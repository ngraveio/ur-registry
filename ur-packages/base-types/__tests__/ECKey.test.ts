import { ECKey } from "../src/ECKey";
import { Ur } from "@ngraveio/bc-ur";

describe("ECKey", () => {
  it("should create an instance with default values", () => {
    const ecKey = new ECKey({ data: Buffer.from("8c05c4b4f3e88840a4f4b5f155cfd69473ea169f3d0431b7a6787a23777f08aa", "hex") });
    expect(ecKey.getCurve()).toBe(0);
    expect(ecKey.getIsPrivate()).toBe(false);
    expect(ecKey.getData().toString("hex")).toBe("8c05c4b4f3e88840a4f4b5f155cfd69473ea169f3d0431b7a6787a23777f08aa");
  });

  it("should create an instance with specified values", () => {
    const ecKey = new ECKey({ data: Buffer.from("8c05c4b4f3e88840a4f4b5f155cfd69473ea169f3d0431b7a6787a23777f08aa", "hex"), curve: 0, isPrivate: true });
    expect(ecKey.getCurve()).toBe(0);
    expect(ecKey.getIsPrivate()).toBe(true);
    expect(ecKey.getData().toString("hex")).toBe("8c05c4b4f3e88840a4f4b5f155cfd69473ea169f3d0431b7a6787a23777f08aa");
  });

  it("should create correct UR and CBOR for private key", () => {
    const ecKey = new ECKey({ data: Buffer.from("8c05c4b4f3e88840a4f4b5f155cfd69473ea169f3d0431b7a6787a23777f08aa", "hex"), isPrivate: true });
    const ur = ecKey.toUr();
    const expectedUR = "ur:eckey/oeaoykaxhdcxlkahssqzwfvslofzoxwkrewngotktbmwjkwdcmnefsaaehrlolkskncnktlbaypkrphsmyid";
    const expectedCBOR = "a202f50358208c05c4b4f3e88840a4f4b5f155cfd69473ea169f3d0431b7a6787a23777f08aa";
    expect(ur.toString()).toBe(expectedUR);
    expect(ur.getPayloadHex()).toBe(expectedCBOR);
  });

  it("should create correct UR and CBOR for public key", () => {
    const ecKey = new ECKey({ data: Buffer.from("03bec5163df25d8703150c3a1804eac7d615bb212b7cc9d7ff937aa8bd1c494b7f", "hex") });
    const ur = ecKey.toUr();
    const expectedUR = "ur:eckey/oyaxhdclaxrnskcmfswzhlltaxbzbnftcsaawdsttbbzrkcldnkesotszmmuknpdrycegagrlbemdevtlp";
    const expectedCBOR = "a103582103bec5163df25d8703150c3a1804eac7d615bb212b7cc9d7ff937aa8bd1c494b7f";
    expect(ur.toString()).toBe(expectedUR);
    expect(ur.getPayloadHex()).toBe(expectedCBOR);
  });


  it("should handle invalid UR gracefully", () => {
    const invalidUr = "ur:eckey/invalid";
    expect(() => Ur.fromString(invalidUr).decode()).toThrow();
  });

  it("should handle empty CBOR data", () => {
    const emptyCbor = Buffer.from("", "hex");
    expect(() => Ur.fromCbor({ type: 'eckey', payload: emptyCbor }).decode()).toThrow();
  });
});