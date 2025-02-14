import { HDKey, Keypath, PathComponent, OutputDescriptor } from '@ngraveio/ur-blockchain-commons'
import { DetailedAccount } from '../src'
import { HexString } from '@ngraveio/ur-hex-string'

describe('Crypto Detailed Account', () => {
  it('should generate CryptoDetailedAccount with hdkey', () => {
    const originKeyPath = new Keypath({ path: "m/44'/501'/0'/0'" })

    // Create a HDKey
    const cryptoHDKey = new HDKey({
      isMaster: false,
      keyData: Buffer.from('02eae4b876a8696134b868f88cc2f51f715f2dbedb7446b8e6edf3d4541c4eb67b', 'hex'),
      origin: originKeyPath,
    })

    // Create detailed account
    const detailedAccount = new DetailedAccount({
      account: cryptoHDKey,
    })

    const hex = detailedAccount.toHex()
    const ur = detailedAccount.toUr()

    expect(hex).toBe('a101d99d6fa301f403582102eae4b876a8696134b868f88cc2f51f715f2dbedb7446b8e6edf3d4541c4eb67b06d99d70a10188182cf51901f5f500f500f5')
    expect(ur.toString()).toBe(
      'ur:detailed-account/oyadtantjlotadwkaxhdclaowdverokopdinhseeroisyalksaykctjshedprnuyjyfgrovawewftyghceglrpkgamtantjooyadlocsdwykcfadykykaeykaeykionnimfd'
    )
  })

  it('should decode CryptoDetailedAccount with hdkey', () => {
    const hex = 'a101d99d6fa301f403582102eae4b876a8696134b868f88cc2f51f715f2dbedb7446b8e6edf3d4541c4eb67b06d99d70a10188182cf51901f5f500f500f5'

    const detailedAccount = DetailedAccount.fromHex(hex) as DetailedAccount

    // Get HDKey
    const hdKey = detailedAccount.getAccount() as HDKey

    // Check tag
    expect(hdKey.type.tag).toBe(HDKey.tag)
    // Try to get path
    expect(hdKey.getOrigin()?.toString()).toBe("44'/501'/0'/0'")
  })

  it('should generate CryptoDetailedAccount with CryptoOutput p2pkh hdkey', () => {
    const originKeypath = new Keypath({ path: "m/44'/0'/0'", sourceFingerprint: 3545084735 })
    const childrenKeypath = new Keypath({ path: "1/*" })
    const hdkey = new HDKey({
      isMaster: false,
      keyData: Buffer.from('02d2b36900396c9282fa14628566582f206a5dd0bcc8d5e892611806cafb0301f0', 'hex'),
      chainCode: Buffer.from('637807030d55d01f9a0cb3a7839515d796bd07706386a6eddf06cc29a65a0e29', 'hex'),
      origin: originKeypath,
      children: childrenKeypath,
      parentFingerprint: 2017537594,
    })

    const cryptoOutput = new OutputDescriptor({
      source: 'pkh(@0)',
      keys: [hdkey],
    })

    const cryptoOutputHex = 'a20167706b68284030290281d99d6fa601f403582102d2b36900396c9282fa14628566582f206a5dd0bcc8d5e892611806cafb0301f0045820637807030d55d01f9a0cb3a7839515d796bd07706386a6eddf06cc29a65a0e2906d99d70a20186182cf500f500f5021ad34db33f07d99d70a1018401f480f4081a78412e3a'

    expect(cryptoOutput.toHex()).toBe(cryptoOutputHex)

    // Create detailed account
    const detailedAccount = new DetailedAccount({account: cryptoOutput})

    const hex = detailedAccount.toHex()
    const ur = detailedAccount.toUr() 

    expect(hex).toBe(
      'a101d99d74a20167706b68284030290281d99d6fa601f403582102d2b36900396c9282fa14628566582f206a5dd0bcc8d5e892611806cafb0301f0045820637807030d55d01f9a0cb3a7839515d796bd07706386a6eddf06cc29a65a0e2906d99d70a20186182cf500f500f5021ad34db33f07d99d70a1018401f480f4081a78412e3a'
    )
    expect(ur.toString()).toBe(
      'ur:detailed-account/oyadtantjyoeadiojojeisdefzdydtaolytantjloladwkaxhdclaotdqdinaeesjzmolfzsbbidlpiyhddlcximhltirfsptlvsmohscsamsgzoaxadwtaahdcxiaksataxbtgotictnybnqdoslsmdbztsmtryatjoialnolweuramsfdtolhtbadtamtantjooeadlncsdwykaeykaeykaocytegtqdfhattantjooyadlradwklawkaycyksfpdmftrdlfaokb'
    )
  })

  it('should decode CryptoDetailedAccount with CryptoOutput p2pkh hdkey', () => {
    const hex =
      'a101d99d74a20167706b68284030290281d99d6fa601f403582102d2b36900396c9282fa14628566582f206a5dd0bcc8d5e892611806cafb0301f0045820637807030d55d01f9a0cb3a7839515d796bd07706386a6eddf06cc29a65a0e2906d99d70a20186182cf500f500f5021ad34db33f07d99d70a1018401f480f4081a78412e3a'

    const detailedAccount = DetailedAccount.fromHex(hex) as DetailedAccount;

    // Get HDKey
    const cryptoOutput = detailedAccount.getAccount() as OutputDescriptor

    // Check tag
    expect(cryptoOutput.type.tag).toBe(OutputDescriptor.tag);
    //@ts-ignore
    expect(cryptoOutput.data.keys[0]).toBeInstanceOf(HDKey)
    // @ts-ignore
    expect(cryptoOutput.data?.keys?.[0]?.getOrigin().toString()).toBe("44'/0'/0'")
  })

  // Errors
  it('should throw an error when creating CryptoDetailedAccount with HDKey that doesnt have a path', () => {
    const hdkey = new HDKey({
      isMaster: false,
      keyData: Buffer.from('02d2b36900396c9282fa14628566582f206a5dd0bcc8d5e892611806cafb0301f0', 'hex'),
      chainCode: Buffer.from('637807030d55d01f9a0cb3a7839515d796bd07706386a6eddf06cc29a65a0e29', 'hex'),
      parentFingerprint: 2017537594,
    })

    expect(() => {
      const detailedAccount = new DetailedAccount({account: hdkey})
    }).toThrowError()
  })

  it('should throw an error when decoding CryptoDetailedAccount with HDKey that doesnt have a path', () => {
    const hex =
      'a101d9012fa303582102d2b36900396c9282fa14628566582f206a5dd0bcc8d5e892611806cafb0301f0045820637807030d55d01f9a0cb3a7839515d796bd07706386a6eddf06cc29a65a0e29081a78412e3a'

    expect(() => {
      const detailedAccount = DetailedAccount.fromHex(hex)
    }).toThrowError()
  })

  it('should throw an error when creating CryptoDetailedAccount with CryptoOutput that uses HDKey that doesnt have a path', () => {
    const hdkey = new HDKey({
      isMaster: false,
      keyData: Buffer.from('02d2b36900396c9282fa14628566582f206a5dd0bcc8d5e892611806cafb0301f0', 'hex'),
      chainCode: Buffer.from('637807030d55d01f9a0cb3a7839515d796bd07706386a6eddf06cc29a65a0e29', 'hex'),
      parentFingerprint: 2017537594,
    })

    const cryptoOutput = new OutputDescriptor({source: 'pkh(@0)', keys: [hdkey]})

    expect(() => {
      const detailedAccount = new DetailedAccount({account: cryptoOutput})
      //console.log(detailedAccount.toHex().toString('hex')); // a101d90134d90193d9012fa303582102d2b36900396c9282fa14628566582f206a5dd0bcc8d5e892611806cafb0301f0045820637807030d55d01f9a0cb3a7839515d796bd07706386a6eddf06cc29a65a0e29081a78412e3a
    }).toThrowError()
  })
})

describe('Crypto Detailed Account with tokens', () => {
  it('should generate one solana CryptoDetailedAccount with one spl token', () => {
    const cryptoHDKey = HDKey.fromHex('A203582102EAE4B876A8696134B868F88CC2F51F715F2DBEDB7446B8E6EDF3D4541C4EB67B06D99D70A10188182CF51901F5F500F500F5')

    const tokenIds = ['EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v']

    // Create detailed account
    const detailedAccount = new DetailedAccount({
      account: cryptoHDKey,
      tokenIds
    })

    expect(detailedAccount.getTokenIds()).toEqual(['EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'])

    const hex = detailedAccount.toHex()
    const ur = detailedAccount.toUr()

    expect(hex).toBe(
      'a201d99d6fa203582102eae4b876a8696134b868f88cc2f51f715f2dbedb7446b8e6edf3d4541c4eb67b06d99d70a10188182cf51901f5f500f500f50281782c45506a465764643541756671535371654d32714e31787a7962617043384734774547476b5a77795444743176'
    )
    expect(ur.toString()).toBe(
      'ur:detailed-account/oeadtantjloeaxhdclaowdverokopdinhseeroisyalksaykctjshedprnuyjyfgrovawewftyghceglrpkgamtantjooyadlocsdwykcfadykykaeykaeykaolyksdwfegdimfghgieieecfpkpiyjsgugujsihgteyjsglehksknkkidhsjofxetfleektfeflfljehtktkkghfyjyehkotdclvltl'
    )
  })

  it('should remove 0x on encoding and add it on decoding on ETH contract ', () => {
    // Create a HDKey
    const originKeypath = new Keypath({
      path: [
        new PathComponent({ index: 60, hardened: true }),
        new PathComponent({ index: 0, hardened: true }),
        new PathComponent({ index: 0, hardened: true }),
        new PathComponent({ index: 0, hardened: false }),
        new PathComponent({ index: 1, hardened: false }),
      ],
      sourceFingerprint: Buffer.from('d34db33f', 'hex').readUInt32BE(),  
    })

    const cryptoHDKey = new HDKey({
      isMaster: false,
      keyData: Buffer.from('02d2b36900396c9282fa14628566582f206a5dd0bcc8d5e892611806cafb0301f0', 'hex'),
      origin: originKeypath,
      parentFingerprint: Buffer.from('78412e3a', 'hex').readInt32BE(),
    })

    // Contract address
    const tokenIds = ['0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48']

    // Create detailed account
    const detailedAccount = new DetailedAccount({ account: cryptoHDKey, tokenIds})

    expect(detailedAccount.getTokenIds()).toEqual(['0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'])

    const hex = detailedAccount.toHex() 
    const ur = detailedAccount.toUr()

    // Expect it to encode hex string as bytes type
    expect(hex).toBe('a201d99d6fa401f403582102d2b36900396c9282fa14628566582f206a5dd0bcc8d5e892611806cafb0301f006d99d70a2018a183cf500f500f500f401f4021ad34db33f081a78412e3a0281d9010754a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48');
    expect(ur.toString()).toBe('ur:detailed-account/oeadtantjloxadwkaxhdclaotdqdinaeesjzmolfzsbbidlpiyhddlcximhltirfsptlvsmohscsamsgzoaxadwtamtantjooeadlecsfnykaeykaeykaewkadwkaocytegtqdfhaycyksfpdmftaolytaadatghnbroinmeswclluensettntgedmnnpftoenamwmfdjlfpcltt');

    // Decode
    const newDetailedAccount = DetailedAccount.fromHex(hex) as DetailedAccount

    expect(newDetailedAccount.getTokenIds()).toEqual(['0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'])
  })

  it('should generateCryptoDetailedAccounttokens with HexString, Buffer and string types, should use bytes encoding on CBOR', () => {
    // Create a HDKey
    const cryptoHDKey = HDKey.fromHex('a203582102eae4b876a8696134b868f88cc2f51f715f2dbedb7446b8e6edf3d4541c4eb67b06d99d70a1018a182cf5183cf500f500f400f4')

    // First 2 tokens should be hex strings last one will be string
    const hexToken = new HexString('0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48')
    const buff = Buffer.from('A0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 'hex')
    const tokenIds = [hexToken, buff, '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 'USDC-c76f1f']

    // Create detailed account
    const detailedAccount = new DetailedAccount({account: cryptoHDKey, tokenIds})

    expect(detailedAccount.getTokenIds()).toEqual([
      '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      'USDC-c76f1f',
    ])

    const hex = detailedAccount.toHex()
    const ur = detailedAccount.toUr()

    // Encode addresses uso=ing bytes encoding, others as string
    expect(hex).toBe(
      'a201d99d6fa203582102eae4b876a8696134b868f88cc2f51f715f2dbedb7446b8e6edf3d4541c4eb67b06d99d70a1018a182cf5183cf500f500f400f40284d9010754a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48d9010754a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48d9010754a0b86991c6218b36c1d19d4a2e9eb0ce3606eb486b555344432d633736663166'
    )
    expect(ur.toString()).toBe(
      'ur:detailed-account/oeadtantjloeaxhdclaowdverokopdinhseeroisyalksaykctjshedprnuyjyfgrovawewftyghceglrpkgamtantjooyadlecsdwykcsfnykaeykaewkaewkaolrtaadatghnbroinmeswclluensettntgedmnnpftoenamwmfdtaadatghnbroinmeswclluensettntgedmnnpftoenamwmfdtaadatghnbroinmeswclluensettntgedmnnpftoenamwmfdjegogufyfxdpiaemeniyehiyoysbuegd'
    )
  })
})
