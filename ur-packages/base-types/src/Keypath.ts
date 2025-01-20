import { Ur, registryItemFactory, RegistryItemClass } from '@ngraveio/bc-ur'

// Type definitions from CDDL
// Type aliases for basic types
type Uint32 = number // Limited to 4 bytes, must validate elsewhere
type Uint31 = number // Should be validated as < 0x80000000
type Uint8 = number // Represents an 8-bit unsigned integer

// Basic components
type ChildIndex = Uint31
type IsHardened = boolean

type ChildIndexComponent = {
  childIndex: ChildIndex
  isHardened: IsHardened
}

type ChildRangeComponent = {
  range: [ChildIndex, ChildIndex] // [low, high] where low < high
  isHardened: IsHardened
}

type ChildWildcardComponent = {
  wildcard: [] // Empty array for wildcard
  isHardened: IsHardened
}

type ChildPairComponent = [
  ChildIndexComponent, // Child to use for external addresses
  ChildIndexComponent // Child to use for internal addresses
]

// path-component can be one of the child component types
type IPathComponent = ChildIndexComponent | ChildRangeComponent | ChildWildcardComponent | ChildPairComponent

// keypath structure
export interface IKeypathInput {
  components: IPathComponent[] // An array of path components; if empty, sourceFingerprint is required
  sourceFingerprint?: Uint32 // Must be present if components are empty; not equal to 0
  depth?: Uint8 // Optional; 0 if this is a public key derived directly from a master key
}

/**
 * This is basically bip44 path that supports wildcard and pair components and range
 * - m/44'/0'/0'/0/0
 * - m/44'/1-6'/0 (range)
 * - m/44'/0'/0'/* (wildcard)
 * - m/44'/0'/0'/<0;1h>/* (pair) // https://github.com/bitcoin/bitcoin/pull/22838
 * // https://github.com/bitcoin/bitcoin/blob/master/doc/descriptors.md#specifying-receiving-and-change-descriptors-in-one-descriptor
 */
export class Keypath extends registryItemFactory({
  tag: 40304,
  URType: 'keypath',
  CDDL: `
    ; Metadata for the complete or partial derivation path of a key.
    ;
    ; 'source-fingerprint', if present, is the fingerprint of the
    ; ancestor key from which the associated key was derived.
    ;
    ; If 'components' is empty, then 'source-fingerprint' MUST be a fingerprint of
    ; a master key.
    ;
    ; 'depth', if present, represents the number of derivation steps in
    ; the path of the associated key, regardless of whether steps are present in the 'components' element
    ; of this structure.

    tagged-keypath = #6.40304(keypath)

    keypath = {
        components: [path-component], ; If empty, source-fingerprint MUST be present
        ? source-fingerprint: uint32 .ne 0 ; fingerprint of ancestor key, or master key if components is empty
        ? depth: uint8 ; 0 if this is a public key derived directly from a master key
    }

    path-component = (
        child-index-component /     ; A single child, possibly hardened
        child-range-component /		; A specific range of children, all possibly hardened
        child-wildcard-component /  ; An inspecific range of children, all possibly hardened
        child-pair-component        ; Used in output descriptors,
                                    ; see https://github.com/bitcoin/bitcoin/pull/22838
    )

    uint32 = uint .size 4
    uint31 = uint32 .lt 0x80000000
    child-index-component = (child-index, is-hardened)
    child-range-component = ([child-index, child-index], is-hardened) ; [low, high] where low < high
    child-wildcard-component = ([], is-hardened)
    child-pair-component = [
        child-index-component,	; Child to use for external addresses, possibly hardened
        child-index-component	; Child to use for internal addresses, possibly hardened
    ]

    child-index = uint31
    is-hardened = bool

    components = 1
    source-fingerprint = 2
    depth = 3 
  `,
  keyMap: {
    components: 1,
    source_fingerprint: 2,
    depth: 3,
  },
}) {
  public data: IKeypathInput
  constructor(input: IKeypathInput) {
    super(input)
    this.data = input
  }

  public getComponents = () => this.data.components
  public getSourceFingerprint = () => this.data.sourceFingerprint
  public getDepth = () => this.data.depth
}

// Input type for PathComponent constructor
export type PathComponentArgs = {
  index?: number; // Single child index, if defined
  range?: [number, number]; // Range of child indices (low, high)
  wildcard?: boolean; // Whether the component is a wildcard
  hardened: boolean; // Whether the component is hardened
  pair?: [PathComponent, PathComponent]; // Pair of child components
};

export class PathComponent {
  public static readonly HARDENED_BIT = 0x80000000;

  private index?: number;
  private range?: [number, number];
  private wildcard: boolean;
  private hardened: boolean;
  private pair?: [PathComponent, PathComponent];

  constructor(args: PathComponentArgs) {
    const { index, range, wildcard, hardened, pair } = args;

    if (index !== undefined) {
      if ((index & PathComponent.HARDENED_BIT) !== 0) {
        throw new Error(
          `#[ur-registry][PathComponent][fn.constructor]: Invalid index ${index} - most significant bit cannot be set`
        );
      }
      if (range || wildcard || pair) {
        throw new Error(
          "A PathComponent cannot have both index and range, wildcard, or pair."
        );
      }
      this.index = index;
      this.wildcard = false;
    } else if (range) {
      if (range[0] >= range[1]) {
        throw new Error(
          `#[ur-registry][PathComponent][fn.constructor]: Invalid range [${range[0]}, ${range[1]}] - low must be less than high.`
        );
      }
      if (wildcard || pair) {
        throw new Error(
          "A PathComponent cannot have both range and wildcard or pair."
        );
      }
      this.range = range;
      this.wildcard = false;
    } else if (wildcard) {
      if (pair) {
        throw new Error(
          "A PathComponent cannot have both wildcard and pair."
        );
      }
      this.wildcard = true;
    } else if (pair) {
      if (hardened) {
        throw new Error(
          "A PathComponent cannot be a pair and hardened at the same time."
        );
      }
      this.pair = pair;
      this.wildcard = false;
    } else {
      throw new Error(
        "Invalid PathComponent: at least one of index, range, wildcard, or pair must be defined."
      );
    }

    this.hardened = hardened;
  }

  // Getters
  public getIndex = () => this.index;
  public getRange = () => this.range;
  public isWildcard = () => this.wildcard;
  public isHardened = () => this.hardened;
  public getPair = () => this.pair;

  // Utility functions
  public isChildIndexComponent = (): boolean => this.index !== undefined;

  public isChildRangeComponent = (): boolean => this.range !== undefined;

  public isChildWildcardComponent = (): boolean => this.wildcard === true;

  public isChildPairComponent = (): boolean => this.pair !== undefined;

  // Static helper to create hardened components
  public static createHardened(index: number): PathComponent {
    if (index >= PathComponent.HARDENED_BIT) {
      throw new Error(
        `Invalid index ${index} - cannot set the hardened bit manually.`
      );
    }
    return new PathComponent({ index, hardened: true });
  }
}



export class PathComponentHelper {
  /**
   * Converts a BIP44 path string to an array of PathComponent objects.
   * @param pathString The BIP44 path string (e.g., "m/44'/0'/0'/0/0")
   * @returns An array of PathComponent objects
   */
  public static fromBIP44PathString(pathString: string): PathComponent[] {
    if (!pathString.startsWith('m')) {
      throw new Error('Invalid BIP44 path string. Must start with "m".');
    }

    const segments = pathString.split('/').slice(1); // Remove "m"
    return segments.map((segment) => {
      const hardened = segment.endsWith("'");
      const indexStr = hardened ? segment.slice(0, -1) : segment;

      const index = parseInt(indexStr, 10);
      if (isNaN(index)) {
        throw new Error(`Invalid path segment: ${segment}`);
      }

      if (index < 0 || index >= PathComponent.HARDENED_BIT) {
        throw new Error(
          `Path index out of bounds: ${index}. Must be between 0 and ${
            PathComponent.HARDENED_BIT - 1
          }.`
        );
      }

      return new PathComponent({ index, hardened });
    });
  }

  /**
   * Converts an array of PathComponent objects to a BIP44 path string.
   * @param components An array of PathComponent objects
   * @returns The BIP44 path string (e.g., "m/44'/0'/0'/0/0")
   */
  public static toBIP44PathString(components: PathComponent[]): string {
    const segments = components.map((component) => {
      const index = component.getIndex();
      if (index === undefined) {
        throw new Error(
          'Invalid PathComponent: Cannot convert wildcard or other unsupported types to BIP44 path.'
        );
      }

      return component.isHardened() ? `${index}'` : `${index}`;
    });

    return `m/${segments.join('/')}`;
  }
}


// Convert BIP44 path string to PathComponent array
const pathString = "m/44'/0'/0'/0/0";
const pathComponents = PathComponentHelper.fromBIP44PathString(pathString);

console.log(pathComponents); // Array of PathComponent objects

// Convert PathComponent array back to BIP44 path string
const bip44Path = PathComponentHelper.toBIP44PathString(pathComponents);
console.log(bip44Path); // "m/44'/0'/0'/0/0"



/// Example Paths
// m/44'/0'/0'/0/0
// m/44'/1-5/*/*