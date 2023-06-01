import { CryptoCoinIdentity, EllipticCurve } from "@ngraveio/bc-ur-registry-crypto-coin-identity";
import { SignRequestMeta } from '../SignRequestMetadata';

export enum SolSignType {
    signTypeTransaction = 1,
    signTypeMessage = 2,
  }

export interface SolSignRequestProps {
    type?: SolSignType;
    address?: Buffer;
}

export class SolSignRequestMeta extends SignRequestMeta {
    static coinId: CryptoCoinIdentity = new CryptoCoinIdentity(EllipticCurve.secp256k1, 501);

    constructor(data: SolSignRequestProps, tag?: number) {
        super(data, tag);
    }

    checkInputData(data: SolSignRequestProps) {
        if(data?.type) {
            if (!(data.type in SolSignType)) {
                throw new Error('Invalid type');
            }
        }
        // If address exists, make sure it is Buffer and 20 bytes
        if(data?.address) {
            if (!(data.address instanceof Buffer)) {
                throw new Error('Address must be Buffer');
            }
        }
    }

}