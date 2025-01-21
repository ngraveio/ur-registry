import { Ur, registryItemFactory, RegistryItemClass } from '@ngraveio/bc-ur'
import { PathComponent } from './classes/PathComponent'

/**
 * Keypath class for handling hierarchical key derivation paths.
 *
 * Valid Path String Rules:
 *
 * 1. Paths can include:
 *    - Single indices (e.g., `44'/0'/0'/0/0`).
 *    - Ranges with hardening applied individually (e.g., `1h-6h`; `1-6h` is invalid).
 *    - Wildcards (`*`) at any depth (e.g., `44'/0'/0'/*`).
 *    - Pairs for external/internal addresses (e.g., `<0h;1h>` or `<0;1>`).
 *    - Mixed components combining ranges, wildcards, and pairs (e.g., `44'/0'/1'-5'/<0h;1h>/*`).
 *
 * 2. Rules for hardening:
 *    - Hardened indices must be ≤ `0x80000000`.
 *    - Hardened chars (`'` or `h`) must immediately follow the index.
 *
 * 3. Path formatting:
 *    - Paths can optionally start with `m`, but it is not required.
 *    - Components must be delimited by `/` and contain integers, ranges, wildcards, or pairs.
 *
 * Invalid Examples:
 * - `1-6h` (hardening not applied to all indices in range).
 * - `<0;1h>` (mixed hardening in pair).
 *
 * Usage:
 * - The `components` can be passed as a string or an array of `PathComponent`.
 * - `source-fingerprint`: The fingerprint of the ancestor or master key. Required if `components` is empty.
 * - `depth`: The number of derivation steps in the path. If omitted, it will be inferred from `components`.
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
  public data: {
    components: PathComponent[]
    sourceFingerprint?: number
    depth?: number
  }

  constructor(input: { components: string | PathComponent[]; sourceFingerprint?: number; depth?: number }) {
    super(input)

    // Convert string components to PathComponent array if necessary
    const componentsArray = typeof input.components === 'string' ? Keypath.pathToComponents(input.components) : input.components

    // Set depth if not provided
    const depth = input.depth ?? componentsArray.length

    // Ensure sourceFingerprint is present if components are empty
    if (componentsArray.length === 0 && !input.sourceFingerprint) {
      throw new Error('Keypath requires a source-fingerprint if components are empty.')
    }

    this.data = {
      components: componentsArray,
      sourceFingerprint: input.sourceFingerprint,
      depth,
    }
  }

  /**
   * Parses a path string into an array of PathComponent objects.
   * @param path The path string to parse.
   */
  public static pathToComponents(path: string): PathComponent[] {
    const components = path.split('/') // Split the path into components
    return components.map(component => PathComponent.fromString(component))
  }

  /**
   * Converts an array of PathComponent objects back into a path string.
   * @param components Array of PathComponent objects.
   */
  public static componentsToString(components: PathComponent[]): string {
    return components.map(component => component.toString()).join('/')
  }

  /**
   * Converts a path string into a CDDL-compliant structure for CBOR encoding.
   * @param path The path string to parse and convert.
   */
  public static pathToCBORData(path: string): any {
    const components = Keypath.pathToComponents(path)
    return components.map(component => component.toCBORData())
  }

  /**
   * Converts the Keypath components back to a path string.
   */
  public toString(): string {
    return Keypath.componentsToString(this.data.components)
  }

  /**
   * Converts the Keypath to a CDDL-compliant structure for CBOR encoding.
   */
  public toCBORData(): any {
    return {
      components: this.data.components.map(component => component.toCBORData()),
      source_fingerprint: this.data.sourceFingerprint,
      depth: this.data.depth,
    }
  }

  public getComponents(): PathComponent[] {
    return this.data.components
  }

  public getSourceFingerprint(): number | undefined {
    return this.data.sourceFingerprint
  }

  public getDepth(): number | undefined {
    return this.data.depth
  }
}
