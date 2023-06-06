import {
  extend,
  DataItem,
  RegistryItem,
  DataItemMap
} from "@keystonehq/bc-ur-registry";
import { ExtendedRegistryTypes } from "./RegistryType";
import { CryptoPortfolioMetadata } from "@ngraveio/bc-ur-registry-crypto-portfolio-metadata";

const { RegistryTypes, decodeToDataItem } = extend;

enum Keys {
  requestId = 1,
  signature,
  metadata,
}

interface ICryptoTxSignature {
  requestId?: Buffer; // Size 16
  signature: Buffer;
  metadata?: CryptoPortfolioMetadata;
}

export class CryptoTxSignature extends RegistryItem {

  private _requestId?: Buffer; // Size 16
  private signature: Buffer;
  private metadata?: CryptoPortfolioMetadata;  

  getRegistryType = () => ExtendedRegistryTypes.CRYPTO_SIGNATURE;

  constructor({ requestId, signature, metadata }: ICryptoTxSignature) {
    super();

    // Make sure signature is provided and contains data
    if(!signature || signature.length === 0) throw new Error("Signature is required");
    
    this.requestId = requestId;
    this.signature = signature;
    this.metadata = metadata;
  }

  // Check request before setting
  private set requestId(requestId: Buffer | undefined) {
    // Check requestId is 16 bytes
    if(requestId) {
      // Request id should not be longer than 16 bytes
      if(requestId.length > 16) throw new Error("Request id should not be longer than 16 bytes");

      // If request id is smaller than 16 bytes, prepad with 0s
      if(requestId.length < 16) {
        const padding = Buffer.alloc(16 - requestId.length);
        requestId = Buffer.concat([padding, requestId]);
      }

      this._requestId = requestId;
    }
  }

  public getRequestId = () => this._requestId;
  public getSignature = () => this.signature;
  public getMetadata = () => this.metadata;

  /**
   * Convert CryptoTxSignature to DataItem representation
   * @returns {DataItem} DataItem representation of CryptoTxSignature
   */
  public toDataItem = () => {
    const map: DataItemMap = {};

    if(this._requestId) {
      map[Keys.requestId] = new DataItem(
        this._requestId,
        RegistryTypes.UUID.getTag()
      );
    }

    map[Keys.signature] = this.signature;

    if (this.metadata) {
      map[Keys.metadata] = this.metadata.toDataItem();
      map[Keys.metadata].setTag(this.metadata.getRegistryType().getTag());
    }

    return new DataItem(map);
  };

  /**
   * Creates a CryptoTxSignature from a DataItem
   * @param dataItem
   * @returns 
   */
  public static fromDataItem = (dataItem: DataItem) => {
    const map = dataItem.getData();
    const signature = map[Keys.signature];
    const requestId = map[Keys.requestId].getData();
    
    let metadata = undefined;
    if(map[Keys.metadata])
      metadata = CryptoPortfolioMetadata.fromDataItem(map[Keys.metadata]);

    return new CryptoTxSignature({signature, requestId, metadata});
  };

  public static fromCBOR = (_cborPayload: Buffer) => {
    const dataItem = decodeToDataItem(_cborPayload);
    return CryptoTxSignature.fromDataItem(dataItem);
  };
}
