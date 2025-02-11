import { registryItemFactory } from '@ngraveio/bc-ur'
import { Keypath } from '@ngraveio/bc-ur-registry'
import { CryptoCoinIdentity } from '@ngraveio/bc-ur-registry-crypto-coin-identity'
import { Buffer } from 'buffer/'

interface ISignRequestInput {
  /** Identifier of the signing request */
  requestId?: Buffer // Size 16 // TODO: convert UUID tagged item
  /** Provides information on the elliptic curve and the blockchain/coin */
  coinId: CryptoCoinIdentity
  /** Key path for signing this request */
  derivationPath?: Keypath | string
  /** Transaction to be decoded by the offline signer */
  signData: Buffer
  /** Origin of this sign request, e.g. wallet name */
  origin?: string
  /** Specify type of transaction required for some blockchains */
  txType?: number // Integer
  /** Specify sender address if not already specified in the sign-data and derivation-path */
  address?: string | Buffer
}

interface ISignRequestData {
  /** Identifier of the signing request */
  requestId?: Buffer // Size 16 // TODO: convert UUID tagged item
  /** Provides information on the elliptic curve and the blockchain/coin */
  coinId: CryptoCoinIdentity
  /** Key path for signing this request */
  derivationPath?: Keypath
  /** Transaction to be decoded by the offline signer */
  signData: Buffer
  /** Origin of this sign request, e.g. wallet name */
  origin?: string
  /** Specify type of transaction required for some blockchains */
  txType?: number
  /** Specify sender address if not already specified in the sign-data and derivation-path */
  address?: string
}

export class SignRequest extends registryItemFactory({
  tag: 41411,
  URType: 'sign-request',
  allowKeysNotInMap: true,
  keyMap: {
    requestId: 1,
    coinId: 2,
    derivationPath: 3,
    signData: 4,
    origin: 5,
    txType: 6,
    address: 7,
  },
  CDDL: `
    sign-request = {
        ?request-id: uuid,                        ; Identifier of the signing request
        coin-id: #6.41401(coin-identity),         ; Provides information on the elliptic curve and the blockchain/coin
        ?derivation-path: #6.40304(keypath),      ; Key path for signing this request
        sign-data: bytes,                         ; Transaction to be decoded by the offline signer 
        ?origin: text,                            ; Origin of this sign request, e.g. wallet name
        ?tx-type: int .default 1                  ; Specify type of transaction required for some blockchains
        ?address: string / bytes                  ; Specify sender address if not already specified in the sign-data and derivation-path
    }

    request-id = 1
    coin-id = 2
    derivation-path = 3
    sign-data = 4
    origin = 5
    tx-type = 6
    address=7
  `,
}) {
  data: ISignRequestData

  constructor(data: ISignRequestInput) {
    super(data)

    //@ts-ignore
    this.data = data

    // If no request id is provided, generate a random one
    if (data.requestId === undefined) {
      this.data.requestId = this.generateRandomRequestId()
    }

    // If given keypath is a string, convert it to Keypath
    if (data.derivationPath !== undefined && typeof data.derivationPath === 'string') {
      this.data.derivationPath = new Keypath({ path: data.derivationPath })
    }

    // If address is provided as a buffer, convert it to string
    if (data.address !== undefined && Buffer.isBuffer(data.address)) {
      this.data.address = data.address.toString('hex')
    }

    // If coin is Ethereum and txType is not provided, set it to 1
    if (data.coinId.getType() == 60) {
      if (data.txType === undefined) {
        this.data.txType = 1
      }
    }
  }

  generateRandomRequestId = (): Buffer => {
    return Buffer.from(require('crypto').randomBytes(16))
  }

  override verifyInput = (input: ISignRequestInput): { valid: boolean; reasons?: Error[] } => {
    const reasons: Error[] = []

    // If request id is provided check if it is not longer than 16 bytes and type of buffer
    if (input.requestId !== undefined) {
      if (!Buffer.isBuffer(input.requestId)) {
        reasons.push(new Error('Request id should be of type Buffer'))
      } else if (input.requestId.length > 16) {
        reasons.push(new Error('Request id should not be longer than 16 bytes'))
      }
    }

    // Check if coin id is provided
    if (input.coinId === undefined || !(input.coinId instanceof CryptoCoinIdentity)) {
      reasons.push(new Error('Coin id is required and should be of type CoinIdentity'))
    }

    // If derivation path is provided it should be a valid string or instance of Keypath
    if (input.derivationPath !== undefined) {
      if (typeof input.derivationPath !== 'string' && !(input.derivationPath instanceof Keypath)) {
        reasons.push(new Error('Derivation path should be a string or instance of Keypath'))
      }

      let derivationPath: Keypath
      if (typeof input.derivationPath === 'string') {
        try {
          derivationPath = new Keypath({ path: input.derivationPath })
        } catch (error) {
          reasons.push(new Error('Invalid derivation path: ' + (error as Error).toString()))
        }
      } else {
        derivationPath = input.derivationPath
      }

      if (derivationPath.getComponents().length === 0) {
        reasons.push(new Error('Derivation path should not be empty'))
      }

      if (!derivationPath.isOnlySimple()) {
        reasons.push(new Error('Derivation path mush only contain simple index components'))
      }
    }

    // Check if sign data is provided and is of type Buffer
    if (input.signData === undefined || !Buffer.isBuffer(input.signData)) {
      reasons.push(new Error('Sign data is required and should be of type Buffer'))
    } else {
      if (input.signData.length === 0) {
        reasons.push(new Error('Sign data should not be empty'))
      }
    }

    // If origin is provided, it should be a string
    if (input.origin !== undefined && typeof input.origin !== 'string') {
      reasons.push(new Error('Origin should be a string'))
    }

    // If tx type is provided, it should be an positive integer
    if (input.txType !== undefined && (!Number.isInteger(input.txType) || input.txType < 0)) {
      reasons.push(new Error('Tx type should be a positive integer'))
    }

    // If address is provided, it should be a string or a buffer
    if (input.address !== undefined && typeof input.address !== 'string' && !Buffer.isBuffer(input.address)) {
      reasons.push(new Error('Address should be a string or a buffer'))
    }

    return {
      valid: reasons.length === 0,
      reasons: reasons.length > 0 ? reasons : undefined,
    }
  }

  // Getters
  public getRequestId = () => this.data.requestId
  public getCoinId = () => this.data.coinId
  public getDerivationPath = () => this.data.derivationPath
  public getSignData = () => this.data.signData
  public getOrigin = () => this.data.origin
  public getTxType = () => this.data.txType
  public getAddress = () => this.data.address
}
