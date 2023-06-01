import { CryptoCoinIdentity, EllipticCurve } from "@ngraveio/bc-ur-registry-crypto-coin-identity";
import { SignRequestMeta } from '../SignRequestMetadata';

export enum TezosKeyType {
    ed25519 = 1,
    sep256k1 = 2,
    nistp256r1 = 3,
    sapling = 4,
}

export enum TezosDataType {
    dataTypeOperation = 1, // A forged operation
  }

export interface TezosSignRequestProps {
    type?: TezosDataType;
    keyType?: TezosKeyType;
}

export class TezosSignRequestMeta extends SignRequestMeta {
    //static coinId: CryptoCoinIdentity = new CryptoCoinIdentity(EllipticCurve.secp256k1, 501);

    constructor(data: TezosSignRequestProps, tag?: number) {
        super(data, tag);

        // keyType is inferred from the coinId
    }
}

const tezosCoinIds = {
    [TezosKeyType.ed25519 ]: new CryptoCoinIdentity(EllipticCurve.Ed25519, 1729).toURL(),
    [TezosKeyType.sep256k1 ]: new CryptoCoinIdentity(EllipticCurve.secp256k1, 1729).toURL(),
    [TezosKeyType.nistp256r1 ]: new CryptoCoinIdentity(EllipticCurve.P256, 1729).toURL(),
    // TODO sapling??
};

// Add 3 tezos metadata
// addMetadata('bc-coin://Ed25519/1729', TezosSignRequestMeta);
// addMetadata('bc-coin://secp256k1/1729', TezosSignRequestMeta);
// addMetadata('bc-coin://P256/1729', TezosSignRequestMeta);