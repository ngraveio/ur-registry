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

---

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
keyPath.toString('h');  // 1h/2/3-4/5-6h/*/*'/<7h;0>

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

----

### HDKey
The HDKey specification follows the CDDL definition outlined in [BlockchainCommons Research](https://github.com/BlockchainCommons/Research/blob/master/papers/bcr-2020-007-hdkey.md#cddl-for-hdkey).

Hierarchical Deterministic (HD) Keys follow the [BIP32](https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki) standard, enabling secure and structured management of cryptocurrency keys. HDKeys can be serialized in the `xpub` format and are compatible with wallets and platforms using this standard.


#### HDKey Constructor Arguments

The `HDKey` class can be instantiated with the following arguments:

```typescript
interface HDKeyConstructorArgs {
  isMaster?: boolean
  keyData: Buffer
  chainCode?: Buffer
  isPrivateKey?: boolean
  useInfo?: CoinInfo
  origin?: Keypath
  children?: Keypath
  parentFingerprint?: number
  name?: string
  note?: string
}
```

#### Parameters

- **`isMaster`** *(optional)*:  
  Indicates whether this key is the master key. Defaults to `false`.

- **`keyData`** *(required)*:  
  A `Buffer` containing the key's raw data. For public keys, this must be 33 bytes. For private keys, it should be 34 bytes (`0x00` prepended to 32-byte private key data).

- **`chainCode`** *(optional)*:  
  A `Buffer` containing the chain code (32 bytes). Required for deriving additional keys.

- **`isPrivateKey`** *(optional)*:  
  Indicates whether this key is a private key. Defaults to `false`.

- **`useInfo`** *(optional)*:  
  A `CoinInfo` object specifying how this key is intended to be used (e.g., mainnet/testnet or coin type like Bitcoin or Ethereum).

- **`origin`** *(optional)*:  
  A `Keypath` object describing the derivation path that led to this key (e.g., `m/44'/0'/0'`).

- **`children`** *(optional)*:  
  A `Keypath` object defining the derivation rules for child keys (e.g., `0/*` for all external child keys).

- **`parentFingerprint`** *(optional)*:  
  A 4-byte number representing the fingerprint of the parent key. Defaults to `0` for master keys.

- **`name`** *(optional)*:  
  A string specifying a short, human-readable name for the key.

- **`note`** *(optional)*:  
  A string for storing additional text or notes describing the key.

---

#### HDKey Usage

##### Generate a Master Key
A `master-key` is the root of an HDKey hierarchy, used as the starting point for generating derived keys.

```typescript
import { HDKey } from '@ngraveio/bc-ur-registry';

// Example: Creating a master key
const masterKey = new HDKey({
  isMaster: true,
  keyData: Buffer.from('your-private-key-data', 'hex'), // 33 bytes
  chainCode: Buffer.from('your-chain-code', 'hex'),     // 32 bytes
});

// Access properties
console.log(masterKey.isMaster); // true
console.log(masterKey.getKeyData().toString('hex')); // your-private-key-data
console.log(masterKey.getChainCode().toString('hex')); // your-chain-code
```

##### Generate an HDKey from Xpub

You can create an HDKey from an extended public key (xpub). This is useful for securely deriving public keys without exposing the private key.

```typescript
// Example: Creating an HDKey from a Bitcoin mainnet xpub
const bitcoinXpub = 'xpub661MyMwAqRbcFtXgS5s...'; // Replace with actual xpub
const hdKey = HDKey.fromXpub(bitcoinXpub);

console.log(hdKey.isPrivate); // false (public key)
console.log(hdKey.getKeyData().toString('hex')); // Public key data
console.log(hdKey.getChainCode().toString('hex')); // Chain code
```

##### Add Metadata: Origin and Children
- **`origin`**: Specifies the derivation path leading to the current key (e.g., `m/44'/0'/0'` for Bitcoin mainnet).
- **`children`**: Specifies the derivation rules for child keys (e.g., `0/*` to derive all external addresses).

```typescript
import { KeyPath } from '@ngraveio/bc-ur-registry';

// Example: Derived key with metadata
const keyWithMetadata = new HDKey({
  keyData: Buffer.from('child-public-key', 'hex'),
  chainCode: Buffer.from('child-chain-code', 'hex'),
  origin: new KeyPath({ path: "m/44'/0'/0'" }), // Bitcoin mainnet derivation
  children: new KeyPath({ path: "0/*" }),      // Derive all external addresses
});

console.log(keyWithMetadata.getOrigin().toString()); // m/44'/0'/0'
console.log(keyWithMetadata.getChildren().toString()); // 0/*
```

##### Ethereum HDKey Example

Ethereum follows the `BIP44` standard, where the coin type is `60`. Here’s an example of using an Ethereum xpub to create an HDKey.

```typescript
// Example: Creating an HDKey from an Ethereum xpub
const ethereumXpub = 'xpub6Dkxxxx'; // Replace with actual Ethereum xpub
const ethereumHDKey = HDKey.fromXpub(ethereumXpub);

console.log(ethereumHDKey.getKeyData().toString('hex')); // Ethereum public key
console.log(ethereumHDKey.isPrivate); // false
```

---

#### Summary of Methods

- **`HDKey.fromXpub(xpub: string)`**: [Create an HDKey from an extended public key](#generate-an-hdkey-from-xpub).
- **`getKeyData()`**: Retrieve the key data (public or private).
- **`getChainCode()`**: Get the chain code for further derivations.
- **`getOrigin()`**: Access the derivation origin.
- **`getChildren()`**: Access child key derivation rules.
- **`getParentFingerprint()`**: Retrieve the parent fingerprint for the key.

---

#### HDKeys and BIP32 Serialization

HDKeys encoded according to BIP32 are represented as a BASE58-CHECK encoded string, such as:

```
xpub661MyMwAqRbcFtXgS5sYJABqqG9YLmC4Q1Rdap9gSE8NqtwybGhePY2gZ29ESFjqJoCu1Rupje8YtGqsefD265TMg7usUDFdp6W1EGMcet8
```

##### BIP32 Serialization Fields

1. **4 bytes:** Version bytes
   - `0x0488B21E` (mainnet public key)
   - `0x0488ADE4` (mainnet private key)
   - `0x043587CF` (testnet public key)
   - `0x04358394` (testnet private key)
2. **1 byte:** Depth
   - `0x00` for master nodes.
   - `0x01` for level-1 derived keys, and so on.
3. **4 bytes:** Parent fingerprint
   - `0x00000000` for master keys.
   - Derived from the hash of the parent's public key for derived keys.
4. **4 bytes:** Child number
   - `0x00000000` for master keys.
   - `ser32(i)` for index `i` in derived keys.
5. **32 bytes:** Chain code
   - Used for deterministic key derivation.
6. **33 bytes:** Key data
   - Public key: `serP(K)`.
   - Private key: `0x00 || ser256(k)`.

This binary serialization is then **BASE58-CHECK encoded**, adding a 4-byte checksum at the end.

---

#### HDKey Metadata and BIP32 Isomorphism

To maintain compatibility with the BIP32 standard, an `HDKey` must include the following fields for proper derivation:

1. **`chain-code`**: Used for deriving further keys.
2. **`origin`**: Describes the derivation path to the key (e.g., `m/44'/0'/0'`).
3. **`parent-fingerprint`**: The fingerprint of the key's direct ancestor.

**Important:**
- If `origin` contains only a **single derivation step** and includes a `source-fingerprint`, the `parent-fingerprint` **must be identical** to the `source-fingerprint` or can be omitted.

