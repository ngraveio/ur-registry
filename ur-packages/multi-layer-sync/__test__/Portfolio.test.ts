import { HDKey, Keypath, OutputDescriptor } from '@ngraveio/ur-blockchain-commons'
import { DetailedAccount, PortfolioCoin, Portfolio, PortfolioMetadata } from '../src'
import { CoinIdentity, EllipticCurve } from '@ngraveio/bc-ur-registry-crypto-coin-identity'
import { Buffer } from 'node:buffer'

describe('Crypto Portfolio', () => {
  it('should generate / decode Portfolio with empty coin array', () => {
    const portfolio = new Portfolio({ coins: [] })

    expect(portfolio.getCoins()).toEqual([])
    expect(portfolio.getMetadata()).toBeUndefined()

    const hex = portfolio.toHex()
    const ur = portfolio.toUr()

    const decodedPortfolio = Portfolio.fromHex(hex) as Portfolio

    expect(decodedPortfolio.getCoins()).toEqual([])
    expect(decodedPortfolio.getMetadata()).toBeUndefined()
  })

  it('should generate / decode Portfolio with empty coin array and Metadata', () => {
    const metadata = new PortfolioMetadata({
      syncId: Buffer.from('123456781234567802D9044FA3011A71', 'hex'),
      language: 'en',
      firmwareVersion: '1.2.1-1.rc',
      device: 'NGRAVE ZERO',
    })

    const portfolio = new Portfolio({ coins: [], metadata })

    expect(portfolio.getCoins()).toEqual([])
    expect(portfolio.getMetadata()?.getDevice()).toEqual('NGRAVE ZERO')
    expect(portfolio.getMetadata()?.getFirmwareVersion()).toEqual('1.2.1-1.rc')
    expect(portfolio.getMetadata()?.getlanguage()).toEqual('en')
    expect(portfolio.getMetadata()?.getSyncId()?.toString('hex')).toEqual('123456781234567802d9044fa3011a71')

    const hex = portfolio.toHex()
    const ur = portfolio.toUr()

    const decodedPortfolio = Portfolio.fromHex(hex) as Portfolio

    expect(decodedPortfolio.getCoins()).toEqual([])
    expect(decodedPortfolio.getMetadata()?.getDevice()).toEqual('NGRAVE ZERO')
    expect(decodedPortfolio.getMetadata()?.getFirmwareVersion()).toEqual('1.2.1-1.rc')
    expect(decodedPortfolio.getMetadata()?.getlanguage()).toEqual('en')
    expect(decodedPortfolio.getMetadata()?.getSyncId()?.toString('hex')).toEqual('123456781234567802d9044fa3011a71')
  })

  it('should generate / decode Portfolio with 1 coin', () => {
    const coinIdentity = new CoinIdentity(EllipticCurve.secp256k1, 60)
    const syncCoinHex = 'a201d9a1b9a2010802183c0281d9a1baa101d99d6fa401f403582102d2b36900396c9282fa14628566582f206a5dd0bcc8d5e892611806cafb0301f006d99d70a2018a183cf500f500f500f401f4021ad34db33f081a78412e3a'
    const portfolioCoin = PortfolioCoin.fromHex(syncCoinHex) as PortfolioCoin

    const portfolio = new Portfolio({ coins: [portfolioCoin] })

    expect(portfolio.getCoins().length).toEqual(1)
    expect(portfolio.getMetadata()).toBeUndefined()
    expect(portfolio.getCoins()[0].getCoinId().toURL()).toEqual('bc-coin://secp256k1/60')

    const hex = portfolio.toHex()
    const ur = portfolio.toUr()

    const decodedPortfolio = Portfolio.fromHex(hex) as Portfolio

    expect(decodedPortfolio.getCoins().length).toEqual(1)
    expect(decodedPortfolio.getCoins()[0].getCoinId().toURL()).toEqual('bc-coin://secp256k1/60')
    expect(decodedPortfolio.getCoins()[0].toHex()).toEqual(syncCoinHex)
    expect(decodedPortfolio.getMetadata()).toBeUndefined()
  })

  it('should generate / decode Portfolio with 2 coins', () => {
    const coinIdentityEth = new CoinIdentity(EllipticCurve.secp256k1, 60)
    const cryptoHDKeyEth = new HDKey({
      isMaster: false,
      keyData: Buffer.from('02c00551a9b96c332410adaaed426dd0171311b8f5b6ebada246a6be8c24cac1c5', 'hex'),
      origin: new Keypath({ path: "m/44'/60'/0'/0/0" }),
    })
    const tokenIdsETH = ['0xdAC17F958D2ee523a2206206994597C13D831ec7', '0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE']
    const detailedAccountETH = new DetailedAccount({ account: cryptoHDKeyEth, tokenIds: tokenIdsETH })

    const coinIdentitySol = new CoinIdentity(EllipticCurve.secp256k1, 501)
    const cryptoHDKeySol = new HDKey({
      isMaster: false,
      keyData: Buffer.from('02d2b36900396c9282fa14628566582f206a5dd0bcc8d5e892611806cafb0301f0', 'hex'),
      origin: new Keypath({ path: "m/44'/501'/0'/0" }),
    })
    const tokenIdsSol = ['7i5KKsX2weiTkry7jA4ZwSuXGhs5eJBEjY8vVxR4pfRx', 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v']
    const detailedAccountSol = new DetailedAccount({ account: cryptoHDKeySol, tokenIds: tokenIdsSol })

    const portfolioCoinETH = new PortfolioCoin({ coinId: coinIdentityEth, accounts: [detailedAccountETH] })
    const portfolioCoinSol = new PortfolioCoin({ coinId: coinIdentitySol, accounts: [detailedAccountSol] })

    const portfolio = new Portfolio({ coins: [portfolioCoinETH, portfolioCoinSol] })

    expect(portfolio.getMetadata()).toBeUndefined()
    expect(portfolio.getCoins().length).toEqual(2)
    expect(portfolio.getCoins()[0].getCoinId().toURL()).toEqual('bc-coin://secp256k1/60')
    expect(portfolio.getCoins()[1].getCoinId().toURL()).toEqual('bc-coin://secp256k1/501')

    const hex = portfolio.toHex()
    const ur = portfolio.toUr()

    const decodedPortfolio = Portfolio.fromHex(hex) as Portfolio

    expect(decodedPortfolio.getCoins().length).toEqual(2)
    expect(decodedPortfolio.getMetadata()).toBeUndefined()
    expect(decodedPortfolio.getCoins()[0].getCoinId().toURL()).toEqual('bc-coin://secp256k1/60')
    expect(decodedPortfolio.getCoins()[1].getCoinId().toURL()).toEqual('bc-coin://secp256k1/501')
    expect(decodedPortfolio.getCoins()[0].toHex()).toEqual(portfolioCoinETH.toHex())
    expect(decodedPortfolio.getCoins()[1].toHex()).toEqual(portfolioCoinSol.toHex())
  })

  it('should encode / decode Portfolio with 4 coins and Metadata', () => {
    const coinIdEth = new CoinIdentity(EllipticCurve.secp256k1, 60)
    const coinIdSol = new CoinIdentity(EllipticCurve.secp256k1, 501)
    const coinIdMatic = new CoinIdentity(EllipticCurve.secp256k1, 60, [137])
    const coinIdBtc = new CoinIdentity(EllipticCurve.secp256k1, 0)

    const accountEth = new DetailedAccount({
      account: new HDKey({
        isMaster: false,
        keyData: Buffer.from('032503D7DCA4FF0594F0404D56188542A18D8E0784443134C716178BC1819C3DD4', 'hex'),
        chainCode: Buffer.from('D2B36900396C9282FA14628566582F206A5DD0BCC8D5E892611806CAFB0301F0', 'hex'),
        origin: new Keypath({ path: "m/44'/60'/0'" }),
        children: new Keypath({ path: "0/1" }),
      }),
      tokenIds: ['0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48']
    })

    const accountMatic = new DetailedAccount({
      account: new HDKey({
        isMaster: false,
        keyData: Buffer.from('032503D7DCA4FF0594F0404D56188542A18D8E0784443134C716178BC1819C3DD4', 'hex'),
        chainCode: Buffer.from('D2B36900396C9282FA14628566582F206A5DD0BCC8D5E892611806CAFB0301F0', 'hex'),
        origin: new Keypath({ path: "m/44'/60'/0'" }),
        children: new Keypath({ path: "0/1" }),
      }),
      tokenIds: ['2791Bca1f2de4661ED88A30C99A7a9449Aa84174']
    })

    const accountSol = new DetailedAccount({
      account: new HDKey({
        isMaster: false,
        keyData: Buffer.from('02EAE4B876A8696134B868F88CC2F51F715F2DBEDB7446B8E6EDF3D4541C4EB67B', 'hex'),
        origin: new Keypath({ path: "m/44'/501'/0'/0" }),
      }),
      tokenIds: ['EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v']
    })

    const accountBtc = new DetailedAccount({
      account: new OutputDescriptor({
        source: 'pkh(@0)',
        keys: [
          new HDKey({
            isMaster: false,
            keyData: Buffer.from('03EB3E2863911826374DE86C231A4B76F0B89DFA174AFB78D7F478199884D9DD32', 'hex'),
            chainCode: Buffer.from('6456A5DF2DB0F6D9AF72B2A1AF4B25F45200ED6FCC29C3440B311D4796B70B5B', 'hex'),
            origin: new Keypath({ path: "m/44'/0'/0'/0/0" }),
            children: new Keypath({ path: "0/0" }),
          }),
        ],
      })
    })

    const cryptoCoinEth = new PortfolioCoin({ coinId: coinIdEth, accounts: [accountEth] })
    const cryptoCoinSol = new PortfolioCoin({ coinId: coinIdSol, accounts: [accountSol] })
    const cryptoCoinMatic = new PortfolioCoin({ coinId: coinIdMatic, accounts: [accountMatic] })
    const cryptoCoinBtc = new PortfolioCoin({ coinId: coinIdBtc, accounts: [accountBtc] })

    const metadata = new PortfolioMetadata({
      syncId: Buffer.from('123456781234567802D9044FA3011A71', 'hex'),
      language: 'en',
      firmwareVersion: '1.2.1-1.rc',
      device: 'NGRAVE ZERO',
    })

    const portfolio = new Portfolio({ coins: [cryptoCoinEth, cryptoCoinSol, cryptoCoinMatic, cryptoCoinBtc], metadata })

    const hex = portfolio.toHex()
    const ur = portfolio.toUr()

    const decodedPortfolio = Portfolio.fromHex(hex) as Portfolio

    expect(decodedPortfolio.getCoins().length).toEqual(portfolio.getCoins().length)
    expect(decodedPortfolio.getMetadata()?.getSyncId()).toEqual(portfolio.getMetadata()?.getSyncId())
    expect(decodedPortfolio.getMetadata()?.getlanguage()).toEqual(portfolio.getMetadata()?.getlanguage())
    expect(decodedPortfolio.getMetadata()?.getFirmwareVersion()).toEqual(portfolio.getMetadata()?.getFirmwareVersion())
    expect(decodedPortfolio.getMetadata()?.getDevice()).toEqual(portfolio.getMetadata()?.getDevice())

    for (let i = 0; i < portfolio.getCoins().length; i++) {
      expect(decodedPortfolio.getCoins()[i].getCoinId().toURL()).toEqual(portfolio.getCoins()[i].getCoinId().toURL())
      expect(decodedPortfolio.getCoins()[i].getDetailedAccounts()?.length).toEqual(portfolio.getCoins()[i].getDetailedAccounts()?.length)

      for (let j = 0; j < (portfolio.getCoins()[i]?.getDetailedAccounts()?.length || 0); j++) {
        expect(decodedPortfolio.getCoins()[i].getDetailedAccounts()?.[j].getTokenIds()).toEqual(portfolio.getCoins()[i].getDetailedAccounts()?.[j].getTokenIds())
        expect(decodedPortfolio.getCoins()[i].getDetailedAccounts()?.[j].toHex()).toEqual(portfolio.getCoins()[i].getDetailedAccounts()?.[j].toHex())
      }
    }
  })
})