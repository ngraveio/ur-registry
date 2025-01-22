import { registryItemFactory } from '@ngraveio/bc-ur'
import { PathComponent } from './classes/PathComponent'

interface KeypathInput {
  path?: string | PathComponent[]
  sourceFingerprint?: number
  depth?: number
}

interface KeypathData {
  components: PathComponent[]
  sourceFingerprint?: number
  depth?: number
}

/**
 * Keypath class for handling hierarchical key derivation paths.
 *
 * Metadata for the complete or partial derivation path of a key:
 * - 'source-fingerprint': Fingerprint of the ancestor key or master key if components are empty.
 * - 'depth': Number of derivation steps in the path.
 *
 * Valid Path String Rules:
 * 1. Paths can include:
 *    - Single indices (e.g., `44'/0'/0'/0/0`).
 *    - Ranges with hardening applied to the second element (e.g., `1-6'`; `1h-6` is invalid).
 *    - Wildcards (`*`) at any depth (e.g., `44'/0'/0'/*`).
 *    - Pairs for external/internal addresses (e.g., `<0h;1h>` or `<0;1>`).
 *    - Mixed components combining ranges, wildcards, and pairs (e.g., `44'/0'/1'-5'/<0h;1h>/*`).
 * 2. Rules for hardening:
 *    - Hardened indices must be ≤ `0x80000000`.
 *    - Hardened chars (`'` or `h`) must immediately follow the index.
 * 3. Path formatting:
 *    - Paths can optionally start with `m`, but it is not required.
 *    - Components must be delimited by `/` and contain integers, ranges, wildcards, or pairs.
 *
 * Invalid Examples:
 * - `1h-6` (hardening not applied to the second element in range).
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
    sourceFingerprint: 2,
    depth: 3,
  },
}) {
  public data: KeypathData

  constructor(input: KeypathInput) {
    super(input)

    // if input.path is undefined then input.components takes priorty
    // @ts-ignore
    let inputPath = input.path || input.components
    let componentsArray: PathComponent[] = []

    if (inputPath !== undefined) {
      // Convert string components to PathComponent array if necessary
      // @ts-ignore
      componentsArray = typeof inputPath === 'string' ? Keypath.pathToComponents(inputPath) : inputPath
    }

    // Ensure sourceFingerprint is present if components are empty
    if (componentsArray.length === 0 && !input.sourceFingerprint) {
      throw new Error('Keypath requires a source-fingerprint if components are empty.')
    }

    if (input.sourceFingerprint !== undefined) {
      // Finger print should be integer higher than 0
      if (typeof input.sourceFingerprint !== 'number' || input.sourceFingerprint <= 0) {
        throw new Error('Invalid source-fingerprint: Must be a positive integer.')
      }
    }

    this.data = {
      components: componentsArray,
      sourceFingerprint: input.sourceFingerprint,
      depth: input.depth,
    }
  }


  /**
   * Sets the depth of the Keypath based on the number of components.
   * Representing the number of derivation steps
   */
  public setDepth(): void {
    this.data.depth = this.data?.components?.length || 0
  }

  /**
   * Parses a path string into an array of PathComponent objects.
   * @param path The path string to parse.
   * @returns {PathComponent[]} Array of PathComponent objects.
   */
  public static pathToComponents(path: string): PathComponent[] {
    if (!path) return []

    // Ignore leading 'm' if present
    if (path.startsWith('m/')) {
      path = path.slice(2)
    } else if (path.startsWith('m')) {
      path = path.slice(1)
    }

    const components = path.split('/') // Split the path into components
    return components.map(component => PathComponent.fromString(component))
  }

  /**
   * Converts an array of PathComponent objects back into a path string.
   * @param components Array of PathComponent objects.
   * @returns {string} Path string.
   */
  public static componentsToString(components: PathComponent[], hardenedFlag?: "'" | 'h'): string {
    return components.map(component => component.toString(hardenedFlag)).join('/')
  }

  /**
   * Converts the Keypath components back to a path string.
   * @returns {string} Path string.
   */
  public toString(hardenedFlag?: "'" | 'h'): string {
    return Keypath.componentsToString(this.data.components, hardenedFlag)
  }

  /**
   * Gets the components of the Keypath.
   * @returns {PathComponent[]} Array of PathComponent objects.
   */
  public getComponents(): PathComponent[] {
    return this.data.components
  }

  /**
   * Gets the source fingerprint of the Keypath.
   * @returns {number | undefined} Source fingerprint.
   */
  public getSourceFingerprint(): number | undefined {
    return this.data.sourceFingerprint
  }

  /**
   * Gets the depth of the Keypath.
   * @returns {number | undefined} Depth.
   */
  public getDepth(): number | undefined {
    return this.data.depth
  }

  // Override to preCBOR function to convert all pathComponents to CBOR data and put them in array
  override preCBOR() {
    const data = super.preCBOR() as Map<string | number, any>

    const components = this.data.components
    const converted: any[] = []

    // Convert components to CBOR Data Item
    components.forEach((component: PathComponent) => {
      if (component.isIndexComponent()) {
        converted.push(component.getIndex(), component.isHardened())
      } else if (component.isRangeComponent()) {
        converted.push(component.getRange(), component.isHardened())
      } else if (component.isWildcardComponent()) {
        converted.push([], component.isHardened())
      } else if (component.isPairComponent()) {
        const pair = component.getPair()!
        converted.push([pair[0].index, pair[0].hardened, pair[1].index, pair[1].hardened])
      }
    })

    data.set(this.keyMap.components, converted)
    return data
  }

  // Override postCBOR function to convert all pathComponents from CBOR data back to PathComponent
  static override postCBOR(_data: Map<string | number, any>) {
    // First call the super postCBOR function to get the data
    const data = super.postCBOR(_data) as KeypathData

    // Assume data components are the path m/1'/2/3-4/5-6'/*/*'/<7;8'>/<9';0>"
    // CBOR: [1, true, 2, false, [3, 4], false, [5, 6], true, [], false, [], true, [7, false, 8, true], [9, true, 0, false]]
    // this will be converted to: child-index-componen, child-index-componen, child-range-component, child-range-component, child-wildcard-component, child-wildcard-component, child-pair-component, child-pair-component

    const components: PathComponent[] = []
    const pathItems = data['components'] as any[]
    // Now going over the array element we will decide its type
    for (let i = 0; i < pathItems.length; i++) {
      const current = pathItems[i]
      // If the current element is integer, then it is a child-index-component // 1, true,
      if (typeof current === 'number') {
        // Check if the second element is boolean, if not then throw error
        if (typeof pathItems[i + 1] !== 'boolean') {
          throw new Error('Invalid child-index-component: Cannot convert to PathComponent.')
        }
        const hardened = pathItems[i + 1] as boolean
        components.push(new PathComponent({ index: current, hardened }))
        i++
      }
      // If the current element is an array, then it is a either child-wildcard-component, child-range-componentor child-pair-component
      else if (current instanceof Array) {
        // If the array is empty, then it is a child-wildcard-component // [], false,
        if (current.length === 0) {
          // Check if the second element is boolean, if not then throw error
          if (typeof pathItems[i + 1] !== 'boolean') {
            throw new Error('Invalid child-wildcard-component: Cannot convert to PathComponent.')
          }
          const hardened = pathItems[i + 1] as boolean
          components.push(new PathComponent({ wildcard: true, hardened }))
          i++
        }
        // If the array has 2 elements then it is a child-range-component // [5, 6], true,
        else if (current.length === 2) {
          // Check if the second element is boolean, if not then throw error
          if (typeof pathItems[i + 1] !== 'boolean') {
            throw new Error('Invalid child-range-component: Cannot convert to PathComponent.')
          }
          const hardened = pathItems[i + 1] as boolean
          components.push(new PathComponent({ range: current as [number, number], hardened }))
          i++
        }
        // If the array has 4 elements then it is a child-pair-component // [9, true, 0, false]
        else if (current.length === 4) {
          const first = { index: current[0], hardened: current[1] } as { index: number; hardened: boolean }
          const second = { index: current[2], hardened: current[3] } as { index: number; hardened: boolean }
          components.push(new PathComponent({ pair: [first, second] }))
        } else {
          throw new Error('Invalid PathComponent Element is invalid for child-wildcard-component, child-range-component or child-pair-component.')
        } // End for array length check
      } // End For type check
      else {
        throw new Error('Invalid PathComponent: Element is not a number or an array.')
      }
    } // End of the for loop

    // Change components name to path
    // @ts-ignore
    data['path'] = components
    // @ts-ignore
    delete data['components']
    return data
  }
}
