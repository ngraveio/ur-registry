import { registryItemFactory } from '@ngraveio/bc-ur'
import { ECKey } from './ECKey'
import { HDKey } from './HDKey'
import { Address } from './Address'

// https://github.com/bitcoin/bitcoin/blob/master/doc/descriptors.md
// https://github.com/BlockchainCommons/Research/blob/master/papers/bcr-2023-010-output-descriptor.md
// TODO: check https://github.com/bitcoinerlab/descriptors for string output parsing

interface IOutputDescriptorInput {
  source: string
  keys?: (HDKey | ECKey | Address)[]
  name?: string
  note?: string
}

export class OutputDescriptor extends registryItemFactory({
  tag: 40308,
  URType: 'output-descriptor',
  keyMap: {
    source: 1,
    keys: 2,
    name: 3,
    note: 4,
  },
  CDDL: `
      outputdescriptor = #6.40308({
          source: text,       ; text descriptor with keys replaced by placeholders
          ? keys: [+key],     ; array of keys corresponding to placeholders, omitted if source is a complete text descriptor with no placeholders
          ? name: text,       ; optional user-assigned name
          ? note: text        ; optional user-assigned note
      })
  
      source = 1
      keys = 2
      name = 3
      note = 4

      key = (
          hd-key /    ; BCR-2020-007
          ec-key /    ; BCR-2020-008
          address     ; BCR-2020-009
      )
  `,
}) {
  constructor(input: IOutputDescriptorInput) {
    // Pass a data object
    super(input)
  }
}

/**
 * TODO:
 * Should be able to parse output descriptor string and convert included values to corresponding classeses (HDKey, ECKey, Address)
 * And then inject placeholder replacement values like this key to
 * ```
 * wsh(
 *     sortedmulti(
 *         2,
 *         [dc567276/48'/0'/0'/2']xpub6DiYrfRwNnjeX4vHsWMajJVFKrbEEnu8gAW9vDuQzgTWEsEHE16sGWeXXUV1LBWQE1yCTmeprSNcqZ3W74hqVdgDbtYHUv3eM4W2TEUhpan/<0;1>/*,
 *         [f245ae38/48'/0'/0'/2']xpub6DnT4E1fT8VxuAZW29avMjr5i99aYTHBp9d7fiLnpL5t4JEprQqPMbTw7k7rh5tZZ2F5g8PJpssqrZoebzBChaiJrmEvWwUTEMAbHsY39Ge/<0;1>/*,
 *         [c5d87297/48'/0'/0'/2']xpub6DjrnfAyuonMaboEb3ZQZzhQ2ZEgaKV2r64BFmqymZqJqviLTe1JzMr2X2RfQF892RH7MyYUbcy77R7pPu1P71xoj8cDUMNhAMGYzKR4noZ/<0;1>/*
 *     )
 * )
 * ```
 * to
 * ```
 * wsh(sortedmulti(2,@0,@1,@2))
 * ```
 * And determine type of key (HDKey, ECKey, Address) based on the string
 */
