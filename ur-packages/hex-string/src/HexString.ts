import {
    extend,
    DataItem,
    RegistryItem,
  } from "@keystonehq/bc-ur-registry";
import { ExtendedRegistryTypes } from "./RegistryType";

const { decodeToDataItem } = extend;


/**
 * 
 * Encodes as bytes but is not decoded upon reading. 
 * Must be treated as a string of hex characters.
 * 
 * https://github.com/toravir/CBOR-Tag-Specs/blob/master/hexString.md
 * 
 * Tag 263 can be applied to a byte string (major type 2) to indicate that the byte string 
 * is a hexadecimal string - any normal string is stored as hexadecimal string, but this tag 
 * means that string is to be kept as hex format and does not mean anything to convert to ASCII or anything.
 * 
 */

export class HexString extends RegistryItem {
  private data: Buffer;

  getRegistryType = () => ExtendedRegistryTypes.HEX_STRING;

  constructor(data: Buffer | string) {
    super();

    // Check if data is a string, if so, convert to buffer
    if (typeof data === "string") {
      // Check if string starts with 0x, if so, remove it
      if (data.startsWith("0x")) {
        data = data.slice(2);
      }
      // Check if string is even length, if not, add a 0 to the front
      if (data.length % 2 !== 0) {
        data = "0" + data;
      }
      this.data = Buffer.from(data, "hex");
    } else {
      this.data = data;
    }
  }

  public getData = () => this.data.toString("hex");
  public toHex = this.getData;

  public toDataItem = () => {
    return new DataItem(this.data, this.getRegistryType().getTag());
  };

  public static fromDataItem = (dataItem: DataItem) => {
    const data = dataItem.getData();

    return new HexString(data);
  };

  public static fromCBOR = (_cborPayload: Buffer) => {
    const dataItem = decodeToDataItem(_cborPayload);
    return HexString.fromDataItem(dataItem);
  };
}