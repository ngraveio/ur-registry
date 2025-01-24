import { Ur } from "@ngraveio/bc-ur";
import { CoinInfo, Network } from "../src/index";

describe("CoinInfo", () => {
  it("should create an instance with default values", () => {
    const coinInfo = new CoinInfo();
    expect(coinInfo.getType()).toBe(0);
    expect(coinInfo.getNetwork()).toBe(Network.mainnet);
  });

  it("should create an instance with specified values", () => {
    const coinInfo = new CoinInfo(2, Network.testnet);
    expect(coinInfo.getType()).toBe(2);
    expect(coinInfo.getNetwork()).toBe(Network.testnet);
  });

  it("should validate input correctly", () => {
    const coinInfo = new CoinInfo();
    expect(coinInfo.verifyInput({ type: 1, network: 1 }).valid).toBe(true);
    expect(coinInfo.verifyInput({ type: -1, network: 1 }).valid).toBe(false);
    expect(coinInfo.verifyInput({ type: 1, network: -1 }).valid).toBe(false);
  });

  it("should encode/decode BTC Mainnet to/from UR and CBOR correctly", () => {
    const coinInfo = new CoinInfo(0, Network.mainnet); // 0 is for BTC
    const ur = coinInfo.toUr();
    const hex = ur.getPayloadHex();
    const expectedHex = "a201000200";
    const expectedUr = "ur:coin-info/oeadaeaoaefggwfmbn";

    expect(hex).toBe(expectedHex);
    expect(ur.toString()).toBe(expectedUr);

    // Decoding UR
    const decodedUr = Ur.fromString(expectedUr);
    const decodedCBOR = decodedUr.getPayloadHex();

    expect(decodedUr.type).toBe('coin-info');
    expect(decodedCBOR).toBe(hex);

    // Decoding item      
    const decodedCoinInfo = decodedUr.decode() as CoinInfo;
    expect(decodedCoinInfo instanceof CoinInfo).toBe(true);
  });

  it("should encode/decode Ethereum to/from UR and CBOR correctly", () => {
    const coinInfo = new CoinInfo(60); // 60 is SLIP-44 for Ethereum
    const ur = coinInfo.toUr();
    const hex = ur.getPayloadHex();
    const expectedHex = "a101183c";
    const expectedUr = "ur:coin-info/oyadcsfnksdadlmd";

    expect(hex).toBe(expectedHex);
    expect(ur.toString()).toBe(expectedUr);

    // Decoding UR
    const decodedUr = Ur.fromString(expectedUr);
    const decodedCBOR = decodedUr.getPayloadHex();

    expect(decodedUr.type).toBe('coin-info');
    expect(decodedCBOR).toBe(hex);

    // Decoding item      
    const decodedCoinInfo = decodedUr.decode() as CoinInfo;
    expect(decodedCoinInfo instanceof CoinInfo).toBe(true);

  });

  it("should encode Ethereum Testnet (Ropsten) to UR and CBOR correctly", () => {
    const coinInfo = new CoinInfo(undefined, Network.testnet);
    const ur = coinInfo.toUr();
    const hex = ur.getPayloadHex();
    const expectedHex = "a10201";
    const expectedUr = "ur:coin-info/oyaoadidsgrfgy";

    expect(hex).toBe(expectedHex);
    expect(ur.toString()).toBe(expectedUr);

    // Decoding UR
    const decodedUr = Ur.fromString(expectedUr);
    const decodedCBOR = decodedUr.getPayloadHex();

    expect(decodedUr.type).toBe('coin-info');
    expect(decodedCBOR).toBe(hex);

    // Decoding item      
    const decodedCoinInfo = decodedUr.decode() as CoinInfo;
    expect(decodedCoinInfo instanceof CoinInfo).toBe(true);

  });

  it("should handle an empty CoinInfo instance", () => {
    const coinInfo = new CoinInfo(undefined, undefined);
    const ur = coinInfo.toUr();
    const hex = ur.getPayloadHex();
    const expectedHex = "a0";
    const expectedUr = "ur:coin-info/nbaatygsih";

    expect(hex).toBe(expectedHex);
    expect(ur.toString()).toBe(expectedUr);
  });

/*   it("should throw an error for unsupported UR decoding", () => {
    const ur = "ur:coin-info/oeadaeaoaefggwfmbn";
    expect(() => Ur.fromString(ur).decode()).toThrow("UR decoding not supported");
  }); */

  it("should create an instance from CBOR data", () => {
    const data = new Map([[1, 60], [2, 0]]);
    const coinInfo = CoinInfo.fromCBORData(data);
    expect(coinInfo.getType()).toBe(60);
    expect(coinInfo.getNetwork()).toBe(0);
  });

  it("should create an instance from UR", () => {
    const ur = "ur:coin-info/oyadcsfnksdadlmd";
    const coinInfo = Ur.fromString(ur).decode() as CoinInfo;
    expect(coinInfo.getType()).toBe(60);
    expect(coinInfo.getNetwork()).toBe(Network.mainnet);
  });

  it.skip("should create instance from CBOR", () => {
    const cbor = Buffer.from("a101183c", "hex");
    const coinInfo = Ur.fromCbor({ type: "coin-info", payload: cbor }).decode() as CoinInfo;
    expect(coinInfo.getType()).toBe(60);
    expect(coinInfo.getNetwork()).toBe(Network.mainnet);
  });
});