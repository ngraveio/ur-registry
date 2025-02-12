import { v4 as uuidv4, parse, stringify } from 'uuid'
import { registryItemFactory, RegistryItemClass } from '@ngraveio/bc-ur'

/**
 * Encodes as bytes and decodes to UUID.
 *
 * Tag: 37
 * Data item: byte string
 * Semantics: Binary UUID (RFC 4122 section 4.1.2)
 * Point of contact: Lucas Clemente <lucas@clemente.io>
 * Description of semantics: https://github.com/lucas-clemente/cbor-specs/blob/master/uuid.md
 */

type UUIDInput = string | Uint8Array | UUID

const UUIDBase: RegistryItemClass = registryItemFactory({
  tag: 37,
  URType: 'cbor-uuid',
  CDDL: `
    uuid-tag = #6.37(uuid-bytes)
    uuid-bytes = bytes
  `,
})

export class UUID extends UUIDBase {
  public data: Uint8Array = new Uint8Array(16)

  constructor(data: UUIDInput) {
    super(data)

    if (data instanceof UUID) {
      this.data = data.data
    } else if (data instanceof Uint8Array) {
      if (data.length !== 16) {
        throw new Error('Invalid UUID byte length. Expected 16 bytes.')
      }
      this.data = new Uint8Array(data);
    } else if (typeof data === 'string') {
      this.data = parse(data)
    } else {
      throw new Error('Invalid input type for UUID. Expected a string or Uint8Array.')
    }
  }

  static generate(): UUID {
    return new UUID(uuidv4())
  }

  verifyInput(input: UUIDInput): { valid: boolean; reasons?: Error[] } {
    if (typeof input === 'string') {
      try {
        parse(input)
      } catch (error) {
        return { valid: false, reasons: [new Error('Invalid UUID string format: ' + (error as Error).message)] }
      }
    } else if (input instanceof Uint8Array) {
      if (input.length !== 16) {
        return { valid: false, reasons: [new Error('UUID must be exactly 16 bytes')] }
      }
    } else {
      return { valid: false, reasons: [new Error('Invalid data type for UUID')] }
    }
    return { valid: true }
  }

  toString = () => stringify(this.data)
  getBuffer = () => this.data
}
