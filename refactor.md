# Refactor Keystone UR-Registry types

We have updated BC-UR repository to have more features and to include internal UR repository.

## New Features
- 🔑 **Registry System**: Built-in support for CBOR tag registration and extendable registry items.
- 📜 **UR as Communication Layer**: Simplified encoding/decoding from CBOR tags to registry items using UR.
- 🚀 **Fountain Encoder/Decoder**: Reliable multipart UR support for lossy or air-gapped environments.
- 🌐 **Dual Packaging**: Native support for ESM and CJS modules.
- 🛠️ **CBOR2 Integration**: Enhanced CBOR encoding/decoding capabilities.

Previously all **UR Types** defined by **BlockchainCommons** were implemented by [Keystone](https://github.com/KeystoneHQ/ur-registry) following this guide: https://github.com/BlockchainCommons/Research/blob/master/papers/bcr-2020-005-ur.md

Since we have a new UR-Registry we are going to migrate old Keystone Defined types to the new system.

## Setup
In order to start migration, you need to clone 3 repositories until we solve some packaging issues.

1. Clone [Ngrave BC-UR](https://github.com/ngraveio/bc-ur/tree/fix-types) `fix-types` branch.
2. Clone [Keystone UR-Registry](https://github.com/KeystoneHQ/ur-registry).
3. Clone [Ngrave Ur-registry](https://github.com/ngraveio/ur-registry/tree/refactor/bc-ur2) repository `refactor/bc-ur2` branch.

### Ngrave BC-UR
Read the readme file and understand the concepts and how to use Registry Item classes
https://github.com/ngraveio/bc-ur/blob/fix-types/README.md

- Clone the repository and checkout `fix-types` branch.
- Run `yarn` to install dependencies.
- Run `yarn build` to build the project.
- Note your **local path** to the repository.

### Ngrave UR-Registry
- Clone the repository and checkout `refactor/bc-ur2` branch.
- Replace all instances of `"@ngraveio/bc-ur": "file:/PATH"` with your local path to Ngrave BC-UR repository in `package.json` files.
- Run `yarn` to install dependencies.
- Run `yarn lerna run build` to build the project. It's okay for now that a few of the packages are failing.
- Go to `ur-packages/base-types` folder, this will be your base for now.
- Go to `ur-packages/base-types` folder in your terminal as well, here you will be able to run:
  - `yarn install`
  - `yarn build`
  - `yarn test`

### Keystone UR-Registry
- Clone the repository and checkout `main` branch.
- Go to `./src` folder and note the files that contain classes that `extends RegistryItem` classes.

We are going to migrate all these classes to the new Registry system:
  - Bytes
  - CryptoAccount 
  - CryptoCoinInfo 
  - CryptoECKey
  - MultiKey
  - PathComponent
  - CryptoHDKey
  - CryptoKeypath
  - CryptoOutput
  - CryptoPSBT
  - ScriptExpression
  - CryptoMultiAccounts
  - KeyDerivationSchema
  - KeyDerivation
  - QRHardwareCall

## Migration

### Key Changes in new `RegistryItem` system
1. **Direct CBOR Decoding:**
   - Old: CBOR encoded and decoded to `DataItem` before conversion to `RegistryItem`.
   - New: CBOR directly encoded/decoded to `RegistryItem`.

2. **Factory-Based Definitions:**
   - Automates `fromDataItem` and `fromCBOR` methods.
   - Handles key-to-integer mapping automatically via `keyMap` property.

3. **Input Validation:**
   - Adds `verifyInput` for validation.
   - Allows custom processing via `fromCBORData` overrides.

4. **CBOR Tag Registration:**
   - Adds `tag` property for CBOR tag registration.

5. **Deprecated `RegistryItem` methods:**
   - `toDataItem` and `fromDataItem` are deprecated.
   - `toCBOR` and `fromCBOR` are deprecated.
   - `fromCBORData` is deprecated.

6. **New `RegistryItem` methods:**
   - Instead of `toCBOR` and `fromCBOR` methods, we need to convert the item to UR first.
  ```typescript
  const ur = item.toUR();
  // Get cbor data in hex format;
  const cbor = ur.getPayloadHex();
  /// For decoding from cbor
  Ur.fromCbor({type: 'coin-info', payload: cbor}).decode();
  ```
  - Instead of `registry.item.getRegistryType()` method, we have:
    - item.type.tag
    - item.type.URType
    - item.data
  - Methods along with static class methods:
    - RegistryItemClass.tag
    - RegistryItemClass.URType

Read https://github.com/ngraveio/bc-ur/blob/fix-types/README.md#registry-items for more details.

### Step 1: Copy Files
- Copy the file from Keystone to Ngrave UR-Registry `ur-packages/base-types` folder.
- Check if it has any tests, if so, copy its test to `ur-packages/base-types/__tests__` folder.

### Step 2: Refactor Files
Let's go over an example of `CryptoCoinInfo`.

Old file is located at https://github.com/KeystoneHQ/ur-registry/blob/main/src/CryptoCoinInfo.ts

```typescript
import { decodeToDataItem, DataItem } from './lib';
import { RegistryItem } from './RegistryItem';
import { RegistryTypes } from './RegistryType';
import { DataItemMap } from './types';

enum Keys {
  type = '1',
  network = '2',
}

export enum Type {
  bitcoin = 0,
}

export enum Network {
  mainnet,
  testnet,
}

export class CryptoCoinInfo extends RegistryItem {
  getRegistryType = () => {
    return RegistryTypes.CRYPTO_COIN_INFO;
  };

  constructor(private type?: Type, private network?: Network) {
    super();
  }

  public getType = () => {
    return this.type || Type.bitcoin;
  };

  public getNetwork = () => {
    return this.network || Network.mainnet;
  };

  public toDataItem = () => {
    const map: DataItemMap = {};
    if (this.type) {
      map[Keys.type] = this.type;
    }
    if (this.network) {
      map[Keys.network] = this.network;
    }
    return new DataItem(map);
  };

  public static fromDataItem = (dataItem: DataItem) => {
    const map = dataItem.getData();
    const type = map[Keys.type];
    const network = map[Keys.network];
    return new CryptoCoinInfo(type, network);
  };

  public static fromCBOR = (_cborPayload: Buffer) => {
    const dataItem = decodeToDataItem(_cborPayload);
    return CryptoCoinInfo.fromDataItem(dataItem);
  };
}
```

#### Find `tag` and `URType`
First, let's find the `tag` and `URType` for this class.

Navigate to `./src/RegistryType.ts` https://github.com/KeystoneHQ/ur-registry/blob/main/src/RegistryType.ts
Find coin-info and note its `tag` and `URType`.

```typescript
CRYPTO_COIN_INFO: new RegistryType('crypto-coin-info', 305)
```

So we now know that `tag` is `305` and `URType` is `crypto-coin-info`.

#### Find CDDL
Now we are going to find the CDDL definition for this class in the BlockchainCommons repository.
https://github.com/BlockchainCommons/Research/blob/master/papers/bcr-2020-006-urtypes.md

If we follow the link and check `crypto-coin-info`, we will see it has been deprecated and the name moved to `coin-info`, and the tag moved to `40305` from `305`.

You can find the CDDL definition for `coin-info` in https://github.com/BlockchainCommons/Research/blob/master/papers/bcr-2020-007-hdkey.md#cddl-for-coin-info

```cddl
; Metadata for the type and use of a cryptocurrency

tagged-coininfo = #6.40305(coininfo)

coininfo = {
    ? type: uint31 .default cointype-btc, ; values from [SLIP44](https://github.com/satoshilabs/slips/blob/master/slip-0044.md) with high bit turned off
    ? network: int .default mainnet ; coin-specific identifier for testnet
}

type = 1
network = 2

cointype-btc = 0
cointype-eth = 0x3c

mainnet = 0;
testnet-btc = 1;

; from [ETH-TEST-NETWORKS]
testnet-eth-ropsten = 1;
testnet-eth-kovan = 2;
testnet-eth-rinkeby = 3;
testnet-eth-gorli = 4;
```

We are going to apply this source of truth to our new class.

#### Refactor Class

Here we don't need `toDataItem`, `fromDataItem`, `fromCBOR` methods anymore, so instead, we will use the `keyMap` property to define the keys and their types.

Also, we are going to change `getRegistryType` and access its information.

**Final refactored class will look like this:**
```typescript
import { registryItemFactory } from '@ngraveio/bc-ur'

export enum Network {
  mainnet = 0,
  testnet = 1,
}

export class CoinInfo extends registryItemFactory({
  tag: 40305,
  URType: 'coin-info',
  keyMap: {
    type: 1,
    network: 2,
  },
  CDDL: `
      coininfo = #6.40305({
          ? type: uint .default 1, ; values from [SLIP44](https://github.com/satoshilabs/slips/blob/master/slip-0044.md) with high bit turned off
          ? network: int .default 1 ; coin-specific identifier for testnet
      })
  
      type = 1
      network = 2
  `,
}) {
  constructor(type = 1, network: Network = Network.mainnet) {
    // Pass a data object
    super({ type, network })
  }

  public getType = () => this.data.type
  public getNetwork = () => this.data.network

  override verifyInput(input: any): { valid: boolean; reasons?: Error[] } {
    // Check if type is an integer and bigger than 0
    if (typeof input.type !== 'number' || input.type < 0) {
      return {
        valid: false,
        reasons: [new Error('Type must be a positive integer')],
      }
    }
    if (typeof input.network !== 'number' || input.network < 0) {
      return {
        valid: false,
        reasons: [new Error('Network must be a positive integer')],
      }
    }

    return { valid: true }
  }

  /**
   * We need to override this method because the class expects 2 arguments instead of an object
   */
  static override fromCBORData(val: any, allowKeysNotInMap = false, tagged?: any) {
    // Do some post-processing data coming from the CBOR decoder
    const data = this.postCBOR(val, allowKeysNotInMap)

    // Return an instance of the generated class
    return new this(data.type, data.network)
  }
}
```
We have updated the imports, only need the
```typescript
import { registryItemFactory } from '@ngraveio/bc-ur'`
```

Notice that we have added `tag` and `URType` to the class definition via the `registryItemFactory` function.
We have also added the `CDDL` definition to the class.

For the **keyMap**, we have used the following information from CDDL:
```CDDL
      type = 1
      network = 2
```

and keys enum from the old class:
```typescript
enum Keys {
  type = '1',
  network = '2',
}
```

**NOTE**:
If this class were to contain a `RegistryItem` inside, we don't need to convert that from the buffer anymore; it will be handled by the **CBOR** decoder automatically.

For example, the `CryptoAccount` class contains the `CryptoOutput` class, so in the old code in `fromDataItem`:
```typescript
    const cryptoOutputs = outputDescriptors.map((item) =>
      CryptoOutput.fromDataItem(item),
    );
```
is called. We don't need this anymore.

### Step 3: Add to Registry
Go to `./ur-packages/base-types/src/addToRegistry.ts` file and update that to include your new class.

Update `./ur-packages/base-types/src/index.ts` file to export your class.

### Step 4: Test
If the class already has tests, CBOR and UR data should be identical to the old class.
Update the registry item API usage and make sure tests pass.

Otherwise, create your own tests.