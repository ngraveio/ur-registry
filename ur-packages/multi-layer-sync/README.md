# Multi Layer Sync Protocol

This is the implementation of the [Multi Layer Sync Protocol](https://github.com/ngraveio/Research/blob/main/papers/nbcr-2023-002-multi-layer-sync.md#ancher) that supports multiple coins and accounts with different types via globally identifiable URs.

This package add support for following ur types:

| Type                      | [[CBOR Tag]](https://www.iana.org/assignments/cbor-tags/cbor-tags.xhtml) | Owner  | Description                                                                                               | Definition                                                                                                 |
| ------------------------- | ------------------------------------------------------------------------ | ------ | --------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `crypto-detailed-account` | 1402                                                                     | Ngrave | Import multiple accounts with and without output descriptors and specify optionally tokens to synchronize | [[NBCR-2023-002]](https://github.com/ngraveio/Research/blob/main/papers/nbcr-2023-002-multi-layer-sync.md) |
| `crypto-portfolio-coin`             | 1403                                                                     | Ngrave | Associate several accounts to its coin identity                                                           | [[NBCR-2023-002]](https://github.com/ngraveio/Research/blob/main/papers/nbcr-2023-002-multi-layer-sync.md) |
| `crypto-portfolio-metadata`    | 1404                                                                     | Ngrave | Specify wallet metadata                                                                                   | [[NBCR-2023-002]](https://github.com/ngraveio/Research/blob/main/papers/nbcr-2023-002-multi-layer-sync.md) |
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

### [CryptoPortfolioMetadata] Construct the crypto sync metadata.

```js
// Create sync id
const sync_id = Buffer.from('babe0000babe00112233445566778899', 'hex')

// Create metadata
const metadata = new CryptoPortfolioMetadata({ sync_id: sync_id, device: 'my-device', language_code: 'en', fw_version: '1.0.0' })

const cbor = metadata.toCBOR().toString('hex')
console.log(cbor)
// a40150babe0000babe001122334455667788990262656e0365312e302e3004696d792d646576696365

const ur = metadata.toUREncoder(1000).nextPart()
console.log(ur)
// ur:crypto-portfolio-metadata/oxadgdrdrnaeaerdrnaebycpeofygoiyktlonlaoidihjtaxihehdmdydmdyaainjnkkdpieihkoiniaihfrzmytvl
```

### [CryptoPortfolioMetadata] Decode crypto sync metadata.

```js
// read ur
const ur = metadata.toUREncoder(1000).nextPart()

// decoded ur
const ur = URRegistryDecoder.decode(urData)

// get the class from the cbor data
const cryptoPortfolioMetadata = CryptoPortfolioMetadata.fromCBOR(ur.cbor)

// read its properties
cryptoPortfolioMetadata.getSyncId() // babe0000babe00112233445566778899
cryptoPortfolioMetadata.getLanguageCode() // en
cryptoPortfolioMetadata.getDevice() // my-device
cryptoPortfolioMetadata.getFirmwareVersion() // 1.0.0
```

## [CryptoPortfolioCoin] create CryptoPortfolioCoin with 2 detailed accounts with tokens

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

// Create a CryptoPortfolioCoin
const cryptoPortfolioCoin = new CryptoPortfolioCoin(coinIdentity, [detailedAccount, detailedAccount2])

const cbor = cryptoPortfolioCoin.toCBOR().toString('hex')
console.log(cbor)
// a201d90579a3010802183c03f70282d9057aa201d9012fa303582102d2b36900396c9282fa14628566582f206a5dd0bcc8d5e892611806cafb0301f006d90130a1018a183cf500f500f500f400f4081a78412e3a0282d9010754dac17f958d2ee523a2206206994597c13d831ec7d9010754b8c77482e45f1f44de1745f52c74426c631bdd52d9057aa201d9012fa203582102eae4b876a8696134b868f88cc2f51f715f2dbedb7446b8e6edf3d4541c4eb67b06d90130a10188182cf51901f5f500f500f50281782c45506a465764643541756671535371654d32714e31787a7962617043384734774547476b5a77795444743176
const ur = cryptoPortfolioCoin.toUREncoder(1000).nextPart()
console.log(ur)
// ur:crypto-portfolio-coin/oeadtaahkkotadayaocsfnaxylaolftaahknoeadtaaddlotaxhdclaotdqdinaeesjzmolfzsbbidlpiyhddlcximhltirfsptlvsmohscsamsgzoaxadwtamtaaddyoyadlecsfnykaeykaeykaewkaewkaycyksfpdmftaolftaadatghtnselbmdlgdmvwcnoecxidamnlfemssefslscksttaadatghrostjylfvehectfyuechfeykdwjyfwjziacwutgmtaahknoeadtaaddloeaxhdclaowdverokopdinhseeroisyalksaykctjshedprnuyjyfgrovawewftyghceglrpkgamtaaddyoyadlocsdwykcfadykykaeykaeykaolyksdwfegdimfghgi
```

## [CryptoPortfolioCoin] Decode the CryptoPortfolioCoin with 2 detailed accounts with tokens

```js
// cbor taken from the example above
const cryptoPortfolioCoin = CryptoPortfolioCoin.fromCBOR(Buffer.from(cbor, 'hex'))

// get the coin Id
const coinID = cryptoPortfolioCoin.getCoinId()
// get the accounts
const accounts = cryptoPortfolioCoin.getAccounts()
```

## [CryptoPortfolio] create a CryptoPortfolio with 4 coins and Metadata

```js
// Create the coin identities of the 4 desired coins.
const coinIdEth = new CryptoCoinIdentity(EllipticCurve.secp256k1, 60)
const coinIdSol = new CryptoCoinIdentity(EllipticCurve.secp256k1, 501)
const coinIdMatic = new CryptoCoinIdentity(EllipticCurve.secp256k1, 60, [137])
const coinIdBtc = new CryptoCoinIdentity(EllipticCurve.secp256k1, 0)

/**
 * Create the accounts that will be included in the coins.
 * */
// Ethereum with USDC ERC20 token
const accountEth = new CryptoDetailedAccount(
  new CryptoHDKey({
    isMaster: false,
    key: Buffer.from('032503D7DCA4FF0594F0404D56188542A18D8E0784443134C716178BC1819C3DD4', 'hex'),
    chainCode: Buffer.from('D2B36900396C9282FA14628566582F206A5DD0BCC8D5E892611806CAFB0301F0', 'hex'),
    origin: new CryptoKeypath([
      new PathComponent({ index: 44, hardened: true }),
      new PathComponent({ index: 60, hardened: true }),
      new PathComponent({ index: 0, hardened: true }),
    ]),
    children: new CryptoKeypath([new PathComponent({ index: 0, hardened: false }), new PathComponent({ index: 1, hardened: false })]),
  }),
  ['0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'] // USDC ERC20 token on Ethereum
)

// Polygon with USDC ERC20 token
const accountMatic = new CryptoDetailedAccount(
  new CryptoHDKey({
    isMaster: false,
    key: Buffer.from('032503D7DCA4FF0594F0404D56188542A18D8E0784443134C716178BC1819C3DD4', 'hex'),
    chainCode: Buffer.from('D2B36900396C9282FA14628566582F206A5DD0BCC8D5E892611806CAFB0301F0', 'hex'),
    origin: new CryptoKeypath([
      new PathComponent({ index: 44, hardened: true }),
      new PathComponent({ index: 60, hardened: true }),
      new PathComponent({ index: 0, hardened: true }),
    ]),
    children: new CryptoKeypath([new PathComponent({ index: 0, hardened: false }), new PathComponent({ index: 1, hardened: false })]),
  }),
  ['2791Bca1f2de4661ED88A30C99A7a9449Aa84174'] // USDC ERC20 token on Polygon
)

// Solana with USDC SPL token
const accountSol = new CryptoDetailedAccount(
  new CryptoHDKey({
    isMaster: false,
    key: Buffer.from('02EAE4B876A8696134B868F88CC2F51F715F2DBEDB7446B8E6EDF3D4541C4EB67B', 'hex'),
    origin: new CryptoKeypath([
      new PathComponent({ index: 44, hardened: true }),
      new PathComponent({ index: 501, hardened: true }),
      new PathComponent({ index: 0, hardened: true }),
      new PathComponent({ index: 0, hardened: true }),
    ]),
  }),
  ['EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'] // USDC SPL token
)

// Account with crypto-output public key hash
const accountBtc = new CryptoDetailedAccount(
  new CryptoOutput(
    [ScriptExpressions.PUBLIC_KEY_HASH],
    new CryptoHDKey({
      isMaster: false,
      key: Buffer.from('03EB3E2863911826374DE86C231A4B76F0B89DFA174AFB78D7F478199884D9DD32', 'hex'),
      chainCode: Buffer.from('6456A5DF2DB0F6D9AF72B2A1AF4B25F45200ED6FCC29C3440B311D4796B70B5B', 'hex'),
      origin: new CryptoKeypath([
        new PathComponent({ index: 44, hardened: true }),
        new PathComponent({ index: 0, hardened: true }),
        new PathComponent({ index: 0, hardened: true }),
      ]),
      children: new CryptoKeypath([new PathComponent({ index: 0, hardened: false }), new PathComponent({ index: 0, hardened: false })]),
    })
  )
)

// Create the coins
const cryptoCoinEth = new CryptoPortfolioCoin(coinIdEth, [accountEth])
const cryptoCoinSol = new CryptoPortfolioCoin(coinIdSol, [accountSol])
const cryptoCoinMatic = new CryptoPortfolioCoin(coinIdMatic, [accountMatic])
const cryptoCoinBtc = new CryptoPortfolioCoin(coinIdBtc, [accountBtc])

// Create the metadata.
const metadata = new CryptoPortfolioMetadata({
  sync_id: Buffer.from('123456781234567802D9044FA3011A71', 'hex'),
  language_code: 'en',
  fw_version: '1.2.1-1.rc',
  device: 'NGRAVE ZERO',
})

// Create the Crypto Portfolio
const cryptoPortfolio = new CryptoPortfolio([cryptoCoinEth, cryptoCoinSol, cryptoCoinMatic, cryptoCoinBtc], metadata)

const cbor = cryptoPortfolio.toCBOR().toString('hex') // a20184d9057ba201d90579a3010802183c03f70281d9057aa201d9012fa4035821032503d7dca4ff0594f0404d56188542a18d8e0784443134c716178bc1819c3dd4045820d2b36900396c9282fa14628566582f206a5dd0bcc8d5e892611806cafb0301f006d90130a10186182cf5183cf500f507d90130a1018400f401f40281d9010754a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48d9057ba201d90579a30108021901f503f70281d9057aa201d9012fa203582102eae4b876a8696134b868f88cc2f51f715f2dbedb7446b8e6edf3d4541c4eb67b06d90130a10188182cf51901f5f500f500f50281782c45506a465764643541756671535371654d32714e31787a7962617043384734774547476b5a77795444743176d9057ba201d90579a3010802183c038118890281d9057aa201d9012fa4035821032503d7dca4ff0594f0404d56188542a18d8e0784443134c716178bc1819c3dd4045820d2b36900396c9282fa14628566582f206a5dd0bcc8d5e892611806cafb0301f006d90130a10186182cf5183cf500f507d90130a1018400f401f40281d90107542791bca1f2de4661ed88a30c99a7a9449aa84174d9057ba201d90579a30108020003f70281d9057aa101d90134d90193d9012fa403582103eb3e2863911826374de86c231a4b76f0b89dfa174afb78d7f478199884d9dd320458206456a5df2db0f6d9af72b2a1af4b25f45200ed6fcc29c3440b311d4796b70b5b06d90130a10186182cf500f500f507d90130a1018400f400f402d9057ca40150123456781234567802d9044fa3011a710262656e036a312e322e312d312e7263046b4e4752415645205a45524f
const ur = cryptoPortfolio.toUREncoder(1000).nextPart() // ur:crypto-portfolio/oeadlrtaahkgoeadtaahkkotadayaocsfnaxylaolytaahknoeadtaaddloxaxhdclaxdaaxtsuooxzmahmwwtfzgthfcslpfwoylgmnatlrfyeheestcmchluselynsfstyaahdcxtdqdinaeesjzmolfzsbbidlpiyhddlcximhltirfsptlvsmohscsamsgzoaxadwtamtaaddyoyadlncsdwykcsfnykaeykattaaddyoyadlraewkadwkaolytaadatghnbroinmeswclluensettntgedmnnpftoenamwmfdtaahkgoeadtaahkkotadayaocfadykaxylaolytaahknoeadtaaddloeaxhdclaowdverokopdinhseeroisyalksaykctjshedprnuyjyfgrovawewftyghceglrpkgamtaaddyoyadlocsdwykcfadykykaeykaeykaolyksdwfegdimfghgieieecfpkpiyjsgugujsihgteyjsglehksknkkidhsjofxetfleektfeflfljehtktkkghfyjyehkotaahkgoeadtaahkkotadayaocsfnaxlycsldaolytaahknoeadtaaddloxaxhdclaxdaaxtsuooxzmahmwwtfzgthfcslpfwoylgmnatlrfyeheestcmchluselynsfstyaahdcxtdqdinaeesjzmolfzsbbidlpiyhddlcximhltirfsptlvsmohscsamsgzoaxadwtamtaaddyoyadlncsdwykcsfnykaeykattaaddyoyadlraewkadwkaolytaadatghdimerfoywzuefghswelootbnnlosptfynypdfpjytaahkgoeadtaahkkotadayaoaeaxylaolytaahknoyadtaadeetaadmutaaddloxaxhdclaxwmfmdeiamecsdsemgtvsjzcncygrkowtrontzschgezokstswkkscfmklrtauteyaahdcxiehfonurdppfyntapejpproypegrdawkgmaewejlsfdtsrfybdehcaflmtrlbdhpamtaaddyoyadlncsdwykaeykaeykattaaddyoyadlraewkaewkaotaahkeoxadgdbgeehfksbgeehfksaotaaagwotadcyjsaoidihjtaximehdmeydmehdpehdmjpiaaajeglflgmfphffecxhtfegmgwcsoefewn
```

## [CryptoPortfolio] Decode the cryptoPortfolio.

```js
// Decode the cbor taken from the example above
const cryptoPortfolio = CryptoPortfolio.fromCBOR(Buffer.from(cbor, 'hex'))

// get the metadata of the decoded portfolio.
const metadata = decodedCryptoPortfolio.getMetadata()
// get the coins from the decoded portfolio.
const coins = cryptoPortfolio.getCoins()

// get the accounts from a coin (by index)
const accounts = coins[0]?.getDetailedAccounts()
```
