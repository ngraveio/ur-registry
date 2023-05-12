import { URRegistryDecoder } from "@keystonehq/bc-ur-registry";
import { CryptoSyncMetadata } from "../src"

describe("CryptoSyncMetadata", () => {

    it("should encode/decode only with empty values", () => {
        // New metadata
        const metadata = new CryptoSyncMetadata();

        expect(metadata.getSyncId()).toBe(undefined);
        expect(metadata.getLanguageCode()).toBe(undefined);
        expect(metadata.getDevice()).toBe(undefined);
        expect(metadata.getFirmwareVersion()).toBe(undefined);

        //console.log(metadata.toCBOR().toString("hex")); // a401f702f703f704f7
        //console.log(metadata.toUREncoder(1000).nextPart()); // ur:crypto-sync-metadata/oxadylaoylaxylaaylhnihlnse

        const urData = metadata.toUREncoder(1000).nextPart();
        const ur = URRegistryDecoder.decode(urData);
        const metadataRead = CryptoSyncMetadata.fromCBOR(ur.cbor);

        expect(metadataRead.getSyncId()).toBe(undefined);
        expect(metadataRead.getLanguageCode()).toBe(undefined);
        expect(metadataRead.getDevice()).toBe(undefined);
        expect(metadataRead.getFirmwareVersion()).toBe(undefined);
    });
    

    it("should encode/decode with full values", () => {
        // Sync id
        const sync_id = Buffer.from("babe0000babe00112233445566778899", "hex");

        // New metadata
        const metadata = new CryptoSyncMetadata({"sync_id": sync_id, "device": "my-device", "language_code": "en", "fw_version": "1.0.0"});

        expect(metadata.getSyncId()?.toString('hex')).toBe("babe0000babe00112233445566778899");
        expect(metadata.getLanguageCode()).toBe("en");
        expect(metadata.getDevice()).toBe("my-device");
        expect(metadata.getFirmwareVersion()).toBe("1.0.0");


        const urData = metadata.toUREncoder(1000).nextPart();
        const ur = URRegistryDecoder.decode(urData);
        const metadataRead = CryptoSyncMetadata.fromCBOR(ur.cbor);

        expect(metadataRead.getSyncId()?.toString('hex')).toBe("babe0000babe00112233445566778899");
        expect(metadataRead.getLanguageCode()).toBe("en");
        expect(metadataRead.getDevice()).toBe("my-device");
        expect(metadataRead.getFirmwareVersion()).toBe("1.0.0");   
    });

});

describe("CryptoSyncMetadata sync_id", () => {
    it("should encode / decode with 16 byte lenght sync id", () => {
        // Sync id
        const sync_id = Buffer.from("babe0000babe00112233445566778899", "hex");

        // New metadata
        const metadata = new CryptoSyncMetadata({"sync_id": sync_id});

        expect(metadata.getSyncId()?.toString('hex')).toBe("babe0000babe00112233445566778899");

        // console.log(metadata.toCBOR().toString("hex"));
        // console.log(metadata.toUREncoder(100).nextPart());

        const urData = metadata.toUREncoder(100).nextPart();
        const ur = URRegistryDecoder.decode(urData);
        const metadata2 = CryptoSyncMetadata.fromCBOR(ur.cbor);

        expect(metadata2.getSyncId()?.toString('hex')).toBe(metadata.getSyncId()?.toString('hex'));
    });

    it("should pad left of sync_id", () => {
        // Sync id
        const sync_id = Buffer.from("babe", "hex");

        // New metadata
        const metadata = new CryptoSyncMetadata({"sync_id": sync_id});

        expect(metadata.getSyncId()?.toString('hex')).toBe("0000000000000000000000000000babe");

        // console.log(metadata.toCBOR().toString("hex")); // a40150babe0000babe0011223344556677889902f703f704f7
        // console.log(metadata.toUREncoder(100).nextPart()); // ur:crypto-sync-metadata/oxadgdrdrnaeaerdrnaebycpeofygoiyktlonlaoylaxylaaylwzeyyafw
    });

    it("should remove starting zeros when encoding", () => {
        // Sync id
        const sync_id = Buffer.from("0000000000000000000000000000babe", "hex");

        // New metadata
        const metadata = new CryptoSyncMetadata({"sync_id": sync_id});
        // console.log(metadata.toCBOR().toString("hex")); // a40142babe02f703f704f7
        // console.log(metadata.toUREncoder(100).nextPart()); // ur:crypto-sync-metadata/oxadfwrdrnaoylaxylaaylgdpllsgt

        expect(metadata.toCBOR().toString('hex')).toEqual("a40142babe02f703f704f7");
        expect(metadata.toUREncoder(100).nextPart()).toEqual("ur:crypto-sync-metadata/oxadfwrdrnaoylaxylaaylgdpllsgt");
    });

});


describe("CryptoSyncMetadata language codes", () => {

    it("should encode with correct language codes", () => {
        
        const metadata_en = new CryptoSyncMetadata({"language_code": "en"});
        const metadata_tr = new CryptoSyncMetadata({"language_code": "tr"});
        const metadata_fr = new CryptoSyncMetadata({"language_code": "fr"});
        const metadata_nl = new CryptoSyncMetadata({"language_code": "nl"});

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

        // console.log(metadata_en.toUREncoder(100).nextPart()); // ur:crypto-sync-metadata/oxadylaoidihjtaxylaaylwzsgtpfh
        // console.log(metadata_tr.toUREncoder(100).nextPart()); // ur:crypto-sync-metadata/oxadylaoidjyjpaxylaaylnegdjklf
        // console.log(metadata_fr.toUREncoder(100).nextPart()); // ur:crypto-sync-metadata/oxadylaoidiyjpaxylaaylttgltibg
        // console.log(metadata_nl.toUREncoder(100).nextPart()); // ur:crypto-sync-metadata/oxadylaoidjtjzaxylaaylvosnkgns

        expect(metadata_en.toUREncoder(100).nextPart()).toBe("ur:crypto-sync-metadata/oxadylaoidihjtaxylaaylwzsgtpfh");
        expect(metadata_tr.toUREncoder(100).nextPart()).toBe("ur:crypto-sync-metadata/oxadylaoidjyjpaxylaaylnegdjklf");
        expect(metadata_fr.toUREncoder(100).nextPart()).toBe("ur:crypto-sync-metadata/oxadylaoidiyjpaxylaaylttgltibg");
        expect(metadata_nl.toUREncoder(100).nextPart()).toBe("ur:crypto-sync-metadata/oxadylaoidjtjzaxylaaylvosnkgns");
    });
    

    it("should decode CBOR with correct language codes", () => {
        expect(CryptoSyncMetadata.fromCBOR(Buffer.from("a401f70262656e03f704f7", "hex")).getLanguageCode()).toBe("en");
        expect(CryptoSyncMetadata.fromCBOR(Buffer.from("a401f70262747203f704f7", "hex")).getLanguageCode()).toBe("tr");
        expect(CryptoSyncMetadata.fromCBOR(Buffer.from("a401f70262667203f704f7", "hex")).getLanguageCode()).toBe("fr");
        expect(CryptoSyncMetadata.fromCBOR(Buffer.from("a401f702626e6c03f704f7", "hex")).getLanguageCode()).toBe("nl");
    });

    it("should decode UR with correct language codes", () => {

        const decodedEn = URRegistryDecoder.decode("ur:crypto-sync-metadata/oxadylaoidihjtaxylaaylwzsgtpfh");
        expect(CryptoSyncMetadata.fromCBOR(decodedEn.cbor).getLanguageCode()).toBe("en");

        const decodedTr = URRegistryDecoder.decode("ur:crypto-sync-metadata/oxadylaoidjyjpaxylaaylnegdjklf");
        expect(CryptoSyncMetadata.fromCBOR(decodedTr.cbor).getLanguageCode()).toBe("tr");

        const decodedFr = URRegistryDecoder.decode("ur:crypto-sync-metadata/oxadylaoidiyjpaxylaaylttgltibg");
        expect(CryptoSyncMetadata.fromCBOR(decodedFr.cbor).getLanguageCode()).toBe("fr");

        const decodedNl = URRegistryDecoder.decode("ur:crypto-sync-metadata/oxadylaoidjtjzaxylaaylvosnkgns");
        expect(CryptoSyncMetadata.fromCBOR(decodedNl.cbor).getLanguageCode()).toBe("nl");

    });

    it("should throw error encoding with incorrect language codes", () => {
        expect(() => {
            //@ts-ignore
            const metadata = new CryptoSyncMetadata({"language_code": "xx"});
        }).toThrowError("Invalid language code");
        expect(() => {
            //@ts-ignore
            const metadata = new CryptoSyncMetadata({"language_code": "xyx"});
        }).toThrowError("Invalid language code");
    });
    
    it("should throw error decoding CBOR with incorrect language codes", () => {
        expect(() => {
            CryptoSyncMetadata.fromCBOR(Buffer.from("a401f7026378797a03f704f7", "hex"));
        }).toThrowError("Invalid language code");
    });
     
});
