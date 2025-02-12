import { CryptoHDKey, CryptoOutput, URRegistryDecoder, CryptoKeypath, PathComponent, extend, ScriptExpressions } from '@keystonehq/bc-ur-registry';
import {CryptoPortfolioMetadata } from "@ngraveio/bc-ur-registry-crypto-portfolio-metadata";
import { CryptoDetailedAccount, CryptoPortfolioCoin, CryptoPortfolio} from '../src';
import { CoinIdentity, EllipticCurve } from '@ngraveio/bc-ur-registry-crypto-coin-identity';

describe('Crypto Portfolio', () => {
  it('should generate / decode CryptoPortfolio with empty coin array', () => {
    // Create a CryptoPortfolio
    const cryptoPortfolio = new CryptoPortfolio([]);

    // Expect coin array to be empty
    expect(cryptoPortfolio.getCoins()).toEqual([]);
    expect(cryptoPortfolio.getMetadata()).toBeUndefined();

    const cbor = cryptoPortfolio.toCBOR().toString('hex'); // a10180
    const ur = cryptoPortfolio.toUREncoder(1000).nextPart(); // ur:crypto-portfolio/oyadlatehdhhdk

    // Now decode the CBOR
    const decodedCryptoPortfolio = CryptoPortfolio.fromCBOR(Buffer.from(cbor, 'hex'));

    // Expect coin array to be empty
    expect(decodedCryptoPortfolio.getCoins()).toEqual([]);

    // Expect Metadata to be undefined
    expect(decodedCryptoPortfolio.getMetadata()).toBeUndefined();
  });

  it('should generate / decode CryptoPortfolio with empty coin array and MetaData', () => {
    // Metadata
    const metadata = new CryptoPortfolioMetadata({
      syncId: Buffer.from('123456781234567802D9044FA3011A71', 'hex'),
      languageCode: 'en',
      firmwareVersion: '1.2.1-1.rc',
      device: 'NGRAVE ZERO',
    });

    // Create a CryptoPortfolio
    const cryptoPortfolio = new CryptoPortfolio([], metadata);

    // Expect coin array to be empty
    expect(cryptoPortfolio.getCoins()).toEqual([]);

    const cbor = cryptoPortfolio.toCBOR().toString('hex'); // a2018002d9057ca40150123456781234567802d9044fa3011a710262656e036a312e322e312d312e7263046b4e4752415645205a45524f
    const ur = cryptoPortfolio.toUREncoder(1000).nextPart(); // ur:crypto-portfolio/oeadlaaotaahkeoxadgdbgeehfksbgeehfksaotaaagwotadcyjsaoidihjtaximehdmeydmehdpehdmjpiaaajeglflgmfphffecxhtfegmgwuowzlngw

    // Now decode the CBOR
    const decodedCryptoPortfolio = CryptoPortfolio.fromCBOR(Buffer.from(cbor, 'hex'));

    // Expect coin array to be empty
    expect(decodedCryptoPortfolio.getCoins()).toEqual([]);

    // Expect Metadata to be same as original
    expect(decodedCryptoPortfolio.getMetadata()?.getDevice()).toEqual('NGRAVE ZERO');
    expect(decodedCryptoPortfolio.getMetadata()?.getFirmwareVersion()).toEqual('1.2.1-1.rc');
    expect(decodedCryptoPortfolio.getMetadata()?.getLanguageCode()).toEqual('en');
    expect(decodedCryptoPortfolio.getMetadata()?.getSyncId()?.toString('hex')).toEqual('123456781234567802d9044fa3011a71');
  });  

  it('should generate / decode CryptoPortfolio with 1 coin', () => {
    // Create a coin identity
    const coinIdentity = new CoinIdentity(EllipticCurve.secp256k1, 60);

    // Sync Coin CBOR with 1 accounts
    const syncCoinCbor = 'a201d90579a2010802183c0281d9057aa101d9012fa303582102d2b36900396c9282fa14628566582f206a5dd0bcc8d5e892611806cafb0301f006d90130a2018a183cf500f500f500f401f4021ad34db33f081a78412e3a';
    const cryptoPortfolioCoin = CryptoPortfolioCoin.fromCBOR(Buffer.from(syncCoinCbor, 'hex'));

    // Create a CryptoPortfolio
    const cryptoPortfolio = new CryptoPortfolio([cryptoPortfolioCoin]);

    // Expect coin array to be 1
    expect(cryptoPortfolio.getCoins().length).toEqual(1);
    expect(cryptoPortfolio.getMetadata()).toBeUndefined();

    // Expect coin id to be ethereum
    expect(cryptoPortfolio.getCoins()[0].getCoinId().toURL()).toEqual('bc-coin://secp256k1/60');

    const cbor = cryptoPortfolio.toCBOR().toString('hex'); // a10181d9057ba201d90579a2010802183c0281d9057aa101d9012fa303582102d2b36900396c9282fa14628566582f206a5dd0bcc8d5e892611806cafb0301f006d90130a2018a183cf500f500f500f401f4021ad34db33f081a78412e3a

    // Decode payload
    const decodedCryptoPortfolio = CryptoPortfolio.fromCBOR(Buffer.from(cbor, 'hex'));

    // Expect coin array to be 1
    expect(decodedCryptoPortfolio.getCoins().length).toEqual(1);

    // Expect coin id to be ethereum
    expect(decodedCryptoPortfolio.getCoins()[0].getCoinId().toURL()).toEqual('bc-coin://secp256k1/60');

    // Expect CBOR account to be equal to the original one
    expect(decodedCryptoPortfolio.getCoins()[0].toCBOR().toString('hex')).toEqual(syncCoinCbor);

    // Expect Metadata to be undefined
    expect(decodedCryptoPortfolio.getMetadata()).toBeUndefined();

  });

  it('should generate / decode CryptoPortfolio with 2 coins', () => {

    const coinIdentityEth = new CoinIdentity(EllipticCurve.secp256k1, 60);

    const cryptoHDKeyEth = new CryptoHDKey({
      isMaster: false,
      key: Buffer.from(
        '02c00551a9b96c332410adaaed426dd0171311b8f5b6ebada246a6be8c24cac1c5',
        'hex',
      ),
      // m/44'/60'/0'/0/0
      origin: new CryptoKeypath(
        [
          new PathComponent({ index: 44, hardened: true }),
          new PathComponent({ index: 60, hardened: true }),
          new PathComponent({ index: 0, hardened: true }),
          new PathComponent({ index: 0, hardened: false }),
          new PathComponent({ index: 0, hardened: false }),
        ]
      ),
    });

    // USDT, SHIB
    const tokenIdsETH = ['0xdAC17F958D2ee523a2206206994597C13D831ec7', '0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE'];

    // Crate detailed account
    const detailedAccountETH = new CryptoDetailedAccount(cryptoHDKeyEth, tokenIdsETH);

    // Add it to coin
    const CryptoPortfolioCoinETH = new CryptoPortfolioCoin(coinIdentityEth, [detailedAccountETH]);

    // console.log('detailedETH', detailedAccountETH.toCBOR().toString('hex')); //a201d9012fa203582102c00551a9b96c332410adaaed426dd0171311b8f5b6ebada246a6be8c24cac1c506d90130a1018a182cf5183cf500f500f400f40282d9010754dac17f958d2ee523a2206206994597c13d831ec7d901075495ad61b0a150d79219dcf64e1e6cc01f0b64c4ce
    // console.log('syncCoinETH', CryptoPortfolioCoinETH.toCBOR().toString('hex')); //  a201d90579a3010802183c03f70281d9057aa201d9012fa203582102c00551a9b96c332410adaaed426dd0171311b8f5b6ebada246a6be8c24cac1c506d90130a1018a182cf5183cf500f500f400f40282d9010754dac17f958d2ee523a2206206994597c13d831ec7d901075495ad61b0a150d79219dcf64e1e6cc01f0b64c4ce

    /////// Solana

    // Create a coin identity (solana)
    const coinIdentitySol = new CoinIdentity(EllipticCurve.secp256k1, 501);

    // Create a HDKey
    const originKeypathSol = new CryptoKeypath(
      [
        new PathComponent({ index: 44, hardened: true }),
        new PathComponent({ index: 501, hardened: true }),
        new PathComponent({ index: 0, hardened: true }),  
      ],
    );
    const cryptoHDKey = new CryptoHDKey({
      isMaster: false,
      key: Buffer.from(
        '02d2b36900396c9282fa14628566582f206a5dd0bcc8d5e892611806cafb0301f0',
        'hex',
      ),
      origin: originKeypathSol,
    });

    // Tokens: Stepn and USDC
    const solanaTokens = ['7i5KKsX2weiTkry7jA4ZwSuXGhs5eJBEjY8vVxR4pfRx', 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'];

    // Add solana tokens
    const detailedAccount = new CryptoDetailedAccount(cryptoHDKey, solanaTokens);

    // Create sync coin with ethereum XPUB and solana tokens
    const cryptoPortfolioCoin = new CryptoPortfolioCoin(coinIdentitySol, [detailedAccount]);

    // console.log('detailed Sol', detailedAccount.toCBOR().toString('hex')); // a201d9012fa203582102d2b36900396c9282fa14628566582f206a5dd0bcc8d5e892611806cafb0301f006d90130a10186182cf51901f5f500f50282782c3769354b4b735832776569546b7279376a41345a7753755847687335654a42456a5938765678523470665278782c45506a465764643541756671535371654d32714e31787a7962617043384734774547476b5a77795444743176
    // console.log('syncCoin Sol', CryptoPortfolioCoin.toCBOR().toString('hex')); // a201d90579a30108021901f503f70281d9057aa201d9012fa203582102d2b36900396c9282fa14628566582f206a5dd0bcc8d5e892611806cafb0301f006d90130a10186182cf51901f5f500f50282782c3769354b4b735832776569546b7279376a41345a7753755847687335654a42456a5938765678523470665278782c45506a465764643541756671535371654d32714e31787a7962617043384734774547476b5a77795444743176

    // Create a CryptoPortfolio
    const cryptoPortfolio = new CryptoPortfolio([CryptoPortfolioCoinETH, cryptoPortfolioCoin]);

    // console.log('portfolio', cryptoPortfolio.toCBOR().toString('hex')); // a10182d9057ca201d90579a3010802183c03f70281d9057aa201d9012fa203582102c00551a9b96c332410adaaed426dd0171311b8f5b6ebada246a6be8c24cac1c506d90130a1018a182cf5183cf500f500f400f40282d9010754dac17f958d2ee523a2206206994597c13d831ec7d901075495ad61b0a150d79219dcf64e1e6cc01f0b64c4ced9057ca201d90579a30108021901f503f70281d9057aa201d9012fa203582102d2b36900396c9282fa14628566582f206a5dd0bcc8d5e892611806cafb0301f006d90130a10186182cf51901f5f500f50282782c3769354b4b735832776569546b7279376a41345a7753755847687335654a42456a5938765678523470665278782c45506a465764643541756671535371654d32714e31787a7962617043384734774547476b5a77795444743176

    // Expect metadata to be empty
    expect(cryptoPortfolio.getMetadata()).toBeUndefined();
    // Expect coin array to be 2
    expect(cryptoPortfolio.getCoins().length).toEqual(2);
    // Expect first coin to be Eth second coind to be Solana
    expect(cryptoPortfolio.getCoins()[0].getCoinId().toURL()).toEqual('bc-coin://secp256k1/60');
    expect(cryptoPortfolio.getCoins()[1].getCoinId().toURL()).toEqual('bc-coin://secp256k1/501');


    // Encode portfolio
    const cbor = cryptoPortfolio.toCBOR().toString('hex');
    const ur = cryptoPortfolio.toUREncoder(1000).nextPart();

    // console.log('cbor', cbor); // 10182d9057ca201d90579a3010802183c03f70281d9057aa201d9012fa203582102c00551a9b96c332410adaaed426dd0171311b8f5b6ebada246a6be8c24cac1c506d90130a1018a182cf5183cf500f500f400f40282d9010754dac17f958d2ee523a2206206994597c13d831ec7d901075495ad61b0a150d79219dcf64e1e6cc01f0b64c4ced9057ca201d90579a30108021901f503f70281d9057aa201d9012fa203582102d2b36900396c9282fa14628566582f206a5dd0bcc8d5e892611806cafb0301f006d90130a10186182cf51901f5f500f50282782c3769354b4b735832776569546b7279376a41345a7753755847687335654a42456a5938765678523470665278782c45506a465764643541756671535371654d32714e31787a7962617043384734774547476b5a77795444743176
    // console.log('ur', ur); // ur:crypto-portfolio/oyadlftaahkeoeadtaahkkotadayaocsfnaxylaolytaahknoeadtaaddloeaxhdclaortahgyptrhjzeodkbepmpkwefwjntichbwbyroykrpwmpmoefgolrnlkdksgseskamtaaddyoyadlecsdwykcsfnykaeykaewkaewkaolftaadatghtnselbmdlgdmvwcnoecxidamnlfemssefslscksttaadatghmdpmhspfoygdtsmocfuoynglckjzrtctbdiesstotaahkeoeadtaahkkotadayaocfadykaxylaolytaahknoeadtaaddloeaxhdclaotdqdinaeesjzmolfzsbbidlpiyhddlcximhltirfsptlvsmohscsamsgzoaxadwtamtaaddyoyadlncsdwykcfadykykaeykaolfksdweminecgrgrjkhdeyktihinghjejpkkemimfpeehtktgukphdflisjkecihgefwfeimhketkohfksgmeejoiygmksksdwfegdimfghgieieecfpkpiyjsgugujsihgteyjsglehksknkkidhsjofxetfleektfeflfljehtktkkghfyjyehkolakpgurf

    // Decode payload
    const decodedCryptoPortfolio = CryptoPortfolio.fromCBOR(Buffer.from(cbor, 'hex'));

    // Expect coin array to be same as original
    expect(decodedCryptoPortfolio.getCoins().length).toEqual(cryptoPortfolio.getCoins().length);
    // Expect metadata to be undefined
    expect(decodedCryptoPortfolio.getMetadata()).toBeUndefined();
    // Expect coin id to be equal to the one in cryptoPortfolio ( keep order )
    expect(decodedCryptoPortfolio.getCoins()[0].getCoinId().toURL()).toEqual(cryptoPortfolio.getCoins()[0].getCoinId().toURL());
    expect(decodedCryptoPortfolio.getCoins()[1].getCoinId().toURL()).toEqual(cryptoPortfolio.getCoins()[1].getCoinId().toURL());
    // Expect CBOR of the coins to be equal to the original one
    expect(decodedCryptoPortfolio.getCoins()[0].toCBOR().toString('hex')).toEqual(cryptoPortfolio.getCoins()[0].toCBOR().toString('hex'));
    expect(decodedCryptoPortfolio.getCoins()[1].toCBOR().toString('hex')).toEqual(cryptoPortfolio.getCoins()[1].toCBOR().toString('hex'));

  });

  it('should encode / decode Crypto Portfolio with 4 coins and Metadata', () => {
    const coinIdEth =   new CoinIdentity(EllipticCurve.secp256k1, 60);
    const coinIdSol =   new CoinIdentity(EllipticCurve.secp256k1, 501);
    const coinIdMatic = new CoinIdentity(EllipticCurve.secp256k1, 60, [137]);
    const coinIdBtc =   new CoinIdentity(EllipticCurve.secp256k1, 0);

    // Ethereum with USDC ERC20 token
    const accountEth = new CryptoDetailedAccount(
      new CryptoHDKey({
        isMaster: false,
        key: Buffer.from('032503D7DCA4FF0594F0404D56188542A18D8E0784443134C716178BC1819C3DD4', 'hex'),
        chainCode: Buffer.from('D2B36900396C9282FA14628566582F206A5DD0BCC8D5E892611806CAFB0301F0', 'hex'),
        origin: new CryptoKeypath(
          [
            new PathComponent({ index: 44, hardened: true }),
            new PathComponent({ index: 60, hardened: true }),
            new PathComponent({ index: 0, hardened: true }),  
          ]),
        children: new CryptoKeypath(
          [
            new PathComponent({ index: 0, hardened: false }),
            new PathComponent({ index: 1, hardened: false }), // TODO: how to make [0,1]
          ]
        )
      }),
      ['0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'] // USDC ERC20 token on Ethereum 
    );

    // Polygon with USDC ERC20 token
    const accountMatic = new CryptoDetailedAccount(
      new CryptoHDKey({
        isMaster: false,
        key: Buffer.from('032503D7DCA4FF0594F0404D56188542A18D8E0784443134C716178BC1819C3DD4', 'hex'),
        chainCode: Buffer.from('D2B36900396C9282FA14628566582F206A5DD0BCC8D5E892611806CAFB0301F0', 'hex'),
        origin: new CryptoKeypath(
          [
            new PathComponent({ index: 44, hardened: true }),
            new PathComponent({ index: 60, hardened: true }),
            new PathComponent({ index: 0, hardened: true }),  
          ]),
        children: new CryptoKeypath(
          [
            new PathComponent({ index: 0, hardened: false }),
            new PathComponent({ index: 1, hardened: false }), // TODO: how to make [0,1]
          ]
        )
      }),
      [ '2791Bca1f2de4661ED88A30C99A7a9449Aa84174' ] // USDC ERC20 token on Polygon 
    );    

    // Solana with USDC SPL token
    const accountSol = new CryptoDetailedAccount( 
      new CryptoHDKey({
        isMaster: false,
        key: Buffer.from('02EAE4B876A8696134B868F88CC2F51F715F2DBEDB7446B8E6EDF3D4541C4EB67B', 'hex'),
        origin: new CryptoKeypath([
          new PathComponent({ index: 44, hardened: true }),
          new PathComponent({ index: 501, hardened: true }),
          new PathComponent({ index: 0, hardened: true }),
          new PathComponent({ index: 0, hardened: true }),
        ])
      }),
      [ "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v" ] // USDC SPL token
    );

    // Account with crypto-output public key hash
    const accountBtc = new CryptoDetailedAccount(
      new CryptoOutput(
        [ScriptExpressions.PUBLIC_KEY_HASH],
        new CryptoHDKey({
          isMaster: false,
          key: Buffer.from('03EB3E2863911826374DE86C231A4B76F0B89DFA174AFB78D7F478199884D9DD32', 'hex'),
          chainCode: Buffer.from('6456A5DF2DB0F6D9AF72B2A1AF4B25F45200ED6FCC29C3440B311D4796B70B5B', 'hex'),
          origin: new CryptoKeypath([
            new PathComponent({ index: 44, hardened: true }),
            new PathComponent({ index: 0, hardened: true }),
            new PathComponent({ index: 0, hardened: true }),
          ]),
          children: new CryptoKeypath([
            new PathComponent({ index: 0, hardened: false }),
            new PathComponent({ index: 0, hardened: false }),
          ])
        })
      )
    );


    // Create the coins
    const cryptoCoinEth = new CryptoPortfolioCoin(coinIdEth, [accountEth]);
    const cryptoCoinSol = new CryptoPortfolioCoin(coinIdSol, [accountSol]);
    const cryptoCoinMatic = new CryptoPortfolioCoin(coinIdMatic, [accountMatic]);
    const cryptoCoinBtc = new CryptoPortfolioCoin(coinIdBtc, [accountBtc]);

    // Metadata
    const metadata = new CryptoPortfolioMetadata({
      syncId: Buffer.from('123456781234567802D9044FA3011A71', 'hex'),
      languageCode: 'en',
      firmwareVersion: '1.2.1-1.rc',
      device: 'NGRAVE ZERO',
    });

    // Create the Crypto Portfolio
    const cryptoPortfolio = new CryptoPortfolio([cryptoCoinEth, cryptoCoinSol, cryptoCoinMatic, cryptoCoinBtc], metadata);

    // Encode the Crypto Portfolio to CBOR
    const cbor = cryptoPortfolio.toCBOR().toString('hex'); // a20184d9057ba201d90579a3010802183c03f70281d9057aa201d9012fa4035821032503d7dca4ff0594f0404d56188542a18d8e0784443134c716178bc1819c3dd4045820d2b36900396c9282fa14628566582f206a5dd0bcc8d5e892611806cafb0301f006d90130a10186182cf5183cf500f507d90130a1018400f401f40281d9010754a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48d9057ba201d90579a30108021901f503f70281d9057aa201d9012fa203582102eae4b876a8696134b868f88cc2f51f715f2dbedb7446b8e6edf3d4541c4eb67b06d90130a10188182cf51901f5f500f500f50281782c45506a465764643541756671535371654d32714e31787a7962617043384734774547476b5a77795444743176d9057ba201d90579a3010802183c038118890281d9057aa201d9012fa4035821032503d7dca4ff0594f0404d56188542a18d8e0784443134c716178bc1819c3dd4045820d2b36900396c9282fa14628566582f206a5dd0bcc8d5e892611806cafb0301f006d90130a10186182cf5183cf500f507d90130a1018400f401f40281d90107542791bca1f2de4661ed88a30c99a7a9449aa84174d9057ba201d90579a30108020003f70281d9057aa101d90134d90193d9012fa403582103eb3e2863911826374de86c231a4b76f0b89dfa174afb78d7f478199884d9dd320458206456a5df2db0f6d9af72b2a1af4b25f45200ed6fcc29c3440b311d4796b70b5b06d90130a10186182cf500f500f507d90130a1018400f400f402d9057ca40150123456781234567802d9044fa3011a710262656e036a312e322e312d312e7263046b4e4752415645205a45524f
    const ur = cryptoPortfolio.toUREncoder(1000).nextPart(); // ur:crypto-portfolio/oeadlrtaahkgoeadtaahkkotadayaocsfnaxylaolytaahknoeadtaaddloxaxhdclaxdaaxtsuooxzmahmwwtfzgthfcslpfwoylgmnatlrfyeheestcmchluselynsfstyaahdcxtdqdinaeesjzmolfzsbbidlpiyhddlcximhltirfsptlvsmohscsamsgzoaxadwtamtaaddyoyadlncsdwykcsfnykaeykattaaddyoyadlraewkadwkaolytaadatghnbroinmeswclluensettntgedmnnpftoenamwmfdtaahkgoeadtaahkkotadayaocfadykaxylaolytaahknoeadtaaddloeaxhdclaowdverokopdinhseeroisyalksaykctjshedprnuyjyfgrovawewftyghceglrpkgamtaaddyoyadlocsdwykcfadykykaeykaeykaolyksdwfegdimfghgieieecfpkpiyjsgugujsihgteyjsglehksknkkidhsjofxetfleektfeflfljehtktkkghfyjyehkotaahkgoeadtaahkkotadayaocsfnaxlycsldaolytaahknoeadtaaddloxaxhdclaxdaaxtsuooxzmahmwwtfzgthfcslpfwoylgmnatlrfyeheestcmchluselynsfstyaahdcxtdqdinaeesjzmolfzsbbidlpiyhddlcximhltirfsptlvsmohscsamsgzoaxadwtamtaaddyoyadlncsdwykcsfnykaeykattaaddyoyadlraewkadwkaolytaadatghdimerfoywzuefghswelootbnnlosptfynypdfpjytaahkgoeadtaahkkotadayaoaeaxylaolytaahknoyadtaadeetaadmutaaddloxaxhdclaxwmfmdeiamecsdsemgtvsjzcncygrkowtrontzschgezokstswkkscfmklrtauteyaahdcxiehfonurdppfyntapejpproypegrdawkgmaewejlsfdtsrfybdehcaflmtrlbdhpamtaaddyoyadlncsdwykaeykaeykattaaddyoyadlraewkaewkaotaahkeoxadgdbgeehfksbgeehfksaotaaagwotadcyjsaoidihjtaximehdmeydmehdpehdmjpiaaajeglflgmfphffecxhtfegmgwcsoefewn

    // console.log('cbor', cbor); // a20184d9057ba201d90579a3010802183c03f70281d9057aa201d9012fa4035821032503d7dca4ff0594f0404d56188542a18d8e0784443134c716178bc1819c3dd4045820d2b36900396c9282fa14628566582f206a5dd0bcc8d5e892611806cafb0301f006d90130a10186182cf5183cf500f507d90130a1018400f401f40281d9010754a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48d9057ba201d90579a30108021901f503f70281d9057aa201d9012fa203582102eae4b876a8696134b868f88cc2f51f715f2dbedb7446b8e6edf3d4541c4eb67b06d90130a10188182cf51901f5f500f500f50281782c45506a465764643541756671535371654d32714e31787a7962617043384734774547476b5a77795444743176d9057ba201d90579a3010802183c038118890281d9057aa201d9012fa4035821032503d7dca4ff0594f0404d56188542a18d8e0784443134c716178bc1819c3dd4045820d2b36900396c9282fa14628566582f206a5dd0bcc8d5e892611806cafb0301f006d90130a10186182cf5183cf500f507d90130a1018400f401f40281d90107542791bca1f2de4661ed88a30c99a7a9449aa84174d9057ba201d90579a30108020003f70281d9057aa101d90134d90193d9012fa403582103eb3e2863911826374de86c231a4b76f0b89dfa174afb78d7f478199884d9dd320458206456a5df2db0f6d9af72b2a1af4b25f45200ed6fcc29c3440b311d4796b70b5b06d90130a10186182cf500f500f507d90130a1018400f400f402d9057ca40150123456781234567802d9044fa3011a710262656e036a312e322e312d312e7263046b4e4752415645205a45524f
    // console.log('ur', ur); // ur:crypto-portfolio/oeadlrtaahkgoeadtaahkkotadayaocsfnaxylaolytaahknoeadtaaddloxaxhdclaxdaaxtsuooxzmahmwwtfzgthfcslpfwoylgmnatlrfyeheestcmchluselynsfstyaahdcxtdqdinaeesjzmolfzsbbidlpiyhddlcximhltirfsptlvsmohscsamsgzoaxadwtamtaaddyoyadlncsdwykcsfnykaeykattaaddyoyadlraewkadwkaolytaadatghnbroinmeswclluensettntgedmnnpftoenamwmfdtaahkgoeadtaahkkotadayaocfadykaxylaolytaahknoeadtaaddloeaxhdclaowdverokopdinhseeroisyalksaykctjshedprnuyjyfgrovawewftyghceglrpkgamtaaddyoyadlocsdwykcfadykykaeykaeykaolyksdwfegdimfghgieieecfpkpiyjsgugujsihgteyjsglehksknkkidhsjofxetfleektfeflfljehtktkkghfyjyehkotaahkgoeadtaahkkotadayaocsfnaxlycsldaolytaahknoeadtaaddloxaxhdclaxdaaxtsuooxzmahmwwtfzgthfcslpfwoylgmnatlrfyeheestcmchluselynsfstyaahdcxtdqdinaeesjzmolfzsbbidlpiyhddlcximhltirfsptlvsmohscsamsgzoaxadwtamtaaddyoyadlncsdwykcsfnykaeykattaaddyoyadlraewkadwkaolytaadatghdimerfoywzuefghswelootbnnlosptfynypdfpjytaahkgoeadtaahkkotadayaoaeaxylaolytaahknoyadtaadeetaadmutaaddloxaxhdclaxwmfmdeiamecsdsemgtvsjzcncygrkowtrontzschgezokstswkkscfmklrtauteyaahdcxiehfonurdppfyntapejpproypegrdawkgmaewejlsfdtsrfybdehcaflmtrlbdhpamtaaddyoyadlncsdwykaeykaeykattaaddyoyadlraewkaewkaotaahkeoxadgdbgeehfksbgeehfksaotaaagwotadcyjsaoidihjtaximehdmeydmehdpehdmjpiaaajeglflgmfphffecxhtfegmgwcsoefewn

    // Decode payload
    const decodedCryptoPortfolio = CryptoPortfolio.fromCBOR(Buffer.from(cbor, 'hex'));

    // Expect decoded to have same number of coins
    expect(decodedCryptoPortfolio.getCoins().length).toEqual(cryptoPortfolio.getCoins().length);

    // Expect decoded to have same metadata
    expect(decodedCryptoPortfolio.getMetadata()?.getSyncId()).toEqual(cryptoPortfolio.getMetadata()?.getSyncId());
    expect(decodedCryptoPortfolio.getMetadata()?.getLanguageCode()).toEqual(cryptoPortfolio.getMetadata()?.getLanguageCode());
    expect(decodedCryptoPortfolio.getMetadata()?.getFirmwareVersion()).toEqual(cryptoPortfolio.getMetadata()?.getFirmwareVersion());
    expect(decodedCryptoPortfolio.getMetadata()?.getDevice()).toEqual(cryptoPortfolio.getMetadata()?.getDevice());

    // For each coin
    for (let i = 0; i < cryptoPortfolio.getCoins().length; i++) {
      // Expect decoded coins to have same coin identity
      expect(decodedCryptoPortfolio.getCoins()[i].getCoinId().toURL()).toEqual(cryptoPortfolio.getCoins()[i].getCoinId().toURL());

      // Expect decoded coins to have same number of accounts
      expect(decodedCryptoPortfolio.getCoins()[i].getDetailedAccounts()?.length).toEqual(cryptoPortfolio.getCoins()[i].getDetailedAccounts()?.length);

      // For each account
      for (let j = 0; j < (cryptoPortfolio.getCoins()[i]?.getDetailedAccounts()?.length || 0); j++) {
        // Expect decoded coins to have same tokens
        expect(decodedCryptoPortfolio.getCoins()[i].getDetailedAccounts()?.[j].getTokenIds()).toEqual(cryptoPortfolio.getCoins()[i].getDetailedAccounts()?.[j].getTokenIds());

        // Expect decoded coins to have same cbor
        expect(decodedCryptoPortfolio.getCoins()[i].getDetailedAccounts()?.[j].toCBOR().toString('hex')).toEqual(cryptoPortfolio.getCoins()[i].getDetailedAccounts()?.[j].toCBOR().toString('hex'));
      } // Accounts
    }// Coins
  });

});


//{1: [1403({1: 1401({1: 8, 2: 60, 3: undefined}), 2: [1402({1: 303({3: h'032503D7DCA4FF0594F0404D56188542A18D8E0784443134C716178BC1819C3DD4', 4: h'D2B36900396C9282FA14628566582F206A5DD0BCC8D5E892611806CAFB0301F0', 6: 304({1: [44, true, 60, true, 0, true]}), 7: 304({1: [0, false, 1, false]})}), 2: [263(h'A0B86991C6218B36C1D19D4A2E9EB0CE3606EB48')]})]}), 1403({1: 1401({1: 8, 2: 501, 3: undefined}), 2: [1402({1: 303({3: h'02EAE4B876A8696134B868F88CC2F51F715F2DBEDB7446B8E6EDF3D4541C4EB67B', 6: 304({1: [44, true, 501, true, 0, true, 0, true]})}), 2: ["EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"]})]}), 1403({1: 1401({1: 8, 2: 60, 3: [137]}), 2: [1402({1: 303({3: h'032503D7DCA4FF0594F0404D56188542A18D8E0784443134C716178BC1819C3DD4', 4: h'D2B36900396C9282FA14628566582F206A5DD0BCC8D5E892611806CAFB0301F0', 6: 304({1: [44, true, 60, true, 0, true]}), 7: 304({1: [0, false, 1, false]})}), 2: [263(h'2791BCA1F2DE4661ED88A30C99A7A9449AA84174')]})]}), 1403({1: 1401({1: 8, 2: 0, 3: undefined}), 2: [1402({1: 308(403(303({3: h'03EB3E2863911826374DE86C231A4B76F0B89DFA174AFB78D7F478199884D9DD32', 4: h'6456A5DF2DB0F6D9AF72B2A1AF4B25F45200ED6FCC29C3440B311D4796B70B5B', 6: 304({1: [44, true, 0, true, 0, true]}), 7: 304({1: [0, false, 0, false]})})))})]})], 2: 1404({1: h'123456781234567802D9044FA3011A71', 2: "en", 3: "1.2.1-1.rc", 4: "NGRAVE ZERO"})}