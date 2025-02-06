import { UR } from "@ngraveio/bc-ur"
import { Buffer } from "buffer/"
import { PortfolioMetadata } from "../src/index";

describe("CryptoPortfolioMetadata", () => {
    
    it("should encode/decode only with empty values", () => {
        // New metadata
        const metadata = new PortfolioMetadata();

        expect(metadata.getSyncId()).toBe(undefined);
        expect(metadata.getLanguageCode()).toBe(undefined);
        expect(metadata.getDevice()).toBe(undefined);
        expect(metadata.getFirmwareVersion()).toBe(undefined);

        //console.log(metadata.toUr().getPayloadHex().toString("hex")); // a401f702f703f704f7
        //console.log(metadata.toUREncoder(1000).nextPart()); // ur:crypto-portfolio-metadata/oxadylaoylaxylaaylhnihlnse

        const ur = new UR(metadata)
        const metadataRead = ur.decode();

        expect(metadataRead.getSyncId()).toBe(undefined);
        expect(metadataRead.getLanguageCode()).toBe(undefined);
        expect(metadataRead.getDevice()).toBe(undefined);
        expect(metadataRead.getFirmwareVersion()).toBe(undefined);
    });
    

    it("should encode/decode with full values", () => {
        // Sync id
        const sync_id = Buffer.from("babe0000babe00112233445566778899", "hex");

        // New metadata
        const metadata = new PortfolioMetadata({"syncId": sync_id, "device": "my-device", "languageCode": "en", "firmwareVersion": "1.0.0"});

        expect(metadata.getSyncId()?.toString('hex')).toBe("babe0000babe00112233445566778899");
        expect(metadata.getLanguageCode()).toBe("en");
        expect(metadata.getDevice()).toBe("my-device");
        expect(metadata.getFirmwareVersion()).toBe("1.0.0");


        // const urData = metadata.toUREncoder(1000).nextPart();
        // const ur = URRegistryDecoder.decode(urData);
        // const metadataRead = PortfolioMetadata.fromCBOR(ur.cbor);

        const ur = new UR(metadata);
        const metadataRead = ur.decode();        

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
        const metadata = new PortfolioMetadata({"syncId": sync_id});

        expect(metadata.getSyncId()?.toString('hex')).toBe("babe0000babe00112233445566778899");

        // console.log(metadata.toUr().getPayloadHex().toString("hex"));
        // console.log(metadata.toUr().toString());

        const ur = new UR(metadata);
        const metadata2 = ur.decode();

        expect(metadata2.getSyncId()?.toString('hex')).toBe(metadata.getSyncId()?.toString('hex'));
    });

    it("should pad left of sync_id", () => {
        // Sync id
        const sync_id = Buffer.from("babe", "hex");

        // New metadata
        const metadata = new PortfolioMetadata({"syncId": sync_id});

        expect(metadata.getSyncId()?.toString('hex')).toBe("0000000000000000000000000000babe");

        // console.log(metadata.toUr().getPayloadHex().toString("hex")); // a40150babe0000babe0011223344556677889902f703f704f7
        // console.log(metadata.toUr().toString()); // ur:crypto-portfolio-metadata/oxadgdrdrnaeaerdrnaebycpeofygoiyktlonlaoylaxylaaylwzeyyafw

        const ur = new UR(metadata);
        const metadataRead = ur.decode();
    });

    it("should remove starting zeros when encoding", () => {
        // Sync id
        const sync_id = Buffer.from("0000000000000000000000000000babe", "hex");

        // New metadata
        const metadata = new PortfolioMetadata({"syncId": sync_id});

        expect(metadata.toUr().getPayloadHex()).toEqual("a10142babe");
        expect(metadata.toUr().toString()).toEqual("ur:crypto-portfolio-metadata/oyadfwrdrnjpeeosga");

        const ur = new UR(metadata);
        const metadataRead = ur.decode();
    });

});


describe("CryptoPortfolioMetadata language codes", () => {

    it("should encode with correct language codes", () => {
        
        const metadata_en = new PortfolioMetadata({"languageCode": "en"});
        const metadata_tr = new PortfolioMetadata({"languageCode": "tr"});
        const metadata_fr = new PortfolioMetadata({"languageCode": "fr"});
        const metadata_nl = new PortfolioMetadata({"languageCode": "nl"});

        expect(metadata_en.getLanguageCode()).toBe("en"); 
        expect(metadata_tr.getLanguageCode()).toBe("tr"); 
        expect(metadata_fr.getLanguageCode()).toBe("fr"); 
        expect(metadata_nl.getLanguageCode()).toBe("nl"); 

        // console.log(metadata_en.toUr().getPayloadHex().toString("hex")); // a10262656e
        // console.log(metadata_tr.toUr().getPayloadHex().toString("hex")); // a102627472
        // console.log(metadata_fr.toUr().getPayloadHex().toString("hex")); // a102626672
        // console.log(metadata_nl.toUr().getPayloadHex().toString("hex")); // a102626e6c

        expect(metadata_en.toUr().getPayloadHex()).toBe("a10262656e");
        expect(metadata_tr.toUr().getPayloadHex()).toBe("a102627472");
        expect(metadata_fr.toUr().getPayloadHex()).toBe("a102626672");
        expect(metadata_nl.toUr().getPayloadHex()).toBe("a102626e6c");

        // console.log("UR");

        // console.log(metadata_en.toUr().toString()); // ur:crypto-portfolio-metadata/oyaoidihjttprsfefx
        // console.log(metadata_tr.toUr().toString()); // ur:crypto-portfolio-metadata/oyaoidjyjpneioftce
        // console.log(metadata_fr.toUr().toString()); // ur:crypto-portfolio-metadata/oyaoidiyjpvdmugetk
        // console.log(metadata_nl.toUr().toString()); // ur:crypto-portfolio-metadata/oyaoidjtjztlfezcox

        expect(metadata_en.toUr().toString()).toBe("ur:crypto-portfolio-metadata/oyaoidihjttprsfefx");
        expect(metadata_tr.toUr().toString()).toBe("ur:crypto-portfolio-metadata/oyaoidjyjpneioftce");
        expect(metadata_fr.toUr().toString()).toBe("ur:crypto-portfolio-metadata/oyaoidiyjpvdmugetk");
        expect(metadata_nl.toUr().toString()).toBe("ur:crypto-portfolio-metadata/oyaoidjtjztlfezcox");
    });
    

    it("should decode CBOR with correct language codes", () => {
        expect(UR.fromHex({type: "portfolio-metadata", payload: "a401f70262656e03f704f7"}).decode().getLanguageCode()).toBe("en");
        expect(UR.fromHex({type: "portfolio-metadata", payload: "a401f70262747203f704f7"}).decode().getLanguageCode()).toBe("tr");
        expect(UR.fromHex({type: "portfolio-metadata", payload: "a401f70262667203f704f7"}).decode().getLanguageCode()).toBe("fr");
        expect(UR.fromHex({type: "portfolio-metadata", payload: "a401f702626e6c03f704f7"}).decode().getLanguageCode()).toBe("nl");
    });

    it("should decode UR with correct language codes", () => {

        const decodedEn = URRegistryDecoder.decode("ur:crypto-portfolio-metadata/oxadylaoidihjtaxylaaylwzsgtpfh");
        expect(PortfolioMetadata.fromCBOR(decodedEn.cbor).getLanguageCode()).toBe("en");

        const decodedTr = URRegistryDecoder.decode("ur:crypto-portfolio-metadata/oxadylaoidjyjpaxylaaylnegdjklf");
        expect(PortfolioMetadata.fromCBOR(decodedTr.cbor).getLanguageCode()).toBe("tr");

        const decodedFr = URRegistryDecoder.decode("ur:crypto-portfolio-metadata/oxadylaoidiyjpaxylaaylttgltibg");
        expect(PortfolioMetadata.fromCBOR(decodedFr.cbor).getLanguageCode()).toBe("fr");

        const decodedNl = URRegistryDecoder.decode("ur:crypto-portfolio-metadata/oxadylaoidjtjzaxylaaylvosnkgns");
        expect(PortfolioMetadata.fromCBOR(decodedNl.cbor).getLanguageCode()).toBe("nl");

    });

    it("should throw error encoding with incorrect language codes", () => {
        expect(() => {
            //@ts-ignore
            const metadata = new PortfolioMetadata({"languageCode": "xx"});
        }).toThrowError("Invalid language code");
        expect(() => {
            //@ts-ignore
            const metadata = new PortfolioMetadata({"languageCode": "xyx"});
        }).toThrowError("Invalid language code");
    });
    
    it("should throw error decoding CBOR with incorrect language codes", () => {
        expect(() => {
            PortfolioMetadata.fromCBOR(Buffer.from("a401f7026378797a03f704f7", "hex"));
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
        const metadata = new PortfolioMetadata({...myData});

        expect(metadata.getData()).toStrictEqual({...myData});

        const cbor = metadata.toUr().getPayloadHex().toString("hex"); // a766737472696e676b68656c6c6f20776f726c64666e756d626572187b67626f6f6c65616ef565617272617983010203666f626a656374a2616101616202646e756c6cf66464617465c07818323032312d30312d30315430303a30303a30302e3030305a
        //console.log(cbor);

        // Decode metadata
        const decodedMetadata = PortfolioMetadata.fromCBOR(Buffer.from(cbor, "hex"));

        expect(decodedMetadata.getData()).toStrictEqual(metadata.getData());

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
        const metadata = new PortfolioMetadata({...knownValues, ...myData});

        expect(metadata.getSyncId()?.toString('hex')).toBe("babe0000babe00112233445566778899");
        expect(metadata.getLanguageCode()).toBe("en");
        expect(metadata.getDevice()).toBe("my-device");
        expect(metadata.getFirmwareVersion()).toBe("1.0.0");

        expect(metadata.getData()).toStrictEqual({...knownValues, ...myData});


        // const urData = metadata.toUREncoder(1000).nextPart();
        // const ur = URRegistryDecoder.decode(urData);
        // console.log('all', ur.cbor.toString('hex'));

        // Encode
        const cbor = metadata.toUr().getPayloadHex().toString('hex'); // ab0150babe0000babe001122334455667788990262656e0365312e302e3004696d792d64657669636566737472696e676b68656c6c6f20776f726c64666e756d626572187b67626f6f6c65616ef565617272617983010203666f626a656374a2616101616202646e756c6cf66464617465c07818323032312d30312d30315430303a30303a30302e3030305a

        // Decode
        const decodedMetadata = PortfolioMetadata.fromCBOR(Buffer.from(cbor, 'hex'));

        expect(decodedMetadata.getSyncId()?.toString('hex')).toBe("babe0000babe00112233445566778899");
        expect(decodedMetadata.getLanguageCode()).toBe("en");
        expect(decodedMetadata.getDevice()).toBe("my-device");
        expect(decodedMetadata.getFirmwareVersion()).toBe("1.0.0");

        expect(decodedMetadata.getData()).toStrictEqual(metadata.getData());
    });

});
