import { Keypath } from "../src/index";
import { PathComponent } from "../src/helpers/PathComponent";
import { UR } from "@ngraveio/bc-ur";

// TODO: add more test cases
describe("Keypath", () => {
  it("should create an instance with a single index", () => {
    const keypath = new Keypath({ path: "44'/0'/0'/0/0" });
    expect(keypath.toString()).toBe("44'/0'/0'/0/0");
  });

  it("should create an instance with a range", () => {
    const keypath = new Keypath({ path: "1-6h" });
    expect(keypath.toString()).toBe("1-6'");
  });

  it("should create an instance with a wildcard", () => {
    const keypath = new Keypath({ path: "44'/0'/0'/*" });
    expect(keypath.toString()).toBe("44'/0'/0'/*");
  });

  it("should create an instance with a pair", () => {
    const keypath = new Keypath({ path: "<0h;1h>" });
    expect(keypath.toString()).toBe("<0';1'>");
  });

  it("should create an instance with mixed components", () => {
    const keypath = new Keypath({ path: "44'/0'/1'-5'/<0h;1h>/*" });
    expect(keypath.toString('h')).toBe("44h/0h/1-5h/<0h;1h>/*");
  });

  it("should throw an error for invalid range", () => {
    expect(() => new Keypath({ path: "15-7" })).toThrow();
  });

  it("should convert to and from UR", () => {
    const keypath = new Keypath({ path: "44'/0'/0'/0/0" });
    const ur = keypath.toUr();
    const decodedUR = UR.fromString(ur.toString())

    expect(decodedUR.toString()).toBe(ur.toString());

    const decodedKeypath = decodedUR.decode() as Keypath;

    expect(decodedKeypath.toString()).toBe("44'/0'/0'/0/0");
  });

  it("should convert to and from hex", () => {
    const keypath = new Keypath({ path: "44'/0'/0'/0/0" });
    const ur = keypath.toUr();
    const hex = ur.getPayloadHex();
    const decodedKeypath = UR.fromCbor({ type: 'keypath', payload: Buffer.from(hex, 'hex') }).decode() as Keypath;
    expect(decodedKeypath.toString()).toBe("44'/0'/0'/0/0");
  });

  it("should create an instance with source fingerprint and depth", () => {
    const keypath = new Keypath({ path: "44'/0'/0'/0/0", sourceFingerprint: 12345678, depth: 5 });
    expect(keypath.getSourceFingerprint()).toBe(12345678);
    expect(keypath.getDepth()).toBe(5);
  });

  it("should throw an error if components are empty and source fingerprint is missing", () => {
    expect(() => new Keypath({ path: [], sourceFingerprint: undefined })).toThrow();
  });

  it("should encode to UR and get hex payload for regular path", () => {
    const keypath = new Keypath({ path: "44'/0'/0'/0/0" });
    const ur = keypath.toUr();
    const hex = ur.getPayloadHex();
    expect(ur.toString()).toBe("ur:keypath/oyadlecsdwykaeykaeykaewkaewkkolbenti"); 
    expect(hex).toBe("a1018a182cf500f500f500f400f4");
  });

  it("should encode to UR and get hex payload for range", () => {
    const keypath = new Keypath({ path: "1-6h" });
    const ur = keypath.toUr();
    const hex = ur.getPayloadHex();
    expect(ur.toString()).toBe("ur:keypath/oyadlflfadamykoytllfhs");
    expect(hex).toBe("a10182820106f5");
  });

  it("should encode to UR and get hex payload for wildcard", () => {
    const keypath = new Keypath({ path: "44'/0'/0'/*" });
    const ur = keypath.toUr();
    const hex = ur.getPayloadHex();
    expect(ur.toString()).toBe("ur:keypath/oyadlocsdwykaeykaeyklawkmetlwdkg");
    expect(hex).toBe("a10188182cf500f500f580f4");
  });

  it("should encode to UR and get hex payload for pair", () => {
    const keypath = new Keypath({ path: "<0h;1h>" });
    const ur = keypath.toUr();
    const hex = ur.getPayloadHex();
    expect(ur.toString()).toBe("ur:keypath/oyadlylraeykadykguzoieas");
    expect(hex).toBe("a101818400f501f5");
  });

  it("should encode to UR and get hex payload for mixed components", () => {
    const keypath = new Keypath({ path: "44'/0'/1'-5'/<0h;1h>/*" });
    const ur = keypath.toUr();
    const hex = ur.getPayloadHex();
    expect(ur.toString()).toBe("ur:keypath/oyadldcsdwykaeyklfadahyklraeykadyklawkosrfgmct");
    expect(hex).toBe("a10189182cf500f5820105f58400f501f580f4");
  });

  describe("Zero common test verctor", () => {

  /**
   * @brief Test the encoding and decoding of this CDDL example
   * {
   *   1: [1, true, 2, false, [3, 4], false, [5, 6], true, [], false, [], true, [7, false, 8, true], [9, true, 0, false]],
   *   2: 123456789,
   *   3: 8
   * }
   * 
   */
    it("should encode / decode 1'/2/3-4/5-6'/*/*'/<7;8'>/<9';0>", ()=> {
      const path = "1'/2/3-4/5-6'/*/*'/<7;8'>/<9';0>";
      const expectedCBOR = "a3018e01f502f4820304f4820506f580f480f58407f408f58409f500f4021a075bcd150308";// copied from zero
      const expectedUr = "ur:keypath/otadmnadykaowklfaxaawklfahamyklawklayklratwkayyklrasykaewkaocyathpsnbzaxayknjtvwty";//copied from zero

      // Encoding
      const myPath = new Keypath({ sourceFingerprint: 123456789, path, depth: 8 });

      const ur = myPath.toUr();
      const hex = ur.getPayloadHex();

      expect(myPath.data.sourceFingerprint).toBe(123456789);
      expect(myPath.data.depth).toBe(8);
      expect(myPath.toString()).toBe(path);

      expect(ur.toString()).toBe(expectedUr);
      expect(hex).toBe(expectedCBOR);

      // Decoding UR
      const decodedUr = UR.fromString(expectedUr);
      const decodedCBOR = decodedUr.getPayloadHex();
      
      expect(decodedUr.type).toBe('keypath');
      expect(decodedCBOR).toBe(hex);

      // Decoding item      
      const decodedKeypath = decodedUr.decode() as Keypath;
      expect(decodedKeypath instanceof Keypath).toBe(true);
      expect(decodedKeypath.toString()).toBe(path);

      // TODO: add PathComponent tests
    });


  /**
   * @brief Test the encoding and decoding of this CDDL example
   * {
   *   1: [44, true, 200, false, 50, false, [0, 100], false],
   *   3: 4
   * }
   * 
   */
    it("should encode / decode m/44'/200/50/0-100", ()=> {
      const path = "44'/200/50/0-100";
      const expectedCBOR = "A20188182CF518C8F41832F482001864F40304".toLowerCase();
      const expectedUr = "ur:keypath/oeadlocsdwykcsspwkcseywklfaecsiewkaxaarsonnbkk";

      // Encoding
      const myPath = new Keypath({ path });
      myPath.setDepth();
      const ur = myPath.toUr();
      const hex = ur.getPayloadHex();

      expect(myPath.data.depth).toBe(4);
      expect(myPath.toString()).toBe(path);

      expect(hex).toBe(expectedCBOR);
      expect(ur.toString()).toBe(expectedUr);

      // Decoding UR
      const decodedUr = UR.fromString(expectedUr);
      const decodedCBOR = decodedUr.getPayloadHex();
      
      expect(decodedUr.type).toBe('keypath');
      expect(decodedCBOR).toBe(hex);

      // Decoding item      
      const decodedKeypath = decodedUr.decode() as Keypath;
      expect(decodedKeypath instanceof Keypath).toBe(true);
      expect(decodedKeypath.toString()).toBe(path);

      // TODO: add PathComponent tests    
    });

    /**
     * @brief Test the encoding and decoding of this CDDL example
     * {
     *   1: [[44, true, 44, true], 76500, false, 0, false, [], false],
     *   2: 1
     * }
     * 
    */
    it("should encode / decode <44';44'>/76500/0/*", ()=> {
      const path = "<44';44'>/76500/0/*";
      const expectedCBOR = "A2018784182CF5182CF51A00012AD4F400F480F40201".toLowerCase();
      const expectedUr = "ur:keypath/oeadltlrcsdwykcsdwykcyaeaddrtywkaewklawkaoadnscsptbk";

      // Encoding
      const myPath = new Keypath({ sourceFingerprint:1, path });
      const ur = myPath.toUr();
      const hex = ur.getPayloadHex();

      expect(myPath.data.sourceFingerprint).toBe(1);
      expect(myPath.data.depth).toBe(undefined);
      expect(myPath.toString()).toBe(path);

      expect(hex).toBe(expectedCBOR);
      expect(ur.toString()).toBe(expectedUr);

      // Decoding UR
      const decodedUr = UR.fromString(expectedUr);
      const decodedCBOR = decodedUr.getPayloadHex();
      
      expect(decodedUr.type).toBe('keypath');
      expect(decodedCBOR).toBe(hex);

      // Decoding item      
      const decodedKeypath = decodedUr.decode() as Keypath;
      expect(decodedKeypath instanceof Keypath).toBe(true);
      expect(decodedKeypath.toString()).toBe(path);
    });

    /**
     * @brief Test the encoding and decoding of this CDDL example
     * {
     *   1: [],
     *   2: 912348765,
     *   3: 0
     * }
     * 
     */
    it("should encode / decode empty path", ()=> {
      const expectedCBOR = "A30180021A3661565D0300".toLowerCase();
      const expectedUr = "ur:keypath/otadlaaocyenhshfhlaxaeuohtswft";

      // Encoding
      const myPath = new Keypath({ sourceFingerprint:912348765 });
      myPath.setDepth();
      const ur = myPath.toUr();
      const hex = ur.getPayloadHex();

      expect(myPath.data.sourceFingerprint).toBe(912348765);
      expect(myPath.data.depth).toBe(0);

      expect(hex).toBe(expectedCBOR);
      expect(ur.toString()).toBe(expectedUr);

      // Decoding UR
      const decodedUr = UR.fromString(expectedUr);
      const decodedCBOR = decodedUr.getPayloadHex();
      
      expect(decodedUr.type).toBe('keypath');
      expect(decodedCBOR).toBe(hex);

      // Decoding item      
      const decodedKeypath = decodedUr.decode() as Keypath;
      expect(decodedKeypath instanceof Keypath).toBe(true);
    });

    /**
     * @brief Test the encoding and decoding of this CDDL example
     * {
     *   1: [[64, false, 64, true]]
     * }
     * 
     */
    it("should encode / decode <64;64'>", ()=> {
      const path = "<64;64'>";
      const expectedCBOR = "A10181841840F41840F5".toLowerCase();
      const expectedUr = "ur:keypath/oyadlylrcsfzwkcsfzykrtgeqzjt";

      // Encoding
      const myPath = new Keypath({ path });
      const ur = myPath.toUr();
      const hex = ur.getPayloadHex();

      expect(myPath.toString()).toBe(path);

      expect(hex).toBe(expectedCBOR);
      expect(ur.toString()).toBe(expectedUr);

      // Decoding UR
      const decodedUr = UR.fromString(expectedUr);
      const decodedCBOR = decodedUr.getPayloadHex();
      
      expect(decodedUr.type).toBe('keypath');
      expect(decodedCBOR).toBe(hex);

      // Decoding item      
      const decodedKeypath = decodedUr.decode() as Keypath;
      expect(decodedKeypath instanceof Keypath).toBe(true);
      expect(decodedKeypath.toString()).toBe(path);
    });

    /**
     * @brief Test the encoding and decoding of keypath components for this CDDL example
     * {
     *   1: [98, true, [2, 6], false, [], true, [78200, true, 0, true]]
     * }
     * 
     */
    it("should encode and decode from KeypathComponents", () => {
      const path = "98'/2-6/*'/<78200';0'>";
      const expectedCBOR = "A101871862F5820206F480F5841A00013178F500F5".toLowerCase();
      const expectedUr = "ur:keypath/oyadltcsidyklfaoamwklayklrcyaeadehksykaeyknlbtuomn";

      const comp1 = new PathComponent({ index: 98, hardened: true });
      const comp2 = new PathComponent({ range: [2, 6] });
      const comp3 = new PathComponent({ wildcard: true, hardened: true });
      const comp4 = new PathComponent({ pair: [{ index: 78200, hardened: true }, { index: 0, hardened: true } ] });

      // Encoding
      const myPath = new Keypath({ path: [comp1, comp2, comp3, comp4] });
      const ur = myPath.toUr();
      const hex = ur.getPayloadHex();

      expect(myPath.toString()).toBe(path);

      expect(hex).toBe(expectedCBOR);
      expect(ur.toString()).toBe(expectedUr);

      // Decoding UR
      const decodedUr = UR.fromString(expectedUr);
      const decodedCBOR = decodedUr.getPayloadHex();
      
      expect(decodedUr.type).toBe('keypath');
      expect(decodedCBOR).toBe(hex);

      // Decoding item      
      const decodedKeypath = decodedUr.decode() as Keypath;
      expect(decodedKeypath instanceof Keypath).toBe(true);
      expect(decodedKeypath.toString()).toBe(path);
    });      

  });

  describe("Keypath Error Handling", () => {  
    it("should return an error when the derivation path does not match any component regex", () => {
      expect(() => new Keypath({ path: "6/7432'/1nc0rr3ct" })).toThrow();
    });
  
    it("should return an error when the fingerprint is defined as 0", () => {
      expect(() => new Keypath({ path: "45'/0", sourceFingerprint: 0 })).toThrow();
    });
  
    it("should return an error when the child index is superior or equal to 0x80000000", () => {
      expect(() => new Keypath({ path: "50000'/249000/2147483648" })).toThrow();
    });
  
    it("should return an error when the low index is superior to the high index", () => {
      expect(() => new Keypath({ path: "78400/89'/9'/[76,34]" })).toThrow();
    });
  
    it("should decode map index in a random order", () => {
      const urToDecode = "ur:keypath/otaocyaeasztdraxaaadloadykaowkcfaohdykcsfxyklnspbnkn";
      const decodedUr = UR.fromString(urToDecode);
      const decodedKeypath = decodedUr.decode() as Keypath;
      expect(decodedKeypath.toString()).toBe("1'/2/600'/67'");
      expect(decodedKeypath.getSourceFingerprint()).toBe(654378);
      expect(decodedKeypath.getDepth()).toBe(4);
    });
  
    it.skip("should return an error due to wrong UR type", () => {
      const urError = "ur:unknown/otaocyaeasztdraxaaadloadykaowkcfaohdykcsfxyklnspbnkn";
      expect(() => UR.fromString(urError).decode()).toThrow();
    });
  
    it.skip("should return an error when the map index is unknown", () => {
      const urError = "ur:keypath/oeadlncsglyklfaoamwklaykayjnkpjtjejtjlktjtcxinjtieihksgyrdoyws";
      expect(() => UR.fromString(urError).decode()).toThrow();
    });
  
    it("should return an error when the fingerprint is equal to 0", () => {
      const urError = "ur:keypath/oeadlncfctgaykaaykaewkaoaegrdavych";
      expect(() => UR.fromString(urError).decode()).toThrow();
    });
  
    it("should return an error when the child index is superior or equal to 0x80000000", () => {
      const urError = "ur:keypath/oyadlrcfctgawkcylaaeaeeowktohttafx";
      expect(() => UR.fromString(urError).decode()).toThrow();
    });
  
    it("should return an error when the child index is superior or equal to 0x80000000 without child components", () => {
      const urError = "ur:keypath/oeaocydwyndavtaxaebswlswva";
      expect(() => UR.fromString(urError).decode()).toThrow();
    });
  
    it.skip("should return an error due to malformed keypath UR types", () => {
      const urErrors = [
        "ur:keypath/oyadlyadlatogmts", // {1: [1]}
        "ur:keypath/oyadlylacyjsvyhs", // {1: [[], false]}
        "ur:keypath/oyadlylyaewnrpzevl", // {1: [[0]]} 
        "ur:keypath/oyadlylscfaolsykashpoxdygm", // {1: [[4, 900]]}
        "ur:keypath/oyadlylfaacfaxlrvabzbnbg", // {1: [[4, 900]]} 
        "ur:keypath/oyadlylrcshgcfaxlrykwkcaehaedw", // no {1: [[87, 900, true, false]]} // no
        "ur:keypath/oyadlylpatcyaeadhemhykwkcfcpfsspvaghbn",
        "ur:keypath/oyadlnlfadaowkykamcsetwkecfxaode",
        "ur:keypath/oyadlflfadiahsidiaykvoztbdfp", // no
        "ur:keypath/oyadlylraeininjtiajljpjpihiajyatwkstwnjsbe", // no
        "ur:keypath/oyadlflaiojeihkkjohsjyisaytasegm",
        "ur:keypath/oeadlflaykaosagscxgwtohyfmdaaohsbeaeaeaebgenmhdr",
        "ur:keypath/otaocyaomwbnesadlflfatasykaxcfbwdkfppmidmt", // no
        "ur:keypath/otaoykadlfahykaxasnlcfcpry",
        "ur:keypath/otaochadlfcfaxuywkaxwkpmjkrtqz", // no
        "ur:keypath/oyadamtslskneh",
        "ur:keypath/nbaatygsih",
        "ur:keypath/oeadlfaoykadlfcfadspwklrtosgos", // no
        "ur:keypath/otadlfaewkaoadaocfaohdpkmkgubw", // no
        "ur:keypath/otadlfaewkaxadaxaaimlaykhh", // no
        "ur:keypath/",
        "ur:keypath/randomstring",
        "ur:keypath/rtotbw",
        "ur:keypath/zmeygehflkihghaeasltjefxdmrkbdnsrt"
      ];

  
      urErrors.forEach(urError => {
        expect(() => {
          UR.fromString(urError).decode();
      }).toThrow();
      });

      expect(true).toBe(true);
    });
});

});
