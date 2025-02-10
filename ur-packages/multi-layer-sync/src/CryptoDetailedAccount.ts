import { HDKey, OutputDescriptor } from '@ngraveio/bc-ur-registry'
import { HexString } from '@ngraveio/bc-ur-registry-hex-string'

import { registryItemFactory } from '@ngraveio/bc-ur'

type account_exp = HDKey | OutputDescriptor
type tokenId = string | HexString
interface IDetailAccountInput {
  account: account_exp
  tokenIds?: tokenId[] // Specify multiple tokens associated to one account
}

export class DetailedAccount extends registryItemFactory({
  tag: 1402,
  URType: 'detailed-account',
  keyMap: {
    account: 1,
    tokenIds: 2,
  },
  allowKeysNotInMap: false,
  CDDL: `
    account_exp = #6.40303(hdkey) / #6.40308(output-descriptor)

    ; Accounts are specified using either '#6.40303(hdkey)' or 
    ; '#6.40308(output-descriptor)'.
    ; By default, '#6.40303(hdkey)' should be used to share public keys and
    ; extended public keys.
    ; '#6.308(output-descriptor)' should be used to share an output descriptor, 
    ; e.g. for the different Bitcoin address formats (P2PKH, P2SH-P2WPKH, P2WPKH, P2TR).

    ; Optional 'token-ids' to indicate the synchronization of a list of tokens with
    ; the associated accounts
    ; 'token-id' is defined differently depending on the blockchain:
    ; - ERC20 tokens on EVM chains are identified by their contract addresses 
    ; (e.g. "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48")
    ; - ERC1155 tokens are identifed with their contract addresses followed by their 
    ; ID with ':' as separator (e.g. "0xfaafdc07907ff5120a76b34b731b278c38d6043c:
    ; 508851954656174721695133294256171964208")
    ; - ESDT tokens on MultiversX are by their name followed by their ID with "-" as 
    ; separator (e.g. "USDC-c76f1f")
    ; - SPL tokens on Solana are identified by their contract addresses
    ; (e.g. "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v")

    detailed-account = { 
      account: account_exp,
      ? token-ids: [+ string / bytes] ; Specify multiple tokens associated to one account
    }

    account = 1
    token-ids = 2  
  `,
}) {
  data: IDetailAccountInput

  constructor(data: IDetailAccountInput) {
    // Token Ids are just hex string for erc20 token like 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48
    // For ESDT and SPL types its going to be encoded as string
    // We will try to parse the string into bytes with removing 0x part,
    // if we cannot we will encode it as utf8 string
    super(data)
    this.data = data

    let tokenIds = data.tokenIds

    // If token ids are provided, convert them to hex strings
    if (tokenIds !== undefined && Array.isArray(data.tokenIds)) {
      // Try to parse them into hex strings
      tokenIds = tokenIds.map(tokenId => {
        // If its already hexstring, return it
        if (tokenId instanceof HexString) return tokenId as HexString;
        // If its buffer or a string try to parse as HexString
        try {
          return new HexString(tokenId)
        } catch (error) {
          /* no-op */
          return tokenId as string
        }
      })
    }
  }

  override verifyInput(input: IDetailAccountInput): { valid: boolean; reasons?: Error[] } {
    const errors: Error[] = []

    // Checks for the accounts
    if (!input.account) {
      errors.push(new Error('Account must be provided'))
    } else {
      try {
        DetailedAccount.checkAccount(input.account)
      } catch (error) {
        errors.push(error as Error)
      }
    }

    // Checks for the token ids
    if (input.tokenIds !== undefined) {
      // Token ids must be an array
      if (!Array.isArray(input.tokenIds)) {
        errors.push(new Error('Token ids must be an array'))
      } else {
        // Token ids must be either string or uint8array (Buffer is also Uint8Array)
        input.tokenIds.forEach(tokenId => {
          if (typeof tokenId !== 'string' && !(tokenId instanceof Uint8Array) && !(tokenId instanceof HexString)) {
            errors.push(new Error('Token id must be either a string or a Uint8Array or HexString'))
          }
        })
      }
    }

    return {
      valid: errors.length === 0,
      reasons: errors.length > 0 ? errors : undefined,
    }
  }

  public getAccount = () => this.data.account
  public getHdKey = () => {
    return this.data.account instanceof HDKey ? this.data.account : undefined
  }
  public getOutputDescriptor = () => {
    return this.data.account instanceof OutputDescriptor ? this.data.account : undefined
  }
  public getTokenIds = () => {
    if (!this.data.tokenIds) return undefined

    // Always return string representation of the token ids
    return this.data.tokenIds.map((tokenId: HexString | string) => {
      if (tokenId instanceof HexString) {
        // Shall we really add 0x to start?
        return '0x' + (tokenId as HexString).getData()
      }
      return tokenId as string
    })
  }

  static checkAccount(account: account_exp) {
    // If account is HDKey, check if it has origin and a valid path
    if (account instanceof HDKey) {
      DetailedAccount.checkHdKey(account)
    } else if (account instanceof OutputDescriptor) {
      DetailedAccount.checkOutputDescriptor(account)
    }

    throw new Error('Account must be instance of HDKey or OutputDescriptor')
  }

  static checkOutputDescriptor(account: OutputDescriptor) {
    // For the output descriptor, it must have only 1 key and it must be HDKey
    const keys = account.data.keys

    if (!keys || keys.length !== 1) {
      throw new Error('Output descriptor must have only 1 key')
    }

    const key = keys[0]
    if (!(key instanceof HDKey)) {
      throw new Error('Output descriptor key must be instance of HDKey')
    }

    // Check HDKey properties
    DetailedAccount.checkHdKey(key)
  }

  static checkHdKey(hdKey: HDKey) {
    const origin = hdKey.getOrigin()

    if (origin == undefined) {
      throw new Error('HDKey must have origin')
    }

    // Now for detailed account we must have only 1 path
    // and it should only contain simple path components
    // Eg: m/44'/60'/0
    // The other path components are not allowed
    // Eg: m/44/*/1-5
    origin.getComponents().forEach(path => {
      if (!path.isIndexComponent()) {
        throw new Error('Detailed account path can only contain index components')
      }
    })
  }
}
