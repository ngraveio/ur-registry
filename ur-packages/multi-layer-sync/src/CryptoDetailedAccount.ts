import { extend, DataItem, RegistryItem, DataItemMap, CryptoHDKey, CryptoOutput } from '@keystonehq/bc-ur-registry';
import { ExtendedRegistryTypes } from './RegistryType';
import { HexString } from '@ngraveio/bc-ur-registry-hex-string';

const { RegistryTypes, decodeToDataItem } = extend;

/** CDDL
 *
 * account_exp = #6.303(crypto-hdkey) / #6.308(crypto-output)
 *
 * ; Accounts are specified using either '#6.303(crypto-hdkey)' or
 * ; '#6.308(crypto-output)'.
 * ; By default, '#6.303(crypto-hdkey)' should be used to share public keys and
 * ; extended public keys.
 * ; '#6.308(crypto-output)' should be used to share an output descriptor,
 * ; e.g. for multisig.
 *
 * token-id = uint / bytes
 *
 * ; Optional 'token-ids' to indicate the synchronization of a list of tokens with
 * ; the associated accounts
 * ; 'token-id' is defined differently depending on the blockchain:
 * ; - ERC20 tokens on EVM chains are identified by their contract addresses
 * ; (e.g. `0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48`)
 * ; - ERC1155 tokens are identifed with their contract addresses followed by their
 * ; ID with ':' as separator (e.g. `0xfaafdc07907ff5120a76b34b731b278c38d6043c:
 * ; 508851954656174721695133294256171964208`)
 * ; - ESDT tokens on MultiversX are by their name followed by their ID with `-` as
 * ; separator (e.g. `USDC-c76f1f`)
 * ; - SPL tokens on Solana are identified by their contract addresses
 * ; (e.g. `EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v`)
 *
 * detailed-account = {
 *   account: account_exp,
 *   ? token-ids: [+ token-id],  ; Specify multiple tokens associated to one account
 *   * tstr => any               ; Extendable optional parameters
 * }
 *
 * ; The extendable new type should be assumed to be generally ignored by the
 * ; watch-only wallets.
 * ; In the case where a specific offline signer and a specific watch-only wallet
 * ; agree to implement an extendable new type, this one could be used in order
 * ; to synchronize an additional information regarding the shared accounts
 * ; (e.g. the information "Hidden: true" added to a coin could indicate to the
 * ; watch-only wallet not to display to the user the associated accounts).
 *
 * account = 1
 * token-ids = 2
 */

type token_id = string | HexString;
type token_id_input = string | Buffer | HexString;

//account_exp = #6.303(crypto-hdkey) / #6.308(crypto-output)
type account_exp = CryptoHDKey | CryptoOutput;

enum Keys {
  account = 1,
  tokenIds = 2,
}

export class CryptoDetailedAccount extends RegistryItem {
  private account: account_exp;
  private tokenIds?: token_id[];

  getRegistryType = () => ExtendedRegistryTypes.CRYPTO_DETAILED_ACCOUNT;

  constructor(account: account_exp, tokenIds?: token_id_input[]) {
    super();
    // Validate inputs
    CryptoDetailedAccount.checkAccount(account);

    this.account = account;
    // Token Ids are just hex string for erc20 token like 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48
    // For ESDT and SPL types its going to be encoded as string
    // We will try to parse the string into bytes with removing 0x part,
    // if we cannot we will encode it as utf8 string
    if (Array.isArray(tokenIds)) {
      this.tokenIds = tokenIds.map((tokenId) => {
        // If its an instance of hexString already just return it
        if (tokenId instanceof HexString) return tokenId;

        // If its buffer or a string try to parse as HexString
        try {
          return new HexString(tokenId);
        } catch (error) {
          // TODO: check the error if its not hex
          return tokenId as string;
        }
      });
    }
  }

  static checkAccount(account: account_exp) {
    if (!(account instanceof CryptoHDKey) && !(account instanceof CryptoOutput)) {
      throw new Error('account must be instance of CryptoHDKey or CryptoOutput');
    }

    // only accept cryptoOutput if it has CryptoHDKey type instead of CryptoECKey
    if (account instanceof CryptoOutput) {
      // Check if it has hdkey
      if (!(account.getHDKey() instanceof CryptoHDKey)) {
        throw new Error('account must be instance of CryptoHDKey or CryptoOutput cointaining CryptoHDKey');
      }
      // Check if HDkey has origin and a valid path
      CryptoDetailedAccount.checkHdKey(account.getHDKey());
    } else {
      // Check if HDkey has origin and a valid path
      CryptoDetailedAccount.checkHdKey(account);
    }
  }

  static checkHdKey(hdKey: CryptoHDKey) {
    // Check if hdkey has origin and a valid path
    if (!hdKey.getOrigin() || !hdKey.getOrigin().getPath()) {
      throw new Error("HdKey must have origin and path information eg: m/44'/60'/0'/0/0");
    }
  }

  public getAccount = () => this.account;
  public getCryptoHDKey = () => { return this.account instanceof CryptoHDKey ? this.account : undefined; };
  public getCryptoOutput = () => { return this.account instanceof CryptoOutput ? this.account : undefined; };
  public getTokenIds = () => {
    if (!this.tokenIds) return undefined;

    // Always return string representation of the token ids
    return this.tokenIds.map((tokenId) => {
      if (tokenId instanceof HexString) {
        // Shall we really add 0x to start?
        return '0x' + tokenId.getData();
      }
      return tokenId;
    });
  };

  public toDataItem = () => {
    const map: DataItemMap = {};
    // Set account based on its type CryptoHDkey or CryptoOutput
    let dataItemAccount: DataItem;

    // Convert to data item
    dataItemAccount = this.account.toDataItem();

    const accountTag = this.account.getRegistryType().getTag();
    // There is a bug in crypto output, it doesnt have top level datatem
    // Add one layer of data item if its crypto output and contains tag
    if (accountTag == RegistryTypes.CRYPTO_OUTPUT.getTag() && dataItemAccount.getTag()) {
      dataItemAccount = new DataItem(dataItemAccount);
    }

    // Now set the tag
    dataItemAccount.setTag(this.account.getRegistryType().getTag());

    map[Keys.account] = dataItemAccount;

    // Return TokenIds based on their type
    if (this.tokenIds) {
      map[Keys.tokenIds] = this.tokenIds.map((tokenId) => {
        if (tokenId instanceof HexString) return tokenId.toDataItem();
        return tokenId;
      });
    }

    return new DataItem(map);
  };

  public static fromDataItem = (dataItem: DataItem) => {
    const map = dataItem.getData();

    let account: CryptoHDKey | CryptoOutput;
    let tokenIds: token_id[] | undefined = undefined;

    const accountDataItem = map[Keys.account] as DataItem;
    const accountTag = accountDataItem.getTag();

    // Cast to correct type based on tag
    if (accountTag == RegistryTypes.CRYPTO_HDKEY.getTag()) {
      account = CryptoHDKey.fromDataItem(accountDataItem);
    } else if (accountTag == RegistryTypes.CRYPTO_OUTPUT.getTag()) {
      // Because of the bug, we need to remove the top level data item
      // First we will try as it should be, then with bug fix
      try {
        account = CryptoOutput.fromDataItem(accountDataItem);
      } catch (error) {
        account = CryptoOutput.fromDataItem(accountDataItem.getData());
      }
    } else {
      throw new Error(`Invalid tag for account: ${accountTag}`);
    }

    // If token-ids are provided
    if (map[Keys.tokenIds]) {
      // Now check the type of token-ids
      const tokenIdsRead = map[Keys.tokenIds] as (string | DataItem)[];

      // Parse every element in the array
      tokenIds = tokenIdsRead.map((tokenId) => {
        // Check if string
        if (typeof tokenId == 'string') return tokenId;
        // Check if hex string
        else if (tokenId instanceof DataItem) {
          return HexString.fromDataItem(tokenId);
        } else throw new Error(`Invalid type for token-id: ${typeof tokenId}`);
      });
    }

    return new CryptoDetailedAccount(account, tokenIds);
  };

  public static fromCBOR = (_cborPayload: Buffer) => {
    const dataItem = decodeToDataItem(_cborPayload);
    return CryptoDetailedAccount.fromDataItem(dataItem);
  };
}
