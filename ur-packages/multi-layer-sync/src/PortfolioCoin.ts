import { registryItemFactory } from '@ngraveio/bc-ur'
import { DetailedAccount } from './DetailedAccount'
import { CoinIdentity, EllipticCurve } from '@ngraveio/bc-ur-registry-crypto-coin-identity'
import { HDKey } from '@ngraveio/bc-ur-registry'

/** CDDL
 *
 * ; Associate a coin identity to its accounts
 *
 * detailed_accounts = [+ #6.1402(crypto-detailed-account)]
 *
 * ; The accounts are preferrably listed using #6.1402(crypto-detailed-account)
 * : to share the maximum of information related to the accounts
 *
 * accounts_exp = detailed_accounts / #6.311(crypto-account) / #6.1103(crypto-multi-account)
 *
 * ; The accounts can also be listed using #6.311(crypto-account)
 * ; or #6.1103(crypto-multi-account), keeping fully compatibility with these types.
 * ; The information contained in #6.311(crypto-account) and #6.1103(crypto-multi-account)
 * ; are however limited compared to #6.1402(crypto-detailed-account).
 *
 * coin = {
 * 	coin-id: #6.1401(crypto-coin-identity),
 *   accounts: accounts_exp,
 *   ? master-fingerprint: uint32, ; Master fingerprint (fingerprint for the master public key as per BIP32)
 * }
 *
 * coin-id = 1
 * accounts = 2
 * master-fingerprint = 3
 *
 */

//accounts_exp = detailed_accounts / #6.311(crypto-account) / #6.1103(crypto-multi-account)
type detailed_accounts = DetailedAccount[]
type accounts_exp = detailed_accounts //| CryptoAccount | CryptoMultiAccounts;

interface IPortfolioCoinInput {
  coinId: CoinIdentity
  accounts: accounts_exp
  masterFingerprint?: number // uint32
}

export class PortfolioCoin extends registryItemFactory({
  tag: 41403,
  URType: 'portfolio-coin',
  keyMap: {
    coinId: 1,
    accounts: 2,
    masterFingerprint: 3,
  },
  allowKeysNotInMap: false,
  CDDL: `
    ; Associate a coin identity to its accounts

    detailed_accounts = [+ #6.41402(detailed-account)]

    ; The accounts are listed using #6.41402(detailed-account) to share the maximum of information related to the accounts

    coin = {
      coin-id: #6.41401(coin-identity),
      accounts: accounts_exp,
      ? master-fingerprint: uint32 ; Master fingerprint (fingerprint for the master public key as per BIP32)
    }

    ; master-fingerprint must match the potential other fingerprints included in the other sub-UR types

    coin-id = 1
    accounts = 2 
    master-fingerprint = 3
  `,
}) {
  data: IPortfolioCoinInput

  constructor(data: IPortfolioCoinInput) {
    super(data)
    this.data = data
  }

  override verifyInput(input: IPortfolioCoinInput): { valid: boolean; reasons?: Error[] } {
    const errors: Error[] = []

    // Type check
    if (input.coinId == undefined || !(input.coinId instanceof CoinIdentity)) {
      errors.push(new Error('CoinId is not type of CoinIdentity'))
    }

    // Be sure that accounts is correct type
    if (input.accounts == undefined || !Array.isArray(input.accounts)) {
      errors.push(new Error('Accounts must be an array'))
    }

    // Check if accounts is an array of DetailedAccount
    input.accounts.forEach(account => {
      if (!(account instanceof DetailedAccount)) {
        errors.push(new Error('Account is not type of DetailedAccount'))
      }
    })

    // If masterfingerprint is provided, make sure its valid uint32 number with clamped to  max Unsigned 32-bit integer
    if (input.masterFingerprint !== undefined) {
      if (typeof input.masterFingerprint !== 'number' || input.masterFingerprint < 0 || input.masterFingerprint > 0xffffffff) {
        errors.push(new Error('Master fingerprint must be a valid uint32 number'))
      }
    }

    // If there are no errors yet do deep validation
    if (!errors.length) {
      // Edwards curve coins check each accounts origin paths and make sure they are all hardened
      if (input.coinId.getCurve() == EllipticCurve.Ed25519) {
        input.accounts.forEach(account => {
          // For edwards curve coins we expect DetailedAccount to have HDKey as account
          if (!(account.getAccount() instanceof HDKey)) {
            return { valid: false, reasons: [new Error('Ed25519 coin must have HDKey as account')] }
          }
          // Check if HDKey has origin and all paths are hardened
          const hdKey = account.getAccount() as HDKey
          const origin = hdKey.getOrigin()
          if (!origin?.isOnlyHardened()) {
            return { valid: false, reasons: [new Error('Ed25519 coin must have all hardened paths')] }
          }
        })
      }
    }

    return {
      valid: errors.length === 0,
      reasons: errors.length > 0 ? errors : undefined,
    }
  }

  // Legacy that supports CryptoAccount and CryptoMultiAccounts
  //
  // static checkInputs = (accounts: accounts_exp, masterFingerprint?: Uint8Array) => {
  //   // if its detailed_accounts array, run CryptoDetailedAccount.checkAccount for each of them
  //   if (Array.isArray(accounts)) {
  //     accounts.forEach(account => {
  //       // check if account is type of detailed account
  //       // if not throw error
  //       if (!(account instanceof DetailedAccount)) {
  //         throw new Error('Account is not type of CryptoDetailedAccount')
  //       }
  //       // run checkAccount for each of the detailed account
  //       DetailedAccount.checkAccount(account.getAccount())
  //     })
  //   } else if (accounts instanceof CryptoAccount) {
  //     // Be sure that masterfingerprint is same as the one in CryptoAccount
  //     if (masterFingerprint?.toString('hex') !== accounts.getMasterFingerprint().toString('hex')) {
  //       throw new Error('Master fingerprint is not the same as the one in CryptoAccount')
  //     }
  //     // We will run checks on each of the CryptoOutput in CryptoAccount
  //     accounts.getOutputDescriptors().forEach(output => {
  //       DetailedAccount.checkAccount(output)
  //     })
  //   } else if (accounts instanceof CryptoMultiAccounts) {
  //     // Be sure that masterfingerprint is same as the one in CryptoMultiAccounts
  //     if (masterFingerprint?.toString('hex') !== accounts.getMasterFingerprint().toString('hex')) {
  //       throw new Error('Master fingerprint is not the same as the one in CryptoMultiAccounts')
  //     }
  //     // We will run checks on each of the CryptoAccount in CryptoMultiAccounts
  //     accounts.getKeys().forEach(hdKey => {
  //       DetailedAccount.checkAccount(hdKey)
  //     })
  //   }
  // }

  public getCoinId = () => this.data.coinId
  public getAccounts = () => this.data.accounts
  // public getCryptoAccount = () => (this.accounts instanceof CryptoAccount ? this.accounts : undefined)
  // public getCryptoMultiAccounts = () => (this.accounts instanceof CryptoMultiAccounts ? this.accounts : undefined)
  public getDetailedAccounts = () => this.data.accounts
  public getMasterFingerprint = () => this.data.masterFingerprint
}
