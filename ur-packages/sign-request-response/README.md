# Signing Protocol

This is the implementation of the [Signing Protocol](https://github.com/ngraveio/Research/blob/main/papers/nbcr-2023-003-crypto-sign.md) that is coin agnostic and can be used for any coin.

This package adds support for the following ur types:



| Type                      | [[CBOR Tag]](https://www.iana.org/assignments/cbor-tags/cbor-tags.xhtml) | Owner  | Description                                                                                               | Definition                                                                                                 |
| ------------------------- | ------------------------------------------------------------------------ | ------ | --------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `crypto-sign-request` | 1411                                                                     | Ngrave | Blockchain-agnostic signature request type where type of the coin is identified by `crypto-coin-identity` | [[NBCR-2023-003]](https://github.com/ngraveio/Research/blob/main/papers/nbcr-2023-003-crypto-sign.md) |
| `crypto-signature`             | 1412                                                                     | Ngrave | Blockchain-agnostic signature response type                                                           | [[NBCR-2023-003]](https://github.com/ngraveio/Research/blob/main/papers/nbcr-2023-003-crypto-sign.md) |

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

