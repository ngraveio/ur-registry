# Coin Identity

Definition document: https://github.com/ngraveio/Research/blob/main/papers/nbcr-2023-001-coin-identity.md

## Installing

To install, run:

```bash
yarn add @ngraveio/ur-coin-identity
```

```bash
npm install --save @ngraveio/ur-coin-identity
```

## CDDL

The following specification of crypto-coin-identity is written in CDDL. When used embedded in another CBOR structure, this structure should be tagged #6.1401.

```
; Table should always be updated according to IANA registry 
; https://www.iana.org/assignments/cose/cose.xhtml#elliptic-curves
; https://www.rfc-editor.org/rfc/rfc9053.html#name-elliptic-curve-keys

P256=1	            ; NIST P-256 also known as secp256r1
P384=2	            ; NIST P-384 also known as secp384r1	
P521=3	            ; EC2	NIST P-521 also known as secp521r1		
X25519=4            ; X25519 for use w/ ECDH only		
X448=5              ; X448 for use w/ ECDH only		
Ed25519=6           ; Ed25519 for use w/ EdDSA only		
Ed448=7             ; Ed448 for use w/ EdDSA only		
secp256k1=8         ; SECG secp256k1 curve	IESG	

elliptic_curve = P256 / P384 / P521 / X25519 / X448 / Ed25519 / Ed448 / secp256k1

; Subtypes specific to some coins (e.g. ChainId for EVM chains)
hex_string = #6.263(bstr) ; byte string is a hexadecimal string no need for decoding
sub_type_exp = uint32 / str / hex_string

coin-identity = {
    curve: elliptic_curve,
    type: uint31, ; values from [SLIP44] with high bit turned off,
    ? subtype: [ sub_type_exp + ]  ; Compatible with the definition of several subtypes if necessary
}

curve = 1
type = 2
subtype = 3
```

## Usages Examples

### [CoinIdentity] Construct a crypto coin identity

Add additional information to a specific hdkey. It contains the following information:

1. Curve of the coin (e.g. \*_\*\* _`["secp256k1", "ed25519", "secp256r1”, “sr25519”]` ).\* This information is mandatory in the case of some blockchain (e.g. Tezos) supporting multiple elliptic curves.
2. BIP44 coin type as defined in [[SLIP44]](https://github.com/satoshilabs/slips/blob/master/slip-0044.md).
3. Subtype to define additional information to identify the coin (e.g. the chain ID for an EVM chain).

The URI format is as follows: `bc-coin://{subtype2.subtype1.subtype0}.{curve}/type`

Below the coinIdentity of Polygon (MATIC) as an example: "`bc-coin://137.secp256k1/60`"
```js
import {CoinIdentity, EllipticCurve } from from '@ngraveio/ur-coin-identity';

const curve = EllipticCurve.secp256k1 // 8
const type = 60
const chainId = '137'
const subTypes = [chainId]

const coinIdentity = new CoinIdentity(curve, type, subTypes)

const cbor = coinIdentity.toHex(); // "a3010802183c038163313337"
const ur = coinIdentity.toUr();
console.log(ur.toString());
// :ur:crypto-coin-identity/otadayaocsfnaxlyiaeheoemaojsbajy"
```
