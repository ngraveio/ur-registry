import { registryItemFactory } from '@ngraveio/bc-ur'
import { Keypath } from './Keypath'
import { CoinInfo } from './CoinInfo'
import { base58 } from '@scure/base'
import { sha256 } from '@noble/hashes/sha256'

interface HDKeyArgs {
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

type MasterKeyProps = {
  isMaster: true
  keyData: Buffer
  chainCode: Buffer
}

type DeriveKeyProps = {
  isMaster?: false
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
  data: HDKeyArgs

  constructor(input: HDKeyArgs) {
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
        isMaster: input?.isMaster,
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

  /**
   * @returns {boolean} True if the key is a master key, otherwise false.
   */
  public getIsMaster = () => this.data.isMaster || false

  /**
   * @returns {boolean} True if the key is a private key, otherwise false.
   */
  public getIsPrivateKey = () => {
    // Master key is always private
    if (this.getIsMaster()) return false
    return (this.data as DeriveKeyProps).isPrivateKey || false
  }

  /**
   * @returns {Buffer} The key data.
   */
  public getKeyData = () => this.data.keyData

  /**
   * @returns {Buffer | undefined} The chain code.
   */
  public getChainCode = () => this.data.chainCode

  /**
   * @returns {CoinInfo | undefined} The coin information.
   */
  public getUseInfo = () => (this.data as DeriveKeyProps).useInfo

  /**
   * @returns {Keypath | undefined} The origin keypath.
   */
  public getOrigin = () => (this.data as DeriveKeyProps).origin

  /**
   * @returns {Keypath | undefined} The children keypath.
   */
  public getChildren = () => (this.data as DeriveKeyProps).children

  /**
   * @returns {number | undefined} The parent fingerprint.
   */
  public getParentFingerprint = () => (this.data as DeriveKeyProps).parentFingerprint

  /**
   * @returns {string | undefined} The name of the key.
   */
  public getName = () => (this.data as DeriveKeyProps).name

  /**
   * @returns {string | undefined} The note associated with the key.
   */
  public getNote = () => (this.data as DeriveKeyProps).note

  /**
   * Prepares the data for CBOR encoding.
   * @returns {any} The data prepared for CBOR encoding.
   * @throws {Error} If the input data is invalid.
   */
  override preCBOR(): any {
    const { valid, reasons } = this.verifyInput(this.data)
    if (!valid) {
      if (reasons && reasons.length > 0) {
        const reasonMessages = reasons
          .map(r => r.message ?? '')
          .filter(Boolean)
          .join(', ')
        throw new Error(`Invalid HDKey: ${reasonMessages}`)
      }
    }
    return super.preCBOR()
  }

  /**
   * Verifies the input data.
   * @param {HDKeyArgs} input - The input data to verify.
   * @returns {{ valid: boolean; reasons?: Error[] }} The verification result.
   */
  override verifyInput(input: HDKeyArgs): { valid: boolean; reasons?: Error[] } {
    const errors: Error[] = []

    if (input.isMaster !== undefined && typeof input.isMaster !== 'boolean') {
      errors.push(new Error('isMaster must be a boolean'))
    }
    if (!(input.keyData instanceof Uint8Array)) {
      errors.push(new Error('keyData must be a Buffer or Uint8Array'))
    }
    // If this is a master key, chainCode is required
    if (input.isMaster && !input.chainCode) {
      errors.push(new Error('chainCode is required for master key'))
    }
    if (input.chainCode && !(input.chainCode instanceof Uint8Array)) {
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
    if (input.children && !(input.children instanceof Keypath)) {
      errors.push(new Error('children must be an instance of Keypath'))
    }
    if (input.parentFingerprint !== undefined) {
      // It needs to be an integer and bigger than 0 and maximum 32 bit size
      if (typeof input.parentFingerprint !== 'number' || input.parentFingerprint < 0 || input.parentFingerprint > 0xffffffff) {
        errors.push(new Error('parentFingerprint must be a positive integer (uint32)'))
      }
      // Check if this is a master key
      if (input.isMaster) {
        errors.push(new Error('Master key cannot contain a parent fingerprint'))
      }
    }
    if (input.origin && input.origin.getComponents().length === 1 && input.origin.getSourceFingerprint() !== undefined) {
      if (input.parentFingerprint !== input.origin.getSourceFingerprint()) {
        errors.push(new Error('Parent fingerprint for single derivation path should match the source fingerprint of the origin keypath.'))
      }
    }
    if (input.useInfo && input.origin) {
      const components = input.origin.getComponents()
      if (components.length < 2) {
        errors.push(new Error('When BIP44 is specified, the derivation path should contain at least two components.'))
      } else if (components.length >= 2 && components[1].getIndex() !== input.useInfo.getType()) {
        errors.push(new Error('When BIP44 is specified, the derivation path should contain the coin type value.'))
      }
    }
    if (input.children) {
      const components = input.children.getComponents()
      if (components.some(component => component.isHardened()) && !input.isPrivateKey) {
        errors.push(new Error('Only a private key can have hardened children keys.'))
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

  /**
   * Creates an HDKey instance from an extended public key (xpub).
   * @param {string} xpub - The extended public key.
   * @param {{ xpubPath?: string; isPrivate?: boolean; sourceFingerprint?: number }} [params] - Optional parameters.
   * @returns {HDKey} The HDKey instance.
   * @throws {Error} If the xpub is invalid or inconsistent with the provided path.
   */
  static fromXpub(xpub: string, params?: { xpubPath?: string; isPrivate?: boolean; sourceFingerprint?: number }): HDKey {
    const { version: version, depth, parentFingerprint, childNumber, chainCode, keyData, checksum, isMaster } = HDKey.parseXpub(xpub)

    if (isMaster) {
      const masterKeyParams: MasterKeyProps = {
        isMaster: true,
        keyData: Buffer.from(keyData),
        chainCode: Buffer.from(chainCode),
      }
      // Lets Generate the master HD KEY
      return new HDKey(masterKeyParams)
    }

    // Otherwise its a derived key
    let origin: Keypath | undefined
    // Lets check consistency of the xpub
    if (params?.xpubPath) {
      const components = Keypath.pathToComponents(params.xpubPath)

      // Now lets check if the xpubPath is consistent with the xpub
      if (components.length !== depth) {
        throw new Error(`Provided path is not consistent with the xpub depth. Provided path: ${params.xpubPath}, xpub depth: ${depth}`)
      }

      // Check if child number is consistent with the xpub path
      const lastComponent = components[components.length - 1]
      const lastComponentIndex = lastComponent.getIndex() || 0
      const generatedChildNumber = lastComponent.isHardened() ? lastComponentIndex + 0x80000000 : lastComponentIndex
      if (generatedChildNumber !== childNumber) {
        throw new Error(`Provided path is not consistent with the xpub. Provided path child number: ${generatedChildNumber}, xpub child number: ${childNumber}`)
      }

      // Source fingerprint should be equal to the parent fingerprint of the xpub if depth is 1
      if (depth === 1 && params?.sourceFingerprint !== undefined && params?.sourceFingerprint !== parentFingerprint) {
        throw new Error(
          `Provided source fingerprint is not consistent with the xpub. Provided source fingerprint: ${params.sourceFingerprint}, xpub parent fingerprint: ${parentFingerprint}`
        )
      }

      origin = new Keypath({
        path: components,
        depth,
        sourceFingerprint: params.sourceFingerprint || undefined,
      })
    }

    let _isPrivate = false
    if (params?.isPrivate !== undefined) {
      _isPrivate = params.isPrivate
    } else {
      // Check by bitcoin version bytes
      // TODO: to support all coins we need to keep track of all the version bytes
      // TODO: get them from coininfo package
      _isPrivate = version.equals(BTCVersionBytes.MAINNET_XPRIV) || version.equals(BTCVersionBytes.TESTNET_XPRIV)
    }

    const xpubHdKeyParams: DeriveKeyProps = {
      // isMaster: false,
      // set it to undefined if true ( default value)
      isPrivateKey: _isPrivate ? true : undefined,
      keyData: Buffer.from(keyData),
      chainCode: Buffer.from(chainCode),
      origin,
      parentFingerprint: parentFingerprint,
      // children: new Keypath({ path: '/0/*' })
      //note: xpub,
      //name: xpub
    }

    // Lets Generate the xpubs HD KEY
    const xpubHdKey = new HDKey(xpubHdKeyParams)

    return xpubHdKey
  }

  /**
   * Converts the HDKey instance to an extended public key (xpub).
   * @param {{ versionBytes?: Buffer }} [params] - Optional parameters.
   * @returns {string} The extended public key.
   * @throws {Error} If the chain code or origin is missing.
   */
  toXpub(params?: { versionBytes?: Buffer }) {
    // If version bytes are provided use that otherwise, If masterkey or private key use xpriv otherwise use xpub
    const version = params?.versionBytes || (this.getIsMaster() || this.getIsPrivateKey() ? BTCVersionBytes.MAINNET_XPRIV : BTCVersionBytes.MAINNET_XPUB)

    // Check if chain code is present otherwise we cannot generate xpub
    if (this.getChainCode() == undefined || this.getOrigin() == undefined) {
      throw new Error('Cannot generate xpub without chain code or origin')
    }

    // Get the key data
    const keyData = this.getKeyData()
    // Get the chain code
    const chainCode = this.getChainCode()!

    // If its masterkey most of the values will be default
    if (this.getIsMaster()) {
      return HDKey.encodeXpub({
        version,
        depth: 0,
        parentFingerprint: Buffer.alloc(4).fill(0),
        childNumber: 0,
        chainCode,
        keyData,
      })
    }

    // Get the depth from the origin
    const depth = this.getOrigin()?.getDepth() || this.getOrigin()?.getComponents().length || 0

    // If depth is 1 then origin.sourceFingerprint must be same as parentFingerprint
    const parentFingerprint = this.getParentFingerprint() || 0

    // Childnumber is the last index of the origin path
    const lastIndex = this.getOrigin()?.getComponents().slice(-1)[0]
    // Now make sure last index is simple index and check if its hardened
    if (!lastIndex || !lastIndex.isIndexComponent()) {
      throw new Error('Invalid origin path, origin should exist and last index should be simple index')
    }
    const index = lastIndex.getIndex() || 0
    const childNumber = lastIndex.isHardened() ? index + 0x80000000 : index

    return HDKey.encodeXpub({
      version: version,
      depth,
      parentFingerprint: Buffer.alloc(4).fill(parentFingerprint),
      childNumber,
      chainCode,
      keyData,
    })
  }
  /**
   * Converts the HDKey instance to an extended public key (xpub).
   * @param {{ versionBytes?: Buffer }} [params] - Optional parameters.
   * @returns {string} The extended public key.
   * @throws {Error} If the chain code or origin is missing.
   */
  public getBip32Key(params?: { versionBytes?: Buffer }): ReturnType<HDKey['toXpub']> {
    return this.toXpub(params)
  }

  /**
   * Extracts the parent fingerprint from an extended public key (xpub).
   * @param {string} xpub - The extended public key.
   * @returns {number} The parent fingerprint.
   */
  static extractParentFingerprint(xpub: string): number {
    try {
      const { parentFingerprint } = HDKey.parseXpub(xpub)
      return parentFingerprint
    } catch (e) {
      console.warn('Error extracting parent fingerprint from xpub', e)
    }
    return 0
  }

  /**
   * Parses an extended public key (xpub).
   * @param {string} xpub - The extended public key.
   * @returns {{ version: Buffer; depth: number; parentFingerprint: number; childNumber: number; chainCode: Buffer; keyData: Buffer; checksum: Buffer; isMaster: boolean }} The parsed xpub components.
   * @throws {Error} If the checksum is invalid.
   */
  static parseXpub(xpub: string) {
    // decode xpub from base58 to hex
    const xpubHex = Buffer.from(base58.decode(xpub))

    // https://github.com/BlockchainCommons/Research/blob/master/papers/bcr-2020-007-hdkey.md
    // zpub6rBVCActEAEGdH5TJVz3H3H1kBYxmB2AiKEnfFJSFeiKU4vBepoxwCqDBqrgkvmeiUUfvGSUrii7J5anRWgyk8kN63xpXWhpcF2Lgi4gpkE
    // 4 byte: version bytes (mainnet: 0x0488B21E public, 0x0488ADE4 private; testnet: 0x043587CF public, 0x04358394 private)
    // 1 byte: depth: 0x00 for master nodes, 0x01 for level-1 derived keys, ....
    // 4 bytes: the fingerprint of the parent's key (0x00000000 if master key)
    // 4 bytes: child number. This is ser32(i) for i in xi = xpar/i, with xi the key being serialized. (0x00000000 if master key)
    // 32 bytes: the chain code
    // 33 bytes: the public key or private key data (serP(K) for public keys, 0x00 || ser256(k) for private keys)
    // 04b24746 03 75bb5468 80000000 529cb574542b8163f9f0a6bdc01180137350fdb50cf54186bffc067694d05d35 03fbd43643e702d2f9b7306345963ae77c49c5e2f6736d36b11db617918f8d28a4 c783598f
    // First 4 bytes are version bytes
    const version = xpubHex.slice(0, 4)
    // Next byte is depth (1 byte)
    const depth = xpubHex.slice(4, 5).readInt8(0)
    // Next 4 bytes are fingerprint
    const parentFingerprint = xpubHex.slice(5, 9).readUInt32BE(0)
    // Next 4 bytes are child number
    const childNumber = xpubHex.slice(9, 13).readUInt32BE(0)
    // Next 32 bytes are chain code
    const chainCode = xpubHex.slice(13, 45)
    // Next 33 bytes are public key
    const keyData = xpubHex.slice(45, 78)
    // Next 4 bytes are checksum (last 4 bytes)
    const checksum = xpubHex.slice(-4)

    // Verify checksum
    const calculatedChecksum = sha256(sha256(xpubHex.slice(0, -4))).subarray(0, 4)
    if (!checksum.equals(calculatedChecksum)) {
      throw new Error('Invalid checksum for xpub')
    }

    // Check if this is a master key key or a derived key
    const isMaster = depth === 0

    // TODO: check version bytes to determine if its private or public key
    // But this will only work for bitcoin in this case

    // #define MAINNET_XPUB    0x0488B21E
    // #define MAINNET_XPRIV   0x0488ADE4
    // #define TESTNET_XPUB    0x043587CF
    // #define TESTNET_XPRIV   0x04358394
    // bool isPrivate = (version == MAINNET_XPRIV || version == TESTNET_XPRIV);
    // bool isPublic = (version == MAINNET_XPUB || version == TESTNET_XPUB);

    return {
      version,
      depth,
      parentFingerprint,
      childNumber,
      chainCode,
      keyData,
      checksum,
      isMaster,
    }
  }

  /**
   * Encodes the components into an extended public key (xpub).
   * @param {{ version: Buffer; depth: number; parentFingerprint: Buffer; childNumber: number; chainCode: Buffer; keyData: Buffer }} params - The components to encode.
   * @returns {string} The encoded extended public key.
   */
  static encodeXpub({
    version,
    depth,
    parentFingerprint,
    childNumber,
    chainCode,
    keyData,
  }: {
    version: Buffer
    depth: number
    parentFingerprint: Buffer
    childNumber: number // 4 bytes
    chainCode: Buffer // 32 bytes
    keyData: Buffer // 33 bytes
  }) {
    // Get the fingerprint
    const depthBytes = Buffer.alloc(4)
    depthBytes.writeUInt32BE(depth, 0)
    // Get the child number
    const childNumberBytes = Buffer.alloc(4)
    childNumberBytes.writeUInt32BE(childNumber, 0)

    // Concat all the bytes
    const xpubBytes = Buffer.concat([version, depthBytes, parentFingerprint, childNumberBytes, chainCode, keyData])

    // Calculate checksum
    const checksum = sha256(sha256(xpubBytes)).subarray(0, 4)

    // Add checksum to xpub
    const xpubWithChecksum = Buffer.concat([xpubBytes, checksum])

    // Encode xpub to base58
    const xpub = base58.encode(xpubWithChecksum)

    return xpub
  }
}

// https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki#serialization-format
const BTCVersionBytes = {
  MAINNET_XPUB: Buffer.from('0x0488B21E', 'hex'),
  MAINNET_XPRIV: Buffer.from('0x0488ADE4', 'hex'),
  TESTNET_XPUB: Buffer.from('0x043587CF', 'hex'),
  TESTNET_XPRIV: Buffer.from('0x04358394', 'hex'),
}
