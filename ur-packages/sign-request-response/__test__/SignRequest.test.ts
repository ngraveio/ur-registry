import { SignRequest } from '../src/index'
import { UUID } from '@ngraveio/bc-ur-registry-uuid'
import { UR } from '@ngraveio/bc-ur'
import { CryptoCoinIdentity } from '@ngraveio/bc-ur-registry-crypto-coin-identity'
import { Keypath } from '@ngraveio/bc-ur-registry'
import { Buffer } from 'buffer/'

describe('SignRequest', () => {
  it('should encode and decode a Bitcoin sign request with all parameters', () => {
    const requestId = new UUID(Buffer.from('3b5414375e3a450b8fe1251cbc2b3fb5', 'hex'))
    const coinId = new CryptoCoinIdentity(8, 0) // Bitcoin
    const derivationPath = new Keypath({ path: "m/44'/0'/0'/0/0" })
    const signData = Buffer.from('0100000001abcdef', 'hex')
    const origin = "NGRAVE ZERO"
    const txType = 1
    const address = '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa'

    const signRequest = new SignRequest({ requestId, coinId, derivationPath, signData, origin, txType, address })

    // Encoding
    const ur = signRequest.toUr()
    const urString = ur.toString()

    expect(urString).toBe('ur:sign-request/osadtpdagdfrghbbemhyftfebdmyvydacerfdnfhreaotaahkkotadayaoaeaxlaaxtantjooyadlecsdwykaeykaeykaewkaewkaafdadaeaeaeadpysnwsahjeglflgmfphffecxhtfegmgwamadatkscpehfpehkngdehihgdecgyflihiyineyfygtgdghiyghgsecgugsjnkoemfyinkoiyglhscxhycywy')

    // Decoding
    const decodedUr = UR.fromString(urString)
    const decodedSignRequest = SignRequest.fromUr(decodedUr) as SignRequest

    expect(decodedSignRequest.getRequestId()?.toString()).toBe(requestId.toString())
    expect(decodedSignRequest.getCoinId().getType()).toBe(0)
    expect(decodedSignRequest.getDerivationPath()?.toString()).toBe(derivationPath.toString())
    expect(decodedSignRequest.getSignData().toString('hex')).toBe(signData.toString('hex'))
    expect(decodedSignRequest.getOrigin()).toBe(origin)
    expect(decodedSignRequest.getTxType()).toBe(txType)
    expect(decodedSignRequest.getAddress()).toBe(address)
  })

  it('should encode and decode a Bitcoin sign request without optional parameters', () => {
    const requestId = new UUID(Buffer.from('3b5414375e3a450b8fe1251cbc2b3fb5', 'hex'))
    const coinId = new CryptoCoinIdentity(8, 0) // Bitcoin
    const signData = Buffer.from('0100000001abcdef', 'hex')

    const signRequest = new SignRequest({ requestId, coinId, signData })

    // Encoding
    const ur = signRequest.toUr()
    const urString = ur.toString()

    expect(urString).toBe('ur:sign-request/otadtpdagdfrghbbemhyftfebdmyvydacerfdnfhreaotaahkkotadayaoaeaxlaaafdadaeaeaeadpysnwsbetpsbch')

    // Decoding
    const decodedUr = UR.fromString(urString)
    const decodedSignRequest = SignRequest.fromUr(decodedUr) as SignRequest

    expect(decodedSignRequest.getRequestId()?.toString()).toBe(requestId.toString())
    expect(decodedSignRequest.getCoinId().getType()).toBe(0)
    expect(decodedSignRequest.getDerivationPath()).toBeUndefined()
    expect(decodedSignRequest.getSignData().toString('hex')).toBe(signData.toString('hex'))
    expect(decodedSignRequest.getOrigin()).toBeUndefined()
    expect(decodedSignRequest.getTxType()).toBeUndefined()
    expect(decodedSignRequest.getAddress()).toBeUndefined()
  })

  it('should encode and decode an Ethereum sign request with all parameters', () => {
    const requestId = new UUID(Buffer.from('9b1deb4d3b7d4bad9bdd2b0d7b3dcb6d', 'hex'))
    const coinId = new CryptoCoinIdentity(8, 60) // Ethereum
    const derivationPath = new Keypath({ path: "m/44'/60'/0'/0/0" })
    const signData = Buffer.from('f86c808504a817c80082520894', 'hex')
    const origin = "NGRAVE ZERO"
    const txType = 1
    const address = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e'

    const signRequest = new SignRequest({ requestId, coinId, derivationPath, signData, origin, txType, address })

    // Encoding
    const ur = signRequest.toUr()
    const urString = ur.toString()

    expect(urString).toBe('ur:sign-request/osadtpdagdndcawmgtfrkigrpmndutdnbtkgfssbjnaotaahkkotadayaocsfnaxlaaxtantjooyadlecsdwykcsfnykaeykaewkaewkaagtyajzlalpaapdchspaelfgmaymwahjeglflgmfphffecxhtfegmgwamadatksdrdyksemeeeyieeoecfxiaeneneoeefxdyeceoeyeseyechseoideteeeefwiaeeeceeiheeeeeoetiyeeeeihuymeidty')

    // Decoding
    const decodedUr = UR.fromString(urString)
    const decodedSignRequest = SignRequest.fromUr(decodedUr) as SignRequest

    expect(decodedSignRequest.getRequestId()?.toString()).toBe(requestId.toString())
    expect(decodedSignRequest.getCoinId().getType()).toBe(60)
    expect(decodedSignRequest.getDerivationPath()?.toString()).toBe(derivationPath.toString())
    expect(decodedSignRequest.getSignData().toString('hex')).toBe(signData.toString('hex'))
    expect(decodedSignRequest.getOrigin()).toBe(origin)
    expect(decodedSignRequest.getTxType()).toBe(txType)
    expect(decodedSignRequest.getAddress()).toBe(address)
  })

  it('should encode and decode an Ethereum sign request without optional parameters', () => {
    const requestId = new UUID(Buffer.from('9b1deb4d3b7d4bad9bdd2b0d7b3dcb6d', 'hex'))
    const coinId = new CryptoCoinIdentity(8, 60) // Ethereum
    const signData = Buffer.from('f86c808504a817c80082520894', 'hex')

    const signRequest = new SignRequest({ requestId, coinId, signData })

    // Encoding
    const ur = signRequest.toUr()
    const urString = ur.toString()

    expect(urString).toBe('ur:sign-request/oxadtpdagdndcawmgtfrkigrpmndutdnbtkgfssbjnaotaahkkotadayaocsfnaxlaaagtyajzlalpaapdchspaelfgmaymwamadsnvetodt')

    // Decoding
    const decodedUr = UR.fromString(urString)
    const decodedSignRequest = SignRequest.fromUr(decodedUr) as SignRequest

    expect(decodedSignRequest.getRequestId()?.toString()).toBe(requestId.toString())
    expect(decodedSignRequest.getCoinId().getType()).toBe(60)
    expect(decodedSignRequest.getDerivationPath()).toBeUndefined()
    expect(decodedSignRequest.getSignData().toString('hex')).toBe(signData.toString('hex'))
    expect(decodedSignRequest.getOrigin()).toBeUndefined()
    expect(decodedSignRequest.getTxType()).toBe(1) // Default txType for Ethereum
    expect(decodedSignRequest.getAddress()).toBeUndefined()
  })

  // Add more test cases for other blockchains as needed

  describe('verifyInput', () => {
    it('should return valid for correct input', () => {
      const input = {
        requestId: new UUID(Buffer.from('9b1deb4d3b7d4bad9bdd2b0d7b3dcb6d', 'hex')),
        coinId: new CryptoCoinIdentity(8, 60),
        derivationPath: new Keypath({ path: "m/44'/60'/0'/0/0" }),
        signData: Buffer.from('f86c808504a817c80082520894', 'hex'),
        origin: "NGRAVE ZERO",
        txType: 1,
        address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e'
      }
      const signRequest = new SignRequest(input)
      const result = signRequest.verifyInput(input)
      console.log(result)
      expect(result.valid).toBe(true)
      expect(result.reasons).toBeUndefined()
    })

    it('should return invalid for incorrect requestId', () => {
      const input = {
        requestId: 'invalid-uuid',
        coinId: new CryptoCoinIdentity(8, 60),
        derivationPath: new Keypath({ path: "m/44'/60'/0'/0/0" }),
        signData: Buffer.from('f86c808504a817c80082520894', 'hex'),
        origin: "NGRAVE ZERO",
        txType: 1,
        address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e'
      }
      expect(() => new SignRequest(input)).toThrow()
    })

    it('should return invalid for missing coinId', () => {
      const input = {
        requestId: new UUID(Buffer.from('9b1deb4d3b7d4bad9bdd2b0d7b3dcb6d', 'hex')),
        derivationPath: new Keypath({ path: "m/44'/60'/0'/0/0" }),
        signData: Buffer.from('f86c808504a817c80082520894', 'hex'),
        origin: "NGRAVE ZERO",
        txType: 1,
        address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e'
      }
      //@ts-ignore
      expect(() => new SignRequest(input)).toThrow('Coin id is required and should be of type CoinIdentity')
    })

    it('should return invalid for incorrect derivationPath type', () => {
      const input = {
        requestId: new UUID(Buffer.from('9b1deb4d3b7d4bad9bdd2b0d7b3dcb6d', 'hex')),
        coinId: new CryptoCoinIdentity(8, 60),
        derivationPath: 12345 as unknown as string,
        signData: Buffer.from('f86c808504a817c80082520894', 'hex'),
        origin: "NGRAVE ZERO",
        txType: 1,
        address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e'
      }
      expect(() => new SignRequest(input)).toThrow('Derivation path should be a string or instance of Keypath')
    })

    it('should return invalid for missing signData', () => {
      const input = {
        requestId: new UUID(Buffer.from('9b1deb4d3b7d4bad9bdd2b0d7b3dcb6d', 'hex')),
        coinId: new CryptoCoinIdentity(8, 60),
        derivationPath: new Keypath({ path: "m/44'/60'/0'/0/0" }),
        origin: "NGRAVE ZERO",
        txType: 1,
        address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e'
      }
      // @ts-ignore
      expect(() => new SignRequest(input)).toThrow('Sign data is required and should be of type Buffer')
    })

    it('should return invalid for incorrect origin type', () => {
      const input = {
        requestId: new UUID(Buffer.from('9b1deb4d3b7d4bad9bdd2b0d7b3dcb6d', 'hex')),
        coinId: new CryptoCoinIdentity(8, 60),
        derivationPath: new Keypath({ path: "m/44'/60'/0'/0/0" }),
        signData: Buffer.from('f86c808504a817c80082520894', 'hex'),
        origin: 12345 as unknown as string,
        txType: 1,
        address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e'
      }
      expect(() => new SignRequest(input)).toThrow('Origin should be a string')
    })

    it('should return invalid for incorrect txType', () => {
      const input = {
        requestId: new UUID(Buffer.from('9b1deb4d3b7d4bad9bdd2b0d7b3dcb6d', 'hex')),
        coinId: new CryptoCoinIdentity(8, 60),
        derivationPath: new Keypath({ path: "m/44'/60'/0'/0/0" }),
        signData: Buffer.from('f86c808504a817c80082520894', 'hex'),
        origin: "NGRAVE ZERO",
        txType: -1,
        address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e'
      }
      expect(() => new SignRequest(input)).toThrow('Tx type should be a positive integer')
    })

    it('should return invalid for incorrect address type', () => {
      const input = {
        requestId: new UUID(Buffer.from('9b1deb4d3b7d4bad9bdd2b0d7b3dcb6d', 'hex')),
        coinId: new CryptoCoinIdentity(8, 60),
        derivationPath: new Keypath({ path: "m/44'/60'/0'/0/0" }),
        signData: Buffer.from('f86c808504a817c80082520894', 'hex'),
        origin: "NGRAVE ZERO",
        txType: 1,
        address: 12345 as unknown as string
      }
      expect(() => new SignRequest(input)).toThrow('Address should be a string or a buffer')
    })
  })
})