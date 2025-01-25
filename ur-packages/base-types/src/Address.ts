import { registryItemFactory } from '@ngraveio/bc-ur'
import { base16 } from '@scure/base'
import { CoinInfo } from './CoinInfo'
import { decodeAddress, encodeAddress } from './classes/AddressHelpers'

interface IAddressInput {
  /** Type of the coin and network (testnet, mainnet) */
  info?: CoinInfo // When omitted defaults to bitcoin mainnet
  /**
   * The `type` field MAY be included for Bitcoin (and similar cryptocurrency) addresses, and MUST be omitted for non-applicable types.
   * For bitcoin script type eg: p2ms, p2pk, p2pkh, p2sh, p2wpkh, p2wsh, P2TR
   **/
  type?: AddressScriptType
  /** Public key or script hash that is encoded */
  data: Uint8Array | Buffer
}

export enum AddressScriptType {
  P2PKH = 0,
  P2SH = 1,
  P2WPKH = 2,
  P2WSH = 3,
  P2TR = 4,
  P2MS = 5,
}

// https://github.com/BlockchainCommons/Research/blob/master/papers/bcr-2020-009-address.md
export class Address extends registryItemFactory({
  tag: 40307,
  URType: 'address',
  CDDL: `
    tagged-address = #6.40307(address)

    address = {
      ? info: tagged-coininfo,
      ? type: address-type,
      data: bytes
    }

    info = 1
    type = 2
    data = 3

    address-type = p2pkh / p2sh / p2wpkh / p2wsh / p2tr / p2ms
    p2pkh = 0
    p2sh = 1
    p2wpkh = 2
    p2wsh = 3
    p2tr = 4
    p2ms = 5

    ; The \`type\` field MAY be included for Bitcoin (and similar cryptocurrency) addresses, and MUST be omitted for non-applicable types.

    ; \`data\` contains:
    ;   For addresses of type \`p2pkh\`, the hash160 of the public key (20 bytes).
    ;   For addresses of type \`p2sh\`, the hash160 of the script bytes (20 bytes).
    ;   For addresses of type \`p2wphk\`, the sha256 of the script bytes (32 bytes).
    ;   For ethereum addresses, the last 20 bytes of the keccak256 hash of the public key (20 bytes).  
  `,
  keyMap: {
    info: 1,
    type: 2,
    data: 3,
  },
}) {
  public data: IAddressInput

  constructor(input: IAddressInput) {
    super(input)
    this.data = input
  }

  public getAddressInfo = () => this.data.info || new CoinInfo()
  public getAddressScriptType: () => AddressScriptType | undefined = () => {
    // if its not bitcoin return undefined
    if (this.getAddressInfo().getType() !== 0) {
      return undefined
    }

    // Otherwise return the script type
    return this.data.type || AddressScriptType.P2PKH
  }

  public static fromAddress(address: string, network?: 'mainnet' | 'testnet'): Address {
    const decoded = decodeAddress(address)
    if (network !== undefined && decoded.network !== network) {
      throw new Error(`Address network mismatch: expected ${network}, got ${decoded.network ?? 'unknown'}`)
    }
    let info: CoinInfo
    let scriptType: number | undefined

    const coinType = decoded.type
    switch (coinType) {
      case 0:
        // Keep undefined for default values
        info = new CoinInfo(undefined, decoded.network === 'mainnet' ? undefined : 1)
        switch (decoded.scriptType) {
          case 'P2PKH':
            scriptType = AddressScriptType.P2PKH
            break
          case 'P2SH':
            scriptType = AddressScriptType.P2SH
            break
          case 'P2WPKH':
            scriptType = AddressScriptType.P2WPKH
            break
          case 'P2WSH':
            scriptType = AddressScriptType.P2WSH
            break
          case 'P2TR':
            scriptType = AddressScriptType.P2TR
            break
          default:
            throw new Error('Unknown script type')
        }
        break
      case 60:
        info = new CoinInfo(60, network === 'mainnet' ? 0 : 1)
        scriptType = undefined
        break
      default:
        throw new Error('Unknown coin type')
    }

    return new Address({
      data: decoded.payload,
      info,
      type: scriptType,
    })
  }

  /**
   * Convert the address object to its string representation.
   * @returns The encoded address string.
   */
  public toAddress(): string {
    const info = this.getAddressInfo()
    const type = info.getType()
    const network = info.getNetwork() === 0 ? 'mainnet' : 'testnet'
    const scriptTypeValue = this.getAddressScriptType()
    const scriptType = scriptTypeValue !== undefined ? AddressScriptType[scriptTypeValue] : undefined

    if (type !== 0 && type !== 60) {
      throw new Error('Invalid coin type')
    }

    return encodeAddress(type, scriptType, network, this.data.data)
  }
}