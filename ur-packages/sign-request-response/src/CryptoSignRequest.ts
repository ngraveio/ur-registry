import {
  extend,
  DataItem,
  RegistryItem,
  DataItemMap,
  CryptoHDKey
} from "@keystonehq/bc-ur-registry";
import { CryptoCoinIdentity } from "@ngraveio/bc-ur-registry-crypto-coin-identity";
import { ExtendedRegistryTypes } from "./RegistryType";

const { RegistryTypes, decodeToDataItem } = extend;

// request-id = 1
// coin-id = 2
// derivation-path = 3
// sign-data = 4
// master-fingerprint = 5
// origin = 6
// metadata = 7


enum Keys {
  requestId = 1,
  coinId,
  derivationPath,
  signData,
  masterFingerprint,
  origin,
  metadata,
}

interface ICryptoSignRequest {
  requestId?: Buffer; // Size 16
  coinId: CryptoCoinIdentity;
  derivationPath: CryptoHDKey;
  signData: Buffer;
  masterFingerprint?: Buffer; // Size 4
  origin?: string;
  metadata?: any;
}


export class CryptoSignRequest extends RegistryItem {

  private requestId: Buffer; // Size 16
  private coinId: CryptoCoinIdentity;
  private derivationPath: CryptoHDKey;
  private signData: Buffer;
  private masterFingerprint?: Buffer; // Size 4
  private origin?: string;
  private metadata?: any;

  getRegistryType = () => ExtendedRegistryTypes.CRYPTO_SIGNATURE;

  constructor({
    requestId,
    coinId,
    derivationPath,
    signData,
    masterFingerprint,
    origin,
    metadata
  }: ICryptoSignRequest) {
    super();

    // Check inputs
    CryptoSignRequest.checkInputs({
      requestId,
      coinId,
      derivationPath,
      signData,
      masterFingerprint,
      origin,
      metadata
    });

    if(requestId) {
      // Request id should not be longer than 16 bytes
      if(requestId.length > 16) throw new Error("Request id should not be longer than 16 bytes");

      // If request id is smaller than 16 bytes, pad with 0s
      if(requestId.length < 16) {
        const padding = Buffer.alloc(16 - requestId.length);
        requestId = Buffer.concat([requestId, padding]);
      }
    }
    // If request id is not provided, generate a random one
    else {
      requestId = Buffer.from(require("crypto").randomBytes(16));
    }    

    // Set values
    this.requestId = requestId;
    this.coinId = coinId;
    this.derivationPath = derivationPath;
    this.signData = signData;
    this.masterFingerprint = masterFingerprint;
    this.origin = origin;
    this.metadata = metadata;
  }

  static checkInputs = ({
    requestId,
    coinId,
    derivationPath,
    signData,
    masterFingerprint,
    origin,
    metadata
  }: ICryptoSignRequest) => {
    // if(requestId) {
    //   // Request id should not be longer than 16 bytes
    //   if(requestId.length > 16) throw new Error("Request id should not be longer than 16 bytes");

    //   // If request id is smaller than 16 bytes, pad with 0s
    //   if(requestId.length < 16) {
    //     const padding = Buffer.alloc(16 - requestId.length);
    //     requestId = Buffer.concat([requestId, padding]);
    //   }
    // }
    // // If request id is not provided, generate a random one
    // else {
    //   requestId = Buffer.from(require("crypto").randomBytes(16));
    // }

    // Make sure coin id is provided and is type of CryptoCoinIdentity
    if(!coinId || !(coinId instanceof CryptoCoinIdentity)) throw new Error("Coin id is required and should be of type CryptoCoinIdentity");

    // Make sure derivation path is provided and is type of CryptoHDKey and has origin and a valid path
    if(!derivationPath || !(derivationPath instanceof CryptoHDKey) || !derivationPath.getOrigin() || !derivationPath.getOrigin().getPath())
      throw new Error("Derivation path is required and should be of type CryptoHDKey and should have origin and path");

    // Make sure sign data is provided and contains data
    if(!signData || signData.length === 0) throw new Error("Sign data is required");

    // If master fingerprint is provided and make sure it is 4 bytes
    if(masterFingerprint) {
      // Master fingerprint should not be longer than 4 bytes
      if(masterFingerprint.length > 4) throw new Error("Master fingerprint should not be longer than 4 bytes");
    }

    // If origin is provided, make sure it is a string
    if(origin && typeof origin !== "string") throw new Error("Origin should be a string");

    // TODO: metadata
  };

  // Getters
  public getRequestId = () => this.requestId;
  public getCoinId = () => this.coinId;
  public getDerivationPath = () => this.derivationPath;
  public getSignData = () => this.signData;
  public getMasterFingerprint = () => this.masterFingerprint;
  public getOrigin = () => this.origin;
  public getMetadata = () => this.metadata;

  public toDataItem = () => {
    const map: DataItemMap = {};


    map[Keys.requestId] = new DataItem(
      this.requestId,
      RegistryTypes.UUID.getTag()
    );

    const coinId = this.coinId.toDataItem();
    coinId.setTag(this.coinId.getRegistryType().getTag());
    map[Keys.coinId] = coinId;

    const derivationPath = this.derivationPath.toDataItem();
    derivationPath.setTag(this.derivationPath.getRegistryType().getTag());
    map[Keys.derivationPath] = derivationPath;

    map[Keys.signData] = this.signData;
    if (this.masterFingerprint) map[Keys.masterFingerprint] = this.masterFingerprint;
    if (this.origin) map[Keys.origin] = this.origin
    if (this.metadata) map[Keys.metadata] = this.metadata;

    return new DataItem(map);
  };

  public static fromDataItem = (dataItem: DataItem) => {
    const map = dataItem.getData();

    const requestId = map[Keys.requestId].getData();
    const coinId = CryptoCoinIdentity.fromDataItem(map[Keys.coinId]);
    const derivationPath = CryptoHDKey.fromDataItem(map[Keys.derivationPath]);
    const signData = map[Keys.signData];
    const masterFingerprint = map[Keys.masterFingerprint];
    const origin = map[Keys.origin];
    const metadata = map[Keys.metadata];

    const signRequestInput: ICryptoSignRequest = {
      requestId,
      coinId,
      derivationPath,
      signData,
      masterFingerprint,
      origin,
      metadata
    };

    return new CryptoSignRequest(signRequestInput);
  };

  public static fromCBOR = (_cborPayload: Buffer) => {
    const dataItem = decodeToDataItem(_cborPayload);
    return CryptoSignRequest.fromDataItem(dataItem);
  };
}
