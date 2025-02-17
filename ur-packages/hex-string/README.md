# Hex String CBOR type

This repository is the hex string extension of [bc-ur-registry](https://github.com/KeystoneHQ/ur-registry)

This Cbor type is used to represent a byte string as a hexadecimal string. This is useful when you want to represent a byte string as a hex string in a CBOR object.

## Installing

To install, run:

```bash
yarn add @ngraveio/ur-hex-string
```

```bash
npm install --save @ngraveio/ur-hex-string
```

**Source:** https://github.com/toravir/CBOR-Tag-Specs/blob/master/hexString.md

# Hex String Tag for CBOR

This document specifies a tag for Hex String in Concise Binary Object Representation (CBOR) [1].

    Tag: 263
    Data item: byte string
    Semantics: Hexadecimal String
    Point of contact: Ravi R <ravir@employees.org>
    Description of semantics: https://github.com/toravir/CBOR-Tag-Specs/blob/master/hexString.md

# Semantics

Tag 263 can be applied to a byte string (major type 2) to indicate that the byte string is 
a hexadecimal string - any normal string is stored as hexadecimal string, but this tag means
that string is to be kept as hex format and does not mean anything to convert to ASCII or anything.

# Usage Examples

```typescript
import { HexString } from "@ngraveio/ur-hex-string";

// Create HexString from buffer
const hex = "babecafe8badf00d";
const buff = Buffer.from(hex, "hex");
const hexStringFromBuffer = new HexString(buff);
// Remove starting 0x on string
const hexStringWith0x = new HexString("0x" + hex);
// Create HexString from hex string
const hexStringFromString = new HexString(hex);

// Create UR
const ur = hexStringFromBuffer.toUR();
ur.toString(); // Output: ur:hex-string/fdrdrnsgzelupmwtbtjpryzsss

// Decode HexString from CBOR
const expectedCBOR = "48babecafe8badf00d";
const cborData = Buffer.from(expectedCBOR, "hex");
const decodedHexString = HexString.fromHex(cborData);

// Decode HexString from UR
const expectedUR = "ur:hex-string/fdrdrnsgzelupmwtbtjpryzsss";
const decodedHexStringFromUR = UR.fromString(expectedUR).decode() as HexString;
console.log(decodedHexStringFromUR.toHex()); // Output: 48babecafe8badf00d

```

# References

[1] C. Bormann, and P. Hoffman. "Concise Binary Object Representation (CBOR)". RFC 7049, October 2013.

# Author

Ravi R <ravir@employees.org>
