import {
  extend,
  DataItem,
  RegistryItem,
  DataItemMap
} from "@keystonehq/bc-ur-registry";
import { ExtendedRegistryTypes } from "./RegistryType";

const { RegistryTypes, decodeToDataItem } = extend;

enum Keys {
  requestId = 1,
  signature,
  origin,
}

interface ICryptoTxSignature {
  requestId?: Buffer; // Size 16
  signature: Buffer;
  origin?: string;
}

export class CryptoTxSignature extends RegistryItem {

  private requestId?: Buffer; // Size 16
  private signature: Buffer;
  private origin?: string;  

  getRegistryType = () => ExtendedRegistryTypes.CRYPTO_SIGNATURE;

  constructor({ requestId, signature, origin }: ICryptoTxSignature) {
    super();
    // Check requestId is 16 bytes
    if(requestId) {
      // Request id should not be longer than 16 bytes
      if(requestId.length > 16) throw new Error("Request id should not be longer than 16 bytes");

      // If request id is smaller than 16 bytes, pad with 0s
      if(requestId.length < 16) {
        const padding = Buffer.alloc(16 - requestId.length);
        requestId = Buffer.concat([requestId, padding]);
      }
    }

    // Make sure signature is provided and contains data
    if(!signature || signature.length === 0) throw new Error("Signature is required");
    

    this.requestId = requestId;
    this.signature = signature;
    this.origin = origin;
  }

  public getRequestId = () => this.requestId;
  public getSignature = () => this.signature;
  public getOrigin = () => this.origin;

  public toDataItem = () => {
    const map: DataItemMap = {};

    if(this.requestId) {
      map[Keys.requestId] = new DataItem(
        this.requestId,
        RegistryTypes.UUID.getTag()
      );
    }

    map[Keys.signature] = this.signature;

    if (this.origin) {
      map[Keys.origin] = this.origin;
    }

    return new DataItem(map);
  };

  public static fromDataItem = (dataItem: DataItem) => {
    const map = dataItem.getData();
    const signature = map[Keys.signature];
    const requestId = map[Keys.requestId].getData();
    const origin = map[Keys.origin];

    return new CryptoTxSignature({signature, requestId, origin});
  };

  public static fromCBOR = (_cborPayload: Buffer) => {
    const dataItem = decodeToDataItem(_cborPayload);
    return CryptoTxSignature.fromDataItem(dataItem);
  };
}
