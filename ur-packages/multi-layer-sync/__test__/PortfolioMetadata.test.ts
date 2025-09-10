import { UR } from '@ngraveio/bc-ur'
import { Buffer } from 'buffer/'
import { PortfolioMetadata } from '../src/index'

describe('CryptoPortfolioMetadata', () => {
  it('should encode/decode only with empty values', () => {
    // New metadata
    const metadata = new PortfolioMetadata()

    expect(metadata.getSyncId()).toBe(undefined)
    expect(metadata.getlanguage()).toBe(undefined)
    expect(metadata.getDevice()).toBe(undefined)
    expect(metadata.getFirmwareVersion()).toBe(undefined)

    //console.log(metadata.toHex().toString("hex")); // a401f702f703f704f7
    //console.log(metadata.toUREncoder(1000).nextPart()); // ur:portfolio-metadata/oxadylaoylaxylaaylhnihlnse

    const ur = new UR(metadata)
    const metadataRead = PortfolioMetadata.fromUr(ur) as PortfolioMetadata

    expect(metadataRead.getSyncId()).toBe(undefined)
    expect(metadataRead.getlanguage()).toBe(undefined)
    expect(metadataRead.getDevice()).toBe(undefined)
    expect(metadataRead.getFirmwareVersion()).toBe(undefined)
  })

  it('should encode/decode with full values', () => {
    // Sync id
    const sync_id = Buffer.from('babe0000babe00112233445566778899', 'hex')

    // New metadata
    const metadata = new PortfolioMetadata({ syncId: sync_id, device: 'my-device', language: 'en', firmwareVersion: '1.0.0' })

    expect(metadata.getSyncId()?.toString('hex')).toBe('babe0000babe00112233445566778899')
    expect(metadata.getlanguage()).toBe('en')
    expect(metadata.getDevice()).toBe('my-device')
    expect(metadata.getFirmwareVersion()).toBe('1.0.0')

    const ur = new UR(metadata)
    const metadataRead = ur.decode()

    expect(metadataRead.getSyncId()?.toString('hex')).toBe('babe0000babe00112233445566778899')
    expect(metadataRead.getlanguage()).toBe('en')
    expect(metadataRead.getDevice()).toBe('my-device')
    expect(metadataRead.getFirmwareVersion()).toBe('1.0.0')
  })

  it('should encode Portfolio Metadata with addition properties', () => {
    // Create sync id
    const sync_id = Buffer.from('babe0000babe00112233445566778899', 'hex')

    // Create metadata
    const metadata = new PortfolioMetadata({
      syncId: sync_id,
      device: 'my-device',
      language: 'en',
      firmwareVersion: '1.0.0',
      string: 'hello world',
      number: 123,
      boolean: true,
      array: [1, 2, 3],
      object: { a: 1, b: 2 },
      null: null,
      date: new Date('2021-01-01T00:00:00.000Z'),
    })

    const cbor = metadata.toHex()
    const ur = metadata.toUr()

    const expectedHex =
      'ab0150babe0000babe001122334455667788990262656e0365312e302e3004696d792d64657669636566737472696e676b68656c6c6f20776f726c64666e756d626572187b67626f6f6c65616ef565617272617983010203666f626a656374a2616101616202646e756c6cf66464617465c11a5fee6600'
    expect(cbor).toBe(expectedHex)
    expect(ur.toString()).toBe(
      'ur:portfolio-metadata/pyadgdrdrnaeaerdrnaebycpeofygoiyktlonlaoidihjtaxihehdmdydmdyaainjnkkdpieihkoiniaihiyjkjyjpinjtiojeisihjzjzjlcxktjljpjzieiyjtkpjnidihjpcskgioidjljljzihhsjtykihhsjpjphskklsadaoaxiyjlidimihiajyoehshsadhsidaoiejtkpjzjzynieiehsjyihsecyhewyiyaeahhngoeo'
    )
  })
})

describe('CryptoPortfolioMetadata sync_id', () => {
  it('should encode / decode with 16 byte lenght sync id', () => {
    // Sync id
    const sync_id = Buffer.from('babe0000babe00112233445566778899', 'hex')

    // New metadata
    const metadata = new PortfolioMetadata({ syncId: sync_id })

    expect(metadata.getSyncId()?.toString('hex')).toBe('babe0000babe00112233445566778899')

    // console.log(metadata.toHex().toString("hex"));
    // console.log(metadata.toUr().toString());

    const ur = new UR(metadata)
    const metadata2 = ur.decode()

    expect(metadata2.getSyncId()?.toString('hex')).toBe(metadata.getSyncId()?.toString('hex'))
  })

  it('should pad left of sync_id', () => {
    // Sync id
    const sync_id = Buffer.from('babe', 'hex')

    // New metadata
    const metadata = new PortfolioMetadata({ syncId: sync_id })

    expect(metadata.getSyncId()?.toString('hex')).toBe('0000000000000000000000000000babe')

    // console.log(metadata.toHex().toString("hex")); // a40150babe0000babe0011223344556677889902f703f704f7
    // console.log(metadata.toUr().toString()); // ur:portfolio-metadata/oxadgdrdrnaeaerdrnaebycpeofygoiyktlonlaoylaxylaaylwzeyyafw
  })

  it('should remove starting zeros when encoding', () => {
    // Sync id
    const sync_id = Buffer.from('0000000000000000000000000000babe', 'hex')

    // New metadata
    const metadata = new PortfolioMetadata({ syncId: sync_id })

    expect(metadata.toHex()).toEqual('a10142babe')
    expect(metadata.toUr().toString()).toEqual('ur:portfolio-metadata/oyadfwrdrnjpeeosga')
  })
})

describe('CryptoPortfolioMetadata language codes', () => {
  it('should encode with correct language codes', () => {
    const metadata_en = new PortfolioMetadata({ language: 'en' })
    const metadata_tr = new PortfolioMetadata({ language: 'tr' })
    const metadata_fr = new PortfolioMetadata({ language: 'fr' })
    const metadata_nl = new PortfolioMetadata({ language: 'nl' })

    expect(metadata_en.getlanguage()).toBe('en')
    expect(metadata_tr.getlanguage()).toBe('tr')
    expect(metadata_fr.getlanguage()).toBe('fr')
    expect(metadata_nl.getlanguage()).toBe('nl')

    // console.log(metadata_en.toHex().toString("hex")); // a10262656e
    // console.log(metadata_tr.toHex().toString("hex")); // a102627472
    // console.log(metadata_fr.toHex().toString("hex")); // a102626672
    // console.log(metadata_nl.toHex().toString("hex")); // a102626e6c

    expect(metadata_en.toHex()).toBe('a10262656e')
    expect(metadata_tr.toHex()).toBe('a102627472')
    expect(metadata_fr.toHex()).toBe('a102626672')
    expect(metadata_nl.toHex()).toBe('a102626e6c')

    // console.log("UR");

    // console.log(metadata_en.toUr().toString()); // ur:portfolio-metadata/oyaoidihjttprsfefx
    // console.log(metadata_tr.toUr().toString()); // ur:portfolio-metadata/oyaoidjyjpneioftce
    // console.log(metadata_fr.toUr().toString()); // ur:portfolio-metadata/oyaoidiyjpvdmugetk
    // console.log(metadata_nl.toUr().toString()); // ur:portfolio-metadata/oyaoidjtjztlfezcox

    expect(metadata_en.toUr().toString()).toBe('ur:portfolio-metadata/oyaoidihjttprsfefx')
    expect(metadata_tr.toUr().toString()).toBe('ur:portfolio-metadata/oyaoidjyjpneioftce')
    expect(metadata_fr.toUr().toString()).toBe('ur:portfolio-metadata/oyaoidiyjpvdmugetk')
    expect(metadata_nl.toUr().toString()).toBe('ur:portfolio-metadata/oyaoidjtjztlfezcox')
  })

  it('should decode CBOR with correct language codes', () => {
    expect(UR.fromHex({ type: 'portfolio-metadata', payload: 'a401f70262656e03f704f7' }).decode().getlanguage()).toBe('en')
    expect(UR.fromHex({ type: 'portfolio-metadata', payload: 'a401f70262747203f704f7' }).decode().getlanguage()).toBe('tr')
    expect(UR.fromHex({ type: 'portfolio-metadata', payload: 'a401f70262667203f704f7' }).decode().getlanguage()).toBe('fr')
    expect(UR.fromHex({ type: 'portfolio-metadata', payload: 'a401f702626e6c03f704f7' }).decode().getlanguage()).toBe('nl')
  })

  it('should decode UR with correct language codes', () => {
    const decodedEn = PortfolioMetadata.fromUr('ur:portfolio-metadata/oxadylaoidihjtaxylaaylwzsgtpfh') as PortfolioMetadata
    expect(decodedEn.getlanguage()).toBe('en')

    const decodedTr = PortfolioMetadata.fromUr('ur:portfolio-metadata/oxadylaoidjyjpaxylaaylnegdjklf') as PortfolioMetadata
    expect(decodedTr.getlanguage()).toBe('tr')

    const decodedFr = PortfolioMetadata.fromUr('ur:portfolio-metadata/oxadylaoidiyjpaxylaaylttgltibg') as PortfolioMetadata
    expect(decodedFr.getlanguage()).toBe('fr')

    const decodedNl = PortfolioMetadata.fromUr('ur:portfolio-metadata/oxadylaoidjtjzaxylaaylvosnkgns') as PortfolioMetadata
    expect(decodedNl.getlanguage()).toBe('nl')
  })

  it("should fallback to 'en' for incorrect language codes", () => {
    //@ts-ignore
    const metadata1 = new PortfolioMetadata({ language: 'xx' })
    expect(metadata1.getlanguage()).toBe('en')

    //@ts-ignore
    const metadata2 = new PortfolioMetadata({ language: 'xyx' })
    expect(metadata2.getlanguage()).toBe('en')
  })

  it("should fallback to 'en' when decoding CBOR with incorrect language codes", () => {
    const decodedMetadata = PortfolioMetadata.fromHex('a401f7026378797a03f704f7') as PortfolioMetadata
    expect(decodedMetadata.getlanguage()).toBe('en')
  })
})

describe('CryptoPortfolioMetadata with extended values', () => {
  it('Should encode and decode only with unknown key value pairs', () => {
    const myData = {
      string: 'hello world',
      number: 123,
      boolean: true,
      array: [1, 2, 3],
      object: { a: 1, b: 2 },
      null: null,
      date: new Date('2021-01-01T00:00:00.000Z'),
    }
    // New metadata
    const metadata = new PortfolioMetadata({ ...myData })

    expect(metadata.data).toStrictEqual({ ...myData })

    const cbor = metadata.toHex() // a766737472696e676b68656c6c6f20776f726c64666e756d626572187b67626f6f6c65616ef565617272617983010203666f626a656374a2616101616202646e756c6cf66464617465c07818323032312d30312d30315430303a30303a30302e3030305a
    //console.log(cbor);

    // Decode metadata
    const decodedMetadata = PortfolioMetadata.fromHex(cbor)

    expect(decodedMetadata.data).toStrictEqual(metadata.data)
  })

  it('Should encode and decode with known and extended values', () => {
    const sync_id = Buffer.from('babe0000babe00112233445566778899', 'hex')

    const knownValues = { syncId: sync_id, device: 'my-device', language: 'en' as const, firmwareVersion: '1.0.0' }

    const myData = {
      string: 'hello world',
      number: 123,
      boolean: true,
      array: [1, 2, 3],
      object: { a: 1, b: 2 },
      null: null,
      date: new Date('2021-01-01T00:00:00.000Z'),
    }

    // New metadata
    const metadata = new PortfolioMetadata({ ...knownValues, ...myData })

    expect(metadata.getSyncId()?.toString('hex')).toBe('babe0000babe00112233445566778899')
    expect(metadata.getlanguage()).toBe('en')
    expect(metadata.getDevice()).toBe('my-device')
    expect(metadata.getFirmwareVersion()).toBe('1.0.0')

    expect(metadata.data).toStrictEqual({ ...knownValues, ...myData })

    // const urData = metadata.toUREncoder(1000).nextPart();
    // const ur = URRegistryDecoder.decode(urData);
    // console.log('all', ur.cbor.toString('hex'));

    // Encode
    const cbor = metadata.toHex() // ab0150babe0000babe001122334455667788990262656e0365312e302e3004696d792d64657669636566737472696e676b68656c6c6f20776f726c64666e756d626572187b67626f6f6c65616ef565617272617983010203666f626a656374a2616101616202646e756c6cf66464617465c07818323032312d30312d30315430303a30303a30302e3030305a

    // Decode
    const decodedMetadata = PortfolioMetadata.fromHex(cbor) as PortfolioMetadata

    expect(decodedMetadata.getSyncId()?.toString('hex')).toBe('babe0000babe00112233445566778899')
    expect(decodedMetadata.getlanguage()).toBe('en')
    expect(decodedMetadata.getDevice()).toBe('my-device')
    expect(decodedMetadata.getFirmwareVersion()).toBe('1.0.0')

    expect(decodedMetadata.data).toStrictEqual(metadata.data)
  })
})
