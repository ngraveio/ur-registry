import { HexString } from "../src";
import { CborEncoding, createFountainUrTranscoder, createUrTranscoder, globalUrRegistry, UrFountainDecoder } from '@ngraveio/bc-ur'

const { encoder, decoder } = createUrTranscoder()
const cbor = new CborEncoding();

describe("hex-string", () => {
  const hex = "babecafe8badf00d";
  const buff = Buffer.from(hex, "hex");

  const expectedCBOR = "D9010748BABECAFE8BADF00D".toLowerCase(); // Should we?
  const expectedUR = "ur:hex-string/taadatfdrdrnsgzelupmwtbtbtdsvlse";

  it("should generate hex-string from buffer", () => {

      // Create hex-string from buffer
      const hexString = new HexString(buff);

      // Convert it to cbor then hex
      const cborHex = cbor.encode(hexString).toString("hex");
      /**
       * CBOR should contain
       * 263(h'babecafe8badf00d')
       *
       * ```
       * D9 0107                # tag(263)
       *    48                  # bytes(8)
       *     BABECAFE8BADF00D # "\xBA\xBE\xCA\xFE+\xAD\xF0\r"
       * ```  
       */

      expect(cborHex).toBe(expectedCBOR);

      const ur = encoder.encodeUr(hexString)
      expect(ur).toBe(expectedUR);
  });

  it("should generate hex-string from hex string", () => {

      // Create hex-string from buffer
      const hexString = new HexString(hex);

      const cborHex = cbor.encode(hexString).toString("hex");
      expect(cborHex).toBe(expectedCBOR);

      const ur = encoder.encodeUr(hexString)
      expect(ur).toBe(expectedUR);
  });

  it("should decode hex-string from cbor", () => {
      const hexString = cbor.decode(Buffer.from(expectedCBOR, "hex"), HexString) as HexString;
      expect(hexString.toHex()).toBe(hex);
      
  });

  it("should decode hex-string from ur", () => {
      const hexString = decoder.decodeUr(expectedUR) as HexString;

      expect(hexString.type.URType).toBe("hex-string");
      expect(hexString.toHex()).toBe(hex);
  });    


  it("should encode and decode same buffer after QR flow", () => {
      // Create hex-string from buffer
      const hexString = new HexString(buff);

      // Convert it to cbor then hex
      const cborHex = cbor.encode(hexString).toString("hex");

      expect(cborHex).toBe(expectedCBOR);

      const ur = encoder.encodeUr(hexString);

      expect(ur).toBe(expectedUR);

      // Decode QR
      // const { fountainEncoderCreator, fountainDecoderCreator } = createFountainUrTranscoder();
      // const fountainDecoder = fountainDecoderCreator();

      // expect(fountainDecoder.receivePart(ur)).toEqual(true);
      // fountainDecoder.
      // const urDecoder = new URRegistryDecoder();
      // urDecoder.receivePart(ur);
      // const decodeHex = HexString.fromCBOR(urDecoder.resultUR().cbor);

      // expect(decodeHex.toHex()).toEqual(hex);
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


// describe("hex-string-old", () => {
//     const hex = "babecafe8badf00d";
//     const buff = Buffer.from(hex, "hex");

//     const expectedCBOR = "D9010748BABECAFE8BADF00D".toLowerCase(); // Should we?
//     const expectedUR = "ur:hex-string/taadatfdrdrnsgzelupmwtbtbtdsvlse";

//     it("should generate hex-string from buffer", () => {

//         // Create hex-string from buffer
//         const hexString = new HexString(buff);

//         // Convert it to cbor then hex
//         const cborHex = hexString.toCBOR().toString("hex");
//         /**
//          * CBOR should contain
//          * 263(h'babecafe8badf00d')
//          *
//          * ```
//          * D9 0107                # tag(263)
//          *    48                  # bytes(8)
//          *     BABECAFE8BADF00D # "\xBA\xBE\xCA\xFE+\xAD\xF0\r"
//          * ```  
//          */

//         expect(cborHex).toBe(expectedCBOR);

//         const ur = hexString.toUREncoder(1000).nextPart();

//         expect(ur).toBe(expectedUR);
//     });

//     it("should generate hex-string from hex string", () => {

//         // Create hex-string from buffer
//         const hexString = new HexString(hex);

//         const cborHex = hexString.toCBOR().toString("hex");
//         expect(cborHex).toBe(expectedCBOR);

//         const ur = hexString.toUREncoder(1000).nextPart();
//         expect(ur).toBe(expectedUR);
//     });

//     it("should decode hex-string from cbor", () => {
//         const hexString = HexString.fromCBOR(Buffer.from(expectedCBOR, "hex"));
//         expect(hexString.toHex()).toBe(hex);
        
//     });

//     it("should decode hex-string from ur", () => {
//         const decoded = URRegistryDecoder.decode(expectedUR);

//         const hexString = HexString.fromCBOR(decoded.cbor);

//         expect(hexString.getRegistryType().getType()).toBe("hex-string");
//         expect(hexString.toHex()).toBe(hex);
//         expect(hexString.toCBOR().toString("hex")).toBe(expectedCBOR);
//     });    


//     it("should encode and decode same buffer after QR flow", () => {
//         // Create hex-string from buffer
//         const hexString = new HexString(buff);

//         // Convert it to cbor then hex
//         const cborHex = hexString.toCBOR().toString("hex");

//         expect(cborHex).toBe(expectedCBOR);

//         const ur = hexString.toUREncoder(1000).nextPart();

//         expect(ur).toBe(expectedUR);

//         // Decode QR
//         const urDecoder = new URRegistryDecoder();
//         urDecoder.receivePart(ur);
//         const decodeHex = HexString.fromCBOR(urDecoder.resultUR().cbor);

//         expect(decodeHex.toHex()).toEqual(hex);
//     })

//     it("should remove starting 0x on string", () => {
//         const hexString = new HexString("0x" + hex);
//         expect(hexString.toHex()).toBe(hex);
//     });

//     // // Errors
//     // it("should throw error if not hex string", () => {
//     //     expect(() => {
//     //         new HexString("not hex");
//     //     }).toThrowError("Invalid hex string");
//     // });

//     // it("should throw error if string doesnt have even characters", () => {
//     //     expect(() => {
//     //         new HexString(hex + "0");
//     //     }).toThrowError("Invalid hex string");
//     // });

// });
