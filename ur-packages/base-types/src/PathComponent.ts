import { registryItemFactory, UrRegistry } from "@ngraveio/bc-ur";


// Q: this thing doesn't exist on https://github.com/BlockchainCommons/Research/blob/master/papers/bcr-2020-006-urtypes.md

export class PathComponent extends registryItemFactory({
  tag: 123321123321, // Assuming a new CBOR tag for PathComponent
  URType: "path-component", // Assuming a new UR Type for PathComponent
  keyMap: {
    index: 1,
    hardened: 2,
  },
  CDDL: `
      pathcomponent = #6.123321123321({
          index: uint,
          hardened: bool
      })
  
      index = 1
      hardened = 2
  `,
}) {
  constructor(
    index: number,
    hardened: boolean,
  ) {
    // Pass a data object
    super({ index, hardened });
  }

  public getIndex = () => this.data.index;
  public isHardened = () => this.data.hardened;

  override verifyInput(input: any): { valid: boolean; reasons?: Error[]; } {
    const errors: Error[] = [];

    if (typeof input.index !== "number") {
      errors.push(new Error("index must be a number"));
    }
    if (typeof input.hardened !== "boolean") {
      errors.push(new Error("hardened must be a boolean"));
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
    return new this(data.index, data.hardened);
  }
}

// Save to the registry
UrRegistry.addItem(PathComponent);