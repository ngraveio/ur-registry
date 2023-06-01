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
    expect(coinIdentity.getSubType()).toStrictEqual([])

    const urData = coinIdentity.toUREncoder(1000).nextPart()
    const ur = URRegistryDecoder.decode(urData)
    const coinIdentityRead = CryptoCoinIdentity.fromCBOR(ur.cbor)

    expect(coinIdentityRead.getCurve()).toBe(curve)
    expect(coinIdentityRead.getType()).toBe(type)
    expect(coinIdentityRead.getSubType()).toStrictEqual([])
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

describe('toURL', () => {
  it('should convert coinIdentity to the url representation for required fields', () => {
    const curve = EllipticCurve.secp256k1
    const type = 60

    const expectedResult = `bc-coin://${Object.values(EllipticCurve)[curve - 1]}/${type}`

    const coinIdentity = new CryptoCoinIdentity(curve, type)
    const url = coinIdentity.toURL()
    expect(url).toBe(expectedResult)
  })
  it('should convert coinIdentity to the url representation for all fields', () => {
    const curve = EllipticCurve.secp256k1
    const type = 60
    const chainId = '137'
    const subTypes = [chainId]

    const expectedResult = `bc-coin://${chainId}.${"secp256k1"}/${type}`

    const coinIdentity = new CryptoCoinIdentity(curve, type, subTypes)
    const url = coinIdentity.toURL()
    expect(url).toBe(expectedResult)
  })
  it('creates coinIdentity from a url with subtypes', () => {
    const uri = "bc-coin://blabla.137.secp256k1/60"
    const coinID = CryptoCoinIdentity.fromUrl(uri);
    expect(coinID.getCurve()).toBe("secp256k1");
    expect(coinID.getType()).toBe(60);
    expect(coinID.getSubType()).toStrictEqual(["blabla","137"]);
  })
  it('creates coinIdentity from a url with multiple subtypes', () => {
    const uri = "bc-coin://137.secp256k1/60"
    const coinID = CryptoCoinIdentity.fromUrl(uri);
    expect(coinID.getCurve()).toBe("secp256k1");
    expect(coinID.getType()).toBe(60);
    expect(coinID.getSubType()).toStrictEqual(["137"]);
  })
  it('creates coinIdentity from a url without subtypes', () => {
    const uri = "bc-coin://secp256k1/60"
    const coinID = CryptoCoinIdentity.fromUrl(uri);
    expect(coinID.getCurve()).toBe("secp256k1");
    expect(coinID.getType()).toBe(60);
    expect(coinID.getSubType()).toStrictEqual([]);
  })
})


describe('parent', () => {
  it('should return parent coin identity', () => {
    const curve = EllipticCurve.secp256k1
    const type = 60
    const subType = [137]

    const coinIdentity = new CryptoCoinIdentity(curve, type, subType)
    const parent = coinIdentity.getParent()

    expect(parent?.getCurve()).toBe(curve)
    expect(parent?.getType()).toBe(type)
    expect(parent?.getSubType()).toStrictEqual([]);
  });

  it('should return parent coin identity twice and null when its done', () => {
    const curve = EllipticCurve.secp256k1
    const type = 60
    const subType = ['blabla', 137]

    const coinIdentity = new CryptoCoinIdentity(curve, type, subType)
    const parent = coinIdentity.getParent()

    expect(parent?.getCurve()).toBe(curve)
    expect(parent?.getType()).toBe(type)
    expect(parent?.getSubType()).toStrictEqual([137]);

    const parent2 = parent?.getParent();
    expect(parent2?.getCurve()).toBe(curve)
    expect(parent2?.getType()).toBe(type)
    expect(parent2?.getSubType()).toStrictEqual([]);

    const parent3 = parent2?.getParent();
    expect(parent3).toBe(null);

  });

  it('should return parent until subtypes are over with generator getAllParents', () => {
    const curve = EllipticCurve.secp256k1
    const type = 60
    const subType = ['blabla', 137]

    const coinIdentity = new CryptoCoinIdentity(curve, type, subType)
    let i = 2;
    
    // Total of 6 expect statements should be called
    expect.assertions(6);
    for (const parent of coinIdentity.getAllParents()) {
      console.log(parent.toURL());
      expect(parent?.getCurve()).toBe(curve)
      expect(parent?.getType()).toBe(type)
      switch(i) {
        case 2:
          expect(parent?.getSubType()).toStrictEqual([137]);
          break;
        case 1:
          expect(parent?.getSubType()).toStrictEqual([]);
          break;
      };
      i--;
    }
  
  });  
})

