# Signing Protocol

This is the implementation of the [Signing Protocol](https://github.com/ngraveio/Research/blob/main/papers/nbcr-2023-003-crypto-sign.md) that is coin agnostic and can be used for any coin.

This package adds support for the following ur types:

| Type                  | [[CBOR Tag]](https://www.iana.org/assignments/cbor-tags/cbor-tags.xhtml) | Owner  | Description                                                                                               | Definition                                                                                            |
| --------------------- | ------------------------------------------------------------------------ | ------ | --------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `crypto-sign-request` | 1411                                                                     | Ngrave | Blockchain-agnostic signature request type where type of the coin is identified by `crypto-coin-identity` | [[NBCR-2023-003]](https://github.com/ngraveio/Research/blob/main/papers/nbcr-2023-003-crypto-sign.md) |
| `crypto-signature`    | 1412                                                                     | Ngrave | Blockchain-agnostic signature response type                                                               | [[NBCR-2023-003]](https://github.com/ngraveio/Research/blob/main/papers/nbcr-2023-003-crypto-sign.md) |

This repository is an extension of [bc-ur-registry](https://github.com/KeystoneHQ/ur-registry)

## Installing

To install, run:

```bash
yarn add @ngraveio/bc-ur-sign-request-response
```

```bash
npm install --save @ngraveio/bc-ur-sign-request-response
```

## Examples:

## CryptoSignRequest

### [CryptoSignRequest] Create a signing request for a transaction. The signing request is created by the watch-only wallet that includes the transaction to sign and the signer account to be sent via QR code to the offline signer.

#### MultiversX (eGLD)

A MultiversX transaction is uniquely identified through the URI format bc-coin://ed25519/508

```js
// get the native transaction
const nativeTx =
  'f849808609184e72a00082271094000000000000000000000000000000000000000080a47f7465737432000000000000000000000000000000000000000000000000000000600057808080'

// Create the CryptoSignRequest object. The CryptoCoinIdentity identifies this signRequest as a MultiversX sign request.
const egldSignRequest = new CryptoSignRequest({
  coinId: new CryptoCoinIdentity(EllipticCurve.Ed25519, 508),
  derivationPath: "m/44'/508'/0'/0'/0'",
  signData: Buffer.from(nativeTx, 'hex'),
})

// Encode
const cbor = egldSignRequest.toCBOR().toString('hex')
console.log(cbor)

// Decode
const decodedEgldSignRequest = CryptoSignRequest.fromCBOR(Buffer.from(cbor, 'hex'))
```

#### Solana (SOL)

A Solana transaction is uniquely identified through the URI format bc-coin://ed25519/508, information shared in crypto-coin-identity UR type.

```js
// get the native transaction
const nativeTx =
  '01000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100020420771c01ee4ef0cd64de8aca6761ec53d81f2af4d82a6f901875b3eb6656aca1f71cd55949eaf3eb16b17a2760e5bc2141f45583263996a513788ce66ba3ed1c0000000000000000000000000000000000000000000000000000000000000000054a535a992921064d24e87160da387c7c35b5ddbc92bb81e41fa8404105448d4ab54ac2b31a0eacb2d4d88715857164550b21b55a69e7f326a5392230b41c9e02020200010c02000000002d3101000000000301000b48656c6c6f20576f726c64'

// Create the CryptoSignRequest object. The CryptoCoinIdentity identifies this signRequest as a Solana sign request.
const solSignRequest = new CryptoSignRequest({
  coinId: new CryptoCoinIdentity(EllipticCurve.Ed25519, 501),
  derivationPath: "44'/501'/0'/0'",
  signData: Buffer.from(nativeTx, 'hex'),
  metadata: new SolSignRequestMeta({
    type: SolSignType.signTypeTransaction,
    address: Buffer.from('3BjPTqppzsSFtrEzv4iJ28SW97ubkRHrQVwmzoBqT8ZN'), // base58
  }),
})

//// Encode
const cbor = solSignRequest.toCBOR().toString('hex')
console.log(cbor) // a501d82550e382f18c7b5b1d8a9eda5d8a2305279e02d90579a20106021901f503d90130a10188182cf51901f5f500f500f50459010601000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100020420771c01ee4ef0cd64de8aca6761ec53d81f2af4d82a6f901875b3eb6656aca1f71cd55949eaf3eb16b17a2760e5bc2141f45583263996a513788ce66ba3ed1c0000000000000000000000000000000000000000000000000000000000000000054a535a992921064d24e87160da387c7c35b5ddbc92bb81e41fa8404105448d4ab54ac2b31a0eacb2d4d88715857164550b21b55a69e7f326a5392230b41c9e02020200010c02000000002d3101000000000301000b48656c6c6f20576f726c6407a26474797065016761646472657373582c33426a50547170707a7353467472457a7634694a32385357393775626b5248725156776d7a6f427154385a4e

// Decode
const decodedSolSignRequest = CryptoSignRequest.fromCBOR(Buffer.from(cbor, 'hex'))
```

#### Stellar (XRP)

A Stellar transaction is identified by bc-coin://ed25519/148. This information is shared in crypto-coin-identity UR type.

```js
// get the native transaction
const nativeTx = 'thisIsAMockTransaction'

// Create the CryptoSignRequest object. The CryptoCoinIdentity identifies this signRequest as a Stellar sign request.
const xrpSignRequest = new CryptoSignRequest({
  coinId: new CryptoCoinIdentity(EllipticCurve.Ed25519, 148),
  derivationPath: "m/44'/148'/0'",
  signData: Buffer.from(nativeTx, 'hex'),
})

// Encode
const cbor = xrpSignRequest.toCBOR().toString('hex')
console.log(cbor)

// Decode
const decodedXrpSignRequest = CryptoSignRequest.fromCBOR(Buffer.from(cbor, 'hex'))
```

#### Tezos (XTZ)

A Tezos transaction is uniquely identified through the URI format bc-coin://ed25519/1729, bc-coin://secp256k1/1729 or bc-coin://P256/1729 depending on the elliptic curves selected to sign the transaction.This information is shared in crypto-coin-identity UR type.

```js
// get the native Ed25519 tz1 transaction
const nativeTx =
  '4478f49a92c565e944b6021ea10d78e4d357217f07d7b04120ee8089a5df75566c004c740575091c360d45d820711afef7be6f30b972904ec0a9a312f90a84020a000036a21afaa10f9470af5db383080017a46a459edd00'

// Create the CryptoSignRequest object. The CryptoCoinIdentity identifies this signRequest as a Tezos sign request.
const tezSignRequest = new CryptoSignRequest({
  coinId: new CryptoCoinIdentity(EllipticCurve.Ed25519, 1729),
  derivationPath: "m/44'/1729'/0'/0'/0'",
  signData: Buffer.from(nativeTx, 'hex'),
  metadata: new TezosSignRequestMeta({
    type: TezosDataType.dataTypeOperation,
    keyType: TezosKeyType.ed25519,
  }),
})

// Encode
const cbor = tezSignRequest.toCBOR().toString('hex')
console.log(cbor) // a501d82550abb87ab7b0e9924009d4c775d7158cdf02d90579a20106021906c103d90130a1018a182cf51906c1f500f500f500f50458584478f49a92c565e944b6021ea10d78e4d357217f07d7b04120ee8089a5df75566c004c740575091c360d45d820711afef7be6f30b972904ec0a9a312f90a84020a000036a21afaa10f9470af5db383080017a46a459edd0007a2647479706501676b65795479706501

// Decode
const decodedTezSignRequest = CryptoSignRequest.fromCBOR(Buffer.from(cbor, 'hex'))
```
