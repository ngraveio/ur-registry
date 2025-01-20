import { registryItemFactory, UrRegistry } from "@ngraveio/bc-ur";

export class AccountDescriptor extends registryItemFactory({
  tag: 40311,
  URType: "account-descriptor",
  keyMap: {
    masterFingerprint: 1,
    account: 2,
    change: 3,
    addressIndex: 4,
  },
  CDDL: `
      account-descriptor = #6.40311({
          masterFingerprint: bstr .size 4,
          account: uint,
          change: bool,
          addressIndex: uint
      })
  
      masterFingerprint = 1
      account = 2
      change = 3
      addressIndex = 4
  `,
}) {
  constructor(
    masterFingerprint: Buffer,
    account: number,
    change: boolean,
    addressIndex: number
  ) {
    // Pass a data object
    super({ masterFingerprint, account, change, addressIndex });
  }

  public getMasterFingerprint = () => this.data.masterFingerprint;
  public getAccount = () => this.data.account;
  public getChange = () => this.data.change;
  public getAddressIndex = () => this.data.addressIndex;

  override verifyInput(input: any): { valid: boolean; reasons?: Error[]; } {
    const errors: Error[] = [];

    if (!Buffer.isBuffer(input.masterFingerprint) || input.masterFingerprint.length !== 4) {
      errors.push(new Error("MasterFingerprint must be a 4-byte Buffer"));
    }
    if (typeof input.account !== "number" || input.account < 0) {
      errors.push(new Error("Account must be a non-negative integer"));
    }
    if (typeof input.change !== "boolean") {
      errors.push(new Error("Change must be a boolean"));
    }
    if (typeof input.addressIndex !== "number" || input.addressIndex < 0) {
      errors.push(new Error("AddressIndex must be a non-negative integer"));
    }

    return {
      valid: errors.length === 0,
      reasons: errors.length > 0 ? errors : undefined,
    };
  }

  /**
   * We need to override this method because class expects 4 arguments instead of an object
   */
  static override fromCBORData(val: any, allowKeysNotInMap?: boolean, tagged?: any) {
    // Do some post processing data coming from the cbor decoder
    const data = this.postCBOR(val, allowKeysNotInMap);

    // Return an instance of the generated class
    return new this(data.masterFingerprint, data.account, data.change, data.addressIndex);
  }
}

// Save to the registry
UrRegistry.addItem(AccountDescriptor);