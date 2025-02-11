import { CryptoCoinIdentity } from '@ngraveio/bc-ur-registry-crypto-coin-identity';
import { DataItem, DataItemMap } from '@keystonehq/bc-ur-registry';

/**
 * An key value pair of metadata that extends DataItem, so it can be tagged and used in the UR registry
 * This class can be extended to add specific metadata
 */
export class SignRequestMeta extends DataItem {
  // Coin identity is part of this metadata as it shows the audiance of the request
  // This needs to be overwritten in the child class
  private coinId?: CryptoCoinIdentity = undefined;

  constructor(data: DataItemMap, tag?: number) {
    super(data, tag);
    this.checkInputData(data);
  }

  // Used to be toJSON but https://github.com/KeystoneHQ/ur-registry/blob/b0230d8d36c4fd8d7dbb35813198a778ee7f6ced/src/lib/cbor-sync.js#L337 caused issues
  public toString() {
    try {
      return JSON.stringify(this.getData());
    } catch (error) {
      throw new Error('Could not convert metadata to JSON, toJSON() function needs to be overwritten');
    }
  }

  /**
   * Checks the data provided to the MetaData
   * This needs to be overwritten in the child class to check for specific data types
   *
   * @param data object containing the data
   */
  public checkInputData(data: DataItemMap) {
    if (typeof data !== 'object') {
      throw new Error('Invalid input data');
    }
    // Extend rest of this function to check for specific data types
  }

  public getCoinId = () => this.coinId;
}
