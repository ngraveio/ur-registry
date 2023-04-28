# Multi Layer Sync Protocol

This is the implementation of the [Multi Layer Sync Protocol](https://github.com/ngraveio/Research/blob/main/papers/nbcr-2023-002-multi-layer-sync.md#ancher) that supports multiple coins and accounts with different types via globally identifiable URs.

This package add support for following ur types:


| Type | [[CBOR Tag]](https://www.iana.org/assignments/cbor-tags/cbor-tags.xhtml) | Owner | Description | Definition |
| --- | --- | --- | --- | --- |
| `crypto-detailed-account` | 1402 | Ngrave | Import multiple accounts with and without output descriptors and specify optionally tokens to synchronize | [[NBCR-2023-002]](https://github.com/ngraveio/Research/blob/main/papers/nbcr-2023-002-multi-layer-sync.md) |
| `crypto-coin` | 1403 | Ngrave | Associate several accounts to its coin identity  | [[NBCR-2023-002]](https://github.com/ngraveio/Research/blob/main/papers/nbcr-2023-002-multi-layer-sync.md) |
| `crypto-sync-metadata` | 1404 | Ngrave | Specify wallet metadata | [[NBCR-2023-002]](https://github.com/ngraveio/Research/blob/main/papers/nbcr-2023-002-multi-layer-sync.md) |
| `crypto-portfolio` | 1405 | Ngrave | Aggregate the portfolio information | [[NBCR-2023-002]](https://github.com/ngraveio/Research/blob/main/papers/nbcr-2023-002-multi-layer-sync.md) |



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
### TODO