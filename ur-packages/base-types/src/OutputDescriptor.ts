import { registryItemFactory, UrRegistry } from "@ngraveio/bc-ur";
import { CryptoECKey } from './CryptoECKey';
import { HDKey } from './HDKey';
import { MultiKey } from './MultiKey';

export class OutputDescriptor extends registryItemFactory({
  tag: 40308, // Updated CBOR tag
  URType: "output-descriptor", // Updated UR Type
  keyMap: {
    source: 1,
    keys: 2,
    name: 3,
    note: 4,
  },
  CDDL: `
      outputdescriptor = #6.40308({
          source: text,       ; text descriptor with keys replaced by placeholders
          ? keys: [+key], ; array of keys corresponding to placeholders, omitted if source is a complete text descriptor with no placeholders
          ? name: text,       ; optional user-assigned name
          ? note: text        ; optional user-assigned note
      })
  
      source = 1
      keys = 2
      name = 3
      note = 4

      key = (
          hd-key /    ; BCR-2020-007
          ec-key /    ; BCR-2020-008
          address     ; BCR-2020-009
      )
  `,
}) {
  constructor(
    source: string,
    keys?: (HDKey | CryptoECKey | MultiKey)[],
    name?: string,
    note?: string,
  ) {
    // Pass a data object
    super({ source, keys, name, note });
  }

  public getSource = () => this.data.source;
  public getKeys = () => this.data.keys;
  public getName = () => this.data.name;
  public getNote = () => this.data.note;

  override verifyInput(input: any): { valid: boolean; reasons?: Error[]; } {
    const errors: Error[] = [];

    if (typeof input.source !== "string") {
      errors.push(new Error("Source must be a string"));
    }
    if (input.keys && !Array.isArray(input.keys)) {
      errors.push(new Error("Keys must be an array"));
    }
    if (input.name && typeof input.name !== "string") {
      errors.push(new Error("Name must be a string"));
    }
    if (input.note && typeof input.note !== "string") {
      errors.push(new Error("Note must be a string"));
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
    return new this(data.source, data.keys, data.name, data.note);
  }
}

// Save to the registry
UrRegistry.addItem(OutputDescriptor);