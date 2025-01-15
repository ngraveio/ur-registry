import { HexString } from "../src";
import { Ur, defaultEncoders, UrFountainDecoder, UrFountainEncoder } from '@ngraveio/bc-ur'

const cbor = defaultEncoders.cbor;

describe("hex-string", () => {
  const hex = "babecafe8badf00d";
  const buff = Buffer.from(hex, "hex");

  const expectedCBOR = "48babecafe8badf00d";
  const expectedUR = "ur:hex-string/fdrdrnsgzelupmwtbtjpryzsss";

  it("should generate hex-string from buffer", () => {

      // Create hex-string from buffer
      const hexString = new HexString(buff);

      // Convert it to cbor then hex
      const cborHex = hexString.toUr().getPayloadHex();
      // TODO: tag needs to be removed
      /**
       * CBOR should contain
       * h'babecafe8badf00d'
       *
       * ```
       *    48                  # bytes(8)
       *     BABECAFE8BADF00D # "\xBA\xBE\xCA\xFE+\xAD\xF0\r"
       * ```  
       */

      expect(cborHex).toBe(expectedCBOR);

      const ur = hexString.toUr().toString();
      expect(ur).toBe(expectedUR);
  });

  it("should generate hex-string from hex string", () => {

      // Create hex-string from buffer
      const hexString = new HexString(hex);

      const cborHex = hexString.toUr().getPayloadHex();
      expect(cborHex).toBe(expectedCBOR);

      const ur = hexString.toUr().toString();
      expect(ur).toBe(expectedUR);
  });

  it("should decode hex-string from cbor", () => {
    const cborData = Buffer.from(expectedCBOR, "hex");
    const hexString = cbor.decode(cborData, {enforceType: HexString}) as HexString;
    
    expect(hexString.toHex()).toBe(hex);
      
  });

  it("should decode hex-string from ur", () => {
      const hexString = Ur.fromString(expectedUR).decode() as HexString;

      expect(hexString.type.URType).toBe("hex-string");
      expect(hexString.toHex()).toBe(hex);
  });    


  it("should encode and decode same buffer after QR flow", () => {
      // Create hex-string from buffer
      const hexString = new HexString(buff);

      // Convert it to cbor then hex
      const cborHexUr = hexString.toUr();
      const cborHex = cborHexUr.getPayloadHex();

      expect(cborHex).toBe(expectedCBOR);
      expect(cborHexUr.toString()).toBe(expectedUR);

      // Encode for QR
      const encoder = new UrFountainEncoder(hexString);
      const fragments = encoder.getAllPartsUr(0.5);

      // Decode QR
      const decoder = new UrFountainDecoder(fragments);
      // Get decoded payload;
      const decodedHexString = decoder.getDecodedData();

      expect(decodedHexString.toHex()).toEqual(hex);
  })

  it("should remove starting 0x on string", () => {
      const hexString = new HexString("0x" + hex);
      expect(hexString.toHex()).toBe(hex);
  });

  // Errors
  it("should throw error if not hex string", () => {
      expect(() => {
          new HexString("not hex");
      }).toThrowError();
  });

  it("should throw error if not a string", () => {
      expect(() => {
        // @ts-ignore
          new HexString(123);
      }).toThrowError();
  });

});