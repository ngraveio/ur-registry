import { CryptoHDKey, CryptoOutput, CryptoKeypath, PathComponent, extend, ScriptExpressions } from '@keystonehq/bc-ur-registry';

import { CryptoDetailedAccount } from '../src';
import { HexString } from '@ngraveio/bc-ur-registry-hex-string';

const { RegistryTypes, decodeToDataItem } = extend;


describe('Crypto Detailed Account', () => {

  it('should generate CryptoDetailedAccount with hdkey', () => {
    // Create a path component
    const originKeyPath = new CryptoKeypath([
      new PathComponent({ index: 44, hardened: true }),
      new PathComponent({ index: 501, hardened: true }),
      new PathComponent({ index: 0, hardened: true }),
      new PathComponent({ index: 0, hardened: true }),
    ]);

    // Create a HDKey
    const cryptoHDKey = new CryptoHDKey({
      isMaster: false,
      key: Buffer.from('02eae4b876a8696134b868f88cc2f51f715f2dbedb7446b8e6edf3d4541c4eb67b', 'hex'),
      origin: originKeyPath,
    });

    // Create detailed account
    const detailedAccount = new CryptoDetailedAccount(cryptoHDKey);

    const cbor = detailedAccount.toCBOR().toString('hex');
    const ur = detailedAccount.toUREncoder(1000).nextPart();

    expect(cbor).toBe(
      'a101d9012fa203582102eae4b876a8696134b868f88cc2f51f715f2dbedb7446b8e6edf3d4541c4eb67b06d90130a10188182cf51901f5f500f500f5'
    );
    expect(ur).toBe(
      'ur:crypto-detailed-account/oyadtaaddloeaxhdclaowdverokopdinhseeroisyalksaykctjshedprnuyjyfgrovawewftyghceglrpkgamtaaddyoyadlocsdwykcfadykykaeykaeyknegrrfkn'
    );
  });

  it('should decode CryptoDetailedAccount with hdkey', () => {
    const cbor =
      'a101d9012fa203582102eae4b876a8696134b868f88cc2f51f715f2dbedb7446b8e6edf3d4541c4eb67b06d90130a10188182cf51901f5f500f500f5';

    const detailedAccount = CryptoDetailedAccount.fromCBOR(Buffer.from(cbor, 'hex'));

    // Get HDKey
    const hdKey = detailedAccount.getAccount() as CryptoHDKey;

    // Check tag
    expect( hdKey.getRegistryType().getTag() ).toBe( RegistryTypes.CRYPTO_HDKEY.getTag() );
    // Try to get path
    expect(hdKey.getOrigin().getPath()).toBe("44'/501'/0'/0'");
  });

  it('should generate CryptoDetailedAccount with CryptoOutput p2pkh hdkey', () => {

    const scriptExpressions = [ScriptExpressions.PUBLIC_KEY_HASH];
    const originKeypath = new CryptoKeypath(
      [
        new PathComponent({ index: 44, hardened: true }),
        new PathComponent({ index: 0, hardened: true }),
        new PathComponent({ index: 0, hardened: true }),
      ],
      Buffer.from('d34db33f', 'hex'),
    );
    const childrenKeypath = new CryptoKeypath([
      new PathComponent({ index: 1, hardened: false }),
      new PathComponent({ hardened: false }),
    ]);
    const hdkey = new CryptoHDKey({
      isMaster: false,
      key: Buffer.from(
        '02d2b36900396c9282fa14628566582f206a5dd0bcc8d5e892611806cafb0301f0',
        'hex',
      ),
      chainCode: Buffer.from(
        '637807030d55d01f9a0cb3a7839515d796bd07706386a6eddf06cc29a65a0e29',
        'hex',
      ),
      origin: originKeypath,
      children: childrenKeypath,
      parentFingerprint: Buffer.from('78412e3a', 'hex'),
    });

    const cryptoOutput = new CryptoOutput(scriptExpressions, hdkey);

    ////
    const cryptoOutputHex =
    'd90193d9012fa503582102d2b36900396c9282fa14628566582f206a5dd0bcc8d5e892611806cafb0301f0045820637807030d55d01f9a0cb3a7839515d796bd07706386a6eddf06cc29a65a0e2906d90130a20186182cf500f500f5021ad34db33f07d90130a1018401f480f4081a78412e3a';

    // Create crypto output with HDKey 44'/0'/0'
    //const cryptoOutput = CryptoOutput.fromCBOR(Buffer.from(cryptoOutputHex, 'hex'));

    expect(cryptoOutput.toCBOR().toString('hex')).toBe(cryptoOutputHex);

    
    // Create detailed account
    const detailedAccount = new CryptoDetailedAccount(cryptoOutput);

    const cbor = detailedAccount.toCBOR().toString('hex'); // a101d90134d90193d9012fa503582102d2b36900396c9282fa14628566582f206a5dd0bcc8d5e892611806cafb0301f0045820637807030d55d01f9a0cb3a7839515d796bd07706386a6eddf06cc29a65a0e2906d90130a20186182cf500f500f5021ad34db33f07d90130a1018401f480f4081a78412e3a
    const ur = detailedAccount.toUREncoder(1000).nextPart(); // ur:crypto-detailed-account/oyadtaadeetaadmutaaddlonaxhdclaotdqdinaeesjzmolfzsbbidlpiyhddlcximhltirfsptlvsmohscsamsgzoaxadwtaahdcxiaksataxbtgotictnybnqdoslsmdbztsmtryatjoialnolweuramsfdtolhtbadtamtaaddyoeadlncsdwykaeykaeykaocytegtqdfhattaaddyoyadlradwklawkaycyksfpdmfttnsbreem

    expect(cbor).toBe('a101d90134d90193d9012fa503582102d2b36900396c9282fa14628566582f206a5dd0bcc8d5e892611806cafb0301f0045820637807030d55d01f9a0cb3a7839515d796bd07706386a6eddf06cc29a65a0e2906d90130a20186182cf500f500f5021ad34db33f07d90130a1018401f480f4081a78412e3a');
    expect(ur).toBe('ur:crypto-detailed-account/oyadtaadeetaadmutaaddlonaxhdclaotdqdinaeesjzmolfzsbbidlpiyhddlcximhltirfsptlvsmohscsamsgzoaxadwtaahdcxiaksataxbtgotictnybnqdoslsmdbztsmtryatjoialnolweuramsfdtolhtbadtamtaaddyoeadlncsdwykaeykaeykaocytegtqdfhattaaddyoyadlradwklawkaycyksfpdmfttnsbreem')
  });


  it('should decode CryptoDetailedAccount with CryptoOutput p2pkh hdkey', () => {
    const cbor =
      'a101d90134d90193d9012fa503582102d2b36900396c9282fa14628566582f206a5dd0bcc8d5e892611806cafb0301f0045820637807030d55d01f9a0cb3a7839515d796bd07706386a6eddf06cc29a65a0e2906d90130a20186182cf500f500f5021ad34db33f07d90130a1018401f480f4081a78412e3a';

    const detailedAccount = CryptoDetailedAccount.fromCBOR(Buffer.from(cbor, 'hex'));

    // Get HDKey
    const cryptoOutput = detailedAccount.getAccount() as CryptoOutput;

    // Check tag
    expect( cryptoOutput.getRegistryType().getTag() ).toBe( RegistryTypes.CRYPTO_OUTPUT.getTag() );
    // Try to get path
    expect( cryptoOutput.getHDKey().getOrigin().getPath() ).toBe("44'/0'/0'");
  });

  // Errors
  it('should throw an error when creating CryptoDetailedAccount with CryptoOutput that uses CryptoECKey', () => {

    const cryptoOutputEckeyCbor = 'd90193d90132a103582102c6047f9441ed7d6d3045406e95c07cd85c778e4b8cef3ca7abac09b95c709ee5';
    const cryptoOutput = CryptoOutput.fromCBOR(Buffer.from(cryptoOutputEckeyCbor, 'hex'));

    // Create detailed account
    expect(() => {
      const detailedAccount = new CryptoDetailedAccount(cryptoOutput);
    }).toThrowError();

  });

  it("should throw an error when decoding CryptoDetailedAccount with CryptoOutput that uses CryptoECKey", () => {
    const cbor = 'a101d90134d90193d90132a103582102c6047f9441ed7d6d3045406e95c07cd85c778e4b8cef3ca7abac09b95c709ee5';

    expect(() => {
      const detailedAccount = CryptoDetailedAccount.fromCBOR(Buffer.from(cbor, 'hex'));
    }).toThrowError();
  })
  
  it('should throw an error when creating CryptoDetailedAccount with HDKey that doesnt have a path', () => {

    const hdkey = new CryptoHDKey({
      isMaster: false,
      key: Buffer.from(
        '02d2b36900396c9282fa14628566582f206a5dd0bcc8d5e892611806cafb0301f0',
        'hex',
      ),
      chainCode: Buffer.from(
        '637807030d55d01f9a0cb3a7839515d796bd07706386a6eddf06cc29a65a0e29',
        'hex',
      ),
      parentFingerprint: Buffer.from('78412e3a', 'hex'),
    });

    expect(() => {
      const detailedAccount = new CryptoDetailedAccount(hdkey);
    }).toThrowError();
  });

  it('should throw an error when decoding CryptoDetailedAccount with HDKey that doesnt have a path', () => {
    //a101d9012fa303582102d2b36900396c9282fa14628566582f206a5dd0bcc8d5e892611806cafb0301f0045820637807030d55d01f9a0cb3a7839515d796bd07706386a6eddf06cc29a65a0e29081a78412e3a
    const cbor = 'a101d9012fa303582102d2b36900396c9282fa14628566582f206a5dd0bcc8d5e892611806cafb0301f0045820637807030d55d01f9a0cb3a7839515d796bd07706386a6eddf06cc29a65a0e29081a78412e3a';

    expect(() => {
      const detailedAccount = CryptoDetailedAccount.fromCBOR(Buffer.from(cbor, 'hex'));
    }).toThrowError();
  });

  it('should throw an error when creating CryptoDetailedAccount with CryptoOutput that uses HDKey that doesnt have a path', () => {

    const scriptExpressions = [ScriptExpressions.PUBLIC_KEY_HASH];
    const hdkey = new CryptoHDKey({
      isMaster: false,
      key: Buffer.from(
        '02d2b36900396c9282fa14628566582f206a5dd0bcc8d5e892611806cafb0301f0',
        'hex',
      ),
      chainCode: Buffer.from(
        '637807030d55d01f9a0cb3a7839515d796bd07706386a6eddf06cc29a65a0e29',
        'hex',
      ),
      parentFingerprint: Buffer.from('78412e3a', 'hex'),
    });

    const cryptoOutput = new CryptoOutput(scriptExpressions, hdkey);

    expect(() => {
      const detailedAccount = new CryptoDetailedAccount(cryptoOutput);
      //console.log(detailedAccount.toCBOR().toString('hex')); // a101d90134d90193d9012fa303582102d2b36900396c9282fa14628566582f206a5dd0bcc8d5e892611806cafb0301f0045820637807030d55d01f9a0cb3a7839515d796bd07706386a6eddf06cc29a65a0e29081a78412e3a
    }).toThrowError();
  });

  it('should throw an error when decoding CryptoDetailedAccount with CryptoOutput that uses HDKey that doesnt have a path', () => {
    const cbor = 'a101d90134d90193d9012fa303582102d2b36900396c9282fa14628566582f206a5dd0bcc8d5e892611806cafb0301f0045820637807030d55d01f9a0cb3a7839515d796bd07706386a6eddf06cc29a65a0e29081a78412e3a';

    expect(() => {
      const detailedAccount = CryptoDetailedAccount.fromCBOR(Buffer.from(cbor, 'hex'));
    }).toThrowError();
 
  });

});


describe('Crypto Detailed Account with tokens', () => {
    
    it("should generate one solana CryptoDetailedAccount with one spl token", () => {
        const cryptoHDKey = CryptoHDKey.fromCBOR(Buffer.from("a203582102eae4b876a8696134b868f88cc2f51f715f2dbedb7446b8e6edf3d4541c4eb67b06d90130a10188182cf51901f5f500f500f5", 'hex'))

        const tokenIds = ['EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v']
    
        // Create detailed account
        const detailedAccount = new CryptoDetailedAccount(cryptoHDKey, tokenIds);

        expect(detailedAccount.getTokenIds()).toEqual(['EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v']);
    
        const cbor = detailedAccount.toCBOR().toString('hex');
        const ur = detailedAccount.toUREncoder(1000).nextPart();

        expect(cbor).toBe("a201d9012fa203582102eae4b876a8696134b868f88cc2f51f715f2dbedb7446b8e6edf3d4541c4eb67b06d90130a10188182cf51901f5f500f500f50281782c45506a465764643541756671535371654d32714e31787a7962617043384734774547476b5a77795444743176");
        expect(ur).toBe("ur:crypto-detailed-account/oeadtaaddloeaxhdclaowdverokopdinhseeroisyalksaykctjshedprnuyjyfgrovawewftyghceglrpkgamtaaddyoyadlocsdwykcfadykykaeykaeykaolyksdwfegdimfghgieieecfpkpiyjsgugujsihgteyjsglehksknkkidhsjofxetfleektfeflfljehtktkkghfyjyehkoseswvarp")
        
    });

    it("should remove 0x on encoding and add it on decoding on ETH contract ", () => {
      // Create a HDKey
      const originKeypath = new CryptoKeypath(
        [
          new PathComponent({ index: 60, hardened: true }),
          new PathComponent({ index: 0, hardened: true }),
          new PathComponent({ index: 0, hardened: true }),
          new PathComponent({ index: 0, hardened: false }),
          new PathComponent({ index: 1, hardened: false }),      
        ],
        Buffer.from('d34db33f', 'hex'),
      );
      const cryptoHDKey = new CryptoHDKey({
        isMaster: false,
        key: Buffer.from(
          '02d2b36900396c9282fa14628566582f206a5dd0bcc8d5e892611806cafb0301f0',
          'hex',
        ),
        origin: originKeypath,
        parentFingerprint: Buffer.from('78412e3a', 'hex'),
      });      
      
      //const cryptoHDKey = CryptoHDKey.fromCBOR(Buffer.from('a303582102d2b36900396c9282fa14628566582f206a5dd0bcc8d5e892611806cafb0301f006d90130a2018a183cf500f500f500f401f4021ad34db33f081a78412e3a'));

      // Contract address
      const tokenIds = ['0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48']
  
      // Create detailed account
      const detailedAccount = new CryptoDetailedAccount(cryptoHDKey, tokenIds);

      expect( detailedAccount.getTokenIds() ).toEqual(['0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48']); 
  
      const cbor = detailedAccount.toCBOR().toString('hex'); // a201d9012fa303582102d2b36900396c9282fa14628566582f206a5dd0bcc8d5e892611806cafb0301f006d90130a2018a183cf500f500f500f401f4021ad34db33f081a78412e3a0281d9010754a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48
      const ur = detailedAccount.toUREncoder(1000).nextPart(); // ur:crypto-detailed-account/oeadtaaddlotaxhdclaotdqdinaeesjzmolfzsbbidlpiyhddlcximhltirfsptlvsmohscsamsgzoaxadwtamtaaddyoeadlecsfnykaeykaeykaewkadwkaocytegtqdfhaycyksfpdmftaolytaadatghnbroinmeswclluensettntgedmnnpftoenamwmfdvehlpldk
 
      // Expect it to encode hex string as bytes type
      // expect(cbor).toBe('a201d9012fa303582102d2b36900396c9282fa14628566582f206a5dd0bcc8d5e892611806cafb0301f006d90130a2018a183cf500f500f500f401f4021ad34db33f081a78412e3a0281d9010754a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48');
      // expect(ur).toBe('ur:crypto-detailed-account/oeadtaaddlotaxhdclaotdqdinaeesjzmolfzsbbidlpiyhddlcximhltirfsptlvsmohscsamsgzoaxadwtamtaaddyoeadlecsfnykaeykaeykaewkadwkaocytegtqdfhaycyksfpdmftaolytaadatghnbroinmeswclluensettntgedmnnpftoenamwmfdvehlpldk');

      // Decode
      const newDetailedAccount = CryptoDetailedAccount.fromCBOR(Buffer.from(cbor, 'hex'));

      expect( newDetailedAccount.getTokenIds() ).toEqual(['0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48']);
  });

    it("should generateCryptoDetailedAccounttokens with HexString, Buffer and string types, should use bytes encoding on CBOR", () => {   
        // Create a HDKey
        const cryptoHDKey = CryptoHDKey.fromCBOR(Buffer.from('a203582102eae4b876a8696134b868f88cc2f51f715f2dbedb7446b8e6edf3d4541c4eb67b06d90130a1018a182cf5183cf500f500f400f4', 'hex'));

        // First 2 tokens should be hex strings last one will be string
        const hexToken = new HexString('0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48');
        const buff = Buffer.from('A0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 'hex');
        const tokenIds = [hexToken, buff, '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 'USDC-c76f1f']
    
        // Create detailed account
        const detailedAccount = new CryptoDetailedAccount(cryptoHDKey, tokenIds);

        expect( detailedAccount.getTokenIds() ).
        toEqual(
            ['0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
            '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
            '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
             'USDC-c76f1f']
            ); 
    
        const cbor = detailedAccount.toCBOR().toString('hex');
        const ur = detailedAccount.toUREncoder(1000).nextPart();

        // Encode addresses uso=ing bytes encoding, others as string
        expect(cbor).toBe("a201d9012fa203582102eae4b876a8696134b868f88cc2f51f715f2dbedb7446b8e6edf3d4541c4eb67b06d90130a1018a182cf5183cf500f500f400f40284d9010754a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48d9010754a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48d9010754a0b86991c6218b36c1d19d4a2e9eb0ce3606eb486b555344432d633736663166");
        expect(ur).toBe("ur:crypto-detailed-account/oeadtaaddloeaxhdclaowdverokopdinhseeroisyalksaykctjshedprnuyjyfgrovawewftyghceglrpkgamtaaddyoyadlecsdwykcsfnykaeykaewkaewkaolrtaadatghnbroinmeswclluensettntgedmnnpftoenamwmfdtaadatghnbroinmeswclluensettntgedmnnpftoenamwmfdtaadatghnbroinmeswclluensettntgedmnnpftoenamwmfdjegogufyfxdpiaemeniyehiylkqzjypl")
        
    });    
});