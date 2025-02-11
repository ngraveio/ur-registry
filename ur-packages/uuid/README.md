# UUID CBOR type

This repository is the UUID extension of [bc-ur-registry](https://github.com/KeystoneHQ/ur-registry)

## Installing

To install, run:

```bash
yarn add @ngraveio/bc-ur-registry-uuid
```

```bash
npm install --save @ngraveio/bc-ur-registry-uuid
```

**Source:** https://github.com/lucas-clemente/cbor-specs/blob/master/uuid.md

# UUID Tag for CBOR

This document specifies a tag for UUID in Concise Binary Object Representation (CBOR) [1].

    Tag: 37
    Data item: byte string
    Semantics: Binary UUID (RFC 4122 section 4.1.2)
    Point of contact: Lucas Clemente <lucas@clemente.io>
    Description of semantics: https://github.com/lucas-clemente/cbor-specs/blob/master/uuid.md

# Usage

## Generating a UUID

```typescript
import { UUID } from '@ngraveio/bc-ur-registry-uuid';

const uuid = UUID.generate();
console.log(uuid.toString()); // Prints the generated UUID as a string
```

## Creating a UUID from a string

```typescript
import { UUID } from '@ngraveio/bc-ur-registry-uuid';

const uuidString = '123e4567-e89b-12d3-a456-426614174000';
const uuid = new UUID(uuidString);
console.log(uuid.toString()); // Prints the UUID as a string
```

## Creating a UUID from bytes

```typescript
import { UUID } from '@ngraveio/bc-ur-registry-uuid';

const uuidBytes = new Uint8Array([18, 62, 69, 103, 232, 155, 18, 211, 164, 86, 66, 20, 23, 64, 0]);
const uuid = new UUID(uuidBytes);
console.log(uuid.toString()); // Prints the UUID as a string
```

## Verifying a UUID

```typescript
import { UUID } from '@ngraveio/bc-ur-registry-uuid';

const uuidString = '123e4567-e89b-12d3-a456-426614174000';
const uuid = new UUID(uuidString);
const verification = uuid.verifyInput(uuidString);
console.log(verification.valid); // Prints true if the UUID is valid
```

# Semantics

Tag 37 can be applied to a byte string (major type 2) to indicate that the byte string is a UUID as defined in RFC 4122 section 4.1.2.

# References

[1] C. Bormann, and P. Hoffman. "Concise Binary Object Representation (CBOR)". RFC 7049, October 2013.

# Author

Lucas Clemente <lucas@clemente.io>
