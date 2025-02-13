import { SignRequest } from '../src/index'
import { UUID } from '@ngraveio/bc-ur-registry-uuid'
import { UR } from '@ngraveio/bc-ur'
import { CoinIdentity } from '@ngraveio/bc-ur-registry-crypto-coin-identity'
import { Keypath } from '@ngraveio/bc-ur-registry'
import { Buffer } from 'buffer/'

describe('SignRequest', () => {
  it('should encode and decode a Bitcoin sign request with all parameters', () => {
    const requestId = new UUID(Buffer.from('3b5414375e3a450b8fe1251cbc2b3fb5', 'hex'))
    const coinId = new CoinIdentity(8, 0) // Bitcoin
    const derivationPath = new Keypath({ path: "m/44'/0'/0'/0/0" })
    const signData = Buffer.from('0100000001abcdef', 'hex')
    const origin = "NGRAVE ZERO"
    const txType = 1
    const address = '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa'

    const signRequest = new SignRequest({ requestId, coinId, derivationPath, signData, origin, txType, address })

    // Encoding
    const ur = signRequest.toUr()
    const urString = ur.toString()

    expect(urString).toBe('ur:sign-request/osadtpdagdfrghbbemhyftfebdmyvydacerfdnfhreaotaoyrhoeadayaoaeaxtantjooyadlecsdwykaeykaeykaewkaewkaafdadaeaeaeadpysnwsahjeglflgmfphffecxhtfegmgwamadatkscpehfpehkngdehihgdecgyflihiyineyfygtgdghiyghgsecgugsjnkoemfyinkoiyglhsbtjzghlg')

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
    const coinId = new CoinIdentity(8, 0) // Bitcoin
    const signData = Buffer.from('0100000001abcdef', 'hex')

    const signRequest = new SignRequest({ requestId, coinId, signData })

    // Encoding
    const ur = signRequest.toUr()
    const urString = ur.toString()

    expect(urString).toBe('ur:sign-request/otadtpdagdfrghbbemhyftfebdmyvydacerfdnfhreaotaoyrhoeadayaoaeaafdadaeaeaeadpysnwszomtmsls')

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
    const coinId = new CoinIdentity(8, 60) // Ethereum
    const derivationPath = new Keypath({ path: "m/44'/60'/0'/0/0" })
    const signData = Buffer.from('f86c808504a817c80082520894', 'hex')
    const origin = "NGRAVE ZERO"
    const txType = 1
    const address = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e'

    const signRequest = new SignRequest({ requestId, coinId, derivationPath, signData, origin, txType, address })

    // Encoding
    const ur = signRequest.toUr()
    const urString = ur.toString()

    expect(urString).toBe('ur:sign-request/osadtpdagdndcawmgtfrkigrpmndutdnbtkgfssbjnaotaoyrhoeadayaocsfnaxtantjooyadlecsdwykcsfnykaeykaewkaewkaagtyajzlalpaapdchspaelfgmaymwahjeglflgmfphffecxhtfegmgwamadatksdrdyksemeeeyieeoecfxiaeneneoeefxdyeceoeyeseyechseoideteeeefwiaeeeceeiheeeeeoetiyeeeeihjecmiawp')

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
    const coinId = new CoinIdentity(8, 60) // Ethereum
    const signData = Buffer.from('f86c808504a817c80082520894', 'hex')

    const signRequest = new SignRequest({ requestId, coinId, signData })

    // Encoding
    const ur = signRequest.toUr()
    const urString = ur.toString()

    expect(urString).toBe('ur:sign-request/oxadtpdagdndcawmgtfrkigrpmndutdnbtkgfssbjnaotaoyrhoeadayaocsfnaagtyajzlalpaapdchspaelfgmaymwamadwkgezoeh')

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
        coinId: new CoinIdentity(8, 60),
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
        coinId: new CoinIdentity(8, 60),
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
        coinId: new CoinIdentity(8, 60),
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
        coinId: new CoinIdentity(8, 60),
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
        coinId: new CoinIdentity(8, 60),
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
        coinId: new CoinIdentity(8, 60),
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
        coinId: new CoinIdentity(8, 60),
        derivationPath: new Keypath({ path: "m/44'/60'/0'/0/0" }),
        signData: Buffer.from('f86c808504a817c80082520894', 'hex'),
        origin: "NGRAVE ZERO",
        txType: 1,
        address: 12345 as unknown as string
      }
      expect(() => new SignRequest(input)).toThrow('Address should be a string or a buffer')
    })
  })

  describe('Example Coin Signature Requests', () => {
    it('should encode and decode a Bitcoin sign request', () => {
      const requestId = new UUID(Buffer.from('3b5414375e3a450b8fe1251cbc2b3fb5', 'hex'))
      const coinId = new CoinIdentity(8, 0) // Bitcoin
      const derivationPath = new Keypath({ path: "m/44'/0'/0'/0/0", sourceFingerprint: 934670036 })
      const signData = Buffer.from('70736274ff01009a020000000258e87a21b56daf0c23be8e7070456c336f7cbaa5c8757924f545887bb2abdd750000000000ffffffff838d0427d0ec650a68aa46bb0b098aea4422c071b2ca78352a077959d07cea1d0100000000ffffffff0270aaf00800000000160014d85c2b71d0060b09c9886aeb815e50991dda124d00e1f5050000000016001400aea9a2e5f0f876a588df5546e8742d1d87008f000000000000000000', 'hex')
      const origin = "NGRAVE LIQUID"

      const signRequest = new SignRequest({ requestId, coinId, derivationPath, signData, origin })

      // Encoding
      const ur = signRequest.toUr()
      const urString = ur.toString()

      expect(urString).toBe('ur:sign-request/onadtpdagdfrghbbemhyftfebdmyvydacerfdnfhreaotaoyrhoeadayaoaeaxtantjooeadlecsdwykaeykaeykaewkaewkaocyemrewytyaahdosjojkidjyzmadaenyaoaeaeaeaohdvsknclrejnpebncnrnmnjojofejzeojlkerdonspkpkkdkykfelokgprpyutkpaeaeaeaeaezmzmzmzmlslgaaditiwpihbkispkfgrkbdaslewdfycprtjsprsgksecdratkkhktikewdcaadaeaeaeaezmzmzmzmaojopkwtayaeaeaeaecmaebbtphhdnjstiambdassoloimwmlyhygdnlcatnbggtaevyykahaeaeaeaecmaebbaeplptoevwwtyakoonlourgofgvsjydpcaltaemyaeaeaeaeaeaeaeaeaeahjnglflgmfphffecxgsgagygogafyhebgfzdl')

      // Decoding
      const decodedUr = UR.fromString(urString)
      const decodedSignRequest = SignRequest.fromUr(decodedUr) as SignRequest

      expect(decodedSignRequest.getRequestId()?.toString()).toBe(requestId.toString())
      expect(decodedSignRequest.getCoinId().getType()).toBe(0)
      expect(decodedSignRequest.getDerivationPath()?.toString()).toBe(derivationPath.toString())
      expect(decodedSignRequest.getSignData().toString('hex')).toBe(signData.toString('hex'))
      expect(decodedSignRequest.getOrigin()).toBe(origin)
    })

    it('should encode and decode an Polygon sign request', () => {
      const requestId = new UUID(Buffer.from('9b1deb4d3b7d4bad9bdd2b0d7b3dcb6d', 'hex'))
      const coinId = new CoinIdentity(8, 60, [137]) // Polygon
      const derivationPath = new Keypath({ path: "m/44'/60'/0'/0/0", sourceFingerprint: 934670036 })
      const signData = Buffer.from('f849808609184e72a00082271094000000000000000000000000000000000000000080a47f7465737432000000000000000000000000000000000000000000000000000000600057808080', 'hex')
      const origin = "NGRAVE LIQUID"
      const txType = 1
      const address = Buffer.from("1EFECB61A2F80AA34D3B9218B564A64D05946290", 'hex')

      const signRequest = new SignRequest({ requestId, coinId, derivationPath, signData, origin, txType, address })

      // Encoding
      const ur = signRequest.toUr()
      const urString = ur.toString()

      expect(urString).toBe('ur:sign-request/osadtpdagdndcawmgtfrkigrpmndutdnbtkgfssbjnaotaoyrhotadayaocsfnaxlycsldaxtantjooeadlecsdwykcsfnykaeykaewkaewkaocyemrewytyaahdgryagalalnascsgljpnbaelfdibemwaeaeaeaeaeaeaeaeaeaeaeaeaeaeaeaeaeaeaeaelaoxlbjyihjkjyeyaeaeaeaeaeaeaeaeaeaeaeaeaeaeaeaeaeaeaeaeaeaeaeaeaeaeaehnaehglalalaahjnglflgmfphffecxgsgagygogafyamadatghckzesbhsoeyabkotgtfrmocsreieolgtahmwidmhterpwnyn')

      // Decoding
      const decodedUr = UR.fromString(urString)
      const decodedSignRequest = SignRequest.fromUr(decodedUr) as SignRequest

      expect(decodedSignRequest.getRequestId()?.toString()).toBe(requestId.toString())
      expect(decodedSignRequest.getCoinId().getType()).toBe(60)
      expect(decodedSignRequest.getDerivationPath()?.toString()).toBe(derivationPath.toString())
      expect(decodedSignRequest.getSignData().toString('hex')).toBe(signData.toString('hex'))
      expect(decodedSignRequest.getOrigin()).toBe(origin)
      expect(decodedSignRequest.getTxType()).toBe(txType)
      expect(decodedSignRequest.getAddress()).toBe(address.toString('hex'))
    })

    it('should encode and decode a Solana sign request', () => {
      const requestId = new UUID(Buffer.from('9b1deb4d3b7d4bad9bdd2b0d7b3dcb6d', 'hex'))
      const coinId = new CoinIdentity(6, 501) // Solana
      const derivationPath = new Keypath({ path: "m/44'/501'/0'/0'", sourceFingerprint: 934670036 })
      const signData = Buffer.from('01000103c8d842a2f17fd7aab608ce2ea535a6e958dffa20caf669b347b911c4171965530f957620b228bae2b94c82ddd4c093983a67365555b737ec7ddc1117e61c72e0000000000000000000000000000000000000000000000000000000000000000010295cc2f1f39f3604718496ea00676d6a72ec66ad09d926e3ece34f565f18d201020200010c0200000000e1f50500000000', 'hex')
      const origin = "NGRAVE LIQUID"
      const txType = 1
      const address = '9FPebKDGZAdcpT7SpfB1UowuqobV8Zww9TwPDSyzXJMr'

      const signRequest = new SignRequest({ requestId, coinId, derivationPath, signData, origin, txType, address })

      // Encoding
      const ur = signRequest.toUr()
      const urString = ur.toString()

      expect(urString).toBe('ur:sign-request/osadtpdagdndcawmgtfrkigrpmndutdnbtkgfssbjnaotaoyrhoeadamaocfadykaxtantjooeadlocsdwykcfadykykaeykaeykaocyemrewytyaahdmtadaeadaxsptpfwoewnlbtspkrpaytodmonecolwlhdurzscxsgyninqdflrhbysschcfihgubsmdkocxprderdvorhgslfuttyrtmumkftioengogorlemwpkiuobychvacejpvtaeaeaeaeaeaeaeaeaeaeaeaeaeaeaeaeaeaeaeaeaeaeaeaeaeaeaeaeaeaeaeaebedthhsawnwfneenaajslrmtwdaeiojnimjpwpiypmastadsvlwpvlgwhfhecstdadaoaoaeadbnaoaeaeaeaevyykahaeaeaeaeahjnglflgmfphffecxgsgagygogafyamadatksdwesfggdihidgrfyflhtfpieiajoghemgujoiyfwehgojlktkpjsjlidhfethtktktesghktgdfygukkknhdgegtjpcmztvlnt')

      // Decoding
      const decodedUr = UR.fromString(urString)
      const decodedSignRequest = SignRequest.fromUr(decodedUr) as SignRequest

      expect(decodedSignRequest.getRequestId()?.toString()).toBe(requestId.toString())
      expect(decodedSignRequest.getCoinId().getType()).toBe(501)
      expect(decodedSignRequest.getDerivationPath()?.toString()).toBe(derivationPath.toString())
      expect(decodedSignRequest.getSignData().toString('hex')).toBe(signData.toString('hex'))
      expect(decodedSignRequest.getOrigin()).toBe(origin)
      expect(decodedSignRequest.getTxType()).toBe(txType)
      expect(decodedSignRequest.getAddress()).toBe(address)
    })

    it('should encode and decode a Tezos sign request', () => {
      const requestId = new UUID(Buffer.from('9b1deb4d3b7d4bad9bdd2b0d7b3dcb6d', 'hex'))
      const coinId = new CoinIdentity(6, 1729) // Tezos
      const derivationPath = new Keypath({ path: "m/44'/1729'/0'/0'/0'", sourceFingerprint: 934670036 })
      const signData = Buffer.from('f849808609184e72a00082271094000000000000000000000000000000000000000080a47f7465737432000000000000000000000000000000000000000000000000000000600057808080', 'hex')
      const origin = "NGRAVE LIQUID"
      const txType = 1
      const address = 'tz1gLTu4Yxj8tPAcriQVUdxv6BY9QyvzU1az'

      const signRequest = new SignRequest({ requestId, coinId, derivationPath, signData, origin, txType, address })

      // Encoding
      const ur = signRequest.toUr()
      const urString = ur.toString()

      expect(urString).toBe('ur:sign-request/osadtpdagdndcawmgtfrkigrpmndutdnbtkgfssbjnaotaoyrhoeadamaocfamseaxtantjooeadlecsdwykcfamseykaeykaeykaeykaocyemrewytyaahdgryagalalnascsgljpnbaelfdibemwaeaeaeaeaeaeaeaeaeaeaeaeaeaeaeaeaeaeaeaelaoxlbjyihjkjyeyaeaeaeaeaeaeaeaeaeaeaeaeaeaeaeaeaeaeaeaeaeaeaeaeaeaeaehnaehglalalaahjnglflgmfphffecxgsgagygogafyamadatksdkjyknehiogsghkpeehkksimetjygdfpiajpingyhfgoiekskoenfwhkesgykkkokngoehhsknmyfnwmfw')

      // Decoding
      const decodedUr = UR.fromString(urString)
      const decodedSignRequest = SignRequest.fromUr(decodedUr) as SignRequest

      expect(decodedSignRequest.getRequestId()?.toString()).toBe(requestId.toString())
      expect(decodedSignRequest.getCoinId().getType()).toBe(1729)
      expect(decodedSignRequest.getDerivationPath()?.toString()).toBe(derivationPath.toString())
      expect(decodedSignRequest.getSignData().toString('hex')).toBe(signData.toString('hex'))
      expect(decodedSignRequest.getOrigin()).toBe(origin)
      expect(decodedSignRequest.getTxType()).toBe(txType)
      expect(decodedSignRequest.getAddress()).toBe(address)
    })

    it('should encode and decode a MultiversX sign request', () => {
      const requestId = new UUID(Buffer.from('9b1deb4d3b7d4bad9bdd2b0d7b3dcb6d', 'hex'))
      const coinId = new CoinIdentity(6, 508) // MultiversX
      const derivationPath = new Keypath({ path: "m/44'/508'/0'/0'/1'", sourceFingerprint: 934670036 })
      const signData = Buffer.from('f849808609184e72a00082271094000000000000000000000000000000000000000080a47f7465737432000000000000000000000000000000000000000000000000000000600057808080', 'hex')
      const origin = "NGRAVE LIQUID"

      const signRequest = new SignRequest({ requestId, coinId, derivationPath, signData, origin })

      // Encoding
      const ur = signRequest.toUr()
      const urString = ur.toString()

      expect(urString).toBe('ur:sign-request/onadtpdagdndcawmgtfrkigrpmndutdnbtkgfssbjnaotaoyrhoeadamaocfadztaxtantjooeadlecsdwykcfadztykaeykaeykadykaocyemrewytyaahdgryagalalnascsgljpnbaelfdibemwaeaeaeaeaeaeaeaeaeaeaeaeaeaeaeaeaeaeaeaelaoxlbjyihjkjyeyaeaeaeaeaeaeaeaeaeaeaeaeaeaeaeaeaeaeaeaeaeaeaeaeaeaeaehnaehglalalaahjnglflgmfphffecxgsgagygogafypynsuyny')

      // Decoding
      const decodedUr = UR.fromString(urString)
      const decodedSignRequest = SignRequest.fromUr(decodedUr) as SignRequest

      expect(decodedSignRequest.getRequestId()?.toString()).toBe(requestId.toString())
      expect(decodedSignRequest.getCoinId().getType()).toBe(508)
      expect(decodedSignRequest.getDerivationPath()?.toString()).toBe(derivationPath.toString())
      expect(decodedSignRequest.getSignData().toString('hex')).toBe(signData.toString('hex'))
      expect(decodedSignRequest.getOrigin()).toBe(origin)
    })

    it('should encode and decode a Stellar sign request', () => {
      const requestId = new UUID(Buffer.from('9b1deb4d3b7d4bad9bdd2b0d7b3dcb6d', 'hex'))
      const coinId = new CoinIdentity(6, 148) // Stellar
      const derivationPath = new Keypath({ path: "m/44'/148'/0'/0'/2'", sourceFingerprint: 934670036 })
      const signData = Buffer.from('00000002000000002df26f5fc2916d823126414b0cde52203a4f54222e1f3c82f2c82bf7c4e2d76d000000640011b3dc0000000100000001000000000000006400000000646e9655000000010000000c48656c6c6f20576f726c642100000001000000000000000100000000321911377e1664d677a85ab30acd1262522f989f0f31da613219e8396278cdb90000000000000002540be4000000000000000000', 'hex')
      const origin = "NGRAVE LIQUID"

      const signRequest = new SignRequest({ requestId, coinId, derivationPath, signData, origin })

      // Encoding
      const ur = signRequest.toUr()
      const urString = ur.toString()

      expect(urString).toBe('ur:sign-request/onadtpdagdndcawmgtfrkigrpmndutdnbtkgfssbjnaotaoyrhoeadamaocsmwaxtantjooeadlecsdwykcsmwykaeykaeykaoykaocyemrewytyaahdnbaeaeaeaoaeaeaeaedpwzjlhesamejnlfehdsfpgrbnuegmcxftgwghcpdmctfnlfwzspdnylssvotsjnaeaeaeieaebyqduoaeaeaeadaeaeaeadaeaeaeaeaeaeaeieaeaeaeaeiejtmtgoaeaeaeadaeaeaebnfdihjzjzjlcxhgjljpjzieclaeaeaeadaeaeaeaeaeaeaeadaeaeaeaeeycfbyemkbcmietbktpdhtqdbksnbgidgmdlmknebsehtnhseycfvsesidkssnrhaeaeaeaeaeaeaeaoghbdveaeaeaeaeaeaeaeaeaeahjnglflgmfphffecxgsgagygogafyeedshgwd')

      // Decoding
      const decodedUr = UR.fromString(urString)
      const decodedSignRequest = SignRequest.fromUr(decodedUr) as SignRequest

      expect(decodedSignRequest.getRequestId()?.toString()).toBe(requestId.toString())
      expect(decodedSignRequest.getCoinId().getType()).toBe(148)
      expect(decodedSignRequest.getDerivationPath()?.toString()).toBe(derivationPath.toString())
      expect(decodedSignRequest.getSignData().toString('hex')).toBe(signData.toString('hex'))
      expect(decodedSignRequest.getOrigin()).toBe(origin)
    })
  })
})