import {
  extend,
  DataItem,
  RegistryItem,
  DataItemMap,
  CryptoAccount,
  CryptoMultiAccounts,
} from '@keystonehq/bc-ur-registry';
import { ExtendedRegistryTypes } from './RegistryType';
import { CryptoDetailedAccount } from './CryptoDetailedAccount';
import { CryptoCoinIdentity } from '@ngraveio/bc-ur-registry-crypto-coin-identity';

const { RegistryTypes, decodeToDataItem } = extend;

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
type detailed_accounts = CryptoDetailedAccount[];
type accounts_exp = detailed_accounts | CryptoAccount | CryptoMultiAccounts;

enum Keys {
  coin_id = 1,
  accounts = 2,
  masterFingerprint = 3,
}

export class CryptoPortfolioCoin extends RegistryItem {
  private coin_id: CryptoCoinIdentity;
  private accounts: accounts_exp;
  private masterFingerprint?: Buffer; // masterFingerprint.readUInt32BE(0);

  getRegistryType = () => ExtendedRegistryTypes.CRYPTO_SYNC_COIN;

  constructor(coin_id: CryptoCoinIdentity, accounts: accounts_exp, master_fingerprint?: Buffer) {
    super();
    // Be sure that coinId is correct type
    if (!(coin_id instanceof CryptoCoinIdentity)) {
      throw new Error('CoinId is not type of CryptoCoinIdentity');
    }

    // TODO: add checks for edwards coins thats paths must be all hardened

    // Be sure that accounts is correct type
    CryptoPortfolioCoin.checkInputs(accounts, master_fingerprint);

    this.coin_id = coin_id;
    this.accounts = accounts;
    this.masterFingerprint = master_fingerprint;
  }

  static checkInputs = (accounts: accounts_exp, masterFingerprint?: Buffer) => {
    // if its detailed_accounts array, run CryptoDetailedAccount.checkAccount for each of them
    if (Array.isArray(accounts)) {
      accounts.forEach((account) => {
        // check if account is type of detailed account
        // if not throw error
        if (!(account instanceof CryptoDetailedAccount)) {
          throw new Error('Account is not type of CryptoDetailedAccount');
        }
        // run checkAccount for each of the detailed account
        CryptoDetailedAccount.checkAccount(account.getAccount());
      });
    } else if (accounts instanceof CryptoAccount) {
      // Be sure that masterfingerprint is same as the one in CryptoAccount
      if (masterFingerprint?.toString('hex') !== accounts.getMasterFingerprint().toString('hex')) {
        throw new Error('Master fingerprint is not the same as the one in CryptoAccount');
      }
      // We will run checks on each of the CryptoOutput in CryptoAccount
      accounts.getOutputDescriptors().forEach((output) => {
        CryptoDetailedAccount.checkAccount(output);
      });
    } else if (accounts instanceof CryptoMultiAccounts) {
      // Be sure that masterfingerprint is same as the one in CryptoMultiAccounts
      if (masterFingerprint?.toString('hex') !== accounts.getMasterFingerprint().toString('hex')) {
        throw new Error('Master fingerprint is not the same as the one in CryptoMultiAccounts');
      }
      // We will run checks on each of the CryptoAccount in CryptoMultiAccounts
      accounts.getKeys().forEach((hdKey) => {
        CryptoDetailedAccount.checkAccount(hdKey);
      });
    }
  };

  public getCoinId = () => this.coin_id;
  public getAccounts = () => this.accounts;
  public getCryptoAccount = () => (this.accounts instanceof CryptoAccount ? this.accounts : undefined);
  public getCryptoMultiAccounts = () => (this.accounts instanceof CryptoMultiAccounts ? this.accounts : undefined);
  public getDetailedAccounts = (): CryptoDetailedAccount[] | undefined => (this.accounts instanceof Array ? this.accounts : undefined);
  public getMasterFingerprint = () => this.masterFingerprint;

  public toDataItem = () => {
    const map: DataItemMap = {};

    map[Keys.coin_id] = this.coin_id.toDataItem();
    map[Keys.coin_id].setTag(this.coin_id.getRegistryType().getTag());

    // Convert accounts base on type, first check if array
    if (Array.isArray(this.accounts)) {
      // This meants its CryptoDetailedAccount[]
      map[Keys.accounts] = this.accounts.map((account) => {
        const dataItem = account.toDataItem();
        dataItem.setTag(account.getRegistryType().getTag());
        return dataItem;
      });
    } else {
      // This means its CryptoAccount | CryptoMultiAccounts
      const dataItem = this.accounts.toDataItem();
      dataItem.setTag(this.accounts.getRegistryType().getTag());

      map[Keys.accounts] = dataItem;
    }

    // If master_fingerprint is set add it to map
    if (this.masterFingerprint) {
      map[Keys.masterFingerprint] = this.masterFingerprint.readUInt32BE(0);
    }

    return new DataItem(map);
  };

  public static fromDataItem = (dataItem: DataItem) => {
    const map = dataItem.getData();

    const coin_id = CryptoCoinIdentity.fromDataItem(map[Keys.coin_id]);

    let masterFingerprint = undefined;
    const _masterFingerprint = map[Keys.masterFingerprint];
    if (_masterFingerprint) {
      masterFingerprint = Buffer.alloc(4);
      masterFingerprint.writeUInt32BE(_masterFingerprint, 0);
    }

    // Check if accounts is an array
    const accounts = map[Keys.accounts] as DataItem | DataItem[];
    let accountsParsed: accounts_exp;

    if (Array.isArray(accounts)) {
      // This means its CryptoDetailedAccount[]
      accountsParsed = accounts.map((account) => {
        return CryptoDetailedAccount.fromDataItem(account);
      });
    } else {
      // This means its CryptoAccount | CryptoMultiAccounts
      const accountTag = accounts.getTag();
      if (accountTag === RegistryTypes.CRYPTO_ACCOUNT.getTag()) {
        accountsParsed = CryptoAccount.fromDataItem(accounts);
      } else if (accountTag === RegistryTypes.CRYPTO_MULTI_ACCOUNTS.getTag()) {
        accountsParsed = CryptoMultiAccounts.fromDataItem(accounts);
      } else {
        throw new Error('Invalid account type');
      }
    }

    return new CryptoPortfolioCoin(coin_id, accountsParsed, masterFingerprint);
  };

  public static fromCBOR = (_cborPayload: Buffer) => {
    const dataItem = decodeToDataItem(_cborPayload);
    return CryptoPortfolioCoin.fromDataItem(dataItem);
  };
}
