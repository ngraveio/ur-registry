import { registryItemFactory } from '@ngraveio/bc-ur'

export enum Network {
  mainnet = 0,
  testnet = 1,
}

export class CoinInfo extends registryItemFactory({
  tag: 40305,
  URType: 'coin-info',
  keyMap: {
    type: 1,
    network: 2,
  },
  CDDL: `
      coininfo = #6.40305({
          ? type: uint .default 1, ; values from [SLIP44](https://github.com/satoshilabs/slips/blob/master/slip-0044.md) with high bit turned off
          ? network: int .default 1 ; coin-specific identifier for testnet
      })
  
      type = 1
      network = 2
  `,
}) {
  constructor(type = 1, network: Network = Network.mainnet) {
    // Pass an data object
    super({ type, network })
  }

  public getType = () => this.data.type
  public getNetwork = () => this.data.network

  override verifyInput(input: any): { valid: boolean; reasons?: Error[] } {
    // Check if type is integer and bigger than 0
    if (typeof input.type !== 'number' || input.type < 0) {
      return {
        valid: false,
        reasons: [new Error('Type must be a positive integer')],
      }
    }
    if (typeof input.network !== 'number' || input.network < 0) {
      return {
        valid: false,
        reasons: [new Error('Network must be a positive integer')],
      }
    }

    return { valid: true }
  }

  /**
   * We need to override this method because class expects 2 arguments instead of an object
   */
  static override fromCBORData(val: any, allowKeysNotInMap = false, tagged?: any) {
    // Do some post processing data coming from the cbor decoder
    const data = this.postCBOR(val, allowKeysNotInMap)

    // Return an instance of the generated class
    return new this(data.type, data.network)
  }
}
