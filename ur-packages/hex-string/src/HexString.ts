import { registryItemFactory, RegistryItemClass } from '@ngraveio/bc-ur'

/**
 *
 * Encodes as bytes but is not decoded upon reading.
 * Must be treated as a string of hex characters.
 *
 * https://github.com/toravir/CBOR-Tag-Specs/blob/master/hexString.md
 *
 * Tag 263 can be applied to a byte string (major type 2) to indicate that the byte string
 * is a hexadecimal string - any normal string is stored as hexadecimal string, but this tag
 * means that string is to be kept as hex format and does not mean anything to convert to ASCII or anything.
 *
 */

const HexStringBase: RegistryItemClass = registryItemFactory({
  tag: 263,
  URType: 'hex-string',
  CDDL: `
    hexadecimal-tag = #6.263(hex-bytes)
    hex-bytes = bytes
  `,
})

export class HexString extends HexStringBase {
  public data: Buffer

  constructor(data: Buffer | string) {
    super(data)

    // Here we only accept Buffer or string
    if (data instanceof Buffer) {
      this.data = data
    } else if (typeof data === 'string') {
      // Check if string starts with 0x, if so, remove it
      if (data.startsWith('0x')) {
        data = data.slice(2)
      }
      // Check if string is even length, if not, add a 0 to the front
      if (data.length % 2 !== 0) {
        data = '0' + data
      }
      this.data = Buffer.from(data, 'hex')
    } else {
      throw new Error('Invalid data type for HexString, data must be valid hex string or buffer')
    }
  }

  verifyInput(input: Buffer | string): { valid: boolean; reasons?: Error[] } {
    if (typeof input === 'string') {
      const hexRegex = /^(0x)?[0-9a-fA-F]+$/
      if (!hexRegex.test(input)) {
        return { valid: false, reasons: [new Error('Invalid hex string provided')] }
      }
    } else if (!(input instanceof Buffer)) {
      return { valid: false, reasons: [new Error('Invalid data type for HexString, data must be valid hex string or buffer')] }
    }
    return { valid: true }
  }

  getData = () => this.data.toString('hex')
  getBuffer = () => this.data
  toHex = this.getData
}
