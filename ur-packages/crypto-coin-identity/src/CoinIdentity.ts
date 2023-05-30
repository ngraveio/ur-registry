import { extend, DataItem, RegistryItem, DataItemMap } from '@keystonehq/bc-ur-registry'
import { ExtendedRegistryTypes } from './RegistryType'

const { RegistryTypes, decodeToDataItem } = extend

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

type hex_string = Buffer | string
type sub_type_exp = number | string | hex_string

enum Keys {
  curve = 1,
  type = 2,
  subtype = 3,
}

export class CryptoCoinIdentity extends RegistryItem {
  private curve: EllipticCurve // elliptic curve
  private type: number // values from [SLIP44] with high bit turned off,
  private subtype: sub_type_exp[]

  getRegistryType = () => ExtendedRegistryTypes.CRYPTO_COIN_IDENTITY

  constructor(curve: EllipticCurve, type: number, subtype: sub_type_exp[] = []) {
    super()
    this.curve = curve
    this.type = type
    this.subtype = subtype
  }

  public getCurve = () => this.curve
  public getType = () => this.type
  public getSubType = () => this.subtype

  public getParent = () => {
    // If we dont have any subtypes, return null
    if (!this.subtype.length) return null;

    // Otherwise remove latests subtype and return a new CryptoCoinIdentity
    const subtypes = this.subtype.slice(1, this.subtype.length)
    return new CryptoCoinIdentity(this.curve, this.type, subtypes)
  }


  // Make an Iterator that returns all the parents of this CryptoCoinIdentity
  getAllParents2(): Iterable<CryptoCoinIdentity> {
    let currentParent = this.getParent();

    const parentIterator = {
      [Symbol.iterator](): Iterator<CryptoCoinIdentity> {
        return {
          next(): IteratorResult<CryptoCoinIdentity> {
            if ( currentParent ) {
              const returnParent = new CryptoCoinIdentity(currentParent.getCurve(), currentParent.getType(), currentParent.getSubType());
              currentParent = currentParent.getParent();

              return {
                value: returnParent,
                done: false,
              }
            }
            return { value: undefined, done: true }
          },
        }
      }
    };

    return parentIterator;
  }

  // Make an Iterator that returns all the parents of this CryptoCoinIdentity
  getAllParents(): Iterable<CryptoCoinIdentity> {
    let currentSubtypes = this.subtype;
    const curve = this.curve;
    const type = this.type;

    const parentIterator = {
      [Symbol.iterator](): Iterator<CryptoCoinIdentity> {
        return {
          next(): IteratorResult<CryptoCoinIdentity> {
            if ( currentSubtypes.length > 0) {
              currentSubtypes = currentSubtypes.slice(1, currentSubtypes.length)

              return {
                value: new CryptoCoinIdentity(curve, type, currentSubtypes),
                done: false,
              }
            }
            return { value: undefined, done: true }
          },
        }
      }
    };

    return parentIterator;
  }

  public toDataItem = () => {
    const map: DataItemMap = {}

    map[Keys.curve] = this.curve
    map[Keys.type] = this.type
    
    // If subtype is empty do not add it to the map
    if(this.subtype.length)
      map[Keys.subtype] = this.subtype
    
    return new DataItem(map)
  }

  public static fromDataItem = (dataItem: DataItem) => {
    const map = dataItem.getData()

    const curve = map[Keys.curve]
    const type = map[Keys.type]
    const subtype = map[Keys.subtype]

    return new CryptoCoinIdentity(curve, type, subtype)
  }

  public static fromCBOR = (_cborPayload: Buffer) => {
    const dataItem = decodeToDataItem(_cborPayload)
    return CryptoCoinIdentity.fromDataItem(dataItem)
  }

  /**
   * subtypes should be in the correct order
   * @returns
   */
  public toURL = (): string => {
    const curve = Object.values(EllipticCurve)[this.curve - 1]
    const type = this.type
    const subtype = this.subtype
    const subtypes = subtype?.join('.');
    if (subtypes?.length) {
      return `bc-coin://${subtypes}.${curve}/${type}`
    }
    return `bc-coin://${curve}/${type}`
  }

  public static fromUrl = (url: string) => {
    const parts = url.split('://')[1].split('/')
    const subtypeParts = parts[0].split('.')
    if (subtypeParts.length > 1) {
      const curve = subtypeParts[subtypeParts.length -1]
      const type = +parts[1]
      const subTypes = subtypeParts.slice(0,subtypeParts.length -1)
      return new CryptoCoinIdentity(curve as any, type, subTypes)
    }
    const curve = parts[0]
    const type = +parts[1]
    return new CryptoCoinIdentity(curve as any, type)
  }
}
