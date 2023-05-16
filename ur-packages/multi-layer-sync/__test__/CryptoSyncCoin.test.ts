import { CryptoHDKey, CryptoOutput, URRegistryDecoder, CryptoKeypath, PathComponent, extend, ScriptExpressions } from '@keystonehq/bc-ur-registry';

import { CryptoDetailedAccount, CryptoSyncCoin } from '../src';
import { HexString } from '@ngrave/bc-ur-registry-hex-string';
import { CryptoCoinIdentity, EllipticCurve } from '@ngrave/bc-ur-registry-crypto-coin-identity';

const { RegistryTypes, decodeToDataItem } = extend;

describe('Crypto Sync Coin with DetailedAccount', () => {

  it('should generate / decode CryptoSyncCoin with only coinIdentity', () => {
    // Create a coin identity
    const coinIdentity = new CryptoCoinIdentity(EllipticCurve.secp256k1, 60);

    // Create a CryptoSyncCoin
    const cryptoSyncCoin = new CryptoSyncCoin(coinIdentity, []);

    // Expect coinIdentity to be equal to the one in cryptoSyncCoin
    expect(cryptoSyncCoin.getCoinId().toURL()).toEqual(coinIdentity.toURL());

    // Expect other fields to be undefined
    expect(cryptoSyncCoin.getMasterFingerprint()).toBeUndefined();
    expect(cryptoSyncCoin.getAccounts()).toEqual([])
    expect(cryptoSyncCoin.getCryptoAccount()).toBeUndefined();
    expect(cryptoSyncCoin.getCryptoMultiAccounts()).toBeUndefined(); 
    expect(cryptoSyncCoin.getDetailedAccounts()).toEqual([]);

    const cbor = cryptoSyncCoin.toCBOR().toString('hex'); // d9057ba201d90579a3010802183c03f70280
    const ur = cryptoSyncCoin.toUREncoder(1000).nextPart(); // ur:crypto-sync-coin/taahkgoeadtaahkkotadayaocsfnaxylaolawfrponfm

    // Now decode the CBOR
    const decodedCryptoSyncCoin = CryptoSyncCoin.fromCBOR(Buffer.from(cbor, 'hex'));

    // expect decodedCryptoSyncCoin to be equal to cryptoSyncCoin
    // Start with coinIdentity
    expect(decodedCryptoSyncCoin.getCoinId().toURL()).toEqual(cryptoSyncCoin.getCoinId().toURL());

    // Expect other fields to be same undefined
    expect(decodedCryptoSyncCoin.getMasterFingerprint()).toEqual(cryptoSyncCoin.getMasterFingerprint());
    //expect(decodedCryptoSyncCoin.getAccounts()).toEqual(cryptoSyncCoin.getAccounts());
    expect(decodedCryptoSyncCoin.getCryptoAccount()).toEqual(cryptoSyncCoin.getCryptoAccount());
    expect(decodedCryptoSyncCoin.getCryptoMultiAccounts()).toEqual(cryptoSyncCoin.getCryptoMultiAccounts());
    expect(decodedCryptoSyncCoin.getDetailedAccounts()).toEqual(cryptoSyncCoin.getDetailedAccounts());
  });


  it('should generate / decode CryptoSyncCoin with 1 detailed account with HDKEY', () => {
    // Create a coin identity
    const coinIdentity = new CryptoCoinIdentity(EllipticCurve.secp256k1, 60);

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

    // Create a detailed account
    const detailedAccount = new CryptoDetailedAccount(cryptoHDKey);

    // Create a CryptoSyncCoin
    const cryptoSyncCoin = new CryptoSyncCoin(coinIdentity, [detailedAccount]);

    // Check values
    expect(cryptoSyncCoin.getCoinId().toURL()).toEqual(coinIdentity.toURL());
    expect(cryptoSyncCoin.getDetailedAccounts()?.[0].getCryptoHDKey()?.getOrigin().getPath()).toEqual(cryptoHDKey.getOrigin().getPath());

    expect(cryptoSyncCoin.getMasterFingerprint()).toBeUndefined();
    expect(cryptoSyncCoin.getCryptoAccount()).toBeUndefined();
    expect(cryptoSyncCoin.getCryptoMultiAccounts()).toBeUndefined(); 

    const cbor = cryptoSyncCoin.toCBOR().toString('hex'); // a201d90579a3010802183c03f70281d9057aa101d9012fa303582102d2b36900396c9282fa14628566582f206a5dd0bcc8d5e892611806cafb0301f006d90130a2018a183cf500f500f500f401f4021ad34db33f081a78412e3a
    const ur = cryptoSyncCoin.toUREncoder(1000).nextPart(); // ur:crypto-sync-coin/oeadtaahkkotadayaocsfnaxylaolytaahknoyadtaaddlotaxhdclaotdqdinaeesjzmolfzsbbidlpiyhddlcximhltirfsptlvsmohscsamsgzoaxadwtamtaaddyoeadlecsfnykaeykaeykaewkadwkaocytegtqdfhaycyksfpdmftfxrekesp

    // console.log(cbor, ur);

    // Now decode the CBOR
    const decodedCryptoSyncCoin = CryptoSyncCoin.fromCBOR(Buffer.from(cbor, 'hex'));

    // expect decodedCryptoSyncCoin to be equal to cryptoSyncCoin
    // Start with coinIdentity
    expect(decodedCryptoSyncCoin.getCoinId().toURL()).toEqual(cryptoSyncCoin.getCoinId().toURL());
    expect(decodedCryptoSyncCoin.getDetailedAccounts()?.[0].getCryptoHDKey()?.getOrigin().getPath()).toEqual(cryptoHDKey.getOrigin().getPath());

    // Expect other fields to be same undefined
    expect(decodedCryptoSyncCoin.getMasterFingerprint()).toEqual(cryptoSyncCoin.getMasterFingerprint());
    expect(decodedCryptoSyncCoin.getCryptoAccount()).toEqual(cryptoSyncCoin.getCryptoAccount());
    expect(decodedCryptoSyncCoin.getCryptoMultiAccounts()).toEqual(cryptoSyncCoin.getCryptoMultiAccounts());
  });

  it('should generate / decode CryptoSyncCoin with 1 detailed account with CryptoOutput with HDKey', () => {
    // Create a coin identity
    const coinIdentity = new CryptoCoinIdentity(EllipticCurve.secp256k1, 60);

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

    const cryptoOutput = new CryptoOutput([ScriptExpressions.PUBLIC_KEY_HASH], cryptoHDKey);
    const detailedAccount = new CryptoDetailedAccount(cryptoOutput);

    // Create sync coin
    const cryptoSyncCoin = new CryptoSyncCoin(coinIdentity, [detailedAccount]);

    // Test values
    expect(cryptoSyncCoin.getCoinId().toURL()).toEqual(coinIdentity.toURL());
    expect(cryptoSyncCoin.getDetailedAccounts()?.[0].getCryptoOutput()?.getHDKey()?.getOrigin().getPath()).toEqual(cryptoHDKey.getOrigin().getPath());

    // Expect other fields to be same undefined
    expect(cryptoSyncCoin.getMasterFingerprint()).toBeUndefined();
    expect(cryptoSyncCoin.getCryptoAccount()).toBeUndefined();
    expect(cryptoSyncCoin.getCryptoMultiAccounts()).toBeUndefined(); 

    // Encode to CBOR
    const cbor = cryptoSyncCoin.toCBOR().toString('hex'); // a201d90579a3010802183c03f70281d9057aa101d9012fa303582102d2b36900396c9282fa14628566582f206a5dd0bcc8d5e892611806cafb0301f006d90130a2018a183cf500f500f500f401f4021ad34db33f081a78412e3a
    const ur = cryptoSyncCoin.toUREncoder(1000).nextPart(); // ur:crypto-sync-coin/oeadtaahkkotadayaocsfnaxylaolytaahknoyadtaaddlotaxhdclaotdqdinaeesjzmolfzsbbidlpiyhddlcximhltirfsptlvsmohscsamsgzoaxadwtamtaaddyoeadlecsfnykaeykaeykaewkadwkaocytegtqdfhaycyksfpdmftfxrekesp

    // console.log(cbor, ur);

    // Now decode the CBOR
    const decodedCryptoSyncCoin = CryptoSyncCoin.fromCBOR(Buffer.from(cbor, 'hex'));

    // Test values
    expect(decodedCryptoSyncCoin.getCoinId().toURL()).toEqual(coinIdentity.toURL());
    expect(decodedCryptoSyncCoin.getDetailedAccounts()?.[0].getCryptoOutput()?.getHDKey()?.getOrigin().getPath()).toEqual(cryptoHDKey.getOrigin().getPath());

    // Expect other fields to be same undefined
    expect(decodedCryptoSyncCoin.getMasterFingerprint()).toEqual(cryptoSyncCoin.getMasterFingerprint());
    expect(decodedCryptoSyncCoin.getCryptoAccount()).toEqual(cryptoSyncCoin.getCryptoAccount());
    expect(decodedCryptoSyncCoin.getCryptoMultiAccounts()).toEqual(cryptoSyncCoin.getCryptoMultiAccounts());    

  });  

  it('should generate CryptoSyncCoin with 2 detailed account', () => {
    // Create a coin identity
    const coinIdentity = new CryptoCoinIdentity(EllipticCurve.secp256k1, 60);

    const cryptoHDKey = new CryptoHDKey({
      isMaster: false,
      key: Buffer.from(
        '02d2b36900396c9282fa14628566582f206a5dd0bcc8d5e892611806cafb0301f0',
        'hex',
      ),
      origin: new CryptoKeypath(
        [
          new PathComponent({ index: 60, hardened: true }),
          new PathComponent({ index: 0, hardened: true }),
          new PathComponent({ index: 0, hardened: true }),
          new PathComponent({ index: 0, hardened: false }),
          new PathComponent({ index: 0, hardened: false }),      
        ]
      ),
      parentFingerprint: Buffer.from('78412e3a', 'hex'),
    });

    const cryptoHDKey2 = new CryptoHDKey({
      isMaster: false,
      key: Buffer.from(
        '02d2b36900396c9282fa14628566582f206a5dd0bcc8d5e892611806cafb0301f0',
        'hex',
      ),
      origin: new CryptoKeypath(
        [
          new PathComponent({ index: 60, hardened: true }),
          new PathComponent({ index: 0, hardened: true }),
          new PathComponent({ index: 0, hardened: true }),
          new PathComponent({ index: 0, hardened: false }),
          new PathComponent({ index: 1, hardened: false }),      
        ]
      ),
      parentFingerprint: Buffer.from('78412e3a', 'hex'),
    });    

    // Create a detailed account
    const detailedAccount = new CryptoDetailedAccount(cryptoHDKey);
    const detailedAccount2 = new CryptoDetailedAccount(cryptoHDKey2);

    // Create a CryptoSyncCoin
    const cryptoSyncCoin = new CryptoSyncCoin(coinIdentity, [detailedAccount, detailedAccount2]);

    // Check values
    expect(cryptoSyncCoin.getCoinId().toURL()).toEqual(coinIdentity.toURL());
    expect(cryptoSyncCoin.getDetailedAccounts()?.length).toEqual(2);
    expect(cryptoSyncCoin.getDetailedAccounts()?.[0].getCryptoHDKey()?.getOrigin().getPath()).toEqual(cryptoHDKey.getOrigin().getPath());
    expect(cryptoSyncCoin.getDetailedAccounts()?.[1].getCryptoHDKey()?.getOrigin().getPath()).toEqual(cryptoHDKey2.getOrigin().getPath());

    expect(cryptoSyncCoin.getMasterFingerprint()).toBeUndefined();
    expect(cryptoSyncCoin.getCryptoAccount()).toBeUndefined();
    expect(cryptoSyncCoin.getCryptoMultiAccounts()).toBeUndefined(); 

    const cbor = cryptoSyncCoin.toCBOR().toString('hex'); // a201d90579a3010802183c03f70281d9057aa101d9012fa303582102d2b36900396c9282fa14628566582f206a5dd0bcc8d5e892611806cafb0301f006d90130a2018a183cf500f500f500f401f4021ad34db33f081a78412e3a
    const ur = cryptoSyncCoin.toUREncoder(1000).nextPart(); // ur:crypto-sync-coin/oeadtaahkkotadayaocsfnaxylaolytaahknoyadtaaddlotaxhdclaotdqdinaeesjzmolfzsbbidlpiyhddlcximhltirfsptlvsmohscsamsgzoaxadwtamtaaddyoeadlecsfnykaeykaeykaewkadwkaocytegtqdfhaycyksfpdmftfxrekesp

    // console.log(cbor, ur);

    // Now decode the CBOR
    const decodedCryptoSyncCoin = CryptoSyncCoin.fromCBOR(Buffer.from(cbor, 'hex'));

    // expect decodedCryptoSyncCoin to be equal to cryptoSyncCoin
    // Start with coinIdentity
    expect(decodedCryptoSyncCoin.getCoinId().toURL()).toEqual(cryptoSyncCoin.getCoinId().toURL());
    expect(cryptoSyncCoin.getDetailedAccounts()?.length).toEqual(2);
    expect(decodedCryptoSyncCoin.getDetailedAccounts()?.[0].getCryptoHDKey()?.getOrigin().getPath()).toEqual(cryptoHDKey.getOrigin().getPath());
    expect(decodedCryptoSyncCoin.getDetailedAccounts()?.[1].getCryptoHDKey()?.getOrigin().getPath()).toEqual(cryptoHDKey2.getOrigin().getPath());

    // Expect other fields to be same undefined
    expect(decodedCryptoSyncCoin.getMasterFingerprint()).toEqual(cryptoSyncCoin.getMasterFingerprint());
    //expect(decodedCryptoSyncCoin.getAccounts().toString()).toEqual(cryptoSyncCoin.getAccounts().toString());
    expect(decodedCryptoSyncCoin.getCryptoAccount()).toEqual(cryptoSyncCoin.getCryptoAccount());
    expect(decodedCryptoSyncCoin.getCryptoMultiAccounts()).toEqual(cryptoSyncCoin.getCryptoMultiAccounts());
  }); 


  it('should generate CryptoSyncCoin with 2 detailed account with tokens', () => {
    // Create a coin identity
    const coinIdentity = new CryptoCoinIdentity(EllipticCurve.secp256k1, 60);

    const cryptoHDKey = new CryptoHDKey({
      isMaster: false,
      key: Buffer.from(
        '02d2b36900396c9282fa14628566582f206a5dd0bcc8d5e892611806cafb0301f0',
        'hex',
      ),
      origin: new CryptoKeypath(
        [
          new PathComponent({ index: 60, hardened: true }),
          new PathComponent({ index: 0, hardened: true }),
          new PathComponent({ index: 0, hardened: true }),
          new PathComponent({ index: 0, hardened: false }),
          new PathComponent({ index: 0, hardened: false }),      
        ]
      ),
      parentFingerprint: Buffer.from('78412e3a', 'hex'),
    });

    const tokenIds = ['0xdac17f958d2ee523a2206206994597c13d831ec7', '0xb8c77482e45f1f44de1745f52c74426c631bdd52'];


    const cryptoHDKey2 = CryptoHDKey.fromCBOR(Buffer.from("a203582102eae4b876a8696134b868f88cc2f51f715f2dbedb7446b8e6edf3d4541c4eb67b06d90130a10188182cf51901f5f500f500f5", 'hex'))

    const tokenIds2 = ['EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v']

    // Create a detailed account
    const detailedAccount = new CryptoDetailedAccount(cryptoHDKey, tokenIds);
    const detailedAccount2 = new CryptoDetailedAccount(cryptoHDKey2, tokenIds2);

    // Create a CryptoSyncCoin
    const cryptoSyncCoin = new CryptoSyncCoin(coinIdentity, [detailedAccount, detailedAccount2]);

    // Test if values are correct
    expect(cryptoSyncCoin.getCoinId().toURL()).toEqual(coinIdentity.toURL());
    expect(cryptoSyncCoin.getDetailedAccounts()?.length).toEqual(2);
    expect(cryptoSyncCoin.getDetailedAccounts()?.[0].getCryptoHDKey()?.getOrigin().getPath()).toEqual(cryptoHDKey.getOrigin().getPath());
    expect(cryptoSyncCoin.getDetailedAccounts()?.[1].getCryptoHDKey()?.getOrigin().getPath()).toEqual(cryptoHDKey2.getOrigin().getPath());
    expect(cryptoSyncCoin.getDetailedAccounts()?.[0].getTokenIds()).toEqual(tokenIds);
    expect(cryptoSyncCoin.getDetailedAccounts()?.[1].getTokenIds()).toEqual(tokenIds2);

    // Undefined fields
    expect(cryptoSyncCoin.getMasterFingerprint()).toBeUndefined();
    expect(cryptoSyncCoin.getCryptoAccount()).toBeUndefined();
    expect(cryptoSyncCoin.getCryptoMultiAccounts()).toBeUndefined();


    const cbor = cryptoSyncCoin.toCBOR().toString('hex'); // a201d90579a3010802183c03f70282d9057aa201d9012fa303582102d2b36900396c9282fa14628566582f206a5dd0bcc8d5e892611806cafb0301f006d90130a1018a183cf500f500f500f400f4081a78412e3a0282d9010754dac17f958d2ee523a2206206994597c13d831ec7d9010754b8c77482e45f1f44de1745f52c74426c631bdd52d9057aa201d9012fa203582102eae4b876a8696134b868f88cc2f51f715f2dbedb7446b8e6edf3d4541c4eb67b06d90130a10188182cf51901f5f500f500f50281782c45506a465764643541756671535371654d32714e31787a7962617043384734774547476b5a77795444743176
    const ur = cryptoSyncCoin.toUREncoder(1000).nextPart(); // ur:crypto-sync-coin/oeadtaahkkotadayaocsfnaxylaolftaahknoeadtaaddlotaxhdclaotdqdinaeesjzmolfzsbbidlpiyhddlcximhltirfsptlvsmohscsamsgzoaxadwtamtaaddyoyadlecsfnykaeykaeykaewkaewkaycyksfpdmftaolftaadatghtnselbmdlgdmvwcnoecxidamnlfemssefslscksttaadatghrostjylfvehectfyuechfeykdwjyfwjziacwutgmtaahknoeadtaaddloeaxhdclaowdverokopdinhseeroisyalksaykctjshedprnuyjyfgrovawewftyghceglrpkgamtaaddyoyadlocsdwykcfadykykaeykaeykaolyksdwfegdimfghgi

    //expect(cbor).toBe('a201d90579a3010802183c03f70282d9057aa201d9012fa303582102d2b36900396c9282fa14628566582f206a5dd0bcc8d5e892611806cafb0301f006d90130a1018a183cf500f500f500f400f4081a78412e3a0282d9010754dac17f958d2ee523a2206206994597c13d831ec7d9010754b8c77482e45f1f44de1745f52c74426c631bdd52d9057aa201d9012fa203582102eae4b876a8696134b868f88cc2f51f715f2dbedb7446b8e6edf3d4541c4eb67b06d90130a10188182cf51901f5f500f500f50281782c45506a465764643541756671535371654d32714e31787a7962617043384734774547476b5a77795444743176')
    //console.log(cbor, ur);

    // Decode from CBOR
    const decodedCryptoSyncCoin = CryptoSyncCoin.fromCBOR(Buffer.from(cbor, 'hex'));
    expect(decodedCryptoSyncCoin.getCoinId().toURL()).toEqual(coinIdentity.toURL());

    expect(decodedCryptoSyncCoin.getDetailedAccounts()?.length).toEqual(2);
    expect(decodedCryptoSyncCoin.getDetailedAccounts()?.[0].getCryptoHDKey()?.getOrigin().getPath()).toEqual(cryptoHDKey.getOrigin().getPath());
    expect(decodedCryptoSyncCoin.getDetailedAccounts()?.[1].getCryptoHDKey()?.getOrigin().getPath()).toEqual(cryptoHDKey2.getOrigin().getPath());
    expect(decodedCryptoSyncCoin.getDetailedAccounts()?.[0].getTokenIds()).toEqual(tokenIds);
    expect(decodedCryptoSyncCoin.getDetailedAccounts()?.[1].getTokenIds()).toEqual(tokenIds2);

    // Undefined fields
    expect(decodedCryptoSyncCoin.getMasterFingerprint()).toBeUndefined();
    expect(decodedCryptoSyncCoin.getCryptoAccount()).toBeUndefined();
    expect(decodedCryptoSyncCoin.getCryptoMultiAccounts()).toBeUndefined();    

  });    

    // Test with same coin identity and same derivation path on hdkey
  //it('should generate CryptoSyncCoin with different coin BIP44 path on coin identity and hdkey', () => {
  it('should allow diffent BIP44 coin ID on coin identity and HDKey Path Coin Id', () => {
    // Create a bitcoin coin identity
    const coinIdentity = new CryptoCoinIdentity(EllipticCurve.secp256k1, 0);

    // Create an etherum path
    const cryptoHDKey = new CryptoHDKey({
      isMaster: false,
      key: Buffer.from(
        '02d2b36900396c9282fa14628566582f206a5dd0bcc8d5e892611806cafb0301f0',
        'hex',
      ),
      origin: new CryptoKeypath(
        [
          new PathComponent({ index: 60, hardened: true }),
          new PathComponent({ index: 0, hardened: true }),
          new PathComponent({ index: 0, hardened: true }),
          new PathComponent({ index: 0, hardened: false }),
          new PathComponent({ index: 0, hardened: false }),      
        ]
      ),
      parentFingerprint: Buffer.from('78412e3a', 'hex'),
    });

    // Create a detailed account
    const detailedAccount = new CryptoDetailedAccount(cryptoHDKey);

    // Create a CryptoSyncCoin
    const cryptoSyncCoin = new CryptoSyncCoin(coinIdentity, [detailedAccount]);

    // Test values
    // Coin ID type is bitcoin
    expect(cryptoSyncCoin.getCoinId().getType()).toEqual(0);
    // But derivation path is for Ethereum, this is perfectly valid, I can generate a bitcoin address from any public key
    expect(cryptoSyncCoin.getDetailedAccounts()?.length).toEqual(1);
    expect(cryptoSyncCoin.getDetailedAccounts()?.[0].getCryptoHDKey()?.getOrigin().getComponents()[0].getIndex()).toEqual(60);

    //  Test encoding and decoding
    const cbor = cryptoSyncCoin.toCBOR().toString('hex');
    const ur = cryptoSyncCoin.toUREncoder(1000).nextPart();

    // Decode from CBOR
    const decodedCryptoSyncCoin = CryptoSyncCoin.fromCBOR(Buffer.from(cbor, 'hex'));

    expect(decodedCryptoSyncCoin.getCoinId().toURL()).toEqual(coinIdentity.toURL());
    expect(decodedCryptoSyncCoin.getDetailedAccounts()?.[0].getCryptoHDKey()?.getOrigin().getComponents()[0].getIndex()).toEqual(60);

    // Coin BIP44 id and origin path BIP44 id can be different
    expect(decodedCryptoSyncCoin.getCoinId().getType()).not.toEqual(decodedCryptoSyncCoin.getDetailedAccounts()?.[0].getCryptoHDKey()?.getOrigin().getComponents()[0].getIndex());
      
  });

  // TODO: Test error cases
  
});