# BC-UR-Registry

This repository is an implementation of latests [the BC-UR Registry specification](https://github.com/BlockchainCommons/Research/blob/master/papers/bcr-2020-006-urtypes.md)

It is refactored version of [Keystone bc-ur-registry](https://github.com/KeystoneHQ/ur-registry) with [BC-UR Version 2](https://github.com/ngraveio/bc-ur)


**Supported UR types:**
| UR Type | CBOR Tag | Description | Definition |
|------|-----|-------------|------------|
| `hdkey` ~~`crypto-hdkey`~~ | 40303 ~~303~~ | Hierarchical Deterministic (HD) key | [[BCR-2020-007]](bcr-2020-007-hdkey.md) |
| `keypath` ~~`crypto-keypath`~~ | 40304 ~~304~~ | Key Derivation Path | [[BCR-2020-007]](bcr-2020-007-hdkey.md) |
| `coin-info` ~~`crypto-coin-info`~~ | 40305 ~~305~~ | Cryptocurrency Coin Use | [[BCR-2020-007]](bcr-2020-007-hdkey.md) |
| `eckey` ~~`crypto-eckey`~~ | 40306 ~~306~~ | Elliptic Curve (EC) key | [[BCR-2020-008]](bcr-2020-008-eckey.md) |
| `address` ~~`crypto-address`~~ | 40307 ~~307~~ | Cryptocurrency Address | [[BCR-2020-009]](bcr-2020-009-address.md) |
| `output-descriptor` ~~`crypto-output`~~ | 40308 ~~308~~ | Bitcoin Output Descriptor | [[BCR-2020-010]](bcr-2020-010-output-desc.md) |
| `psbt` ~~`crypto-psbt`~~ | 40310 ~~310~~ | Partially Signed Bitcoin Transaction (PSBT) | [[BCR-2020-0006]](https://github.com/BlockchainCommons/Research/blob/master/papers/bcr-2020-006-urtypes.md) |
| (In Progress)`account-descriptor` ~~`crypto-account`~~ | 40311 ~~311~~ | BIP44 Account | [[BCR-2023-019]](bcr-2023-019-account-descriptor.md) |


## Installing

To install, run:

```bash
yarn add @ngraveio/bc-ur-registry
```

```bash
npm install --save @ngraveio/bc-ur-registry
```


## UR-TYPES

### Coin Info
https://github.com/BlockchainCommons/Research/blob/master/papers/bcr-2020-007-hdkey.md
Has 2 parameters `type` BIP44 coin type and `network` that highlights testnet or mainnet for Bitcoin like coins and for ethereum based coins it is `chainId`

Usage:

```typescript
import { CoinInfo, Network } from "@ngraveio/bc-ur-registery";

const bitcoinMainnet = new CoinInfo(); // Default is Bitcoin Mainnet
const bitcoinTestnet = new CoinInfo(undefined, Network.Testnet);

const ethereumMainnet = new CoinInfo(60); // Ethereum Mainnet
const ethereumTestnet = new CoinInfo(60, Network.Testnet); // Ethereum Testnet


bitcoinMainnet.getType(); // 0
bitcoinMainnet.getNetwork(); // 0 for mainnet
```

### KeyPath
Keypath class for handling BIP44 like hierarchical key derivation paths.
https://github.com/BlockchainCommons/Research/blob/master/papers/bcr-2020-007-hdkey.md

Example path in string format: 
- `44'/0'/0'/0/0`
- `1'/2/3-4/5-6'/*/*'/<7;8'>/<9';0>`

**Input arguments:**
 - `path`: String path or array of `PathComponents` that make up the path.
 - `source-fingerprint`: The fingerprint of the ancestor or master key. Required if `components` is empty.
 - `depth`: The number of derivation steps in the path. If omitted, it will be inferred from `components`.


**Usage:**
```typescript
import { KeyPath, PathComponent } from "@ngraveio/bc-ur-registery";

// Create a KeyPath from a string
// This path containes Simple index, Range, Wildcard, Pair
const path = "1'/2/3-4/5-6'/*/*'/<7;8'>/<9';0>";
const keyPath = new KeyPath({sourceFingerprint: 123456789, path: path});
keyPath.setDepth(); // Automatically set the depth of the keypath


// This will save path as array of PathComponents
const components = keyPath.getComponents();
keyPath.getSourceFingerprint(); // 123456789
keyPath.getDepth(); // 8 
keyPath.toString();     // 1'/2/3-4/5-6'/*/*'/<7;8'>/<9';0>
keyPath.toString('h');  // 1h/2/3-4/5-6h/*/*'/<7;8h>/<9h;0>

// Create from components
const comp1 = new PathComponent({ index: 98, hardened: true });
const comp2 = new PathComponent({ range: [2, 6] });
const comp3 = new PathComponent({ wildcard: true, hardened: true });
const comp4 = new PathComponent({ pair: [{ index: 78200, hardened: true }, { index: 0, hardened: true } ] });

// Encoding
const keyPath2 = new Keypath({ path: [comp1, comp2, comp3, comp4] });
keyPath2.toString(); // 98'/2-6/*/*'/<78200h;0h>

```

`KeyPath` consists of following `PathComponents`:
- **index**: Single index value. In text format, it is inteher can be followed by `'` or `h` for hardening.
  - `0'` or `0h` are valid hardened indices.
  - `5` is a non-hardened index.
  ```typescript
  const index = new PathComponent({index: 0, hardened: true}); // 0h
  const index = new PathComponent({index: 0, hardened: false}); // 0
  ```
- **range** Indices range of should be derived childs. In text format, it is `start-end` where start and end are integers.
  - `1-5` is a valid range.
  - `1'-5` is invalid because hardening is not applied to the second element in the range.
  ```typescript
  const range = new PathComponent({start: 1, end: 5}); // 1-5
  const range = new PathComponent({start: 1, end: 5, hardened: true}); // 1-5'
  ```
- **wildcard**: `*` is used to derive all possible children at that level.
  - '*' is a valid wildcard.
  - `*h` is also valid for hardened wildcard.
  ```typescript
  const wildcard = new PathComponent({wildcard: true}); // *
  const wildcard = new PathComponent({wildcard: true, hardened: true}); // *h
  ```
- **pair**: Pair of external and internal indices. In text format, it is `<external;internal>`.
  - `<0;1>` is a valid pair.
  - `<0h;1>` is also valid for hardened external index.
  - `<0;1h>` is also valid for hardened internal index.
  - `<0h;1h>` is also valid for hardened external and internal indices.
  - https://github.com/bitcoin/bitcoin/blob/master/doc/descriptors.md#specifying-receiving-and-change-descriptors-in-one-descriptor
  ```typescript
  const pair = new PathComponent({ pair: [{ index: 1, hardened: false }, { index: 0, hardened: true } ] }); // <1;0h>
  ```

 Valid Path String Rules:
 1. Paths can include:
    - Single indices (e.g., `44'/0'/0'/0/0`).
    - Ranges with hardening applied to the second element (e.g., `1-6'`; `1h-6` is invalid).
    - Wildcards (`*`) at any depth (e.g., `44'/0'/0'/*`).
    - Pairs for external/internal addresses (e.g., `<0h;1h>` or `<0;1>`).
    - Mixed components combining ranges, wildcards, and pairs (e.g., `44'/0'/1'-5'/<0h;1h>/*`).
 2. Rules for hardening:
    - Hardened indices must be ≤ `0x80000000`.
    - Hardened chars (`'` or `h`) must immediately follow the index.
 3. Path formatting:
    - Paths can optionally start with `m`, but it is not required.
    - Components must be delimited by `/` and contain integers, ranges, wildcards, or pairs.


