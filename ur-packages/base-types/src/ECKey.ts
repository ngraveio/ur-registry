import { registryItemFactory, UrRegistry } from "@ngraveio/bc-ur";

export class ECKey extends registryItemFactory({
  tag: 40306, // Updated CBOR tag
  URType: "eckey", // Updated UR Type
  keyMap: {
    curve: 1,
    privateKey: 2,
    data: 3,
  },
  CDDL: `
      eckey = #6.40306({
          curve: uint,
          ? privateKey: bool,
          data: bstr
      })
  
      curve = 1
      privateKey = 2
      data = 3
  `,
}) {
  constructor(
    data: Buffer,
    curve?: number,
    privateKey?: boolean,
  ) {
    // Pass a data object
    super({ data, curve, privateKey });
  }

  public getCurve = () => this.data.curve || 0;
  public isPrivateKey = () => this.data.privateKey || false;
  public getData = () => this.data.data;

  override verifyInput(input: any): { valid: boolean; reasons?: Error[]; } {
    const errors: Error[] = [];

    if (!Buffer.isBuffer(input.data)) {
      errors.push(new Error("data must be a Buffer"));
    }
    if (input.curve !== undefined && typeof input.curve !== "number") {
      errors.push(new Error("curve must be a number"));
    }
    if (input.privateKey !== undefined && typeof input.privateKey !== "boolean") {
      errors.push(new Error("privateKey must be a boolean"));
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
    return new this(data.data, data.curve, data.privateKey);
  }
}

// Save to the registry
UrRegistry.addItem(ECKey);