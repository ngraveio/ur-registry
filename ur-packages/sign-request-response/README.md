# Signing Protocol

This is the implementation of the [Signing Protocol](https://github.com/ngraveio/Research/blob/main/papers/nbcr-2023-003-sign.md) that is coin agnostic and can be used for any coin.

This package adds support for the following ur types:

| Type                  | [[CBOR Tag]](https://www.iana.org/assignments/cbor-tags/cbor-tags.xhtml) | Owner  | Description                                                                                               | Definition                                                                                            |
| --------------------- | ------------------------------------------------------------------------ | ------ | --------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `sign-request` | 41411                                                                     | Ngrave | Blockchain-agnostic signature request type where type of the coin is identified by `coin-identity` | [[NBCR-2023-003]](https://github.com/ngraveio/Research/blob/main/papers/nbcr-2023-003-sign.md) |
| `sign-response`    | 41412                                                                     | Ngrave | Blockchain-agnostic signature response type                                                               | [[NBCR-2023-003]](https://github.com/ngraveio/Research/blob/main/papers/nbcr-2023-003-sign.md) |

## Why Use `sign-request` and `sign-response`

The `sign-request` and `sign-response` UR types provide a standardized, blockchain-agnostic way to handle signature requests and responses. By using these UR types, developers can create a uniform protocol for signing transactions across different blockchains, ensuring compatibility and ease of integration. This standardization helps in reducing the complexity of handling multiple blockchain-specific signing protocols and enhances security by providing a consistent method for transaction verification and signing.

## Installing

To install, run:

```bash
yarn add @ngraveio/ur-sign
```

```bash
npm install --save @ngraveio/ur-sign
```

```typescript
import { SignRequest, SignResponse } from "@ngraveio/ur-sign";
```

## CDDL
**Sign Request:**
```cddl
  sign-request = {
      ?request-id: uuid,                        ; Identifier of the signing request
      coin-id: #6.41401(coin-identity),         ; Provides information on the elliptic curve and the blockchain/coin
      ?derivation-path: #6.40304(keypath),      ; Key path for signing this request
      sign-data: bytes,                         ; Transaction to be decoded by the offline signer 
      ?origin: text,                            ; Origin of this sign request, e.g. wallet name
      ?tx-type: int .default 1                  ; Specify type of transaction required for some blockchains
      ?address: string / bytes                  ; Specify sender address if not already specified in the sign-data and derivation-path
  }

  request-id = 1
  coin-id = 2
  derivation-path = 3
  sign-data = 4
  origin = 5
  tx-type = 6
  address=7
```
**Sign Response:**
```cddl
  sign-response = {
    ?request-id: uuid,     ; Identifier of the signing request 
    signature: bytes,      ; Signature result
    ?origin: text,         ; The device info providing this signature
  }

  ; request-id must be present in case of response to a sign-request where 
  ; the request-id is specified

  request-id = 1
  signature = 2
  origin = 3
```

## Examples:

### Bitcoin

#### Sign Request

```typescript
import { SignRequest } from "@ngraveio/ur-sign";
import { UUID } from "@ngraveio/ur-uuid";
import { CoinIdentity } from "@ngraveio/ur-coin-identity";
import { Keypath } from "@ngraveio/ur-blockchain-commons";

const requestId = new UUID(Buffer.from('3b5414375e3a450b8fe1251cbc2b3fb5', 'hex'));
const coinId = new CoinIdentity(8, 0); // Bitcoin
const derivationPath = new Keypath({ path: "m/44'/0'/0'/0/0" });
const signData = Buffer.from('0100000001abcdef', 'hex');
const origin = "NGRAVE ZERO";
const txType = 1;
const address = '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa';

const signRequest = new SignRequest({ requestId, coinId, derivationPath, signData, origin, txType, address });
const ur = signRequest.toUr();
console.log(ur.toString());
```

#### Sign Response

```typescript
import { SignResponse } from "@ngraveio/ur-sign";
import { UUID } from "@ngraveio/ur-uuid";

const requestId = new UUID(Buffer.from('3b5414375e3a450b8fe1251cbc2b3fb5', 'hex'));
const signature = Buffer.from('70736274ff01009a020000000258e87a21b56daf0c23be8e7070456c336f7cbaa5c8757924f545887bb2abdd750000000000ffffffff838d0427d0ec650a68aa46bb0b098aea4422c071b2ca78352a077959d07cea1d0100000000ffffffff0270aaf00800000000160014d85c2b71d0060b09c9886aeb815e50991dda124d00e1f5050000000016001400aea9a2e5f0f876a588df5546e8742d1d87008f000000000000000000', 'hex');
const origin = "NGRAVE ZERO";

const signResponse = new SignResponse({ requestId, signature, origin });
const ur = signResponse.toUr();
console.log(ur.toString());
```

### Ethereum

#### Sign Request

```typescript
import { SignRequest } from "@ngraveio/ur-sign";
import { UUID } from "@ngraveio/ur-uuid";
import { CoinIdentity } from "@ngraveio/ur-coin-identity";
import { Keypath } from "@ngraveio/ur-blockchain-commons";

const requestId = new UUID(Buffer.from('9b1deb4d3b7d4bad9bdd2b0d7b3dcb6d', 'hex'));
const coinId = new CoinIdentity(8, 60); // Ethereum
const derivationPath = new Keypath({ path: "m/44'/60'/0'/0/0" });
const signData = Buffer.from('f86c808504a817c80082520894', 'hex');
const origin = "NGRAVE ZERO";
const txType = 1;
const address = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e';

const signRequest = new SignRequest({ requestId, coinId, derivationPath, signData, origin, txType, address });
const ur = signRequest.toUr();
console.log(ur.toString());
```

#### Sign Response

```typescript
import { SignResponse } from "@ngraveio/ur-sign";
import { UUID } from "@ngraveio/ur-uuid";

const requestId = new UUID(Buffer.from('9b1deb4d3b7d4bad9bdd2b0d7b3dcb6d', 'hex'));
const signature = Buffer.from('d4f0a7bcd95bba1fbb1051885054730e3f47064288575aacc102fbbf6a9a14daa066991e360d3e3406c20c00a40973eff37c7d641e5b351ec4a99bfe86f335f713', 'hex');
const origin = "NGRAVE ZERO";

const signResponse = new SignResponse({ requestId, signature, origin });
const ur = signResponse.toUr();
console.log(ur.toString());
```

### Solana

#### Sign Request

```typescript
import { SignRequest } from "@ngraveio/ur-sign";
import { UUID } from "@ngraveio/ur-uuid";
import { CoinIdentity } from "@ngraveio/ur-coin-identity";
import { Keypath } from "@ngraveio/ur-blockchain-commons";

const requestId = new UUID(Buffer.from('9b1deb4d3b7d4bad9bdd2b0d7b3dcb6d', 'hex'));
const coinId = new CoinIdentity(6, 501); // Solana
const derivationPath = new Keypath({ path: "m/44'/501'/0'/0'", sourceFingerprint: 934670036 });
const signData = Buffer.from('01000103c8d842a2f17fd7aab608ce2ea535a6e958dffa20caf669b347b911c4171965530f957620b228bae2b94c82ddd4c093983a67365555b737ec7ddc1117e61c72e0000000000000000000000000000000000000000000000000000000000000000010295cc2f1f39f3604718496ea00676d6a72ec66ad09d926e3ece34f565f18d201020200010c0200000000e1f50500000000', 'hex');
const origin = "NGRAVE LIQUID";
const txType = 1;
const address = '9FPebKDGZAdcpT7SpfB1UowuqobV8Zww9TwPDSyzXJMr';

const signRequest = new SignRequest({ requestId, coinId, derivationPath, signData, origin, txType, address });
const ur = signRequest.toUr();
console.log(ur.toString());
```

#### Sign Response

```typescript
import { SignResponse } from "@ngraveio/ur-sign";
import { UUID } from "@ngraveio/ur-uuid";

const requestId = new UUID(Buffer.from('9b1deb4d3b7d4bad9bdd2b0d7b3dcb6d', 'hex'));
const signature = Buffer.from('d4f0a7bcd95bba1fbb1051885054730e3f47064288575aacc102fbbf6a9a14daa066991e360d3e3406c20c00a40973eff37c7d641e5b351ec4a99bfe86f335f7', 'hex');
const origin = "NGRAVE ZERO";

const signResponse = new SignResponse({ requestId, signature, origin });
const ur = signResponse.toUr();
console.log(ur.toString());
```

### Tezos

#### Sign Request

```typescript
import { SignRequest } from "@ngraveio/ur-sign";
import { UUID } from "@ngraveio/ur-uuid";
import { CoinIdentity } from "@ngraveio/ur-coin-identity";
import { Keypath } from "@ngraveio/ur-blockchain-commons";

const requestId = new UUID(Buffer.from('9b1deb4d3b7d4bad9bdd2b0d7b3dcb6d', 'hex'));
const coinId = new CoinIdentity(6, 1729); // Tezos
const derivationPath = new Keypath({ path: "m/44'/1729'/0'/0'/0'", sourceFingerprint: 934670036 });
const signData = Buffer.from('f849808609184e72a00082271094000000000000000000000000000000000000000080a47f7465737432000000000000000000000000000000000000000000000000000000600057808080', 'hex');
const origin = "NGRAVE LIQUID";
const address = 'tz1gLTu4Yxj8tPAcriQVUdxv6BY9QyvzU1az';

const signRequest = new SignRequest({ requestId, coinId, derivationPath, signData, origin, address });
const ur = signRequest.toUr();
console.log(ur.toString());
```

#### Sign Response

```typescript
import { SignResponse } from "@ngraveio/ur-sign";
import { UUID } from "@ngraveio/ur-uuid";

const requestId = new UUID(Buffer.from('9b1deb4d3b7d4bad9bdd2b0d7b3dcb6d', 'hex'));
const signature = Buffer.from('9fb423ee0b1ad3d3ad359c22d1e79048789c232813663fd5d8a1223458082ea844f5e87bf77db3b997aa4c847e23047c042003e3b204cea9ae0e1bf6fdcaaf09', 'hex');
const origin = "NGRAVE ZERO";

const signResponse = new SignResponse({ requestId, signature, origin });
const ur = signResponse.toUr();
console.log(ur.toString());
```

### MultiversX

#### Sign Request

```typescript
import { SignRequest } from "@ngraveio/ur-sign";
import { UUID } from "@ngraveio/ur-uuid";
import { CoinIdentity } from "@ngraveio/ur-coin-identity";
import { Keypath } from "@ngraveio/ur-blockchain-commons";

const requestId = new UUID(Buffer.from('9b1deb4d3b7d4bad9bdd2b0d7b3dcb6d', 'hex'));
const coinId = new CoinIdentity(6, 508); // MultiversX
const derivationPath = new Keypath({ path: "m/44'/508'/0'/0'/1'", sourceFingerprint: 934670036 });
const signData = Buffer.from('f849808609184e72a00082271094000000000000000000000000000000000000000080a47f7465737432000000000000000000000000000000000000000000000000000000600057808080', 'hex');
const origin = "NGRAVE LIQUID";

const signRequest = new SignRequest({ requestId, coinId, derivationPath, signData, origin });
const ur = signRequest.toUr();
console.log(ur.toString());
```

#### Sign Response

```typescript
import { SignResponse } from "@ngraveio/ur-sign";
import { UUID } from "@ngraveio/ur-uuid";

const requestId = new UUID(Buffer.from('9b1deb4d3b7d4bad9bdd2b0d7b3dcb6d', 'hex'));
const signature = Buffer.from('9fb423ee0b1ad3d3ad359c22d1e79048789c232813663fd5d8a1223458082ea844f5e87bf77db3b997aa4c847e23047c042003e3b204cea9ae0e1bf6fdcaaf09', 'hex');
const origin = "NGRAVE ZERO";

const signResponse = new SignResponse({ requestId, signature, origin });
const ur = signResponse.toUr();
console.log(ur.toString());
```

### Stellar

#### Sign Request

```typescript
import { SignRequest } from "@ngraveio/ur-sign";
import { UUID } from "@ngraveio/ur-uuid";
import { CoinIdentity } from "@ngraveio/ur-coin-identity";
import { Keypath } from "@ngraveio/ur-blockchain-commons";

const requestId = new UUID(Buffer.from('9b1deb4d3b7d4bad9bdd2b0d7b3dcb6d', 'hex'));
const coinId = new CoinIdentity(6, 148); // Stellar
const derivationPath = new Keypath({ path: "m/44'/148'/0'/0'/2'", sourceFingerprint: 934670036 });
const signData = Buffer.from('00000002000000002df26f5fc2916d823126414b0cde52203a4f54222e1f3c82f2c82bf7c4e2d76d000000640011b3dc0000000100000001000000000000006400000000646e9655000000010000000c48656c6c6f20576f726c642100000001000000000000000100000000321911377e1664d677a85ab30acd1262522f989f0f31da613219e8396278cdb90000000000000002540be4000000000000000000', 'hex');
const origin = "NGRAVE LIQUID";

const signRequest = new SignRequest({ requestId, coinId, derivationPath, signData, origin });
const ur = signRequest.toUr();
console.log(ur.toString());
```

#### Sign Response

```typescript
import { SignResponse } from "@ngraveio/ur-sign";
import { UUID } from "@ngraveio/ur-uuid";

const requestId = new UUID(Buffer.from('9b1deb4d3b7d4bad9bdd2b0d7b3dcb6d', 'hex'));
const signature = Buffer.from('9fb423ee0b1ad3d3ad359c22d1e79048789c232813663fd5d8a1223458082ea844f5e87bf77db3b997aa4c847e23047c042003e3b204cea9ae0e1bf6fdcaaf09', 'hex');
const origin = "NGRAVE ZERO";

const signResponse = new SignResponse({ requestId, signature, origin });
const ur = signResponse.toUr();
console.log(ur.toString());
```

