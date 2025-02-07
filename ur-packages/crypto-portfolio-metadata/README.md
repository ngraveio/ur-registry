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

### [PortfolioMetadata] Construct the crypto sync metadata.

```js
// Create sync id
const sync_id = Buffer.from('babe0000babe00112233445566778899', 'hex')

// Create metadata
const metadata = new PortfolioMetadata({ synId: sync_id, device: 'my-device', language: 'en', firmwareVersion: '1.0.0' })

const cbor = metadata.toHex()
console.log(cbor)
// a40150babe0000babe001122334455667788990262656e0365312e302e3004696d792d646576696365

const ur = metadata.toUr()
console.log(ur)
// ur:portfolio-metadata/oxadgdrdrnaeaerdrnaebycpeofygoiyktlonlaoidihjtaxihehdmdydmdyaainjnkkdpieihkoiniaihfrzmytvl
```

### [PortfolioMetadata] Construct the crypto sync metadata with additional properties.

```js
// Create sync id
const sync_id = Buffer.from('babe0000babe00112233445566778899', 'hex')

// Create metadata
const metadata = new PortfolioMetadata({
  syncId: sync_id,
  device: 'my-device',
  language: 'en',
  firmwareVersion: '1.0.0',
  string: 'hello world',
  number: 123,
  boolean: true,
  array: [1, 2, 3],
  object: { a: 1, b: 2 },
  null: null,
});

const cbor = metadata.toHex()
console.log(cbor)
// ab0150babe0000babe001122334455667788990262656e0365312e302e3004696d792d64657669636566737472696e676b68656c6c6f20776f726c64666e756d626572187b67626f6f6c65616ef565617272617983010203666f626a656374a2616101616202646e756c6cf66464617465c11a5fee6600

const ur = metadata.toUr()
console.log(ur)
// ur:portfolio-metadata/pyadgdrdrnaeaerdrnaebycpeofygoiyktlonlaoidihjtaxihehdmdydmdyaainjnkkdpieihkoiniaihiyjkjyjpinjtiojeisihjzjzjlcxktjljpjzieiyjtkpjnidihjpcskgioidjljljzihhsjtykihhsjpjphskklsadaoaxiyjlidimihiajyoehshsadhsidaoiejtkpjzjzynieiehsjyihsecyhewyiyaeahhngoeo
```


### [PortfolioMetadata] Decode crypto sync metadata.

```js
// read ur
const ur = Ur.fromString("ur:portfolio-metadata/pyadgdrdrnaeaerdrnaebycpeofygoiyktlonlaoidihjtaxihehdmdydmdyaainjnkkdpieihkoiniaihiyjkjyjpinjtiojeisihjzjzjlcxktjljpjzieiyjtkpjnidihjpcskgioidjljljzihhsjtykihhsjpjphskklsadaoaxiyjlidimihiajyoehshsadhsidaoiejtkpjzjzynieiehsjyihsecyhewyiyaeahhngoeo")

// Decode the class
const PortfolioMetadata = ur.decode()

// read its properties
PortfolioMetadata.getSyncId() // babe0000babe00112233445566778899
PortfolioMetadata.getLanguageCode() // en
PortfolioMetadata.getDevice() // my-device
PortfolioMetadata.getFirmwareVersion() // 1.0.0
```
