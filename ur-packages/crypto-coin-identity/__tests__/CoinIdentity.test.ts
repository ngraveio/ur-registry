import { CryptoCoinIdentity } from '../src'
import { EllipticCurve } from '../src/CoinIdentity'
import { URRegistryDecoder } from '@keystonehq/bc-ur-registry'

describe('CoinIdentity', () => {
  it('Should have registryType with the correct tag and type.', () => {
    const curve = EllipticCurve.secp256k1
    const type = 0

    const coinIdentity = new CryptoCoinIdentity(curve, type)

    const RegistryType = coinIdentity.getRegistryType()
    expect(RegistryType.getTag()).toBe(1401)
    expect(RegistryType.getType()).toBe('crypto-coin-identity')
  })
  it('Should encode/decode with required values', () => {
    const curve = EllipticCurve.secp256k1
    const type = 0

    const coinIdentity = new CryptoCoinIdentity(curve, type)

    expect(coinIdentity.getCurve()).toBe(curve)
    expect(coinIdentity.getType()).toBe(type)
    expect(coinIdentity.getSubType()).toBe(undefined)

    const urData = coinIdentity.toUREncoder(1000).nextPart()
    const ur = URRegistryDecoder.decode(urData)
    const coinIdentityRead = CryptoCoinIdentity.fromCBOR(ur.cbor)

    expect(coinIdentityRead.getCurve()).toBe(curve)
    expect(coinIdentityRead.getType()).toBe(type)
    expect(coinIdentityRead.getSubType()).toBe(undefined)
  })
  it('Should encode/decode with subTypes string & number ', () => {
    const curve = EllipticCurve.secp256k1
    const type = 0
    const subType = ['segwit', 123]
    const coinIdentity = new CryptoCoinIdentity(curve, type, subType)

    expect(coinIdentity.getCurve()).toBe(curve)
    expect(coinIdentity.getType()).toBe(type)
    expect(coinIdentity.getSubType()).toStrictEqual(subType)

    const urData = coinIdentity.toUREncoder(1000).nextPart()
    const ur = URRegistryDecoder.decode(urData)
    const coinIdentityRead = CryptoCoinIdentity.fromCBOR(ur.cbor)

    expect(coinIdentityRead.getCurve()).toBe(curve)
    expect(coinIdentityRead.getType()).toBe(type)
    expect(coinIdentityRead.getSubType()).toStrictEqual(subType)
  })
  it('Should encode/decode with subType hex string', () => {
    const curve = EllipticCurve.secp256k1
    const type = 0
    const subTypeValue = 'babe0000babe00112233445566778899'
    const subType = [Buffer.from(subTypeValue, 'hex')]

    /**
         * A3                                      # map(3)
            01                                   # unsigned(1)
            08                                   # unsigned(8)
            02                                   # unsigned(2)
            00                                   # unsigned(0)
            03                                   # unsigned(3)
            81                                   # array(1)
                50                                # bytes(16)
         BABE0000BABE00112233445566778899 # "\xBA\xBE\u0000\u0000\xBA\xBE\u0000\u0011\"3DUfw\x88\x99"
         */
    const coinIdentity = new CryptoCoinIdentity(curve, type, subType)

    expect(coinIdentity.getCurve()).toBe(curve)
    expect(coinIdentity.getType()).toBe(type)
    expect(coinIdentity.getSubType()).toStrictEqual(subType)
    expect((coinIdentity.getSubType()?.[0] as Buffer).toString('hex')).toStrictEqual(subTypeValue)

    const urData = coinIdentity.toUREncoder(1000).nextPart()
    const ur = URRegistryDecoder.decode(urData)
    const coinIdentityRead = CryptoCoinIdentity.fromCBOR(ur.cbor)

    expect(coinIdentityRead.getCurve()).toBe(curve)
    expect(coinIdentityRead.getType()).toBe(type)
    expect(coinIdentityRead.getSubType()).toStrictEqual(subType)
    expect((coinIdentityRead.getSubType()?.[0] as Buffer).toString('hex')).toStrictEqual(subTypeValue)
  })
  it('Should encode/decode with all possible values', () => {
    const curve = EllipticCurve.secp256k1
    const type = 0
    const subType = [
      Buffer.from('babe0000babe00112233445566778899', 'hex'),
      Buffer.from('babe0000babe001122334', 'hex'),
      Buffer.from('babe', 'hex'),
      'segwit',
      123,
    ]

    const coinIdentity = new CryptoCoinIdentity(curve, type, subType)

    expect(coinIdentity.getCurve()).toBe(curve)
    expect(coinIdentity.getType()).toBe(type)
    expect(coinIdentity.getSubType()).toStrictEqual(subType)

    const urData = coinIdentity.toUREncoder(1000).nextPart()
    const ur = URRegistryDecoder.decode(urData)
    const coinIdentityRead = CryptoCoinIdentity.fromCBOR(ur.cbor)

    expect(coinIdentityRead.getCurve()).toBe(curve)
    expect(coinIdentityRead.getType()).toBe(type)
    expect(coinIdentityRead.getSubType()).toStrictEqual(subType)
  })
})
