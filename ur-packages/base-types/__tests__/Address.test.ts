import { Ur } from "@ngraveio/bc-ur";
import { CoinInfo, Address, AddressScriptType } from "../src/index";


describe("Address", () => {

  describe('Etheruem', () => {

    it('should create an testnet ethereum adress', () => {
      const payload = Buffer.from("81b7e08f65bdf5648606c89998a9cc8164397647", "hex");

      const address = new Address({
        data: payload,
        info: new CoinInfo(60, 1),
      });

      // Expect the type to be ethereum
      expect(address.getAddressInfo().getType()).toBe(60);
      // Expect the network to be testnet
      expect(address.getAddressInfo().getNetwork()).toBe(1);
    });

    it("should create correct UR and CBOR with default values", () => {
      const payload = Buffer.from("81b7e08f65bdf5648606c89998a9cc8164397647", "hex");

      const address = new Address({
        data: payload,
        info: new CoinInfo(60, 1),
      });

      const ur = address.toUr();
      const hex = ur.getPayloadHex();

      /**
        {
          1: 40305({ / info: coininfo [BCR-2020-007] /
            1: 60, / type: coin-type-eth (0x3c) [BCR-2020-007] /
            2: 1 / network: testnet-eth-ropsten [BCR-2020-007] /
          }),
          3: h'81b7e08f65bdf5648606c89998a9cc8164397647' / data /
        }
      */
      const expectedHex = "a201d99d71a201183c0201035481b7e08f65bdf5648606c89998a9cc8164397647";
      const expectedUr = "ur:address/oeadtantjsoeadcsfnaoadaxghlyrlvtmyihryykielnamspnlmkptsflyieeskoflkovdfdlb";

      expect(hex).toBe(expectedHex);
      expect(ur.toString()).toBe(expectedUr);
    });

    it("should create correct instance from address testnet", () => {
      const address = Address.fromAddress("0x81b7E08F65Bdf5648606c89998A9CC8164397647");

      // Expect the type to be ethereum
      expect(address.getAddressInfo().getType()).toBe(60);
      // Expect the network to be testnet
      expect(address.getAddressInfo().getNetwork()).toBe(1);
    });

    it("should create correct address string", () => {
      const payload = Buffer.from("81b7e08f65bdf5648606c89998a9cc8164397647", "hex");

      const address = new Address({
        data: payload,
        info: new CoinInfo(60, 1),
      });

      // Expect the default type to be ethereum
      expect(address.toAddress()).toBe("0x81b7E08F65Bdf5648606c89998A9CC8164397647");
    });

  });

  describe('Bitcoin', () => {
    it("should create an mainnet bitcoin address with default value", () => {
      const payload = Buffer.from("77bff20c60e522dfaa3350c39b030a5d004e839a", "hex");
  
      // By default, it should be a P2PKH address and mainnet but should not encode that to cbor
      const address = new Address({
        data: payload,
      });
  
      // Expect the default type to be bitcoin
      expect(address.getAddressInfo().getType()).toBe(0);
      // Expect the default network to be mainnet
      expect(address.getAddressInfo().getNetwork()).toBe(0);
      // Expect the default script type to be P2PKH
      expect(address.getAddressScriptType()).toBe(AddressScriptType.P2PKH);
    });

    it("should create correct UR and CBOR with default values", () => {
      const payload = Buffer.from("77bff20c60e522dfaa3350c39b030a5d004e839a", "hex");

      // By default, it should be a P2PKH address and mainnet
      const address = new Address({
        data: payload,
      });

      const ur = address.toUr();
      const hex = ur.getPayloadHex();

      /**
        {
          3: h'77bff20c60e522dfaa3350c39b030a5d004e839a' ; data
        }
      */
      const expectedHex = "a1035477bff20c60e522dfaa3350c39b030a5d004e839a";
      const expectedUr = "ur:address/oyaxghktrswzbnhnvwcpurpkeogdsrndaxbkhlaegllsnyolrsemgu";

      expect(hex).toBe(expectedHex);
      expect(ur.toString()).toBe(expectedUr);
    });

    it("should create correct instance from UR P2PKH", () => {
      const ur = Ur.fromString("ur:address/oyaxghktrswzbnhnvwcpurpkeogdsrndaxbkhlaegllsnyolrsemgu");

      const address = ur.decode() as Address;

      expect(address instanceof Address).toBe(true);
      // Expect the default type to be bitcoin
      expect(address.getAddressInfo().getType()).toBe(0);
      // Expect the default network to be mainnet
      expect(address.getAddressInfo().getNetwork()).toBe(0);
      // Expect the default script type to be P2PKH
      expect(address.getAddressScriptType()).toBe(AddressScriptType.P2PKH);
    });


    describe('to/from address string', () => {
      it("should create correct address string with default values", () => {
        const payload = Buffer.from("77bff20c60e522dfaa3350c39b030a5d004e839a", "hex");
    
        // By default, it should be a P2PKH address and mainnet but should not encode that to cbor
        const address = new Address({
          data: payload,
        });
    
        // Expect the default type to be bitcoin
        expect(address.toAddress()).toBe("1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2");
      });
  
      it("should create correct instance from address mainnet P2PKH", () => {
        const address = Address.fromAddress("1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2");
  
        // Expect the default type to be bitcoin
        expect(address.getAddressInfo().getType()).toBe(0);
        // Expect the default network to be mainnet
        expect(address.getAddressInfo().getNetwork()).toBe(0);
        // Expect the default script type to be P2PKH
        expect(address.getAddressScriptType()).toBe(AddressScriptType.P2PKH);      
        // Verify .toAddress()
        expect(address.toAddress()).toBe("1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2");
      });

      it("should create correct instance from address testnet P2PKH", () => {
        const address = Address.fromAddress("ms5e572mZ1eDKdeyfR6MpRqXHVv6kM6wAP");
  
        // Expect the default type to be bitcoin
        expect(address.getAddressInfo().getType()).toBe(0);
        // Expect the default network to be testnet
        expect(address.getAddressInfo().getNetwork()).toBe(1);
        // Expect the default script type to be P2PKH
        expect(address.getAddressScriptType()).toBe(AddressScriptType.P2PKH);      
        // Verify .toAddress()
        expect(address.toAddress()).toBe("ms5e572mZ1eDKdeyfR6MpRqXHVv6kM6wAP");
      });

      it("should create correct instance from address mainnet P2SH", () => {
        const address = Address.fromAddress("3FymWfwDaGzsRWesK47nxFWPDiDmkC8GkR");
  
        // Expect the default type to be bitcoin
        expect(address.getAddressInfo().getType()).toBe(0);
        // Expect the default network to be mainnet
        expect(address.getAddressInfo().getNetwork()).toBe(0);
        // Expect the default script type to be P2SH
        expect(address.getAddressScriptType()).toBe(AddressScriptType.P2SH);      
        // Verify .toAddress()
        expect(address.toAddress()).toBe("3FymWfwDaGzsRWesK47nxFWPDiDmkC8GkR");
      });

      it("should create correct instance from address testnet P2SH", () => {
        const address = Address.fromAddress("2MvJq3ieuKUiwvQP1WVQdfb5WB5fMStTkhH");
  
        // Expect the default type to be bitcoin
        expect(address.getAddressInfo().getType()).toBe(0);
        // Expect the default network to be testnet
        expect(address.getAddressInfo().getNetwork()).toBe(1);
        // Expect the default script type to be P2SH
        expect(address.getAddressScriptType()).toBe(AddressScriptType.P2SH);      
        // Verify .toAddress()
        expect(address.toAddress()).toBe("2MvJq3ieuKUiwvQP1WVQdfb5WB5fMStTkhH");
      });

      it("should create correct instance from address mainnet P2WPKH", () => {
        const address = Address.fromAddress("bc1q26mhhmkkddq9zd66fec6tac2lp07c7uuaurgtr");
  
        // Expect the default type to be bitcoin
        expect(address.getAddressInfo().getType()).toBe(0);
        // Expect the default network to be mainnet
        expect(address.getAddressInfo().getNetwork()).toBe(0);
        // Expect the default script type to be P2WPKH
        expect(address.getAddressScriptType()).toBe(AddressScriptType.P2WPKH);      
        // Verify .toAddress()
        expect(address.toAddress()).toBe("bc1q26mhhmkkddq9zd66fec6tac2lp07c7uuaurgtr");
      });

      it("should create correct instance from address testnet P2WPKH", () => {
        const address = Address.fromAddress("tb1q0mt7t7sjn777f4mgpk7u67a82aykkw3kq4kaad");
  
        // Expect the default type to be bitcoin
        expect(address.getAddressInfo().getType()).toBe(0);
        // Expect the default network to be testnet
        expect(address.getAddressInfo().getNetwork()).toBe(1);
        // Expect the default script type to be P2WPKH
        expect(address.getAddressScriptType()).toBe(AddressScriptType.P2WPKH);      
        // Verify .toAddress()
        expect(address.toAddress()).toBe("tb1q0mt7t7sjn777f4mgpk7u67a82aykkw3kq4kaad");
      });

      it("should create correct instance from address mainnet P2WSH", () => {
        const address = Address.fromAddress("bc1q6axwlnwlky7jykqqwlrcjy2s6ragcwaesal0nfpv5pnwdmgu72es5kywz8");
  
        // Expect the default type to be bitcoin
        expect(address.getAddressInfo().getType()).toBe(0);
        // Expect the default network to be mainnet
        expect(address.getAddressInfo().getNetwork()).toBe(0);
        // Expect the default script type to be P2WSH
        expect(address.getAddressScriptType()).toBe(AddressScriptType.P2WSH);      
        // Verify .toAddress()
        expect(address.toAddress()).toBe("bc1q6axwlnwlky7jykqqwlrcjy2s6ragcwaesal0nfpv5pnwdmgu72es5kywz8");
      });

      it("should create correct instance from address testnet P2WSH", () => {
        const address = Address.fromAddress("tb1qwjnw4rf07n8wyerlnplyeecpfkw5q2puqn0vux04kqpdu689qx0qx6uqvj");
  
        // Expect the default type to be bitcoin
        expect(address.getAddressInfo().getType()).toBe(0);
        // Expect the default network to be testnet
        expect(address.getAddressInfo().getNetwork()).toBe(1);
        // Expect the default script type to be P2WSH
        expect(address.getAddressScriptType()).toBe(AddressScriptType.P2WSH);      
        // Verify .toAddress()
        expect(address.toAddress()).toBe("tb1qwjnw4rf07n8wyerlnplyeecpfkw5q2puqn0vux04kqpdu689qx0qx6uqvj");
      });

      it("should create correct instance from address mainnet P2TR", () => {
        const address = Address.fromAddress("bc1p9cjtuu7rlytzgeuwtdy4fuflmpp00tmpwchr7xjdexs5la94frkqpmcs8f");
  
        // Expect the default type to be bitcoin
        expect(address.getAddressInfo().getType()).toBe(0);
        // Expect the default network to be mainnet
        expect(address.getAddressInfo().getNetwork()).toBe(0);
        // Expect the default script type to be P2TR
        expect(address.getAddressScriptType()).toBe(AddressScriptType.P2TR);      
        // Verify .toAddress()
        expect(address.toAddress()).toBe("bc1p9cjtuu7rlytzgeuwtdy4fuflmpp00tmpwchr7xjdexs5la94frkqpmcs8f");
      });

      it("should create correct instance from address testnet P2TR", () => {
        const address = Address.fromAddress("tb1p34jjsay897lryzkc0fkxk9wruhvct6vnmknxxaxy75rxnpakqlqs56v2lh");
  
        // Expect the default type to be bitcoin
        expect(address.getAddressInfo().getType()).toBe(0);
        // Expect the default network to be testnet
        expect(address.getAddressInfo().getNetwork()).toBe(1);
        // Expect the default script type to be P2TR
        expect(address.getAddressScriptType()).toBe(AddressScriptType.P2TR);      
        // Verify .toAddress()
        expect(address.toAddress()).toBe("tb1p34jjsay897lryzkc0fkxk9wruhvct6vnmknxxaxy75rxnpakqlqs56v2lh");
      });



    });

  });




});