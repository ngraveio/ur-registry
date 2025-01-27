import { registryItemFactory } from '@ngraveio/bc-ur'
import { OutputDescriptor } from './index'

interface IAccountDescriptorArgs {
  masterFingerprint: number
  outputDescriptors: OutputDescriptor[]
}
export class AccountDescriptor extends registryItemFactory({
  tag: 40311,
  URType: 'account-descriptor',
  keyMap: {
    masterFingerprint: 1,
    outputDescriptors: 2,
  },
  CDDL: `
      ; Output descriptors here are restricted to HD keys at account level key derivations only (no 0/* or 1/* children keypaths)

      output-exp = #6.40308(output-descriptor)

      tagged-account = #6.40311(account)

      account = {
          master-fingerprint: uint32, ; Master fingerprint (fingerprint for the master public key as per BIP32)
          output-descriptors: [+ output-exp] ; Output descriptors for various script types for this account
      }

      master-fingerprint = 1
      output-descriptors = 2
  `,
}) {
  data: IAccountDescriptorArgs

  constructor(input: IAccountDescriptorArgs) {
    super(input)
    this.data = input
  }

  getMasterFingerprint(): number {
    return this.data.masterFingerprint
  }

  getOutputDescriptors(): OutputDescriptor[] {
    return this.data.outputDescriptors
  }
}
