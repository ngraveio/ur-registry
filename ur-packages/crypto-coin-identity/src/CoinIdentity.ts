import { registryItemFactory, RegistryItemClass } from '@ngraveio/bc-ur'

/**
 * Elliptic curve types defined by the IANA registry
 *
 *  https://www.iana.org/assignments/cose/cose.xhtml#elliptic-curves
 *  https://www.rfc-editor.org/rfc/rfc9053.html#name-elliptic-curve-keys
 * 
 * P256=1	            ; NIST P-256 also known as secp256r1  
 * P384=2	            ; NIST P-384 also known as secp384r1  
 * P521=3	            ; EC2	NIST P-521 also known as secp521r1  
 * X25519=4           ; X25519 for use w/ ECDH only  
 * X448=5             ; X448 for use w/ ECDH only  
 * Ed25519=6          ; Ed25519 for use w/ EdDSA only  
 * Ed448=7            ; Ed448 for use w/ EdDSA only  
 * secp256k1=8        ; SECG secp256k1 curve IESG  
 * 
 */
export enum EllipticCurve {
  P256 = 1, // NIST P-256 also known as secp256r1
  P384 = 2, // NIST P-384 also known as secp384r1
  P521 = 3, // EC2	NIST P-521 also known as secp521r1
  X25519 = 4, // X25519 for use w/ ECDH only
  X448 = 5, // X448 for use w/ ECDH only
  Ed25519 = 6, // Ed25519 for use w/ EdDSA only
  Ed448 = 7, // Ed448 for use w/ EdDSA only
  secp256k1 = 8, // SECG secp256k1 curve	IESG
}

export enum ComparisonMethod {
  ExactMatch = '==',
  Parent = '>',
  Child = '<',
  NotEqual = '!=',
  LessThanOrEqual = '<=',
  GreaterThanOrEqual = '>=',
}

type hex_string = Uint8Array | string
type sub_type_exp = number | string | hex_string
interface CryptoCoinIdentityData {
  curve: EllipticCurve // elliptic curve
  type: number // values from [SLIP44] with high bit turned off,
  subtype?: sub_type_exp[]
}

const CryptoCoinIdentityBase: RegistryItemClass = registryItemFactory({
  tag: 1401,
  URType: 'crypto-coin-identity',
  keyMap: {
    curve: 1,
    type: 2,
    subtype: 3,
  },
  CDDL: `
    ; Table should always be updated according to IANA registry
    ; https://www.iana.org/assignments/cose/cose.xhtml#elliptic-curves
    ; https://www.rfc-editor.org/rfc/rfc9053.html#name-elliptic-curve-keys
  
    P256=1	            ; NIST P-256 also known as secp256r1
    P384=2	            ; NIST P-384 also known as secp384r1
    P521=3	            ; EC2	NIST P-521 also known as secp521r1
    X25519=4           ; X25519 for use w/ ECDH only
    X448=5             ; X448 for use w/ ECDH only
    Ed25519=6          ; Ed25519 for use w/ EdDSA only
    Ed448=7            ; Ed448 for use w/ EdDSA only
    secp256k1=8        ; SECG secp256k1 curve	IESG
  
    elliptic_curve = P256 / P384 / P521 / X25519 / X448 / Ed25519 / Ed448 / secp256k1
  
    ; Subtypes specific to some coins (e.g. ChainId for EVM chains)
    hex_string = #6.263(bstr) ; byte string is a hexadecimal string no need for decoding
    sub_type_exp = uint32 / str / hex_string
  
    coin-identity = {
        curve: elliptic_curve,
        type: uint31, ; values from [SLIP44] with high bit turned off,
        ? subtype: [ sub_type_exp + ]  ; Compatible with the definition of several subtypes if necessary
    }
  
    curve = 1
    type = 2
    subtype = 3
  `,
})


/** CDDL
 *
 * ; Table should always be updated according to IANA registry
 * ; https://www.iana.org/assignments/cose/cose.xhtml#elliptic-curves
 * ; https://www.rfc-editor.org/rfc/rfc9053.html#name-elliptic-curve-keys
 *
 * P256=1	            ; NIST P-256 also known as secp256r1  
 * P384=2	            ; NIST P-384 also known as secp384r1  
 * P521=3	            ; EC2	NIST P-521 also known as secp521r1  
 * X25519=4           ; X25519 for use w/ ECDH only  
 * X448=5             ; X448 for use w/ ECDH only  
 * Ed25519=6          ; Ed25519 for use w/ EdDSA only  
 * Ed448=7            ; Ed448 for use w/ EdDSA only  
 * secp256k1=8        ; SECG secp256k1 curve	IESG  
 *
 * elliptic_curve = P256 / P384 / P521 / X25519 / X448 / Ed25519 / Ed448 / secp256k1
 *
 * ; Subtypes specific to some coins (e.g. ChainId for EVM chains)  
 * hex_string = #6.263(bstr) ; byte string is a hexadecimal string no need for decoding  
 * sub_type_exp = uint32 / str / hex_string  
 *
 * coin-identity = {
 *     curve: elliptic_curve,  
 *     type: uint31, ; values from [SLIP44] with high bit turned off,  
 *     ? subtype: [ sub_type_exp + ]  ; Compatible with the definition of several subtypes if necessary  
 * }  
 *
 * curve = 1  
 * type = 2  
 * subtype = 3  
 */
export class CryptoCoinIdentity extends CryptoCoinIdentityBase {
  public data: CryptoCoinIdentityData

  constructor(curve: EllipticCurve, type: number, subtype: sub_type_exp[] = []) {
    super({ curve, type, subtype }, CryptoCoinIdentityBase.keyMap)
    this.data = { curve, type, subtype }
  }

  /**
   * Static method to create an instance from CBOR data.
   * It processes the raw CBOR data if needed and returns a new instance of the class.
   */
  static fromCBORData(val: any, tagged?: any) {
    // Do some post processing data coming from the cbor decoder
    const data = this.postCBOR(val)
    const { curve, type, subtype } = data

    // Return an instance of the generated class
    return new this(curve, type, subtype)
  }

  public getCurve = () => this.data.curve
  public getType = () => this.data.type
  public getSubType = () => this.data.subtype || []

  /**
   * Get the parent CoinIdentity of the current CoinIdentity
   * @returns {CryptoCoinIdentity} a new instance of CryptoCoinIdentity for the parent if it exists or null if it does not.
   */
  public getParent = () => {
    // If we dont have any subtypes, return null
    if (!this.data.subtype?.length) return null

    // Otherwise remove the last subtype and return a new CryptoCoinIdentity
    const subtypes = this.data.subtype.slice(1, this.data.subtype.length)
    return new CryptoCoinIdentity(this.data.curve, this.data.type, subtypes)
  }

  /**
   * Create an Iterator that returns all the parents of this CryptoCoinIdentity
   * @returns {Iterable<CryptoCoinIdentity>} An iterator for all the parent CoinIdentities of the current CoinIdentity
   */
  getAllParents(): Iterable<CryptoCoinIdentity> {
    let currentParent = this.getParent()

    const parentIterator = {
      [Symbol.iterator](): Iterator<CryptoCoinIdentity> {
        return {
          next(): IteratorResult<CryptoCoinIdentity> {
            if (currentParent) {
              const returnParent = new CryptoCoinIdentity(currentParent.getCurve(), currentParent.getType(), currentParent.getSubType())
              currentParent = currentParent.getParent()

              return {
                value: returnParent,
                done: false,
              }
            }
            return { value: undefined, done: true }
          },
        }
      },
    }

    return parentIterator
  }

  /**
   * Create a url from ths CryptoCoinIdentity. The subtypes should be in the correct order.
   * @returns {string} url representation of the CryptoCoinIdentity
   */
  public toURL = (): string => {
    const curve = Object.values(EllipticCurve)[this.data.curve - 1]
    const type = this.data.type
    const subtype = this.data.subtype
    const subtypes = subtype?.join('.')
    if (subtypes?.length) {
      return `bc-coin://${subtypes}.${curve}/${type}`
    }
    return `bc-coin://${curve}/${type}`
  }

  /**
   * Convert a url into a CryptoCoinIdentity
   * @param url url representation of a CryptoCoinIdentity
   * @returns {CryptoCoinIdentity} created from the passed url.
   */
  public static fromUrl = (url: string) => {
    const parts = url.split('://')[1].split('/')
    const subtypeParts = parts[0].split('.')
    if (subtypeParts.length > 1) {
      const curve = subtypeParts[subtypeParts.length - 1] as unknown as EllipticCurve
      const type = +parts[1]
      const subTypes = subtypeParts.slice(0, subtypeParts.length - 1)
      return new CryptoCoinIdentity(curve, type, subTypes)
    }
    const curve = parts[0] as unknown as EllipticCurve
    const type = +parts[1]
    return new CryptoCoinIdentity(curve, type)
  }

  /**
   * Compare the current id to a given id
   * @param coinIdentity CoinIdentity to compare the current one with
   * @param comparison comparison method to check
   * @returns boolean indicating if the comparison is valid
   */
  public compare = (coinIdentity: CryptoCoinIdentity, comparison: ComparisonMethod): boolean => {
    const url = this.toURL().replace('bc-coin://', '')
    const urlToCompare = coinIdentity.toURL().replace('bc-coin://', '')

    return CryptoCoinIdentity.compareCoinIds(url, urlToCompare, comparison)
  }

  /**
   * Compare a coin url, generated with '.toUrl()' method, with a different one
   * @param coinUrl1 first coinIdentity as a url.
   * @param coinUrl2 second coinIdentity as a url.
   * @param comparison comparison method.
   * @returns boolean indicating if the comparison is valid
   */
  static compareCoinIds(coinUrl1: string, coinUrl2: string, comparison: ComparisonMethod): boolean {
    const dict = CryptoCoinIdentity.compareCoinIdsDict(coinUrl1, coinUrl2)
    return dict[comparison]
  }

  /**
   * Creates a dictionary for all comparison methods for two given coin urls, generated with '.toUrl()'.
   * @param coinUrl1 first coinIdentity as a url.
   * @param coinUrl2 second coinIdentity as a url.
   * @returns dictionary indicating which comparison methods are true | false.
   */
  static compareCoinIdsDict(coinUrl1: string, coinUrl2: string) {
    const url = coinUrl1.replace('bc-coin://', '')
    const urlToCompare = coinUrl2.replace('bc-coin://', '')

    const isEqual = url === urlToCompare
    const isChild = url.includes(urlToCompare)
    const isParent = urlToCompare.includes(url)
    const isNotEqual = url !== urlToCompare

    return {
      [ComparisonMethod.ExactMatch]: isEqual,
      [ComparisonMethod.Child]: isChild,
      [ComparisonMethod.Parent]: isParent,
      [ComparisonMethod.NotEqual]: isNotEqual,
      [ComparisonMethod.LessThanOrEqual]: isEqual || isChild,
      [ComparisonMethod.GreaterThanOrEqual]: isEqual || isParent,
    }
  }
}
