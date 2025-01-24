import { registryItemFactory } from '@ngraveio/bc-ur'

export enum Network {
  mainnet = 0,
  testnet = 1,
}

interface CoinInfoData {
  type?: number
  network?: number
}

export class CoinInfo extends registryItemFactory({
  tag: 40305,
  URType: 'coin-info',
  keyMap: {
    type: 1,
    network: 2,
  },
  CDDL: `
    ; Metadata for the type and use of a cryptocurrency

    tagged-coininfo = #6.40305(coininfo)

    coininfo = {
        ? type: uint31 .default cointype-btc, ; values from [SLIP44](https://github.com/satoshilabs/slips/blob/master/slip-0044.md) with high bit turned off
        ? network: int .default mainnet ; coin-specific identifier for testnet
    }

    type = 1
    network = 2

    cointype-btc = 0
    cointype-eth = 0x3c

    mainnet = 0;
    testnet-btc = 1;

    ; from [ETH-TEST-NETWORKS]
    testnet-eth-ropsten = 1;
    testnet-eth-kovan = 2;
    testnet-eth-rinkeby = 3;
    testnet-eth-gorli = 4;
  `,
}) {
  public data: CoinInfoData;

  constructor(type?: number, network?: Network) {
    // Pass an data object
    super({ type, network })
    this.data = { type, network }
  }

  public getType = () => this.data.type || 0
  public getNetwork = () => this.data.network || 0

  override verifyInput(input: CoinInfoData): { valid: boolean; reasons?: Error[] } {
    // Check if type is integer and bigger than 0
    if (input.type !== undefined && (typeof input.type !== 'number' || input.type < 0)) {
      return {
        valid: false,
        reasons: [new Error('Type must be a positive integer')],
      }
    }
    if (input.network !== undefined && (typeof input.network !== 'number' || input.network < 0)) {
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
    const data = this.postCBOR(val, allowKeysNotInMap) as CoinInfoData;

    // Return an instance of the generated class
    return new this(data.type, data.network)
  }
}
