import { Ur } from "@ngraveio/bc-ur";
import { CoinInfo } from "../src/index";

describe("CoinInfo", () => {
  it("should create an instance with default values", () => {
    const coinInfo = new CoinInfo();
    expect(coinInfo.getType()).toBe(1);
    expect(coinInfo.getNetwork()).toBe(0);
  });

  it("should create an instance with specified values", () => {
    const coinInfo = new CoinInfo(2, 1);
    expect(coinInfo.getType()).toBe(2);
    expect(coinInfo.getNetwork()).toBe(1);
  });

  it("should validate input correctly", () => {
    const coinInfo = new CoinInfo();
    expect(coinInfo.verifyInput({ type: 1, network: 1 }).valid).toBe(true);
    expect(coinInfo.verifyInput({ type: -1, network: 1 }).valid).toBe(false);
    expect(coinInfo.verifyInput({ type: 1, network: -1 }).valid).toBe(false);
  });

  it("should create an instance from CBOR data", () => {
    const data = new Map([[1, 3], [2, 0]]);
    const coinInfo = CoinInfo.fromCBORData(data);
    expect(coinInfo.getType()).toBe(3);
    expect(coinInfo.getNetwork()).toBe(0);
  });

  it("should create correct UR and CBOR", () => {
    const coinInfo = new CoinInfo(2, 1);
    const ur = coinInfo.toUr();
    expect(ur.toString()).toBe("ur:coin-info/oeadaoaoadeysftnwk");
    expect(ur.getPayloadHex()).toBe("a201020201");
  })

  it("should create an instance from UR", () => {
    const ur = "ur:coin-info/oeadaoaoadeysftnwk";
    const coinInfo = Ur.fromString(ur).decode() as CoinInfo;
    expect(coinInfo.getType()).toBe(2);
    expect(coinInfo.getNetwork()).toBe(1);
  });

  it.skip("should create instance from CBOR", () => {
    const cbor = Buffer.from("a201020201", "hex");
    const coinInfo = Ur.fromCbor({type: 'coin-info', payload: cbor}).decode() as CoinInfo;
    expect(coinInfo.getType()).toBe(2);
    expect(coinInfo.getNetwork()).toBe(1);
  })
});
