# BC-UR-Registry

This repository is an implementation of latests [the BC-UR Registry specification](https://github.com/BlockchainCommons/Research/blob/master/papers/bcr-2020-006-urtypes.md)

It is refactored version of [Keystone bc-ur-registry](https://github.com/KeystoneHQ/ur-registry) with [BC-UR Version 2](https://github.com/ngraveio/bc-ur)


**Supported UR types:**
| UR Type | CBOR Tag | Description | Definition |
|------|-----|-------------|------------|
| [`hdkey`](#hdkey) ~~`crypto-hdkey`~~ | 40303 ~~303~~ | Hierarchical Deterministic (HD) key | [[BCR-2020-007]](https://github.com/BlockchainCommons/Research/blob/master/papers/bcr-2020-007-hdkey.md) |
| [`keypath`](#keypath) ~~`crypto-keypath`~~ | 40304 ~~304~~ | Key Derivation Path | [[BCR-2020-007]](https://github.com/BlockchainCommons/Research/blob/master/papers/bcr-2020-007-hdkey.md) |
| [`coin-info`](#coin-info) ~~`crypto-coin-info`~~ | 40305 ~~305~~ | Cryptocurrency Coin Use | [[BCR-2020-007]](https://github.com/BlockchainCommons/Research/blob/master/papers/bcr-2020-007-hdkey.md) |
| [`eckey`](#eckey) ~~`crypto-eckey`~~ | 40306 ~~306~~ | Elliptic Curve (EC) key | [[BCR-2020-008]](https://github.com/BlockchainCommons/Research/blob/master/papers/bcr-2020-008-eckey.md) |
| [`address`](#address) ~~`crypto-address`~~ | 40307 ~~307~~ | Cryptocurrency Address | [[BCR-2020-009]](https://github.com/BlockchainCommons/Research/blob/master/papers/bcr-2020-009-address.md) |
| [`output-descriptor`](#output-descriptor) ~~`crypto-output`~~ | 40308 ~~308~~ | Bitcoin Output Descriptor | [[BCR-2023-010]](https://github.com/BlockchainCommons/Research/blob/master/papers/bcr-2023-010-output-descriptor.md) |
| [`psbt`](#psbt) ~~`crypto-psbt`~~ | 40310 ~~310~~ | Partially Signed Bitcoin Transaction (PSBT) | [[BCR-2020-0006]](https://github.com/BlockchainCommons/Research/blob/master/papers/bcr-2020-006-urtypes.md) |
| [`account-descriptor`](#account-descriptor) ~~`crypto-account`~~ | 40311 ~~311~~ | BIP44 Account | [[BCR-2023-019]](https://github.com/BlockchainCommons/Research/blob/master/papers/bcr-2023-019-account-descriptor.md) |


## Installing

To install, run:

```bash
yarn add @ngraveio/bc-ur-registry
```

```bash
npm install --save @ngraveio/bc-ur-registry
```


## UR-TYPES

### PSBT

| UR Type | CBOR Tag |
|------|-----|
| `psbt` | NaN |


https://github.com/BlockchainCommons/Research/blob/master/papers/bcr-2020-006-urtypes.md#partially-signed-bitcoin-transaction-psbt-psbt

The type psbt contains a single, deterministic length byte string of variable length up to 2^32-1 bytes. Semantically, this byte string MUST be a valid Partially Signed Bitcoin Transaction encoded in the binary format specified by [BIP174].

It encodes CBOR bytes type without any **tag**.

**Usage:**

```typescript
import { PSBT } from "@ngraveio/bc-ur-registry";

const psbtBytes = Buffer.from("70736274ff01009a020000000258e87a21b56daf0c23be8e7070456c336f7cbaa5c8757924f545887bb2abdd750000000000ffffffff838d0427d0ec650a68aa46bb0b098aea4422c071b2ca78352a077959d07cea1d0100000000ffffffff0270aaf00800000000160014d85c2b71d0060b09c9886aeb815e50991dda124d00e1f5050000000016001400aea9a2e5f0f876a588df5546e8742d1d87008f000000000000000000", "hex");

const psbt = new PSBT(psbtBytes);

psbt.toUr();
// ur:psbt/hdosjojkidjyzmadaenyaoaeaeaeaohdvsknclrejnpebncnrnmnjojofejzeojlkerdonspkpkkdkykfelokgprpyutkpaeaeaeaeaezmzmzmzmlslgaaditiwpihbkispkfgrkbdaslewdfycprtjsprsgksecdratkkhktikewdcaadaeaeaeaezmzmzmzmaojopkwtayaeaeaeaecmaebbtphhdnjstiambdassoloimwmlyhygdnlcatnbggtaevyykahaeaeaeaecmaebbaeplptoevwwtyakoonlourgofgvsjydpcaltaemyaeaeaeaeaeaeaeaeaebkgdcarh
```

### Coin Info
| UR Type | CBOR Tag |
|------|-----|
| `coin-info` | 40305 |

**Definition:** https://github.com/BlockchainCommons/Research/blob/master/papers/bcr-2020-007-hdkey.md

Has 2 parameters `type` BIP44 coin type and `network` that highlights testnet or mainnet for Bitcoin like coins and for ethereum based coins it is `chainId`

Usage:

```typescript
import { CoinInfo, Network } from "@ngraveio/bc-ur-registry";

const bitcoinMainnet = new CoinInfo(); // Default is Bitcoin Mainnet
const bitcoinTestnet = new CoinInfo(undefined, Network.Testnet);

const ethereumMainnet = new CoinInfo(60); // Ethereum Mainnet
const ethereumTestnet = new CoinInfo(60, Network.Testnet); // Ethereum Testnet


bitcoinMainnet.getType(); // 0
bitcoinMainnet.getNetwork(); // 0 for mainnet
```

---

### KeyPath
| UR Type | CBOR Tag |
|------|-----|
| `keypath` | 40304 |

**Definition:** https://github.com/BlockchainCommons/Research/blob/master/papers/bcr-2020-007-hdkey.md

Keypath class for handling BIP44 like hierarchical key derivation paths.

Example path in string format: 
- `44'/0'/0'/0/0`
- `1'/2/3-4/5-6'/*/*'/<7;8'>/<9';0>`

**Input arguments:**
 - `path`: String path or array of `PathComponents` that make up the path.
 - `source-fingerprint`: The fingerprint of the ancestor or master key. Required if `components` is empty.
 - `depth`: The number of derivation steps in the path. If omitted, it will be inferred from `components`.


**Usage:**
```typescript
import { KeyPath, PathComponent } from "@ngraveio/bc-ur-registry";

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
| UR Type | CBOR Tag |
|------|-----|
| `hdkey` | 40303 |

Definition: https://github.com/BlockchainCommons/Research/blob/master/papers/bcr-2020-007-hdkey.md#cddl-for-hdkey


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


### Address

| UR Type | CBOR Tag |
|------|-----|
| `address` | 40307 |

**Definition:** https://github.com/BlockchainCommons/Research/blob/master/papers/bcr-2020-009-address.md

The `Address` class represents a cryptocurrency address, such as a Bitcoin or Ethereum address. It encapsulates the address data and metadata, including the coin type and network (mainnet or testnet).


#### Constructor Arguments

```typescript
interface IAddressInput {
  /** Type of the coin and network (testnet, mainnet) */
  info?: CoinInfo // When omitted defaults to bitcoin mainnet
  /**
   * The `type` field MAY be included for Bitcoin (and similar cryptocurrency) addresses, and MUST be omitted for non-applicable types.
   * For bitcoin script type eg: p2ms, p2pk, p2pkh, p2sh, p2wpkh, p2wsh, P2TR
   **/
  type?: AddressScriptType
  /** Public key or script hash that is encoded */
  data: Uint8Array | Buffer
}
```

#### Usage

```typescript
import { Address, CoinInfo, Network } from '@ngraveio/bc-ur-registry';

// Example: Creating an Ethereum testnet address
const ethereumTestnet = new Address({
  data: Buffer.from("81b7e08f65bdf5648606c89998a9cc8164397647", "hex");
  info: new CoinInfo(60, 1), // BIP44 coin type 60 (ethereum), testnet
});

ethereumTestnet.toString(); // 0x81b7e08f65bdf5648606c89998a9cc8164397647

// Creating a Bitcoin mainnet address P2PKH
const bitcoinMainnet = new Address({
  data: Buffer.from("77bff20c60e522dfaa3350c39b030a5d004e839a", "hex"),
  // default info is bitcoin P2PKH
});

bitcoinMainnet.toString(); // 1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2
```

#### FromAddress
`fromAddress` method can be used to create an `Address` object from a string address.
It currently supports **Bitcoin** and **Ethereum** addresses.

It can infer mainnet or testnet and script type for Bitcoin addresses.
But it cannot infer the **chainId** for Ethereum addresses. So it needs to be given explicitly.

```typescript

// Example: Creating an Ethereum testnet address
const ethereumTestnet = Address.fromAddress("0x81b7e08f65bdf5648606c89998a9cc8164397647", 'testnet');

ethereumTestnet.toString(); // 0x81b7e08f65bdf5648606c89998a9cc8164397647

// Creating a Bitcoin testnet address P2PKH
const bitcoinP2WPKHtestnet = Address.fromAddress("tb1q0mt7t7sjn777f4mgpk7u67a82aykkw3kq4kaad");

bitcoinP2WPKHtestnet.toString(); // tb1q0mt7t7sjn777f4mgpk7u67a82aykkw3kq4kaad
bitcoinP2WPKHtestnet.getAddressInfo().getType() // BIP44 `0` bitcoin
bitcoinP2WPKHtestnet.getAddressInfo().getNetwork() // 1 for testnet
bitcoinP2WPKHtestnet.getAddressScriptType() // AddressScriptType.P2WPKH
```


#### Supported Bitcoin Script Types

| Address Type                              | Starts With         | Version Byte (Mainnet)       | Version Byte (Testnet)       | Encoding Type | Prefix Application                                                                 | Mainnet Example                                                      | Testnet Example                                                |
|-------------------------------------------|---------------------|------------------------------|------------------------------|---------------|------------------------------------------------------------------------------------|----------------------------------------------------------------------|----------------------------------------------------------------|
| Pay-to-Public-Key (P2PK)                  | No address format   | N/A                          | N/A                          | Script-based  | No address prefix; directly uses public key in scripts.                            | No specific address; script usage only.                              | No specific address; script usage only.                        |
| Pay-to-Public-Key-Hash (P2PKH)            | 1                   | 0x00                         | 0x6F                         | Base58Check   | Add the version byte (0x00 or 0x6F) before the hashed public key and checksum.     | 18uWvCS2hqV6D5ehQtDJxrftrePAXGeevS                                   | ms5e572mZ1eDKdeyfR6MpRqXHVv6kM6wAP                             |
| Pay-to-Script-Hash (P2SH)                 | 3                   | 0x05                         | 0xC4                         | Base58Check   | Add the version byte (0x05 or 0xC4) before the script hash and checksum.           | 3FymWfwDaGzsRWesK47nxFWPDiDmkC8GkR                                   | 2MvJq3ieuKUiwvQP1WVQdfb5WB5fMStTkhH                            |
| Pay-to-Witness-Public-Key-Hash (P2WPKH)   | bc1q                | Witness Version 0 (0x00)     | Witness Version 0 (0x00)     | Bech32        | Add the human-readable prefix (bc or tb) and encode the data with Bech32.          | bc1q26mhhmkkddq9zd66fec6tac2lp07c7uuaurgtr                           | tb1q0mt7t7sjn777f4mgpk7u67a82aykkw3kq4kaad                     |
| Pay-to-Witness-Script-Hash (P2WSH)        | bc1q                | Witness Version 0 (0x00)     | Witness Version 0 (0x00)     | Bech32        | Add the human-readable prefix (bc or tb) and encode the data with Bech32.          | bc1q6axwlnwlky7jykqqwlrcjy2s6ragcwaesal0nfpv5pnwdmgu72es5kywz8f       | tb1qwjnw4rf07n8wyerlnplyeecpfkw5q2puqn0vux04kqpdu689qx0qx6uqvj |
| Pay-to-Taproot (P2TR)                     | bc1p                | Witness Version 1 (0x01)     | Witness Version 1 (0x01)     | Bech32m       | Add the human-readable prefix (bc or tb) and encode the data with Bech32m.         | bc1p9cjtuu7rlytzgeuwtdy4fuflmpp00tmpwchr7xjdexs5la94frkqpmcs8f       | tb1p34jjsay897lryzkc0fkxk9wruhvct6vnmknxxaxy75rxnpakqlqs56v2lh |
| Pay-to-Multisig (P2MS)                    | No address format   | N/A                          | N/A                          | Script-based  | No address prefix; directly uses multisignature script.                            | No specific address; script usage only.                              | No specific address; script usage only.                        |


### Output Descriptor
| UR Type | CBOR Tag |
|------|-----|
| `output-descriptor` | 40308 |

**Definition:** https://github.com/BlockchainCommons/Research/blob/master/papers/bcr-2023-010-output-descriptor.md

Output descriptors [[OD-IN-CORE]](https://github.com/bitcoin/bitcoin/blob/master/doc/descriptors.md), [[OSD]](https://bitcoinops.org/en/topics/output-script-descriptors/), also called output script descriptors, are a way of specifying Bitcoin payment outputs that can range from a simple address to multisig and segwit using a simple domain-specific language. For more on the motivation for output descriptors, see [[WHY-OD]](https://bitcoin.stackexchange.com/questions/89261/why-does-importmulti-not-support-zpub-and-ypub/89281#89281).

**Important Note:** 
> Output descritor string parsing is not implemented in this library. So you need to manually parse the output descriptor string and create `HDKey`, `ECKey`, and `Address` objects and pass them to the `OutputDescriptor` class.

**Input Arguments:**

- `text`: The output descriptor string.
- `keys` *(optional)*: An array of keys that are defined as `HDKey`, `Eckey`, or `Address` classes.
- `name` *(optional)*: A human-readable name for the descriptor.
- `note` *(optional)*: Additional notes or comments.

**Usage:**

```typescript
import { OutputDescriptor, HDKey, ECKey } from '@ngraveio/bc-ur-registry';

// pk(03e220e776d811c44075a4a260734445c8967865f5357ba98ead3bc6a6552c36f2)
const text = "pk(@0)"
const eckey = new ECKey({
  data: Buffer.from("03e220e776d811c44075a4a260734445c8967865f5357ba98ead3bc6a6552c36f2", "hex")
});

const outputDescriptor = new OutputDescriptor({
  source: text,
  keys: [eckey],
});

```

More advanced example with HDKeys:

```typescript
import { OutputDescriptor, HDKey, ECKey } from '@ngraveio/bc-ur-registry';

const text = 'wsh(sortedmulti(2,@0,@1,@2))'

// Create HDKey objects
const hdkey1 = HDKey.fromXpub("xpub6DiYrfRwNnjeX4vHsWMajJVFKrbEEnu8gAW9vDuQzgTWEsEHE16sGWeXXUV1LBWQE1yCTmeprSNcqZ3W74hqVdgDbtYHUv3eM4W2TEUhpan");
const sourceFingerprint = Buffer.from("dc567276", "hex").readUint32BE();

hdkey1.data.origin = new Keypath({
  sourceFingerprint: sourceFingerprint,
  path: "48'/0'/0'/2'"
});
// @ts-ignore
hdkey1.data.children = new Keypath({
  path: "<0;1>/*",
});

const hdkey2 = HDKey.fromXpub("xpub6DnT4E1fT8VxuAZW29avMjr5i99aYTHBp9d7fiLnpL5t4JEprQqPMbTw7k7rh5tZZ2F5g8PJpssqrZoebzBChaiJrmEvWwUTEMAbHsY39Ge");

hdkey2.data.origin = new Keypath({
  sourceFingerprint: Buffer.from("f245ae38", "hex").readUint32BE(),
  path: "48'/0'/0'/2'"
});
// @ts-ignore
hdkey2.data.children = new Keypath({
  path: "<0;1>/*",
});

const hdkey3 = HDKey.fromXpub("xpub6DjrnfAyuonMaboEb3ZQZzhQ2ZEgaKV2r64BFmqymZqJqviLTe1JzMr2X2RfQF892RH7MyYUbcy77R7pPu1P71xoj8cDUMNhAMGYzKR4noZ");

hdkey3.data.origin = new Keypath({
  sourceFingerprint: Buffer.from("c5d87297", "hex").readUint32BE(),
  path: "48'/0'/0'/2'"
});

hdkey3.data.children = new Keypath({
  path: "<0;1>/*",
});

const outputDescriptor = new OutputDescriptor({
  source: text,
  keys: [hdkey1, hdkey2, hdkey3],
  name: "Satoshi's Stash",
});

```

### Account Descriptor
| UR Type | CBOR Tag |
|------|-----|
| `account-descriptor` | 40311 |

**Definition:** https://github.com/BlockchainCommons/Research/blob/master/papers/bcr-2023-019-account-descriptor.md


The `AccountDescriptor` promotes standards-based sharing of BIP44 account level xpubs and other information, allowing devices to join wallets with minimal user interaction. It addresses the need for devices to share xpubs at the correct derivation path for various script types, reducing the burden on users to select the script type manually. This standard format bundles information for multiple script types into a set, enabling wallet software to select the appropriate type from the set provided by the device.

#### Constructor Arguments

```typescript
interface IAccountDescriptorArgs {
  masterFingerprint: number
  outputDescriptors: OutputDescriptor[]
}
```

#### Usage

```typescript
import { AccountDescriptor, OutputDescriptor } from '@ngraveio/bc-ur-registry';

// Example: Creating an AccountDescriptor
const outputDescriptor = new OutputDescriptor({
  // ...output descriptor initialization...
});

const accountDescriptor = new AccountDescriptor({
  masterFingerprint: 1234567890,
  outputDescriptors: [outputDescriptor],
});

// Access properties
console.log(accountDescriptor.getMasterFingerprint()); // 1234567890
console.log(accountDescriptor.getOutputDescriptors()); // [outputDescriptor]
```

The `AccountDescriptor` class provides methods to access the master fingerprint and output descriptors:

- **`getMasterFingerprint()`**: Returns the master fingerprint.
- **`getOutputDescriptors()`**: Returns the array of output descriptors.

```typescript
const masterFingerprint = accountDescriptor.getMasterFingerprint();
const outputDescriptors = accountDescriptor.getOutputDescriptors();
```

This class ensures that output descriptors are restricted to HD keys at account level key derivations only, as per the BIP44 standard.

