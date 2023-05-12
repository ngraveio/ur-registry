<h1 align="center">Ngrave UR Registry</h1>

<p align="center">
  <a href="http://commitizen.github.io/cz-cli/">
	  <img src="https://img.shields.io/badge/commitizen-friendly-brightgreen.svg" alt="Commitzen friendly" />
  </a>
  <a href="https://conventionalcommits.org">
	  <img src="https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg" alt="Conventional Commits" />
  </a>
</p>

## Getting started

This is a monorepo repository using [yarn workspaces](https://classic.yarnpkg.com/lang/en/docs/workspaces/), [Commitzen](http://commitizen.github.io/cz-cli/) and [Conventional Commits](https://conventionalcommits.org) to maintain and manage bc ur packages.

This repository is an implementation of [the BC-UR Registry specification](https://github.com/BlockchainCommons/Research/blob/master/papers/bcr-2020-006-urtypes.md) and an extension to [Keystone UR Registry](https://github.com/KeystoneHQ/ur-registry)

## 🌐 Links

Blockchain Commons Research

- ➡️ https://github.com/BlockchainCommons/Research

Research Paper on Multi Layer Sync Protocol:

- ➡️ https://github.com/ngraveio/Research

## 🚀 Quick start

In the root folder run following commands _(all the below commands need to run on root folder)_:

Install all dependecies with:

```bash
  yarn
```

to build

```bash
  yarn lerna run build
```

## 🗂 Monorepo structure

| Package                                                              | Description                                                                                                                      |
| -------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| [`ur-packages/**`](./ur-packages)                                    | Implementations of Blockchain Commons UR packages                                                                                |
| [`@ngrave/crypto-coin-identity`](./ur-packages/crypto-coin-identity) | Implementation of `coin-identity` type that can represent a coin                                                                 |
| [`@ngrave/multi-layer-sync`](./ur-packages/multi-layer-sync)         | Implementations of following types: **crypto-detailed-account**, **crypto-coin**, **crypto-sync-metadata**, **crypto-portfolio** |
| [`@ngrave/hex-string`](./ur-packages/hex-string)                     | Implementation of `hex-string` type that encodes and decodes hex string                                                          |

## 🚨 Code standard

- [JavaScript Standard Style](https://standardjs.com/) - Javascript styleguide
- [Prettier](https://prettier.io/) - Code formatter
- [ESLint](https://eslint.org/) - Lint to quickly find problems
- [Stylelint](https://stylelint.io/) - A mighty, modern linter that helps you avoid errors and enforce conventions in your styles

## ⌨️ Commands

| Command        | Description              |
| -------------- | ------------------------ |
| `yarn`         | Install all dependencies |
| `yarn build`   | Build all packages       |
| `yarn test:ci` | Run all tests            |

## CryptoDetailedAccount

Import multiple accounts with and without output descriptors and specify optionally tokens to synchronise. Extending the scope of the previously defined crypto-account and crypto-multi-account UR types. This new type aims to incorporate in the same structure:

- The accounts with and without scripts by selecting either `crypto-hdkey` or `crypto-output.`
- An optional list of tokens to synchronize them at the same time of the associated account.
- Extendable optional parameters to allow specific indication on the account (e.g. to hide the account to the user).

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
