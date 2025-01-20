# Refactor Overview: Version 2

## Introduction
This refactor simplifies CBOR encoding and decoding by enabling direct conversion from CBOR to `RegistryItem`, removing intermediate steps. It also introduces a factory-based approach to streamline registry item definitions, reducing boilerplate and improving consistency.

---

## Key Changes
1. **Direct CBOR Decoding:**
   - Old: CBOR encoded and decoded to `DataItem` before conversion to `RegistryItem`.
   - New: CBOR directly encoded decoded to `RegistryItem`.

2. **Factory-Based Definitions:**
   - Automates `fromDataItem` and `fromCBOR` methods.
   - Handles key-to-integer mapping via `preCBOR` and `postCBOR`.

3. **Input Validation:**
   - Adds `verifyInput` for validation.
   - Allows custom processing via `fromCBORData` overrides.

---
### CoinInfo example
https://github.com/BlockchainCommons/Research/blob/master/papers/bcr-2020-007-hdkey.md#cddl-for-coin-info

We are going to create a Registry Item for this type:
```CDDL

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

This CDDL says that tag is `40305` and coininfo has 2 optional params `type` and `network`. `type` is `uint31` and `network` is `int`.

Those keys are then defined as `type=1` and `network=2.`  
So that encoded cbor is smaller when there are no string keys.

**Old definition:**

```ts

enum Keys {
  type = '1',
  network = '2',
}

export enum Type {
  bitcoin = 0,
}

export enum Network {
  mainnet=0,
  testnet=1,
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
    // Here it converts string keys to integer keys
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


# New Registry Item

Here is the new definition:

```ts
enum Network {
  mainnet=0,
  testnet=1,
}

class CoinInfo extends registryItemFactory({
  tag: 40305,
  URType: "coin-info",
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
  constructor(type: number = 1, network: Network = Network.mainnet) {
    // Pass an data object
    super({type, network});
  }

  public getType = () => this.data.type;
  public getNetwork = () => this.data.network;


  verifyInput(input: any): { valid: boolean; reasons?: Error[]; } {
    // Check if type is integer and bigger than 0
    if (typeof input.type !== "number" || input.type < 0) {
      return {
        valid: false,
        reasons: [new Error("Type must be a positive integer")],
      };
    }
    if (typeof input.network !== "number" || input.network < 0) {
      return {
        valid: false,
        reasons: [new Error("Network must be a positive integer")],
      };
    }

    return {valid: true};
  }


  /**
   * We need to override this method because class expects 2 arguments instead of an object
   */
  static fromCBORData(val: any, allowKeysNotInMap?: boolean, tagged?: any) {
    // Do some post processing data coming from the cbor decoder
    const data = this.postCBOR(val, allowKeysNotInMap);

    // Return an instance of the generated class
    return new this(data.type, data.network);
  }  
}
  ```

  Now we dont need to define `fromDataItem` and `fromCBOR` methods.
   It is automatically generated and key to integer is done automaticaly by `RegistryItem.preCBOR` and `RegistryItem.postCBOR` methods.   
   We can also define `verifyInput` method to check if the input is valid.

  You can also override fromCBORData method to do some post processing on the data coming from the cbor decoder and if your class doesnt take the data object as an argument.