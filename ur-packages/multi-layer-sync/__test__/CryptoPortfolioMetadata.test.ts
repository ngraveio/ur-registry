import { URRegistryDecoder } from "@keystonehq/bc-ur-registry";
import { CryptoPortfolioMetadata } from "../src"

describe("CryptoPortfolioMetadata", () => {
    
    it("should encode/decode only with empty values", () => {
        // New metadata
        const metadata = new CryptoPortfolioMetadata();

        expect(metadata.getSyncId()).toBe(undefined);
        expect(metadata.getLanguageCode()).toBe(undefined);
        expect(metadata.getDevice()).toBe(undefined);
        expect(metadata.getFirmwareVersion()).toBe(undefined);

        //console.log(metadata.toCBOR().toString("hex")); // a401f702f703f704f7
        //console.log(metadata.toUREncoder(1000).nextPart()); // ur:crypto-portfolio-metadata/oxadylaoylaxylaaylhnihlnse

        const urData = metadata.toUREncoder(1000).nextPart();
        const ur = URRegistryDecoder.decode(urData);
        const metadataRead = CryptoPortfolioMetadata.fromCBOR(ur.cbor);

        expect(metadataRead.getSyncId()).toBe(undefined);
        expect(metadataRead.getLanguageCode()).toBe(undefined);
        expect(metadataRead.getDevice()).toBe(undefined);
        expect(metadataRead.getFirmwareVersion()).toBe(undefined);
    });
    

    it("should encode/decode with full values", () => {
        // Sync id
        const sync_id = Buffer.from("babe0000babe00112233445566778899", "hex");

        // New metadata
        const metadata = new CryptoPortfolioMetadata({"syncId": sync_id, "device": "my-device", "languageCode": "en", "firmwareVersion": "1.0.0"});

        expect(metadata.getSyncId()?.toString('hex')).toBe("babe0000babe00112233445566778899");
        expect(metadata.getLanguageCode()).toBe("en");
        expect(metadata.getDevice()).toBe("my-device");
        expect(metadata.getFirmwareVersion()).toBe("1.0.0");


        const urData = metadata.toUREncoder(1000).nextPart();
        const ur = URRegistryDecoder.decode(urData);
        const metadataRead = CryptoPortfolioMetadata.fromCBOR(ur.cbor);

        expect(metadataRead.getSyncId()?.toString('hex')).toBe("babe0000babe00112233445566778899");
        expect(metadataRead.getLanguageCode()).toBe("en");
        expect(metadataRead.getDevice()).toBe("my-device");
        expect(metadataRead.getFirmwareVersion()).toBe("1.0.0");   
    });

});

describe("CryptoPortfolioMetadata sync_id", () => {
    it("should encode / decode with 16 byte lenght sync id", () => {
        // Sync id
        const sync_id = Buffer.from("babe0000babe00112233445566778899", "hex");

        // New metadata
        const metadata = new CryptoPortfolioMetadata({"syncId": sync_id});

        expect(metadata.getSyncId()?.toString('hex')).toBe("babe0000babe00112233445566778899");

        // console.log(metadata.toCBOR().toString("hex"));
        // console.log(metadata.toUREncoder(100).nextPart());

        const urData = metadata.toUREncoder(100).nextPart();
        const ur = URRegistryDecoder.decode(urData);
        const metadata2 = CryptoPortfolioMetadata.fromCBOR(ur.cbor);

        expect(metadata2.getSyncId()?.toString('hex')).toBe(metadata.getSyncId()?.toString('hex'));
    });

    it("should pad left of sync_id", () => {
        // Sync id
        const sync_id = Buffer.from("babe", "hex");

        // New metadata
        const metadata = new CryptoPortfolioMetadata({"syncId": sync_id});

        expect(metadata.getSyncId()?.toString('hex')).toBe("0000000000000000000000000000babe");

        // console.log(metadata.toCBOR().toString("hex")); // a40150babe0000babe0011223344556677889902f703f704f7
        // console.log(metadata.toUREncoder(100).nextPart()); // ur:crypto-portfolio-metadata/oxadgdrdrnaeaerdrnaebycpeofygoiyktlonlaoylaxylaaylwzeyyafw
    });

    it("should remove starting zeros when encoding", () => {
        // Sync id
        const sync_id = Buffer.from("0000000000000000000000000000babe", "hex");

        // New metadata
        const metadata = new CryptoPortfolioMetadata({"syncId": sync_id});
        // console.log(metadata.toCBOR().toString("hex")); // a40142babe02f703f704f7
        // console.log(metadata.toUREncoder(100).nextPart()); // ur:crypto-portfolio-metadata/oxadfwrdrnaoylaxylaaylgdpllsgt

        expect(metadata.toCBOR().toString('hex')).toEqual("a40142babe02f703f704f7");
        expect(metadata.toUREncoder(100).nextPart()).toEqual("ur:crypto-portfolio-metadata/oxadfwrdrnaoylaxylaaylgdpllsgt");
    });

});


describe("CryptoPortfolioMetadata language codes", () => {

    it("should encode with correct language codes", () => {
        
        const metadata_en = new CryptoPortfolioMetadata({"languageCode": "en"});
        const metadata_tr = new CryptoPortfolioMetadata({"languageCode": "tr"});
        const metadata_fr = new CryptoPortfolioMetadata({"languageCode": "fr"});
        const metadata_nl = new CryptoPortfolioMetadata({"languageCode": "nl"});

        expect(metadata_en.getLanguageCode()).toBe("en"); 
        expect(metadata_tr.getLanguageCode()).toBe("tr"); 
        expect(metadata_fr.getLanguageCode()).toBe("fr"); 
        expect(metadata_nl.getLanguageCode()).toBe("nl"); 

        /** 
         * Current encoding still fills other fields with undefined values do we need it?
         * 
         * eg: 
         * {1: undefined, 2: "tr", 3: undefined, 4: undefined}
         * ```
         * A4         # map(4)
         *    01      # unsigned(1)
         *    F7      # primitive(23)
         *    02      # unsigned(2)
         *    62      # text(2)
         *       7472 # "tr"
         *    03      # unsigned(3)
         *    F7      # primitive(23)
         *    04      # unsigned(4)
         *    F7      # primitive(23)
         * ```
         */

        // console.log(metadata_en.toCBOR().toString("hex")); // a401f70262656e03f704f7
        // console.log(metadata_tr.toCBOR().toString("hex")); // a401f70262747203f704f7
        // console.log(metadata_fr.toCBOR().toString("hex")); // a401f70262667203f704f7
        // console.log(metadata_nl.toCBOR().toString("hex")); // a401f702626e6c03f704f7

        expect(metadata_en.toCBOR().toString("hex")).toBe("a401f70262656e03f704f7");
        expect(metadata_tr.toCBOR().toString("hex")).toBe("a401f70262747203f704f7");
        expect(metadata_fr.toCBOR().toString("hex")).toBe("a401f70262667203f704f7");
        expect(metadata_nl.toCBOR().toString("hex")).toBe("a401f702626e6c03f704f7");

        // console.log("UR");

        // console.log(metadata_en.toUREncoder(100).nextPart()); // ur:crypto-portfolio-metadata/oxadylaoidihjtaxylaaylwzsgtpfh
        // console.log(metadata_tr.toUREncoder(100).nextPart()); // ur:crypto-portfolio-metadata/oxadylaoidjyjpaxylaaylnegdjklf
        // console.log(metadata_fr.toUREncoder(100).nextPart()); // ur:crypto-portfolio-metadata/oxadylaoidiyjpaxylaaylttgltibg
        // console.log(metadata_nl.toUREncoder(100).nextPart()); // ur:crypto-portfolio-metadata/oxadylaoidjtjzaxylaaylvosnkgns

        expect(metadata_en.toUREncoder(100).nextPart()).toBe("ur:crypto-portfolio-metadata/oxadylaoidihjtaxylaaylwzsgtpfh");
        expect(metadata_tr.toUREncoder(100).nextPart()).toBe("ur:crypto-portfolio-metadata/oxadylaoidjyjpaxylaaylnegdjklf");
        expect(metadata_fr.toUREncoder(100).nextPart()).toBe("ur:crypto-portfolio-metadata/oxadylaoidiyjpaxylaaylttgltibg");
        expect(metadata_nl.toUREncoder(100).nextPart()).toBe("ur:crypto-portfolio-metadata/oxadylaoidjtjzaxylaaylvosnkgns");
    });
    

    it("should decode CBOR with correct language codes", () => {
        expect(CryptoPortfolioMetadata.fromCBOR(Buffer.from("a401f70262656e03f704f7", "hex")).getLanguageCode()).toBe("en");
        expect(CryptoPortfolioMetadata.fromCBOR(Buffer.from("a401f70262747203f704f7", "hex")).getLanguageCode()).toBe("tr");
        expect(CryptoPortfolioMetadata.fromCBOR(Buffer.from("a401f70262667203f704f7", "hex")).getLanguageCode()).toBe("fr");
        expect(CryptoPortfolioMetadata.fromCBOR(Buffer.from("a401f702626e6c03f704f7", "hex")).getLanguageCode()).toBe("nl");
    });

    it("should decode UR with correct language codes", () => {

        const decodedEn = URRegistryDecoder.decode("ur:crypto-portfolio-metadata/oxadylaoidihjtaxylaaylwzsgtpfh");
        expect(CryptoPortfolioMetadata.fromCBOR(decodedEn.cbor).getLanguageCode()).toBe("en");

        const decodedTr = URRegistryDecoder.decode("ur:crypto-portfolio-metadata/oxadylaoidjyjpaxylaaylnegdjklf");
        expect(CryptoPortfolioMetadata.fromCBOR(decodedTr.cbor).getLanguageCode()).toBe("tr");

        const decodedFr = URRegistryDecoder.decode("ur:crypto-portfolio-metadata/oxadylaoidiyjpaxylaaylttgltibg");
        expect(CryptoPortfolioMetadata.fromCBOR(decodedFr.cbor).getLanguageCode()).toBe("fr");

        const decodedNl = URRegistryDecoder.decode("ur:crypto-portfolio-metadata/oxadylaoidjtjzaxylaaylvosnkgns");
        expect(CryptoPortfolioMetadata.fromCBOR(decodedNl.cbor).getLanguageCode()).toBe("nl");

    });

    it("should throw error encoding with incorrect language codes", () => {
        expect(() => {
            //@ts-ignore
            const metadata = new CryptoPortfolioMetadata({"languageCode": "xx"});
        }).toThrowError("Invalid language code");
        expect(() => {
            //@ts-ignore
            const metadata = new CryptoPortfolioMetadata({"languageCode": "xyx"});
        }).toThrowError("Invalid language code");
    });
    
    it("should throw error decoding CBOR with incorrect language codes", () => {
        expect(() => {
            CryptoPortfolioMetadata.fromCBOR(Buffer.from("a401f7026378797a03f704f7", "hex"));
        }).toThrowError("Invalid language code");
    });
     
});

describe('CryptoPortfolioMetadata with extended values', () => {
    it('Should encode and decode only with unknown key value pairs', () => {

        const myData = {
            "string": "hello world",
            "number": 123,
            "boolean": true,
            "array": [1, 2, 3],
            "object": {"a": 1, "b": 2},
            "null": null,
            "date": new Date("2021-01-01T00:00:00.000Z"),
        }
        // New metadata
        const metadata = new CryptoPortfolioMetadata({...myData});

        expect(metadata.getData()).toStrictEqual({...myData});

        const cbor = metadata.toCBOR().toString("hex");
        console.log(cbor);

        // Decode metadata
        const decodedMetadata = CryptoPortfolioMetadata.fromCBOR(Buffer.from(cbor, "hex"));
        console.log(metadata.getData());

        expect(decodedMetadata.getData()).toStrictEqual(metadata.getData());


        // const urData = metadata.toUREncoder(1000).nextPart();
        // const ur = URRegistryDecoder.decode(urData);
        // const metadataRead = CryptoPortfolioMetadata.fromCBOR(ur.cbor);

        // expect(metadataRead.getSyncId()?.toString('hex')).toBe("babe0000babe00112233445566778899");
        // expect(metadataRead.getLanguageCode()).toBe("en");
        // expect(metadataRead.getDevice()).toBe("my-device");
        // expect(metadataRead.getFirmwareVersion()).toBe("1.0.0");   
    });

    it("Should encode and decode with known and extended values", () => {

        const sync_id = Buffer.from("babe0000babe00112233445566778899", "hex");

        const knownValues = {"syncId": sync_id, "device": "my-device", "languageCode": "en" as const, "firmwareVersion": "1.0.0"}

        const myData = {
            "string": "hello world",
            "number": 123,
            "boolean": true,
            "array": [1, 2, 3],
            "object": {"a": 1, "b": 2},
            "null": null,
            "date": new Date("2021-01-01T00:00:00.000Z"),
        }


        // New metadata
        const metadata = new CryptoPortfolioMetadata({...knownValues, ...myData});

        expect(metadata.getSyncId()?.toString('hex')).toBe("babe0000babe00112233445566778899");
        expect(metadata.getLanguageCode()).toBe("en");
        expect(metadata.getDevice()).toBe("my-device");
        expect(metadata.getFirmwareVersion()).toBe("1.0.0");

        expect(metadata.getData()).toStrictEqual({...knownValues, ...myData});


        const urData = metadata.toUREncoder(1000).nextPart();
        const ur = URRegistryDecoder.decode(urData);
        console.log('all', ur.cbor.toString('hex'));
        const decodedMetadata = CryptoPortfolioMetadata.fromCBOR(ur.cbor);

        expect(decodedMetadata.getSyncId()?.toString('hex')).toBe("babe0000babe00112233445566778899");
        expect(decodedMetadata.getLanguageCode()).toBe("en");
        expect(decodedMetadata.getDevice()).toBe("my-device");
        expect(decodedMetadata.getFirmwareVersion()).toBe("1.0.0");

        expect(decodedMetadata.getData()).toStrictEqual(metadata.getData());
    });

});
