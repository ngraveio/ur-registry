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

A Solana transaction is uniquely identified through the URI format bc-coin://ed25519/501, information shared in crypto-coin-identity UR type.

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
  }),
})

// Encode
const cbor = tezSignRequest.toCBOR().toString('hex')
console.log(cbor) // a501d82550abb87ab7b0e9924009d4c775d7158cdf02d90579a20106021906c103d90130a1018a182cf51906c1f500f500f500f50458584478f49a92c565e944b6021ea10d78e4d357217f07d7b04120ee8089a5df75566c004c740575091c360d45d820711afef7be6f30b972904ec0a9a312f90a84020a000036a21afaa10f9470af5db383080017a46a459edd0007a2647479706501676b65795479706501

// Decode
const decodedTezSignRequest = CryptoSignRequest.fromCBOR(Buffer.from(cbor, 'hex'))
```

#### Ethereum (ETH)

An Ethereum transaction is uniquely identified through the URI format bc-coin://secp256k1/60, information shared in crypto-coin-identity UR type.

##### Normal transaction

```js
// get the native ethereum transaction legacy rpl encoded
const nativeTx =
  'e906850963bf08ed8252589442cda393bbe6d079501b98cc9ccf1906901b10bf80856e61626572808080'

// Create the CryptoSignRequest object. The CryptoCoinIdentity identifies this signRequest as a Ethereum sign request.

const ethSignRequest = new CryptoSignRequest({
  coinId: new CryptoCoinIdentity(EllipticCurve.secp256k1, 60),
  derivationPath: "m/44'/60'/0'/0/0",
  signData: Buffer.from(nativeTx, 'hex'),
  metadata: new EthSignRequestMeta({
    dataType: EthDataType.transaction, // legacy rpl encoded
  }),
});

// Encode
const cbor = ethSignRequest.toCBOR().toString('hex')
console.log(cbor) // a501d82550ee61d8625149f73eabaaa0ed7c7ab93102d90579a2010802183c03d90130a1018a182cf5183cf500f500f400f404582ae906850963bf08ed8252589442cda393bbe6d079501b98cc9ccf1906901b10bf80856e6162657280808007a168646174615479706501

// Decode
const decodedEthSignRequest = CryptoSignRequest.fromCBOR(Buffer.from(cbor, 'hex'))
```

##### ERC20 transaction

```js
/**
 * This transaction is from the following ERC20 transfer request rpl:
 * from: "0xeB012c6d43542D105b6De63f4E8F8eff1f2a916e"
 * to: "0x42cda393bbe6d079501B98cc9cCF1906901b10Bf"
 * value: 0
 * contractAddress: "0x27054b13b1b798b345b591a4d22e6562d47ea75a"
 * token: "AirSwap (AST) 
 * tokenValue: 0.0001
 */

const nativeTx = 'f869068505d90661eb82a31d9427054b13b1b798b345b591a4d22e6562d47ea75a80b844a9059cbb00000000000000000000000042cda393bbe6d079501b98cc9ccf1906901b10bf0000000000000000000000000000000000000000000000000000000000000001808080';


// Create the CryptoSignRequest object. The CryptoCoinIdentity identifies this signRequest as a Ethereum sign request.
const ethSignRequest = new CryptoSignRequest({
  coinId: new CryptoCoinIdentity(EllipticCurve.secp256k1, 60),
  derivationPath: "m/44'/60'/0'/0/1",
  signData: Buffer.from(nativeTx, 'hex'),
  metadata: new EthSignRequestMeta({
    dataType: EthDataType.transaction, // rlp encoded transaction
  }),
});


// Encode
const cbor = ethSignRequest.toCBOR().toString('hex')
console.log(cbor) // a501d8255066faa8ff51d07b7ad09322dda934da2202d90579a2010802183c03d90130a1018a182cf5183cf500f500f401f404586bf869068505d90661eb82a31d9427054b13b1b798b345b591a4d22e6562d47ea75a80b844a9059cbb00000000000000000000000042cda393bbe6d079501b98cc9ccf1906901b10bf000000000000000000000000000000000000000000000000000000000000000180808007a168646174615479706501

// Decode
const decodedEthSignRequest = CryptoSignRequest.fromCBOR(Buffer.from(cbor, 'hex'))
```

##### ERC20 transaction Polygon

```js
/**
 * This transaction is from the following ERC20 transfer request rlp:
 * from: "0x371398af172609f57f0F13Be4c1AAf48AcCEB59d"
 * to: "0x9E9B5d5151B0F6BEEf3D90eeb36b12365c09bBb4"
 * value: 0
 * contractAddress: "0x6f8a06447Ff6FcF75d803135a7de15CE88C1d4ec"
 * token: "SHIB" 
 * tokenValue: 10
 */
const nativeTx = '02F87081890E8507D4E0A5E485220C87BE3883017AD0946F8A06447FF6FCF75D803135A7DE15CE88C1D4EC80B844A9059CBB0000000000000000000000009E9B5D5151B0F6BEEF3D90EEB36B12365C09BBB40000000000000000000000000000000000000000000000008AC7230489E80000C0';

const maticSignRequest = new CryptoSignRequest({
  coinId: new CryptoCoinIdentity(EllipticCurve.secp256k1, 60, [137]),
  derivationPath: "m/44'/60'/0'/0/0",
  signData: Buffer.from(nativeTx, 'hex'),
  metadata: new PolygonMeta({
    dataType: EthDataType.typedTransaction, // rlp encoded typed transaction
  }),
});


// Encode
const cbor = maticSignRequest.toCBOR().toString('hex')
console.log(cbor) // a501d82550280a618ea46c025c748236ad393e28d302d90579a3010802183c0381188903d90130a1018a182cf5183cf500f500f400f404587302f87081890e8507d4e0a5e485220c87be3883017ad0946f8a06447ff6fcf75d803135a7de15ce88c1d4ec80b844a9059cbb0000000000000000000000009e9b5d5151b0f6beef3d90eeb36b12365c09bbb40000000000000000000000000000000000000000000000008ac7230489e80000c007a168646174615479706504

// Decode
const decodedMaticSignRequest = CryptoSignRequest.fromCBOR(Buffer.from(cbor, 'hex'))
```

##### ERC721 transaction

```js
/**
 * This transaction is from the following erc721 NFT transfer request rpl:
 * from: "0xeB012c6d43542D105b6De63f4E8F8eff1f2a916e"
 * to: "0x42cda393bbe6d079501B98cc9cCF1906901b10Bf"
 * value: 0
 * contractAddress: "0xc9154424B823b10579895cCBE442d41b9Abd96Ed"
 * tokenId: 30215980622330187411918288900688501299580125367569939549692495857307848015874
 */
const nativeTx = 'f88a068506275583f48301281c94c9154424b823b10579895ccbe442d41b9abd96ed80b86442842e0e000000000000000000000000eb012c6d43542d105b6de63f4e8f8eff1f2a916e00000000000000000000000042cda393bbe6d079501b98cc9ccf1906901b10bf42cda393bbe6d079501b98cc9ccf1906901b10bf000000000000000000000002808080';

const ethSignRequest = new CryptoSignRequest({
  coinId: new CryptoCoinIdentity(EllipticCurve.secp256k1, 60),
  derivationPath: "m/44'/60'/0'/0/1",
  signData: Buffer.from(nativeTx, 'hex'),
  metadata: new EthSignRequestMeta({
    dataType: EthDataType.transaction, // rlp encoded transaction
  }),
});


// Encode
const cbor = ethSignRequest.toCBOR().toString('hex')
console.log(cbor) // a501d82550dcbc47e80f4b0a666fdda1de90cdb33b02d90579a2010802183c03d90130a1018a182cf5183cf500f500f401f404588cf88a068506275583f48301281c94c9154424b823b10579895ccbe442d41b9abd96ed80b86442842e0e000000000000000000000000eb012c6d43542d105b6de63f4e8f8eff1f2a916e00000000000000000000000042cda393bbe6d079501b98cc9ccf1906901b10bf42cda393bbe6d079501b98cc9ccf1906901b10bf00000000000000000000000280808007a168646174615479706501

// Decode
const decodedEthSignRequest = CryptoSignRequest.fromCBOR(Buffer.from(cbor, 'hex'))
```

##### ERC721 transaction Polygon

```js
/**
 * This transaction is from the following erc721 NFT transfer request rpl:
 * from: "0x371398af172609f57f0F13Be4c1AAf48AcCEB59d"
 * to: "0x9E9B5d5151B0F6BEEf3D90eeb36b12365c09bBb4"
 * value: 0
 * contractAddress: "0xb6432d111bc2a022048b9aea7c11b2d627184bdd"
 * tokenId: 107839786668602559178668060348078522694548577690162289924414441239912
 * 
 * link: https://polygonscan.com/nft/0xb6432d111bc2a022048b9aea7c11b2d627184bdd/107839786668602559178668060348078522694548577690162289924414441239912
 * 
 */
const nativeTx = '02f89081890e8506fc23ac008515a6cd9ad88304a35c94b6432d111bc2a022048b9aea7c11b2d627184bdd80b86423b872dd000000000000000000000000371398af172609f57f0f13be4c1aaf48acceb59d0000000000000000000000009e9b5d5151b0f6beef3d90eeb36b12365c09bbb4000000040000000000000000000000000000000000000000000000000003b568c0';

const ethSignRequest = new CryptoSignRequest({
  coinId: new CryptoCoinIdentity(EllipticCurve.secp256k1, 60),
  derivationPath: "m/44'/60'/0'/0/0",
  signData: Buffer.from(nativeTx, 'hex'),
  metadata: new EthSignRequestMeta({
    dataType: EthDataType.typedTransaction, // rlp encoded transaction
  }),
});


// Encode
const cbor = ethSignRequest.toCBOR().toString('hex')
console.log(cbor) // a501d825503d4c4d199637f1614500335078ed200a02d90579a2010802183c03d90130a1018a182cf5183cf500f500f400f404589302f89081890e8506fc23ac008515a6cd9ad88304a35c94b6432d111bc2a022048b9aea7c11b2d627184bdd80b86423b872dd000000000000000000000000371398af172609f57f0f13be4c1aaf48acceb59d0000000000000000000000009e9b5d5151b0f6beef3d90eeb36b12365c09bbb4000000040000000000000000000000000000000000000000000000000003b568c007a168646174615479706504

// Decode
const decodedEthSignRequest = CryptoSignRequest.fromCBOR(Buffer.from(cbor, 'hex'))
```

##### ERC1155 transaction

```js
/**
 * This transaction is from the following erc1155 NFT transfer request rpl:
 * from: "0xeB012c6d43542D105b6De63f4E8F8eff1f2a916e"
 * to: "0x42cda393bbe6d079501B98cc9cCF1906901b10Bf"
 * value: 0
 * contractAddress: "0xB66a603f4cFe17e3D27B87a8BfCaD319856518B8"
 * tokenId: 30215980622330187411918288900688501299580125367569939549692495857307848015879
 * nftValue: 1
 */
const nativeTx = 'f8e906850666b5ee5582ba8c94b66a603f4cfe17e3d27b87a8bfcad319856518b880b8c4f242432a000000000000000000000000eb012c6d43542d105b6de63f4e8f8eff1f2a916e00000000000000000000000042cda393bbe6d079501b98cc9ccf1906901b10bf42cda393bbe6d079501b98cc9ccf1906901b10bf000000000000000000000007000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000000808080';

const ethSignRequest = new CryptoSignRequest({
  coinId: new CryptoCoinIdentity(EllipticCurve.secp256k1, 60),
  derivationPath: "m/44'/60'/0'/0/1",
  signData: Buffer.from(nativeTx, 'hex'),
  metadata: new EthSignRequestMeta({
    dataType: EthDataType.transaction, // rlp encoded transaction
  }),
});


// Encode
const cbor = ethSignRequest.toCBOR().toString('hex')
console.log(cbor) // a501d82550d9e96428277d76b12e2562ca76b301a302d90579a2010802183c03d90130a1018a182cf5183cf500f500f401f40458ebf8e906850666b5ee5582ba8c94b66a603f4cfe17e3d27b87a8bfcad319856518b880b8c4f242432a000000000000000000000000eb012c6d43542d105b6de63f4e8f8eff1f2a916e00000000000000000000000042cda393bbe6d079501b98cc9ccf1906901b10bf42cda393bbe6d079501b98cc9ccf1906901b10bf000000000000000000000007000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000000080808007a168646174615479706501

// Decode
const decodedEthSignRequest = CryptoSignRequest.fromCBOR(Buffer.from(cbor, 'hex'))
```