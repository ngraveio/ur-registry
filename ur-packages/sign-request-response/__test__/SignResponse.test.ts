import { SignResponse, SignResponseInput } from '../src/SignResponse'
import { UUID } from '@ngraveio/bc-ur-registry-uuid'
import { UR } from '@ngraveio/bc-ur'
import { Buffer } from 'buffer/'

describe('SignResponse', () => {
  it('should encode and decode a Solana signature response', () => {
    const requestId = new UUID(Buffer.from('9b1deb4d3b7d4bad9bdd2b0d7b3dcb6d', 'hex'))
    const signature = Buffer.from('d4f0a7bcd95bba1fbb1051885054730e3f47064288575aacc102fbbf6a9a14daa066991e360d3e3406c20c00a40973eff37c7d641e5b351ec4a99bfe86f335f7', 'hex')
    const origin = "NGRAVE ZERO"

    const signResponse = new SignResponse({ requestId, signature, origin })

    // Encoding
    const ur = signResponse.toUr()
    const urString = ur.toString()

    expect(urString).toBe('ur:sign-response/otadtpdagdndcawmgtfrkigrpmndutdnbtkgfssbjnaohdfztywtosrftahprdctrkbegylogdghjkbafhflamfwlohghtpsseaozorsimnybbtnnbiynlckenbtfmeeamsabnaeoxasjkwswfkekiieckhpecckssptndzelnwfecylaxjeglflgmfphffecxhtfegmgwknfsytca')

    // Decoding
    const decodedUr = UR.fromString(urString)
    const decodedSignResponse = SignResponse.fromUr(decodedUr) as SignResponse

    expect(decodedSignResponse.getRequestId()?.toString()).toBe(requestId.toString())
    expect(decodedSignResponse.getSignature().toString('hex')).toBe(signature.toString('hex'))
    expect(decodedSignResponse.getOrigin()).toBe(origin)
  })

  it('should encode and decode a Bitcoin signature response', () => {
    const requestId = new UUID(Buffer.from('3b5414375e3a450b8fe1251cbc2b3fb5', 'hex'))
    const signature = Buffer.from('70736274ff01009a020000000258e87a21b56daf0c23be8e7070456c336f7cbaa5c8757924f545887bb2abdd750000000000ffffffff838d0427d0ec650a68aa46bb0b098aea4422c071b2ca78352a077959d07cea1d0100000000ffffffff0270aaf00800000000160014d85c2b71d0060b09c9886aeb815e50991dda124d00e1f5050000000016001400aea9a2e5f0f876a588df5546e8742d1d87008f000000000000000000', 'hex')
    const origin = "NGRAVE ZERO"

    const signResponse = new SignResponse({ requestId, signature, origin })

    // Encoding
    const ur = signResponse.toUr()
    const urString = ur.toString()

    expect(urString).toBe('ur:sign-response/otadtpdagdfrghbbemhyftfebdmyvydacerfdnfhreaohdosjojkidjyzmadaenyaoaeaeaeaohdvsknclrejnpebncnrnmnjojofejzeojlkerdonspkpkkdkykfelokgprpyutkpaeaeaeaeaezmzmzmzmlslgaaditiwpihbkispkfgrkbdaslewdfycprtjsprsgksecdratkkhktikewdcaadaeaeaeaezmzmzmzmaojopkwtayaeaeaeaecmaebbtphhdnjstiambdassoloimwmlyhygdnlcatnbggtaevyykahaeaeaeaecmaebbaeplptoevwwtyakoonlourgofgvsjydpcaltaemyaeaeaeaeaeaeaeaeaeaxjeglflgmfphffecxhtfegmgwspghwtld')

    // Decoding
    const decodedUr = UR.fromString(urString)
    const decodedSignResponse = SignResponse.fromUr(decodedUr) as SignResponse

    expect(decodedSignResponse.getRequestId()?.toString()).toBe(requestId.toString())
    expect(decodedSignResponse.getSignature().toString('hex')).toBe(signature.toString('hex'))
    expect(decodedSignResponse.getOrigin()).toBe(origin)
  })

  it('should encode and decode an Ethereum signature response', () => {
    const requestId = new UUID(Buffer.from('9b1deb4d3b7d4bad9bdd2b0d7b3dcb6d', 'hex'))
    const signature = Buffer.from('d4f0a7bcd95bba1fbb1051885054730e3f47064288575aacc102fbbf6a9a14daa066991e360d3e3406c20c00a40973eff37c7d641e5b351ec4a99bfe86f335f713', 'hex')
    const origin = "NGRAVE ZERO"

    const signResponse = new SignResponse({ requestId, signature, origin })

    // Encoding
    const ur = signResponse.toUr()
    const urString = ur.toString()

    expect(urString).toBe('ur:sign-response/otadtpdagdndcawmgtfrkigrpmndutdnbtkgfssbjnaohdfptywtosrftahprdctrkbegylogdghjkbafhflamfwlohghtpsseaozorsimnybbtnnbiynlckenbtfmeeamsabnaeoxasjkwswfkekiieckhpecckssptndzelnwfecylbwaxjeglflgmfphffecxhtfegmgwoxurfzby')

    // Decoding
    const decodedUr = UR.fromString(urString)
    const decodedSignResponse = SignResponse.fromUr(decodedUr) as SignResponse

    expect(decodedSignResponse.getRequestId()?.toString()).toBe(requestId.toString())
    expect(decodedSignResponse.getSignature().toString('hex')).toBe(signature.toString('hex'))
    expect(decodedSignResponse.getOrigin()).toBe(origin)
  })

  it('should encode and decode a Tezos signature response', () => {
    const requestId = new UUID(Buffer.from('9b1deb4d3b7d4bad9bdd2b0d7b3dcb6d', 'hex'))
    const signature = Buffer.from('9fb423ee0b1ad3d3ad359c22d1e79048789c232813663fd5d8a1223458082ea844f5e87bf77db3b997aa4c847e23047c042003e3b204cea9ae0e1bf6fdcaaf09', 'hex')
    const origin = "NGRAVE ZERO"

    const signResponse = new SignResponse({ requestId, signature, origin })

    // Encoding
    const ur = signResponse.toUr()
    const urString = ur.toString()

    expect(urString).toBe('ur:sign-response/otadtpdagdndcawmgtfrkigrpmndutdnbtkgfssbjnaohdfzneqzcnwybdcytetepmecnscpttvdmhfdksnscndebwiyfhtltpoycpeehdaydmpdfyykvskgylkiqdrhmspkgslrkbcnaakeaacxaxvlpraatoptplbacwynzcsgpeasaxjeglflgmfphffecxhtfegmgwlkdifdrn')

    // Decoding
    const decodedUr = UR.fromString(urString)
    const decodedSignResponse = SignResponse.fromUr(decodedUr) as SignResponse

    expect(decodedSignResponse.getRequestId()?.toString()).toBe(requestId.toString())
    expect(decodedSignResponse.getSignature().toString('hex')).toBe(signature.toString('hex'))
    expect(decodedSignResponse.getOrigin()).toBe(origin)
  })

  it('should encode and decode a MultiversX signature response', () => {
    const requestId = new UUID(Buffer.from('9b1deb4d3b7d4bad9bdd2b0d7b3dcb6d', 'hex'))
    const signature = Buffer.from('9fb423ee0b1ad3d3ad359c22d1e79048789c232813663fd5d8a1223458082ea844f5e87bf77db3b997aa4c847e23047c042003e3b204cea9ae0e1bf6fdcaaf09', 'hex')
    const origin = "NGRAVE ZERO"

    const signResponse = new SignResponse({ requestId, signature, origin })

    // Encoding
    const ur = signResponse.toUr()
    const urString = ur.toString()

    expect(urString).toBe('ur:sign-response/otadtpdagdndcawmgtfrkigrpmndutdnbtkgfssbjnaohdfzneqzcnwybdcytetepmecnscpttvdmhfdksnscndebwiyfhtltpoycpeehdaydmpdfyykvskgylkiqdrhmspkgslrkbcnaakeaacxaxvlpraatoptplbacwynzcsgpeasaxjeglflgmfphffecxhtfegmgwlkdifdrn')

    // Decoding
    const decodedUr = UR.fromString(urString)
    const decodedSignResponse = SignResponse.fromUr(decodedUr) as SignResponse

    expect(decodedSignResponse.getRequestId()?.toString()).toBe(requestId.toString())
    expect(decodedSignResponse.getSignature().toString('hex')).toBe(signature.toString('hex'))
    expect(decodedSignResponse.getOrigin()).toBe(origin)
  })

  it('should encode and decode a Stellar signature response', () => {
    const requestId = new UUID(Buffer.from('9b1deb4d3b7d4bad9bdd2b0d7b3dcb6d', 'hex'))
    const signature = Buffer.from('9fb423ee0b1ad3d3ad359c22d1e79048789c232813663fd5d8a1223458082ea844f5e87bf77db3b997aa4c847e23047c042003e3b204cea9ae0e1bf6fdcaaf09', 'hex')
    const origin = "NGRAVE ZERO"

    const signResponse = new SignResponse({ requestId, signature, origin })

    // Encoding
    const ur = signResponse.toUr()
    const urString = ur.toString()

    expect(urString).toBe('ur:sign-response/otadtpdagdndcawmgtfrkigrpmndutdnbtkgfssbjnaohdfzneqzcnwybdcytetepmecnscpttvdmhfdksnscndebwiyfhtltpoycpeehdaydmpdfyykvskgylkiqdrhmspkgslrkbcnaakeaacxaxvlpraatoptplbacwynzcsgpeasaxjeglflgmfphffecxhtfegmgwlkdifdrn')

    // Decoding
    const decodedUr = UR.fromString(urString)
    const decodedSignResponse = SignResponse.fromUr(decodedUr) as SignResponse;

    expect(decodedSignResponse.getRequestId()?.toString()).toBe(requestId.toString())
    expect(decodedSignResponse.getSignature().toString('hex')).toBe(signature.toString('hex'))
    expect(decodedSignResponse.getOrigin()).toBe(origin)
  })

  describe('verifyInput', () => {
    it('should return valid for correct input', () => {
      const input = {
        requestId: new UUID(Buffer.from('9b1deb4d3b7d4bad9bdd2b0d7b3dcb6d', 'hex')),
        signature: Buffer.from('d4f0a7bcd95bba1fbb1051885054730e3f47064288575aacc102fbbf6a9a14daa066991e360d3e3406c20c00a40973eff37c7d641e5b351ec4a99bfe86f335f7', 'hex'),
        origin: "NGRAVE ZERO"
      }
      const signResponse = new SignResponse(input)
      const result = signResponse.verifyInput(input)
      expect(result.valid).toBe(true)
      expect(result.reasons).toBeUndefined()
    })

    it('should return invalid for incorrect requestId', () => {
      const input = {
        requestId: 'invalid-uuid',
        signature: Buffer.from('d4f0a7bcd95bba1fbb1051885054730e3f47064288575aacc102fbbf6a9a14daa066991e360d3e3406c20c00a40973eff37c7d641e5b351ec4a99bfe86f335f7', 'hex'),
        origin: "NGRAVE ZERO"
      }
      expect(() => new SignResponse(input)).toThrow('Invalid requestId')
    })

    it('should return invalid for missing signature', () => {
      const input = {
        requestId: new UUID(Buffer.from('9b1deb4d3b7d4bad9bdd2b0d7b3dcb6d', 'hex')),
        origin: "NGRAVE ZERO"
      } as SignResponseInput
      expect(() => new SignResponse(input)).toThrow('Signature must be a buffer')
    })

    it('should return invalid for incorrect origin type', () => {
      const input = {
        requestId: new UUID(Buffer.from('9b1deb4d3b7d4bad9bdd2b0d7b3dcb6d', 'hex')),
        signature: Buffer.from('d4f0a7bcd95bba1fbb1051885054730e3f47064288575aacc102fbbf6a9a14daa066991e360d3e3406c20c00a40973eff37c7d641e5b351ec4a99bfe86f335f7', 'hex'),
        origin: 12345 as unknown as string
      }
      expect(() => new SignResponse(input)).toThrow('Origin must be a string')
    })
  })
})
