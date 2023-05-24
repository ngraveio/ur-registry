# Signing Protocol

This is the implementation of the [Signing Protocol](https://github.com/ngraveio/Research/blob/main/papers/nbcr-2023-003-crypto-sign.md) that is coin agnostic and can be used for any coin.

This package add support for following ur types:

| Type                      | [[CBOR Tag]](https://www.iana.org/assignments/cbor-tags/cbor-tags.xhtml) | Owner  | Description                                                                                               | Definition                                                                                                 |
| ------------------------- | ------------------------------------------------------------------------ | ------ | --------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `crypto-sign-request` | 1411                                                                     | Ngrave | Import multiple accounts with and without output descriptors and specify optionally tokens to synchronize | [[NBCR-2023-003]](https://github.com/ngraveio/Research/blob/main/papers/nbcr-2023-003-crypto-sign.md) |
| `crypto-signature`             | 1412                                                                     | Ngrave | Associate several accounts to its coin identity                                                           | [[NBCR-2023-003]](https://github.com/ngraveio/Research/blob/main/papers/nbcr-2023-003-crypto-sign.md) |

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

