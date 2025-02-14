import { HDKey, Keypath, OutputDescriptor } from '@ngraveio/ur-blockchain-commons'
import { DetailedAccount, PortfolioCoin } from '../src'
import { CoinIdentity, EllipticCurve } from '@ngraveio/bc-ur-registry-crypto-coin-identity'

describe('Crypto Sync Coin with DetailedAccount', () => {
  it('should generate / decode PortfolioCoin with only coinIdentity', () => {
    // Create a coin identity
    const coinIdentity = new CoinIdentity(EllipticCurve.secp256k1, 60)

    // Create a PortfolioCoin
    const portfolioCoin = new PortfolioCoin({
      coinId: coinIdentity,
      accounts: [],
    })

    // Expect coinIdentity to be equal to the one in PortfolioCoin
    expect(portfolioCoin.getCoinId().toURL()).toEqual(coinIdentity.toURL())

    // Expect other fields to be undefined
    expect(portfolioCoin.getMasterFingerprint()).toBeUndefined()
    expect(portfolioCoin.getAccounts()).toEqual([])
    expect(portfolioCoin.getDetailedAccounts()).toEqual([])

    const hex = portfolioCoin.toHex()
    const ur = portfolioCoin.toUr()

    // Now decode the hex
    const decodedPortfolioCoin = PortfolioCoin.fromHex(hex) as PortfolioCoin

    // expect decodedPortfolioCoin to be equal to PortfolioCoin
    // Start with coinIdentity
    expect(decodedPortfolioCoin.getCoinId().toURL()).toEqual(portfolioCoin.getCoinId().toURL())

    // Expect other fields to be same undefined
    expect(decodedPortfolioCoin.getMasterFingerprint()).toEqual(portfolioCoin.getMasterFingerprint())
    expect(decodedPortfolioCoin.getAccounts()).toEqual(portfolioCoin.getAccounts())
    expect(decodedPortfolioCoin.getDetailedAccounts()).toEqual(portfolioCoin.getDetailedAccounts())
  })

  it('should generate / decode PortfolioCoin with 1 detailed account with HDKEY', () => {
    // Create a coin identity
    const coinIdentity = new CoinIdentity(EllipticCurve.secp256k1, 60)

    // Create a HDKey
    const originKeypath = new Keypath({
      path: "m/60'/0'/0'/0/1",
      sourceFingerprint: 3545084735,
    })
    const cryptoHDKey = new HDKey({
      isMaster: false,
      keyData: Buffer.from('02d2b36900396c9282fa14628566582f206a5dd0bcc8d5e892611806cafb0301f0', 'hex'),
      origin: originKeypath,
      parentFingerprint: 2017537594,
    })

    // Create a detailed account
    const detailedAccount = new DetailedAccount({
      account: cryptoHDKey,
    })

    // Create a PortfolioCoin
    const portfolioCoin = new PortfolioCoin({
      coinId: coinIdentity,
      accounts: [detailedAccount],
    })

    // Check values
    expect(portfolioCoin.getCoinId().toURL()).toEqual(coinIdentity.toURL())
    expect(portfolioCoin.getDetailedAccounts()?.[0].getHdKey()?.getOrigin()?.toString()).toEqual(cryptoHDKey.getOrigin()?.toString())

    expect(portfolioCoin.getMasterFingerprint()).toBeUndefined()

    const hex = portfolioCoin.toHex() // a201d9a1b9a2010802183c0281d9a1baa101d99d6fa401f403582102d2b36900396c9282fa14628566582f206a5dd0bcc8d5e892611806cafb0301f006d99d70a2018a183cf500f500f500f401f4021ad34db33f081a78412e3a
    const ur = portfolioCoin.toUr()

    // Now decode the hex
    const decodedPortfolioCoin = PortfolioCoin.fromHex(hex) as PortfolioCoin

    // expect decodedPortfolioCoin to be equal to PortfolioCoin
    // Start with coinIdentity
    expect(decodedPortfolioCoin.getCoinId().toURL()).toEqual(portfolioCoin.getCoinId().toURL())
    expect(decodedPortfolioCoin.getDetailedAccounts()?.[0].getHdKey()?.getOrigin()?.toString()).toEqual(cryptoHDKey.getOrigin()?.toString())

    // Expect other fields to be same undefined
    expect(decodedPortfolioCoin.getMasterFingerprint()).toEqual(portfolioCoin.getMasterFingerprint())
  })

  it('should generate / decode PortfolioCoin with 1 detailed account with OutputDescriptor with HDKey', () => {
    // Create a coin identity
    const coinIdentity = new CoinIdentity(EllipticCurve.secp256k1, 60)

    // Create a HDKey
    const originKeypath = new Keypath({
      path: "m/60'/0'/0'/0/1",
      sourceFingerprint: 3545084735,
    })
    const cryptoHDKey = new HDKey({
      isMaster: false,
      keyData: Buffer.from('02d2b36900396c9282fa14628566582f206a5dd0bcc8d5e892611806cafb0301f0', 'hex'),
      origin: originKeypath,
      parentFingerprint: 2017537594,
    })

    const cryptoOutput = new OutputDescriptor({
      source: 'pkh(@0)',
      keys: [cryptoHDKey],
    })
    const detailedAccount = new DetailedAccount({
      account: cryptoOutput,
    })

    // Create sync coin
    const portfolioCoin = new PortfolioCoin({
      coinId: coinIdentity,
      accounts: [detailedAccount],
    })

    // Test values
    expect(portfolioCoin.getCoinId().toURL()).toEqual(coinIdentity.toURL())
    //@ts-ignore
    expect(portfolioCoin.getDetailedAccounts()[0].getOutputDescriptor().data.keys[0].getOrigin()?.toString()).toEqual(cryptoHDKey.getOrigin()?.toString())

    // Expect other fields to be same undefined
    expect(portfolioCoin.getMasterFingerprint()).toBeUndefined()

    // Encode to hex
    const hex = portfolioCoin.toHex()
    const ur = portfolioCoin.toUr()

    // Now decode the hex
    const decodedPortfolioCoin = PortfolioCoin.fromHex(hex) as PortfolioCoin

    // Test values
    expect(decodedPortfolioCoin.getCoinId().toURL()).toEqual(coinIdentity.toURL())
    //@ts-ignore
    expect(portfolioCoin.getDetailedAccounts()[0].getOutputDescriptor().data.keys[0].getOrigin()?.toString()).toEqual(cryptoHDKey.getOrigin()?.toString())

    // Expect other fields to be same undefined
    expect(decodedPortfolioCoin.getMasterFingerprint()).toEqual(portfolioCoin.getMasterFingerprint())
  })

  it('should generate PortfolioCoin with 2 detailed account', () => {
    // Create a coin identity
    const coinIdentity = new CoinIdentity(EllipticCurve.secp256k1, 60)

    const cryptoHDKey = new HDKey({
      isMaster: false,
      keyData: Buffer.from('02d2b36900396c9282fa14628566582f206a5dd0bcc8d5e892611806cafb0301f0', 'hex'),
      origin: new Keypath({
        path: "m/60'/0'/0'/0/0",
      }),
      parentFingerprint: 2017537594,
    })

    const cryptoHDKey2 = new HDKey({
      isMaster: false,
      keyData: Buffer.from('02d2b36900396c9282fa14628566582f206a5dd0bcc8d5e892611806cafb0301f0', 'hex'),
      origin: new Keypath({
        path: "m/60'/0'/0'/0/1",
      }),
      parentFingerprint: 2017537594,
    })

    // Create a detailed account
    const detailedAccount = new DetailedAccount({
      account: cryptoHDKey,
    })
    const detailedAccount2 = new DetailedAccount({
      account: cryptoHDKey2,
    })

    // Create a PortfolioCoin
    const portfolioCoin = new PortfolioCoin({
      coinId: coinIdentity,
      accounts: [detailedAccount, detailedAccount2],
    })

    // Check values
    expect(portfolioCoin.getCoinId().toURL()).toEqual(coinIdentity.toURL())
    expect(portfolioCoin.getDetailedAccounts()?.length).toEqual(2)
    expect(portfolioCoin.getDetailedAccounts()?.[0].getHdKey()?.getOrigin()?.toString()).toEqual(cryptoHDKey.getOrigin()?.toString())
    expect(portfolioCoin.getDetailedAccounts()?.[1].getHdKey()?.getOrigin()?.toString()).toEqual(cryptoHDKey2.getOrigin()?.toString())

    expect(portfolioCoin.getMasterFingerprint()).toBeUndefined()

    const hex = portfolioCoin.toHex()
    const ur = portfolioCoin.toUr()

    // Now decode the hex
    const decodedPortfolioCoin = PortfolioCoin.fromHex(hex) as PortfolioCoin

    // expect decodedPortfolioCoin to be equal to PortfolioCoin
    // Start with coinIdentity
    expect(decodedPortfolioCoin.getCoinId().toURL()).toEqual(portfolioCoin.getCoinId().toURL())
    expect(portfolioCoin.getDetailedAccounts()?.length).toEqual(2)
    expect(decodedPortfolioCoin.getDetailedAccounts()?.[0].getHdKey()?.getOrigin()?.toString()).toEqual(cryptoHDKey.getOrigin()?.toString())
    expect(decodedPortfolioCoin.getDetailedAccounts()?.[1].getHdKey()?.getOrigin()?.toString()).toEqual(cryptoHDKey2.getOrigin()?.toString())

    // Expect other fields to be same undefined
    expect(decodedPortfolioCoin.getMasterFingerprint()).toEqual(portfolioCoin.getMasterFingerprint())
  })

  it('should generate PortfolioCoin with 2 detailed account with tokens', () => {
    // Create a coin identity
    const coinIdentity = new CoinIdentity(EllipticCurve.secp256k1, 60)

    const cryptoHDKey = new HDKey({
      isMaster: false,
      keyData: Buffer.from('02d2b36900396c9282fa14628566582f206a5dd0bcc8d5e892611806cafb0301f0', 'hex'),
      origin: new Keypath({
        path: "m/60'/0'/0'/0/0",
      }),
      parentFingerprint: 2017537594,
    })

    const tokenIds = ['0xdac17f958d2ee523a2206206994597c13d831ec7', '0xb8c77482e45f1f44de1745f52c74426c631bdd52']

    const cryptoHDKey2 = HDKey.fromHex('A203582102EAE4B876A8696134B868F88CC2F51F715F2DBEDB7446B8E6EDF3D4541C4EB67B06D99D70A10188182CF51901F5F500F500F5') as HDKey;

    const tokenIds2 = ['EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v']

    // Create a detailed account
    const detailedAccount = new DetailedAccount({
      account: cryptoHDKey,
      tokenIds,
    })
    const detailedAccount2 = new DetailedAccount({
      account: cryptoHDKey2,
      tokenIds: tokenIds2,
    })

    // Create a PortfolioCoin
    const portfolioCoin = new PortfolioCoin({
      coinId: coinIdentity,
      accounts: [detailedAccount, detailedAccount2],
    })

    // Test if values are correct
    expect(portfolioCoin.getCoinId().toURL()).toEqual(coinIdentity.toURL())
    expect(portfolioCoin.getDetailedAccounts()?.length).toEqual(2)
    expect(portfolioCoin.getDetailedAccounts()?.[0].getHdKey()?.getOrigin()?.toString()).toEqual(cryptoHDKey.getOrigin()?.toString())
    expect(portfolioCoin.getDetailedAccounts()?.[1].getHdKey()?.getOrigin()?.toString()).toEqual(cryptoHDKey2.getOrigin()?.toString())
    expect(portfolioCoin.getDetailedAccounts()?.[0].getTokenIds()).toEqual(tokenIds)
    expect(portfolioCoin.getDetailedAccounts()?.[1].getTokenIds()).toEqual(tokenIds2)

    // Undefined fields
    expect(portfolioCoin.getMasterFingerprint()).toBeUndefined()

    const hex = portfolioCoin.toHex()
    const ur = portfolioCoin.toUr()

    // Decode from hex
    const decodedPortfolioCoin = PortfolioCoin.fromHex(hex) as PortfolioCoin
    expect(decodedPortfolioCoin.getCoinId().toURL()).toEqual(coinIdentity.toURL())

    expect(decodedPortfolioCoin.getDetailedAccounts()?.length).toEqual(2)
    expect(decodedPortfolioCoin.getDetailedAccounts()?.[0].getHdKey()?.getOrigin()?.toString()).toEqual(cryptoHDKey.getOrigin()?.toString())
    expect(decodedPortfolioCoin.getDetailedAccounts()?.[1].getHdKey()?.getOrigin()?.toString()).toEqual(cryptoHDKey2.getOrigin()?.toString())
    expect(decodedPortfolioCoin.getDetailedAccounts()?.[0].getTokenIds()).toEqual(tokenIds)
    expect(decodedPortfolioCoin.getDetailedAccounts()?.[1].getTokenIds()).toEqual(tokenIds2)

    // Undefined fields
    expect(decodedPortfolioCoin.getMasterFingerprint()).toBeUndefined()
  })

  it('should allow different BIP44 coin ID on coin identity and HDKey Path Coin Id', () => {
    // Create a bitcoin coin identity
    const coinIdentity = new CoinIdentity(EllipticCurve.secp256k1, 0)

    // Create an etherum path
    const cryptoHDKey = new HDKey({
      isMaster: false,
      keyData: Buffer.from('02d2b36900396c9282fa14628566582f206a5dd0bcc8d5e892611806cafb0301f0', 'hex'),
      origin: new Keypath({
        path: "m/60'/0'/0'/0/0",
      }),
      parentFingerprint: 2017537594,
    })

    // Create a detailed account
    const detailedAccount = new DetailedAccount({
      account: cryptoHDKey,
    })

    // Create a PortfolioCoin
    const portfolioCoin = new PortfolioCoin({
      coinId: coinIdentity,
      accounts: [detailedAccount],
    })

    // Test values
    // Coin ID type is bitcoin
    expect(portfolioCoin.getCoinId().getType()).toEqual(0)
    // But derivation path is for Ethereum, this is perfectly valid, I can generate a bitcoin address from any public key
    expect(portfolioCoin.getDetailedAccounts()?.length).toEqual(1)
    expect(portfolioCoin.getDetailedAccounts()?.[0].getHdKey()?.getOrigin()?.getComponents()[0].getIndex()).toEqual(60)

    // Test encoding and decoding
    const hex = portfolioCoin.toHex()
    const ur = portfolioCoin.toUr()

    // Decode from hex
    const decodedPortfolioCoin = PortfolioCoin.fromHex(hex) as PortfolioCoin

    expect(decodedPortfolioCoin.getCoinId().toURL()).toEqual(coinIdentity.toURL())
    expect(decodedPortfolioCoin.getDetailedAccounts()?.[0].getHdKey()?.getOrigin()?.getComponents()[0].getIndex()).toEqual(60)

    // Coin BIP44 id and origin path BIP44 id can be different
    expect(decodedPortfolioCoin.getCoinId().getType()).not.toEqual(decodedPortfolioCoin.getDetailedAccounts()?.[0].getHdKey()?.getOrigin()?.getComponents()[0].getIndex())
  })
})