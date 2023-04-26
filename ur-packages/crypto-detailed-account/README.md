# BC-UR-Registry-sync

This repository is the Crypto Coin Identity extension of [bc-ur-registry](https://github.com/KeystoneHQ/ur-registry)

Definition document: https://github.com/ngraveio/Research/blob/main/papers/nbcr-2023-001-coin-identity.md

## Installing

To install, run:

```bash
yarn add @ngrave/bc-ur-registry-crypto-coin-identity
```

```bash
npm install --save @ngrave/bc-ur-registry-crypto-coin-identity
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
