import { registryItemFactory, UrRegistry } from "@ngraveio/bc-ur";
import { ECKey } from './ECKey';
import { HDKey } from './HDKey';
import { MultiKey } from './MultiKey';
import { ScriptExpression, ScriptExpressions } from './ScriptExpression';

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
    keys?: (HDKey | ECKey | MultiKey)[],
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

  private _toOutputDescriptor = (seIndex: number): string => {
    if (seIndex >= this.data.keys.length) {
      return this.data.keys[seIndex].getOutputDescriptorContent();
    } else {
      return `${this.data.keys[seIndex].getExpression()}(${this._toOutputDescriptor(seIndex + 1)})`;
    }
  };

  public override toString = () => {
    return this._toOutputDescriptor(0);
  };

  toDataItem = () => {
    let dataItem = this.data.keys.toDataItem();
    if (
      this.data.keys instanceof ECKey ||
      this.data.keys instanceof HDKey
    ) {
      dataItem.setTag(this.data.keys.getRegistryType().getTag());
    }

    const clonedSe = [...this.data.keys];

    clonedSe.reverse().forEach((se) => {
      const tagValue = se.getTag();
      if (dataItem.getTag() === undefined) {
        dataItem.setTag(tagValue);
      } else {
        dataItem = new DataItem(dataItem, tagValue);
      }
    });

    return dataItem;
  };

  public static fromDataItem = (dataItem: DataItem) => {
    const scriptExpressions: ScriptExpression[] = [];
    let _dataItem = dataItem;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      let _tag = _dataItem.getTag();
      const se = ScriptExpression.fromTag(_tag as number);
      if (se) {
        scriptExpressions.push(se);
        if (_dataItem.getData() instanceof DataItem) {
          _dataItem = _dataItem.getData();
          _tag = _dataItem.getTag();
        } else {
          break;
        }
      } else {
        break;
      }
    }
    const seLength = scriptExpressions.length;
    const isMultiKey =
      seLength > 0 &&
      (scriptExpressions[seLength - 1].getExpression() ===
        ScriptExpressions.MULTISIG.getExpression() ||
        scriptExpressions[seLength - 1].getExpression() ===
        ScriptExpressions.SORTED_MULTISIG.getExpression());
    //TODO: judge is multi key by scriptExpressions
    if (isMultiKey) {
      const multiKey = MultiKey.fromDataItem(_dataItem);
      return new OutputDescriptor(scriptExpressions, multiKey);
    }

    if (_dataItem.getTag() === RegistryTypes.CRYPTO_HDKEY.getTag()) {
      const cryptoHDKey = HDKey.fromDataItem(_dataItem);
      return new OutputDescriptor(scriptExpressions, cryptoHDKey);
    } else {
      const cryptoECKey = ECKey.fromDataItem(_dataItem);
      return new OutputDescriptor(scriptExpressions, cryptoECKey);
    }
  };

  public static fromCBOR = (_cborPayload: Buffer) => {
    const dataItem = decodeToDataItem(_cborPayload);
    return OutputDescriptor.fromDataItem(dataItem);
  };
}

// Save to the registry
UrRegistry.addItem(OutputDescriptor);