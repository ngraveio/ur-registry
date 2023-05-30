import { CryptoCoinIdentity, EllipticCurve } from "@ngraveio/bc-ur-registry-crypto-coin-identity";
import { extend, DataItem, RegistryItem, DataItemMap } from '@keystonehq/bc-ur-registry'

// Map metadata types by coinID
// For coinID match, first check elliptic curve, then type, then subtype
// If no match, return undefined

// Also add types as interfaces for metadata


// Add Patch functiomality

export class SignRequestMeta extends DataItem {

    coinId?: CryptoCoinIdentity = undefined;

    constructor(data: DataItemMap, tag?: number) {
        super(data, tag);
        this.checkInputData(data);

        //this.coinId = coinId;
    }

    // Used to be toJSON but https://github.com/KeystoneHQ/ur-registry/blob/b0230d8d36c4fd8d7dbb35813198a778ee7f6ced/src/lib/cbor-sync.js#L337 caused issues
    public toString() {
        try {
            return JSON.stringify(this.getData())
        } catch (error) {
            throw new Error('Could not convert metadata to JSON, toJSON() function needs to be overwritten');
        }

    }

    public toDataItem() {
        return new DataItem(this.getData(), this.getTag());
    }

    // Throw error if data is undefined
    public checkInputData(data: DataItemMap) {
        if (typeof data !== 'object') {
            throw new Error('Invalid input data');
        }
        // Extend this function to check for specific data types
    }

    public getCoinId = () => this.coinId;
}