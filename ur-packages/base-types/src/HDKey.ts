import { registryItemFactory, UrRegistry } from "@ngraveio/bc-ur";
import { CryptoKeypath } from './CryptoKeypath';

export class HDKey extends registryItemFactory({
  tag: 40303, // Updated CBOR tag
  URType: "hdkey", // Updated UR Type
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
      hdkey = #6.40303({
          isMaster: bool,
          ? isPrivateKey: bool,
          keyData: bstr,
          chainCode: bstr,
          ? useInfo: cryptoCoinInfo,
          ? origin: cryptoKeypath,
          ? children: [* cryptoKeypath],
          ? parentFingerprint: bstr .size 4,
          ? name: text,
          ? note: text
      })
  
      isMaster = 1
      isPrivateKey = 2
      keyData = 3
      chainCode = 4
      useInfo = 5
      origin = 6
      children = 7
      parentFingerprint = 8
      name = 9
      note = 10
  `,
}) {
  constructor(
    isMaster: boolean,
    keyData: Buffer,
    chainCode: Buffer,
    isPrivateKey?: boolean,
    useInfo?: CryptoCoinInfo,
    origin?: CryptoKeypath,
    children?: CryptoKeypath[],
    parentFingerprint?: Buffer,
    name?: string,
    note?: string,
  ) {
    // Pass a data object
    super({ isMaster, keyData, chainCode, isPrivateKey, useInfo, origin, children, parentFingerprint, name, note });
  }

  public getIsMaster = () => this.data.isMaster;
  public getIsPrivateKey = () => this.data.isPrivateKey;
  public getKeyData = () => this.data.keyData;
  public getChainCode = () => this.data.chainCode;
  public getUseInfo = () => this.data.useInfo;
  public getOrigin = () => this.data.origin;
  public getChildren = () => this.data.children;
  public getParentFingerprint = () => this.data.parentFingerprint;
  public getName = () => this.data.name;
  public getNote = () => this.data.note;

  override verifyInput(input: any): { valid: boolean; reasons?: Error[]; } {
    const errors: Error[] = [];

    if (typeof input.isMaster !== "boolean") {
      errors.push(new Error("isMaster must be a boolean"));
    }
    if (!Buffer.isBuffer(input.keyData)) {
      errors.push(new Error("keyData must be a Buffer"));
    }
    if (!Buffer.isBuffer(input.chainCode)) {
      errors.push(new Error("chainCode must be a Buffer"));
    }
    if (input.isPrivateKey !== undefined && typeof input.isPrivateKey !== "boolean") {
      errors.push(new Error("isPrivateKey must be a boolean"));
    }
    if (input.useInfo && !(input.useInfo instanceof CryptoCoinInfo)) {
      errors.push(new Error("useInfo must be an instance of CryptoCoinInfo"));
    }
    if (input.origin && !(input.origin instanceof CryptoKeypath)) {
      errors.push(new Error("origin must be an instance of CryptoKeypath"));
    }
    if (input.children && !Array.isArray(input.children)) {
      errors.push(new Error("children must be an array"));
    }
    if (input.parentFingerprint && !Buffer.isBuffer(input.parentFingerprint)) {
      errors.push(new Error("parentFingerprint must be a Buffer"));
    }
    if (input.name && typeof input.name !== "string") {
      errors.push(new Error("name must be a string"));
    }
    if (input.note && typeof input.note !== "string") {
      errors.push(new Error("note must be a string"));
    }

    return {
      valid: errors.length === 0,
      reasons: errors.length > 0 ? errors : undefined,
    };
  }

  /**
   * We need to override this method because class expects multiple arguments instead of an object
   */
  static override fromCBORData(val: any, allowKeysNotInMap?: boolean, tagged?: any) {
    // Do some post processing data coming from the cbor decoder
    const data = this.postCBOR(val, allowKeysNotInMap);

    // Return an instance of the generated class
    return new this(data.isMaster, data.keyData, data.chainCode, data.isPrivateKey, data.useInfo, data.origin, data.children, data.parentFingerprint, data.name, data.note);
  }
}

// Save to the registry
UrRegistry.addItem(HDKey);