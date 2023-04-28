import {
    extend,
    DataItem,
    RegistryItem,
    DataItemMap,
  } from "@keystonehq/bc-ur-registry";
import { ExtendedRegistryTypes } from "./RegistryType";
import { CryptoSyncCoin } from "./CryptoSyncCoin"
import { CryptoSyncMetadata } from "./CryptoSyncMetadata";

const { RegistryTypes, decodeToDataItem } = extend;

/** CDDL
 * 
 * ; Top level multi coin sync payload
 * ; All master-fingerprint fields must match within the included UR types
 * sync = {
 * 		coins: [+ #6.1402(crypto-coin)]           ; Multiple coins with their respective accounts and coin identities
 * 		? master-fingerprint: uint32,             ; Master fingerprint (fingerprint for the master public key as per BIP32 derived on secp256k1 curve)
 * 		? metadata: #6.1403(crypto-sync-metadata) ; Optional wallet metadata
 * }
 * 
 * coins = 1
 * master-fingerprint = 2
 * metadata = 3
 * 
 */


enum Keys {
  coins = 1,
  master_fingerprint = 2,
  metadata = 3,
}

export class CryptoPortfolio extends RegistryItem {
  private coins: CryptoSyncCoin[];
  private master_fingerprint?: number; // masterFingerprint.readUInt32BE(0);
  private metadata?: CryptoSyncMetadata;

  getRegistryType = () => ExtendedRegistryTypes.CRYPTO_PORTFOLIO;

  constructor(
    coins: CryptoSyncCoin[],
    master_fingerprint?: number,
    metadata?: CryptoSyncMetadata
  ) {
    super();
    this.coins = coins;
    this.master_fingerprint = master_fingerprint;
    this.metadata = metadata;
  }
  
  public getCoins = () => this.coins;
  public getMasterFingerprint = () => this.master_fingerprint;
  public getMetadata = () => this.metadata;


  public toDataItem = () => {
    const map: DataItemMap = {};

    // Add coins
    map[Keys.coins] = this.coins.map((coin) => coin.toDataItem());
  
    // If master_fingerprint is set add it to map
    if (this.master_fingerprint) {
      map[Keys.master_fingerprint] = this.master_fingerprint;
    }

    // If metadata is set add it to map
    if (this.metadata) {
      map[Keys.metadata] = this.metadata.toDataItem();
    }

    return new DataItem(map);
  };

  public static fromDataItem = (dataItem: DataItem) => {
    const map = dataItem.getData();
    let master_fingerprint: number | undefined = undefined;
    let metadata: CryptoSyncMetadata | undefined = undefined;

    // Get coins
    const coins = map[Keys.coins] as DataItem[];
    const coinsParsed = coins.map((coin) => CryptoSyncCoin.fromDataItem(coin));

    // Get master_fingerprint
    if(map[Keys.master_fingerprint]) master_fingerprint =  map[Keys.master_fingerprint] as number;

    // Get metadata
    if(map[Keys.metadata]) metadata = CryptoSyncMetadata.fromDataItem(map[Keys.metadata] as DataItem);

    return new CryptoPortfolio(coinsParsed, master_fingerprint, metadata);
  }

  public static fromCBOR = (_cborPayload: Buffer) => {
    const dataItem = decodeToDataItem(_cborPayload);
    return CryptoPortfolio.fromDataItem(dataItem);
  };
}
  