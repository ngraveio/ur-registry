import { CryptoCoinIdentity, EllipticCurve } from "@ngraveio/bc-ur-registry-crypto-coin-identity";
import { SignRequestMeta } from '../SignRequestMetadata';

export enum EthDataType {
    transaction = 1,        // legacy transaction rlp encoding of unsigned transaction data
    typedData = 2,          // EIP-712 typed signing data
    personalMessage = 3,    // for signing message usage, like EIP-191 personal_sign data
    typedTransaction = 4,   // EIP-2718 typed transaction of unsigned transaction data
  }

export interface EthSignRequestProps {
    dataType: EthDataType;
    address?: Buffer;
}

export class EthSignRequestMeta extends SignRequestMeta {
    static coinId: CryptoCoinIdentity = new CryptoCoinIdentity(EllipticCurve.secp256k1, 60);

    constructor(data: EthSignRequestProps, tag?: number) {
        super(data, tag);
    }

    checkInputData(data: EthSignRequestProps) {
        // Make sure dataType is valid
        if (!(data.dataType in EthDataType)) {
            throw new Error('Invalid dataType');
        }
        // If address exists, make sure it is Buffer and 20 bytes
        if(data.address) {
            if (!(data.address instanceof Buffer)) {
                throw new Error('Address must be Buffer');
            }
            if (data.address.length !== 20) {
                throw new Error('Address must be 20 bytes');
            }
        }
    }

}

export interface PolygonSignRequestProps extends EthSignRequestProps {
    //extraData: string;
}

export class PolygonMeta extends EthSignRequestMeta {
    static coinId: CryptoCoinIdentity = new CryptoCoinIdentity(EllipticCurve.secp256k1, 60, [137]);

    constructor(data: PolygonSignRequestProps, tag?: number) {
        super(data, tag);
    }

    checkInputData(data: PolygonSignRequestProps) {
        super.checkInputData(data);
        // Make sure extraData is string
        // if (data?.extraData && typeof data.extraData !== 'string') {
        //     throw new Error('Invalid extraData');
        // }
    }
}


export class IrfanSignRequestMeta extends SignRequestMeta {
    static coinId: CryptoCoinIdentity = new CryptoCoinIdentity(EllipticCurve.Ed25519, 798);

    constructor(data: object, tag?: number) {
        super(data, tag);
    }

}