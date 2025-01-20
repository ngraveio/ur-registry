import { registryItemFactory, UrRegistry } from "@ngraveio/bc-ur";

export class Bytes extends registryItemFactory({
  tag: 303, // incorrect, for bytes we have "undefined"!
  URType: "bytes",
  keyMap: {
    data: 1,
  },
  CDDL: `
      bytes = #6.303({
          data: bstr
      })
  
      data = 1
`,
}) {
  constructor(data: Buffer) {
    // Pass a data object
    super({ data });
  }

  public getData = () => this.data.data;

  override verifyInput(input: any): { valid: boolean; reasons?: Error[]; } {
    // Check if data is a Buffer
    if (!Buffer.isBuffer(input.data)) {
      return {
        valid: false,
        reasons: [new Error("Data must be a Buffer")],
      };
    }

    return { valid: true };
  }

  /**
   * We need to override this method because class expects 1 argument instead of an object
   */
  static override fromCBORData(val: any, allowKeysNotInMap?: boolean, tagged?: any) {
    // Do some post processing data coming from the cbor decoder
    const data = this.postCBOR(val, allowKeysNotInMap);

    // Return an instance of the generated class
    return new this(data.data);
  }
}

// Save to the registry
UrRegistry.addItem(Bytes);