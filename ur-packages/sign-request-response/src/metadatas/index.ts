import { CryptoCoinIdentity, EllipticCurve } from "@ngraveio/bc-ur-registry-crypto-coin-identity";
import { SignRequestMeta } from '../SignRequestMetadata';
import { EthSignRequestMeta, PolygonMeta } from "./Ethereum.metadata";


//export const signMetaMap = new Map<CryptoCoinIdentity, typeof SignRequestMeta>([
export const signMetaMap = new Map<string, typeof SignRequestMeta>([
    [EthSignRequestMeta.coinId.toURL(), EthSignRequestMeta],
    [PolygonMeta.coinId.toURL(), PolygonMeta],
]);

export function addMetadata(coinId: CryptoCoinIdentity | string, metadata: typeof SignRequestMeta) {
    if (coinId instanceof CryptoCoinIdentity) signMetaMap.set(coinId.toURL(), metadata);
    else signMetaMap.set(coinId, metadata);
}

export { EthSignRequestMeta, PolygonMeta, IrfanSignRequestMeta } from "./Ethereum.metadata";