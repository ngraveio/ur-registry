# Crypto Portfolio Metadata

This repository is the crypto portfolio metadata [[NBCR-2023-002]](https://github.com/ngraveio/Research/blob/main/papers/nbcr-2023-002-multi-layer-sync.md) to specify additional information about the wallet, etc.

## Installing

To install, run:

```bash
yarn add @ngraveio/bc-ur-registry-crypto-portfolio-metadata
```

```bash
npm install --save @ngraveio/bc-ur-registry-crypto-portfolio-metadata
```

## Examples

Note: **Language code** must be a valid *iso-639* code.

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

### [CryptoPortfolioMetadata] Construct the crypto sync metadata with additional properties.

```js
// Create sync id
const sync_id = Buffer.from('babe0000babe00112233445566778899', 'hex')

// Create metadata
const metadata = new CryptoPortfolioMetadata({
  sync_id: sync_id,
  device: 'my-device',
  language_code: 'en',
  fw_version: '1.0.0',
  string: 'hello world',
  number: 123,
  boolean: true,
  array: [1, 2, 3],
  object: { a: 1, b: 2 },
  null: null,
  date: new Date('2021-01-01T00:00:00.000Z'),
});

const cbor = metadata.toCBOR().toString('hex')
console.log(cbor)
// ab0150babe0000babe001122334455667788990262656e0365312e302e3004696d792d64657669636566737472696e676b68656c6c6f20776f726c64666e756d626572187b67626f6f6c65616ef565617272617983010203666f626a656374a2616101616202646e756c6cf66464617465c07818323032312d30312d30315430303a30303a30302e3030305a

const ur = metadata.toUREncoder(1000).nextPart()
console.log(ur)
````


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
