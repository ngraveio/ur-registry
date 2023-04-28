import {
    extend,
    DataItem,
    RegistryItem,
    DataItemMap,
    CryptoAccount,
    CryptoMultiAccounts,
  } from "@keystonehq/bc-ur-registry";
import { ExtendedRegistryTypes } from "./RegistryType";
import { CryptoDetailedAccount } from "./CryptoDetailedAccount"
import { CryptoCoinIdentity } from "@ngrave/bc-ur-registry-crypto-coin-identity"

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
type detailed_accounts = CryptoDetailedAccount[]
type accounts_exp = detailed_accounts | CryptoAccount | CryptoMultiAccounts

enum Keys {
  coin_id = 1,
  accounts = 2,
  master_fingerprint = 3,
}

export class CryptoSyncCoin extends RegistryItem {
  private coin_id: CryptoCoinIdentity;
  private accounts: accounts_exp;
  private master_fingerprint?: number; // masterFingerprint.readUInt32BE(0);
  // Any any

  getRegistryType = () => ExtendedRegistryTypes.CRYPTO_SYNC_COIN;

  constructor(
    coin_id: CryptoCoinIdentity,
    accounts: accounts_exp,
    master_fingerprint?: number
  ) {
    super();
    this.coin_id = coin_id;
    this.accounts = accounts;
    this.master_fingerprint = master_fingerprint;
  }

  public getCoinId = () => this.coin_id;
  public getAccounts = () => this.accounts;
  public getMasterFingerprint = () => this.master_fingerprint;

  public toDataItem = () => {
    const map: DataItemMap = {};

    map[Keys.coin_id] = this.coin_id.toDataItem();
    
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
    if (this.master_fingerprint) {
      map[Keys.master_fingerprint] = this.master_fingerprint;
    }

    return new DataItem(map);
  };

  public static fromDataItem = (dataItem: DataItem) => {
    const map = dataItem.getData();

    const coin_id = CryptoCoinIdentity.fromDataItem(map[Keys.coin_id]);
    const master_fingerprint = map[Keys.master_fingerprint];
    // const masterFingerprint = Buffer.alloc(4);
    // const _masterFingerprint = map[Keys.master7Fingerprint];
    // if (_masterFingerprint) {
    //   masterFingerprint.writeUInt32BE(_masterFingerprint, 0);
    // }        

    // Check if accounts is an array
    const accounts = map[Keys.accounts] as (DataItem | DataItem[]);
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
        throw new Error("Invalid account type");
      }
    }

    return new CryptoSyncCoin(coin_id, accountsParsed, master_fingerprint);
  }

  public static fromCBOR = (_cborPayload: Buffer) => {
    const dataItem = decodeToDataItem(_cborPayload);
    return CryptoSyncCoin.fromDataItem(dataItem);
  };
}
  