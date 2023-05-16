# Multi Layer Sync Protocol

This is the implementation of the [Multi Layer Sync Protocol](https://github.com/ngraveio/Research/blob/main/papers/nbcr-2023-002-multi-layer-sync.md#ancher) that supports multiple coins and accounts with different types via globally identifiable URs.

This package add support for following ur types:

| Type                      | [[CBOR Tag]](https://www.iana.org/assignments/cbor-tags/cbor-tags.xhtml) | Owner  | Description                                                                                               | Definition                                                                                                 |
| ------------------------- | ------------------------------------------------------------------------ | ------ | --------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `crypto-detailed-account` | 1402                                                                     | Ngrave | Import multiple accounts with and without output descriptors and specify optionally tokens to synchronize | [[NBCR-2023-002]](https://github.com/ngraveio/Research/blob/main/papers/nbcr-2023-002-multi-layer-sync.md) |
| `crypto-coin`             | 1403                                                                     | Ngrave | Associate several accounts to its coin identity                                                           | [[NBCR-2023-002]](https://github.com/ngraveio/Research/blob/main/papers/nbcr-2023-002-multi-layer-sync.md) |
| `crypto-sync-metadata`    | 1404                                                                     | Ngrave | Specify wallet metadata                                                                                   | [[NBCR-2023-002]](https://github.com/ngraveio/Research/blob/main/papers/nbcr-2023-002-multi-layer-sync.md) |
| `crypto-portfolio`        | 1405                                                                     | Ngrave | Aggregate the portfolio information                                                                       | [[NBCR-2023-002]](https://github.com/ngraveio/Research/blob/main/papers/nbcr-2023-002-multi-layer-sync.md) |

This repository is an extension of [bc-ur-registry](https://github.com/KeystoneHQ/ur-registry)

## Installing

To install, run:

```bash
yarn add @ngrave/bc-ur-multi-layer-sync
```

```bash
npm install --save @ngrave/bc-ur-multi-layer-sync
```

## Examples:

## CryptoDetailedAccount

### [CryptoDetailedAccount] Construct a crypto detailed account with hdkey.

```js
// Create a path component
const originKeyPath = new CryptoKeypath([
  new PathComponent({ index: 44, hardened: true }),
  new PathComponent({ index: 501, hardened: true }),
  new PathComponent({ index: 0, hardened: true }),
  new PathComponent({ index: 0, hardened: true }),
])

// Create a HDKey
const cryptoHDKey = new CryptoHDKey({
  isMaster: false,
  key: Buffer.from('02eae4b876a8696134b868f88cc2f51f715f2dbedb7446b8e6edf3d4541c4eb67b', 'hex'),
  origin: originKeyPath,
})

// Create detailed account
const detailedAccount = new CryptoDetailedAccount(cryptoHDKey)

const cbor = detailedAccount.toCBOR().toString('hex')
const ur = detailedAccount.toUREncoder(1000).nextPart()

console.log(cbor)
//'a101d9012fa203582102eae4b876a8696134b868f88cc2f51f715f2dbedb7446b8e6edf3d4541c4eb67b06d90130a10188182cf51901f5f500f500f5'
console.log(ur)
// 'ur:crypto-detailed-account/oyadtaaddloeaxhdclaowdverokopdinhseeroisyalksaykctjshedprnuyjyfgrovawewftyghceglrpkgamtaaddyoyadlocsdwykcfadykykaeykaeyknegrrfkn'
```

### [CryptoDetailedAccount] Decode a crypto detailed account with hdkey.

```js
// get the cbor result after scanning the QR code
    const cbor =
      'a101d9012fa203582102eae4b876a8696134b868f88cc2f51f715f2dbedb7446b8e6edf3d4541c4eb67b06d90130a10188182cf51901f5f500f500f5';

    // convert the cbor data into the CryptoDetailedAccount
    const detailedAccount = CryptoDetailedAccount.fromCBOR(Buffer.from(cbor, 'hex'));

    // Get HDKey
    const hdKey = detailedAccount.getAccount() as CryptoHDKey;
```

### [CryptoDetailedAccount] Construct a crypto detailed account with CryptoOutput p2pkh hdkey.

```js
const scriptExpressions = [ScriptExpressions.PUBLIC_KEY_HASH]
const originKeypath = new CryptoKeypath(
  [new PathComponent({ index: 44, hardened: true }), new PathComponent({ index: 0, hardened: true }), new PathComponent({ index: 0, hardened: true })],
  Buffer.from('d34db33f', 'hex')
)
const childrenKeypath = new CryptoKeypath([new PathComponent({ index: 1, hardened: false }), new PathComponent({ hardened: false })])
const hdkey = new CryptoHDKey({
  isMaster: false,
  key: Buffer.from('02d2b36900396c9282fa14628566582f206a5dd0bcc8d5e892611806cafb0301f0', 'hex'),
  chainCode: Buffer.from('637807030d55d01f9a0cb3a7839515d796bd07706386a6eddf06cc29a65a0e29', 'hex'),
  origin: originKeypath,
  children: childrenKeypath,
  parentFingerprint: Buffer.from('78412e3a', 'hex'),
})

const cryptoOutput = new CryptoOutput(scriptExpressions, hdkey)

// Create detailed account
const detailedAccount = new CryptoDetailedAccount(cryptoOutput)

const cbor = detailedAccount.toCBOR().toString('hex')
console.log(cbor)
// a101d90134d90193d9012fa503582102d2b36900396c9282fa14628566582f206a5dd0bcc8d5e892611806cafb0301f0045820637807030d55d01f9a0cb3a7839515d796bd07706386a6eddf06cc29a65a0e2906d90130a20186182cf500f500f5021ad34db33f07d90130a1018401f480f4081a78412e3a

const ur = detailedAccount.toUREncoder(1000).nextPart()
console.log(ur)
// ur:crypto-detailed-account/oyadtaadeetaadmutaaddlonaxhdclaotdqdinaeesjzmolfzsbbidlpiyhddlcximhltirfsptlvsmohscsamsgzoaxadwtaahdcxiaksataxbtgotictnybnqdoslsmdbztsmtryatjoialnolweuramsfdtolhtbadtamtaaddyoeadlncsdwykaeykaeykaocytegtqdfhattaaddyoyadlradwklawkaycyksfpdmfttnsbreem
```

### [CryptoDetailedAccount] Decode a crypto detailed account with CryptoOutput p2pkh hdkey.

```js
// get the cbor result after scanning the QR code
    const cbor =
      'a101d90134d90193d9012fa503582102d2b36900396c9282fa14628566582f206a5dd0bcc8d5e892611806cafb0301f0045820637807030d55d01f9a0cb3a7839515d796bd07706386a6eddf06cc29a65a0e2906d90130a20186182cf500f500f5021ad34db33f07d90130a1018401f480f4081a78412e3a';

    // convert the cbor data into the CryptoDetailedAccount
    const detailedAccount = CryptoDetailedAccount.fromCBOR(Buffer.from(cbor, 'hex'));

    // Get HDKey
    const cryptoOutput = detailedAccount.getAccount() as CryptoOutput;
```

### [CryptoSyncMetadata] Construct the crypto sync metadata.

```js
// Create sync id
const sync_id = Buffer.from('babe0000babe00112233445566778899', 'hex')

// Create metadata
const metadata = new CryptoSyncMetadata({ sync_id: sync_id, device: 'my-device', language_code: 'en', fw_version: '1.0.0' })

const cbor = metadata.toCBOR().toString('hex')
console.log(cbor)
// a40150babe0000babe001122334455667788990262656e0365312e302e3004696d792d646576696365

const ur = metadata.toUREncoder(1000).nextPart()
console.log(ur)
// ur:crypto-sync-metadata/oxadgdrdrnaeaerdrnaebycpeofygoiyktlonlaoidihjtaxihehdmdydmdyaainjnkkdpieihkoiniaihfrzmytvl
```

### [CryptoSyncMetadata] Decode crypto sync metadata.

```js
// read ur
const ur = metadata.toUREncoder(1000).nextPart()

// decoded ur
const ur = URRegistryDecoder.decode(urData)

// get the class from the cbor data
const cryptoSyncMetadata = CryptoSyncMetadata.fromCBOR(ur.cbor)

// read its properties
cryptoSyncMetadata.getSyncId() // babe0000babe00112233445566778899
cryptoSyncMetadata.getLanguageCode() // en
cryptoSyncMetadata.getDevice() // my-device
cryptoSyncMetadata.getFirmwareVersion() // 1.0.0
```

## [CryptoSyncCoin] create CryptoSyncCoin with 2 detailed account with tokens

```js
// Create a coin identity
const coinIdentity = new CryptoCoinIdentity(EllipticCurve.secp256k1, 60)

const cryptoHDKey = new CryptoHDKey({
  isMaster: false,
  key: Buffer.from('02d2b36900396c9282fa14628566582f206a5dd0bcc8d5e892611806cafb0301f0', 'hex'),
  origin: new CryptoKeypath([
    new PathComponent({ index: 60, hardened: true }),
    new PathComponent({ index: 0, hardened: true }),
    new PathComponent({ index: 0, hardened: true }),
    new PathComponent({ index: 0, hardened: false }),
    new PathComponent({ index: 0, hardened: false }),
  ]),
  parentFingerprint: Buffer.from('78412e3a', 'hex'),
})

const tokenIds = ['0xdac17f958d2ee523a2206206994597c13d831ec7', '0xB8c77482e45F1F44dE1745F52C74426C631bDD52']

// add a cryptoHD key from a known hex
const cryptoHDKey2 = CryptoHDKey.fromCBOR(
  Buffer.from('a203582102eae4b876a8696134b868f88cc2f51f715f2dbedb7446b8e6edf3d4541c4eb67b06d90130a10188182cf51901f5f500f500f5', 'hex')
)

const tokenIds2 = ['EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v']

// Create a detailed account
const detailedAccount = new CryptoDetailedAccount(cryptoHDKey, tokenIds)
const detailedAccount2 = new CryptoDetailedAccount(cryptoHDKey2, tokenIds2)

// Create a CryptoSyncCoin
const cryptoSyncCoin = new CryptoSyncCoin(coinIdentity, [detailedAccount, detailedAccount2])

const cbor = cryptoSyncCoin.toCBOR().toString('hex')
console.log(cbor)
// a201d90579a3010802183c03f70282d9057aa201d9012fa303582102d2b36900396c9282fa14628566582f206a5dd0bcc8d5e892611806cafb0301f006d90130a1018a183cf500f500f500f400f4081a78412e3a0282d9010754dac17f958d2ee523a2206206994597c13d831ec7d9010754b8c77482e45f1f44de1745f52c74426c631bdd52d9057aa201d9012fa203582102eae4b876a8696134b868f88cc2f51f715f2dbedb7446b8e6edf3d4541c4eb67b06d90130a10188182cf51901f5f500f500f50281782c45506a465764643541756671535371654d32714e31787a7962617043384734774547476b5a77795444743176
const ur = cryptoSyncCoin.toUREncoder(1000).nextPart()
console.log(ur)
// ur:crypto-sync-coin/oeadtaahkkotadayaocsfnaxylaolftaahknoeadtaaddlotaxhdclaotdqdinaeesjzmolfzsbbidlpiyhddlcximhltirfsptlvsmohscsamsgzoaxadwtamtaaddyoyadlecsfnykaeykaeykaewkaewkaycyksfpdmftaolftaadatghtnselbmdlgdmvwcnoecxidamnlfemssefslscksttaadatghrostjylfvehectfyuechfeykdwjyfwjziacwutgmtaahknoeadtaaddloeaxhdclaowdverokopdinhseeroisyalksaykctjshedprnuyjyfgrovawewftyghceglrpkgamtaaddyoyadlocsdwykcfadykykaeykaeykaolyksdwfegdimfghgi
```

## [CryptoSyncCoin] create CryptoSyncCoin with 2 detailed account with tokens

```js
// cbor taken from the example above
const cryptoSyncCoin = CryptoSyncCoin.fromCBOR(Buffer.from(cbor, 'hex'))

// get the coin Id
const coinID = cryptoSyncCoin.getCoinId()
// get the accounts
const accounts = cryptoSyncCoin.getAccounts()
```
