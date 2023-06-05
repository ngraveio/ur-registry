import { CryptoCoinIdentity, EllipticCurve } from "@ngraveio/bc-ur-registry-crypto-coin-identity";
import { SignRequestMeta } from '../SignRequestMetadata';
import { EthSignRequestMeta, PolygonMeta } from "./ethereum.metadata";
import { SolSignRequestMeta } from "./solana.metadata";
import { TezosSignRequestMeta } from "./tezos.metadata";


//export const signMetaMap = new Map<CryptoCoinIdentity, typeof SignRequestMeta>([
export const signMetaMap = new Map<string, typeof SignRequestMeta>([
    [EthSignRequestMeta.coinId.toURL(), EthSignRequestMeta],
    [PolygonMeta.coinId.toURL(), PolygonMeta],
    [SolSignRequestMeta.coinId.toURL(), SolSignRequestMeta],
    // Add 3 tezos metadata
    ['bc-coin://Ed25519/1729', TezosSignRequestMeta],
    ['bc-coin://secp256k1/1729', TezosSignRequestMeta],
    ['bc-coin://P256/1729', TezosSignRequestMeta],
]);

export function addMetadata(coinId: CryptoCoinIdentity | string, metadata: typeof SignRequestMeta) {
    if (coinId instanceof CryptoCoinIdentity) signMetaMap.set(coinId.toURL(), metadata);
    else signMetaMap.set(coinId, metadata);
}

export * from './ethereum.metadata'
export * from './solana.metadata'
export * from './tezos.metadata'