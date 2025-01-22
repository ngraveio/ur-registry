import { registryItemFactory, UrRegistry } from '@ngraveio/bc-ur'
import { Keypath } from './Keypath'
import { CoinInfo } from './CoinInfo'
import { base58 } from "@scure/base";

interface HDKeyConstructorArgs {
  isMaster?: boolean
  keyData: Buffer
  chainCode: Buffer
  isPrivateKey?: boolean
  useInfo?: CoinInfo
  origin?: Keypath
  children?: Keypath
  parentFingerprint?: number
  name?: string
  note?: string
}

type MasterKeyProps = {
  isMaster: true
  keyData: Buffer
  chainCode: Buffer
}

type DeriveKeyProps = {
  isMaster: false
  isPrivateKey?: boolean
  keyData: Buffer
  chainCode?: Buffer
  useInfo?: CoinInfo
  origin?: Keypath
  children?: Keypath
  parentFingerprint?: number
  name?: string
  note?: string
}

export class HDKey extends registryItemFactory({
  tag: 40303,
  URType: 'hdkey',
  keyMap: {
    isMaster: 1,
    isPrivateKey: 2,
    keyData: 3,
    chainCode: 4,
    useInfo: 5,
    origin: 6,
    children: 7,
    parentFingerprint: 8,
    name: 9,
    note: 10,
  },
  CDDL: `
      tagged-hdkey = #6.40303(hdkey)

      ; An HD key is either a master key or a derived key.

      hdkey = {
          master-key / derived-key
      }

      ; A master key is always private, has no use or derivation information,
      ; and always includes a chain code.
      master-key = (
          is-master: true,
          key-data: key-data-bytes,
          chain-code: chain-code-bytes
      )

      ; A derived key may be private or public, has an optional chain code, and
      ; may carry additional metadata about its use and derivation.
      ; To maintain isomorphism with [BIP32] and allow keys to be derived from
      ; this key 'chain-code', 'origin', and 'parent-fingerprint' must be present.
      ; If 'origin' contains only a single derivation step and also contains 'source-fingerprint',
      ; then 'parent-fingerprint' MUST be identical to 'source-fingerprint' or may be omitted.
      derived-key = (
          ? is-private: bool .default false,     ; true if key is private, false if public
          key-data: key-data-bytes,
          ? chain-code: chain-code-bytes         ; omit if no further keys may be derived from this key
          ? use-info: tagged-coininfo, ; How the key is to be used
          ? origin: tagged-keypath,    ; How the key was derived
          ? children: tagged-keypath,  ; What children should/can be derived from this
          ? parent-fingerprint: uint32 .ne 0,    ; The fingerprint of this key's direct ancestor, per [BIP32]
          ? name: text,                          ; A short name for this key.
          ? note: text                           ; An arbitrary amount of text describing the key.
      )

      ; If the 'use-info' field is omitted, defaults (mainnet BTC key) are assumed.
      ; If 'cointype' and 'origin' are both present, then per [BIP44], the second path
      ; component's 'child-index' must match 'cointype'.

      ; The 'children' field may be used to specify what set of child keys should or can be derived from this key. 
      ; This may include 'child-index-range' or 'child-index-wildcard' as its last component. 
      ; Any components that specify hardened derivation will require the key be private.

      is-master = 1
      is-private = 2
      key-data = 3
      chain-code = 4
      use-info = 5
      origin = 6
      children = 7
      parent-fingerprint = 8
      name = 9
      note = 10

      uint8 = uint .size 1
      key-data-bytes = bytes .size 33
      chain-code-bytes = bytes .size 32
  `,
}) {
  data: MasterKeyProps | DeriveKeyProps

  constructor(input: HDKeyConstructorArgs) {
    super(input)

    // Check if this is a master key key or a derived key
    if (input.isMaster) {
      this.data = {
        isMaster: true,
        keyData: input.keyData,
        chainCode: input.chainCode,
      }
    } else {
      this.data = {
        isMaster: false,
        isPrivateKey: input.isPrivateKey, // By default it is false
        keyData: input.keyData,
        chainCode: input.chainCode,
        useInfo: input.useInfo,
        origin: input.origin,
        children: input.children,
        parentFingerprint: input.parentFingerprint,
        name: input.name,
        note: input.note,
      }
    }
  }
  public getIsMaster = () => this.data.isMaster
  public getIsPrivateKey = () => {
    // Master key is always private
    if (this.getIsMaster()) return false
    return (this.data as DeriveKeyProps).isPrivateKey || false
  }
  public getKeyData = () => this.data.keyData
  public getChainCode = () => this.data.chainCode
  public getUseInfo = () => (this.data as DeriveKeyProps).useInfo
  public getOrigin = () => (this.data as DeriveKeyProps).origin
  public getChildren = () => (this.data as DeriveKeyProps).children
  public getParentFingerprint = () => (this.data as DeriveKeyProps).parentFingerprint
  public getName = () => (this.data as DeriveKeyProps).name
  public getNote = () => (this.data as DeriveKeyProps).note

  override verifyInput(input: HDKeyConstructorArgs): { valid: boolean; reasons?: Error[] } {
    const errors: Error[] = []

    if (typeof input.isMaster !== 'boolean') {
      errors.push(new Error('isMaster must be a boolean'))
    }
    if (!(input.keyData instanceof Uint8Array)) {
      errors.push(new Error('keyData must be a Buffer or Uint8Array'))
    }
    if (!(input.chainCode instanceof Uint8Array)) {
      errors.push(new Error('chainCode must be a Buffer or Uint8Array'))
    }
    if (input.isPrivateKey !== undefined && typeof input.isPrivateKey !== 'boolean') {
      errors.push(new Error('isPrivateKey must be a boolean'))
    }
    if (input.useInfo && !(input.useInfo instanceof CoinInfo)) {
      errors.push(new Error('useInfo must be an instance of CoinInfo'))
    }
    if (input.origin && !(input.origin instanceof Keypath)) {
      errors.push(new Error('origin must be an instance of Keypath'))
    }
    if (input.children &&  !(input.origin instanceof Keypath)) {
      errors.push(new Error('children must be an instance of Keypath'))
    }
    if (input.parentFingerprint) {
      // It needs to be an integer and bigger than 0 and maximum 32 bit size
      if (typeof input.parentFingerprint !== 'number' || input.parentFingerprint < 0 || input.parentFingerprint > 0xffffffff) {
        errors.push(new Error('parentFingerprint must be a positive integer (uint32)'))
      }
    }
    if (input.name && typeof input.name !== 'string') {
      errors.push(new Error('name must be a string'))
    }
    if (input.note && typeof input.note !== 'string') {
      errors.push(new Error('note must be a string'))
    }

    return {
      valid: errors.length === 0,
      reasons: errors.length > 0 ? errors : undefined,
    }
  }

  // TODO: add deserializeFromBIP32

//   function xpubToHdkey(xpub: string, xpubPath: string) {
//     // decode xpub from base58 to hex
//     const xpubHex = base58.decode(xpub);
//     // Generate path components from path
//     const pathComponents = generatePathComponentsFromPath(xpubPath);
  
//     // https://github.com/BlockchainCommons/Research/blob/master/papers/bcr-2020-007-hdkey.md
//     // zpub6rBVCActEAEGdH5TJVz3H3H1kBYxmB2AiKEnfFJSFeiKU4vBepoxwCqDBqrgkvmeiUUfvGSUrii7J5anRWgyk8kN63xpXWhpcF2Lgi4gpkE
//     // 4 byte: version bytes (mainnet: 0x0488B21E public, 0x0488ADE4 private; testnet: 0x043587CF public, 0x04358394 private)
//     // 1 byte: depth: 0x00 for master nodes, 0x01 for level-1 derived keys, ....
//     // 4 bytes: the fingerprint of the parent's key (0x00000000 if master key)
//     // 4 bytes: child number. This is ser32(i) for i in xi = xpar/i, with xi the key being serialized. (0x00000000 if master key)
//     // 32 bytes: the chain code
//     // 33 bytes: the public key or private key data (serP(K) for public keys, 0x00 || ser256(k) for private keys)
//     // 04b24746 03 75bb5468 80000000 529cb574542b8163f9f0a6bdc01180137350fdb50cf54186bffc067694d05d35 03fbd43643e702d2f9b7306345963ae77c49c5e2f6736d36b11db617918f8d28a4 c783598f
//     // First 4 bytes are version bytes
//     const versionBytes = xpubHex.slice(0, 4);
//     // Next byte is depth (1 byte)
//     const depth = xpubHex.slice(4, 5);
//     // Next 4 bytes are fingerprint
//     const fingerprint = xpubHex.slice(5, 9);
//     // Next 4 bytes are child number
//     const childNumber = xpubHex.slice(9, 13);
//     // Next 32 bytes are chain code
//     const chainCode = xpubHex.slice(13, 45);
//     // Next 33 bytes are public key
//     const publicKey = xpubHex.slice(45, 78);
//     // Next 4 bytes are checksum (last 4 bytes)
//     const checksum = xpubHex.slice(-4);
  
//     // Children path componentes for /0/* (wildcard)
//     const childrenPath = [
//       new PathComponent({ index: 0, hardened: false }),
//       new PathComponent({ index: undefined, hardened: false }),
//     ];
  
//     const xpubHdKeyParams = {
//       isMaster: false,
//       isPrivateKey: false,
//       key: Buffer.from(publicKey),
//       chainCode: Buffer.from(chainCode),
//       origin: new CryptoKeypath(
//         pathComponents,
//         Buffer.from(fingerprint),
//         depth[0]
//       ),
//       parentFingerprint: Buffer.from(fingerprint),
//       // Children path componentes for /0/* (wildcard)
//       children: new CryptoKeypath(childrenPath, Buffer.from(fingerprint)), // TODO check depth
//       //note: xpub,
//     };
  
//     // Lets Generate the xpubs HD KEY
//     const xpubHdKey = new CryptoHDKey(xpubHdKeyParams);
  
//     return xpubHdKey;  
// }