import { registryItemFactory } from '@ngraveio/bc-ur'
import { Buffer } from 'node:buffer'

/**
 * Partially Signed Bitcoin Transaction (PSBT)
 *
 * Definition: https://github.com/BlockchainCommons/Research/blob/master/papers/bcr-2020-006-urtypes.md#partially-signed-bitcoin-transaction-psbt-psbt
 */
export class PSBT extends registryItemFactory({
  tag: NaN, // This is just bytes, so no need to tag it for CBOR
  URType: 'psbt',
  CDDL: `bytes`,
}) {
  psbt: Uint8Array

  constructor(psbt: Buffer | Uint8Array) {
    super(psbt)
    this.psbt = psbt
  }

  getPSBT = () => this.psbt

  override verifyInput(input: any): { valid: boolean; reasons?: Error[] } {
    if (!(input instanceof Uint8Array)) {
      return {
        valid: false,
        reasons: [new Error('Invalid data type for PSBT, data must be a Uint8Array')],
      }
    }
    return { valid: true }
  }
}
