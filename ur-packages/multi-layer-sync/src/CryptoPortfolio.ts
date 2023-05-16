import {
    extend,
    DataItem,
    RegistryItem,
    DataItemMap,
  } from "@keystonehq/bc-ur-registry";
import { ExtendedRegistryTypes } from "./RegistryType";
import { CryptoPortfolioCoin } from "./CryptoPortfolioCoin"
import { CryptoSyncMetadata } from "./CryptoSyncMetadata";

const { RegistryTypes, decodeToDataItem } = extend;

/** CDDL
 * 
 * ; Top level multi coin sync payload
 * ; All master-fingerprint fields must match within the included UR types
 * sync = {
 * 		coins: [+ #6.1402(crypto-portfolio-coin)]           ; Multiple coins with their respective accounts and coin identities
 * 		? master-fingerprint: uint32,             ; Master fingerprint (fingerprint for the master public key as per BIP32 derived on secp256k1 curve)
 * 		? metadata: #6.1403(crypto-sync-metadata) ; Optional wallet metadata
 * }
 * 
 * coins = 1
 * metadata = 2
 * 
 */

enum Keys {
  coins = 1,
  metadata = 2,
}

export class CryptoPortfolio extends RegistryItem {
  private coins: CryptoPortfolioCoin[];
  private metadata?: CryptoSyncMetadata;

  getRegistryType = () => ExtendedRegistryTypes.CRYPTO_PORTFOLIO;

  constructor(
    coins: CryptoPortfolioCoin[],
    metadata?: CryptoSyncMetadata
  ) {
    super();
    // Test metadata
    if (metadata && !(metadata instanceof CryptoSyncMetadata)) {
      throw new Error("metadata must be of type CryptoSyncMetadata");
    }

    // Check if coins is array if so check if every element is instance of CryptoPortfolioCoin
    if (!Array.isArray(coins) || !coins.every((coin) => coin instanceof CryptoPortfolioCoin)) {
      throw new Error("coins must be of type CryptoPortfolioCoin[]");
    }

    this.coins = coins;
    this.metadata = metadata;
  }
  
  public getCoins = () => this.coins;
  public getMetadata = () => this.metadata;


  public toDataItem = () => {
    const map: DataItemMap = {};

    // Add coins
    map[Keys.coins] = this.coins.map((coin) => {
       const dataItem = coin.toDataItem()
       dataItem.setTag(ExtendedRegistryTypes.CRYPTO_SYNC_COIN.getTag());
      return dataItem;
    });
  
    // If metadata is set add it to map
    if (this.metadata) {
      map[Keys.metadata] = this.metadata.toDataItem();
      map[Keys.metadata].setTag(ExtendedRegistryTypes.CRYPTO_SYNC_METADATA.getTag());
    }

    return new DataItem(map);
  };

  public static fromDataItem = (dataItem: DataItem) => {
    const map = dataItem.getData();
    let metadata: CryptoSyncMetadata | undefined = undefined;

    // Get coins
    const coins = map[Keys.coins] as DataItem[];
    const coinsParsed = coins.map((coin) => CryptoPortfolioCoin.fromDataItem(coin));

    // Get master_fingerprint

    // Get metadata
    if(map[Keys.metadata]) metadata = CryptoSyncMetadata.fromDataItem(map[Keys.metadata] as DataItem);

    return new CryptoPortfolio(coinsParsed, metadata);
  }

  public static fromCBOR = (_cborPayload: Buffer) => {
    const dataItem = decodeToDataItem(_cborPayload);
    return CryptoPortfolio.fromDataItem(dataItem);
  };
}
  