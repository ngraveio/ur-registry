import { registryItemFactory } from '@ngraveio/bc-ur'

export class Bytes extends registryItemFactory({
  tag: NaN, // This is just bytes, so no need to tag it for CBOR
  URType: 'bytes',
  CDDL: `bytes`,
}) {
  constructor(psbt: Buffer | Uint8Array) {
    super(psbt)
  }

  override verifyInput(input: any): { valid: boolean; reasons?: Error[] } {
    if (!(input instanceof Uint8Array)) {
      return {
        valid: false,
        reasons: [new Error('Invalid data type for Bytes, data must be a Uint8Array')],
      }
    }
    return { valid: true }
  }
}
