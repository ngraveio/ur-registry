import { extend, DataItem, RegistryItem, DataItemMap, CryptoKeypath } from '@keystonehq/bc-ur-registry';
import { CryptoCoinIdentity } from '@ngraveio/bc-ur-registry-crypto-coin-identity';
import { ExtendedRegistryTypes } from './RegistryType';
import { signMetaMap } from './metadatas';
import { SignRequestMeta } from './SignRequestMetadata';
import { EthSignRequestMeta } from './metadatas/Ethereum.metadata';

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

interface ICryptoSignRequestProps {
  requestId?: Buffer; // Size 16
  coinId: CryptoCoinIdentity;
  derivationPath: CryptoKeypath;
  signData: Buffer;
  masterFingerprint?: Buffer; // Size 4
  origin?: string;
  metadata?: SignRequestMeta | object;
}

export class CryptoSignRequest extends RegistryItem {
  private _requestId!: Buffer; // Size 16
  private coinId: CryptoCoinIdentity;
  private derivationPath: CryptoKeypath;
  private signData: Buffer;
  private masterFingerprint?: Buffer; // Size 4
  private origin?: string;
  private metadata?: SignRequestMeta;

  getRegistryType = () => ExtendedRegistryTypes.CRYPTO_SIGNATURE;

  constructor({
    requestId,
    coinId,
    derivationPath,
    signData,
    masterFingerprint,
    origin,
    metadata,
  }: ICryptoSignRequestProps) {
    super();

    this.requestId = requestId;

    // Check inputs
    CryptoSignRequest.checkInputs({
      requestId,
      coinId,
      derivationPath,
      signData,
      masterFingerprint,
      origin,
      metadata,
    });

    // Set inputs
    this.coinId = coinId;
    this.derivationPath = derivationPath;
    this.signData = signData;
    this.masterFingerprint = masterFingerprint;
    this.origin = origin;

    // Check metadata
    if (metadata) {
      // Find metadata type
      const metaType = CryptoSignRequest.findMetadataType(coinId);

      if (metadata instanceof EthSignRequestMeta) {
        console.log('metadata is EthSignRequestMeta');
      }

      // Check if we have an object or an instance of SignRequestMeta
      if (metadata instanceof SignRequestMeta) {
        // Check if that is correct instance
        if (!(metadata instanceof metaType)) {
          const currentType = (metadata as any).constructor.name;
          throw new Error(
            `Provided Metadata is an instance of ${currentType}, it should be instance of ${
              metaType.name
            } for coin ${coinId.toURL()}`
          );
        }

        this.metadata = metadata;
      } else {
        // Create an general instance of foundmetadata type
        this.metadata = new metaType(metadata);
      }
    }
  }

  private set requestId(requestId: Buffer|undefined) {
    // Check Request Id
    if (requestId) {
      // Request id should not be longer than 16 bytes
      if (requestId.length > 16) throw new Error('Request id should not be longer than 16 bytes');
      // If request id is smaller than 16 bytes, pad with 0s
      else if (requestId.length < 16) {
        const padding = Buffer.alloc(16 - requestId.length);
        this._requestId = Buffer.concat([requestId, padding]);
      } else this._requestId = requestId;
    }
    // If request id is not provided, generate a random one
    else {
      this._requestId = Buffer.from(require('crypto').randomBytes(16));
    }
  }

  /**
   * A static method to check if provided inputs follow the rules
   */
  static checkInputs = ({
    requestId,
    coinId,
    derivationPath,
    signData,
    masterFingerprint,
    origin,
    metadata,
  }: ICryptoSignRequestProps) => {
    // If request id is provided check if it is not longer than 16 bytes
    if (requestId) {
      if (requestId.length > 16) throw new Error('Request id should not be longer than 16 bytes');
    }

    // Make sure coin id is provided and is type of CryptoCoinIdentity
    if (!coinId || !(coinId instanceof CryptoCoinIdentity))
      throw new Error('Coin id is required and should be of type CryptoCoinIdentity');

    // Make sure derivation path is provided and is type of CryptoHDKey and has origin and a valid path
    if (!derivationPath || !(derivationPath instanceof CryptoKeypath) || !derivationPath.getPath())
      throw new Error('Derivation path is required and should be of type CryptoKeypath');

    // Make sure sign data is provided and contains data
    if (!signData || signData.length === 0) throw new Error('Sign data is required');

    // If master fingerprint is provided and make sure it is 4 bytes
    if (masterFingerprint) {
      // Master fingerprint should not be longer than 4 bytes
      if (masterFingerprint.length > 4) throw new Error('Master fingerprint should not be longer than 4 bytes');
    }

    // If origin is provided, make sure it is a string
    if (origin && typeof origin !== 'string') throw new Error('Origin should be a string');
  };

  // Getters
  public getRequestId = () => this._requestId;
  public getCoinId = () => this.coinId;
  public getDerivationPath = () => this.derivationPath;
  public getSignData = () => this.signData;
  public getMasterFingerprint = () => this.masterFingerprint;
  public getOrigin = () => this.origin;
  public getMetadata = () => this.metadata;

  /**
   * Converts CryptoSignRequest to an object with tag support
   *
   * @returns {DataItem} DataItem representation of CryptoSignRequest
   */
  public toDataItem = () => {
    const map: DataItemMap = {};

    // Create a new DataItem for request id with UUID tag
    map[Keys.requestId] = new DataItem(this._requestId, RegistryTypes.UUID.getTag());

    // Embed coinId with its tag
    const coinId = this.coinId.toDataItem();
    coinId.setTag(this.coinId.getRegistryType().getTag());
    map[Keys.coinId] = coinId;

    // Embed derivation path with its tag
    const derivationPath = this.derivationPath.toDataItem();
    derivationPath.setTag(this.derivationPath.getRegistryType().getTag());
    map[Keys.derivationPath] = derivationPath;

    // Add sign data
    map[Keys.signData] = this.signData;

    // Add optional fields
    if (this.masterFingerprint) map[Keys.masterFingerprint] = this.masterFingerprint;
    if (this.origin) map[Keys.origin] = this.origin;
    // We have to use `getData()` for returning an object without a tag
    if (this.metadata) map[Keys.metadata] = this.metadata.getData();

    return new DataItem(map);
  };

  /**
   * Finds correspoinding metadata type for given coin id from global `signMetaMap` map
   * If no metadata is found, it will return general `SignRequestMeta` type
   * @param coinId
   * @returns
   */
  public static findMetadataType(coinId: CryptoCoinIdentity): typeof SignRequestMeta {
    // Try to find exact metadata from metadata list
    if (signMetaMap.has(coinId.toURL())) {
      return signMetaMap.get(coinId.toURL())!;
    }

    // Try to match with parent until we dont have any more parents
    let parentCoinId = coinId.getParent();
    while (parentCoinId) {
      if (signMetaMap.has(parentCoinId.toURL())) {
        return signMetaMap.get(parentCoinId.toURL())!;
      }
      parentCoinId = parentCoinId.getParent();
    }

    // Otherwise return general metadata
    return SignRequestMeta;
  }

  /**
   * Creates CryptoSignRequest from DataItem
   *
   * @param dataItem object with keys and values of CryptoSignRequest
   * @returns
   */
  public static fromDataItem = (dataItem: DataItem) => {
    const map = dataItem.getData();

    const requestId = map[Keys.requestId].getData();
    const coinId = CryptoCoinIdentity.fromDataItem(map[Keys.coinId]);
    const derivationPath = CryptoKeypath.fromDataItem(map[Keys.derivationPath]);
    const signData = map[Keys.signData];
    const masterFingerprint = map[Keys.masterFingerprint];
    const origin = map[Keys.origin];

    let metadata = map[Keys.metadata];

    // Select metadata
    const signRequestInput: ICryptoSignRequestProps = {
      requestId,
      coinId,
      derivationPath,
      signData,
      masterFingerprint,
      origin,
      metadata,
    };

    return new CryptoSignRequest(signRequestInput);
  };

  public static fromCBOR = (_cborPayload: Buffer) => {
    const dataItem = decodeToDataItem(_cborPayload);
    return CryptoSignRequest.fromDataItem(dataItem);
  };
}
