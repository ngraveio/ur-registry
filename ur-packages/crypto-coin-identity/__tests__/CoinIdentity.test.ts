import { CryptoCoinIdentity } from '../src'
import { ComparisonMethod, EllipticCurve } from '../src/CoinIdentity'
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

    const expectedResult = `bc-coin://${chainId}.${'secp256k1'}/${type}`

    const coinIdentity = new CryptoCoinIdentity(curve, type, subTypes)
    const url = coinIdentity.toURL()
    expect(url).toBe(expectedResult)
  })
  it('creates coinIdentity from a url with subtypes', () => {
    const uri = 'bc-coin://blabla.137.secp256k1/60'
    const coinID = CryptoCoinIdentity.fromUrl(uri)
    expect(coinID.getCurve()).toBe('secp256k1')
    expect(coinID.getType()).toBe(60)
    expect(coinID.getSubType()).toStrictEqual(['blabla', '137'])
  })
  it('creates coinIdentity from a url with multiple subtypes', () => {
    const uri = 'bc-coin://137.secp256k1/60'
    const coinID = CryptoCoinIdentity.fromUrl(uri)
    expect(coinID.getCurve()).toBe('secp256k1')
    expect(coinID.getType()).toBe(60)
    expect(coinID.getSubType()).toStrictEqual(['137'])
  })
  it('creates coinIdentity from a url without subtypes', () => {
    const uri = 'bc-coin://secp256k1/60'
    const coinID = CryptoCoinIdentity.fromUrl(uri)
    expect(coinID.getCurve()).toBe('secp256k1')
    expect(coinID.getType()).toBe(60)
    expect(coinID.getSubType()).toStrictEqual([])
  })
})

describe('compareCoinIds', () => {
  it('should return true for identical coinIds', () => {
    const result = CryptoCoinIdentity.compareCoinIds('seckp256/60', 'seckp256/60', ComparisonMethod.ExactMatch)
    expect(result).toBe(true)
  })

  it('should return true when url is parent of urlToCompare', () => {
    const result = CryptoCoinIdentity.compareCoinIds('bc-coin://seckp256/60', 'bc-coin://child.seckp256/60', ComparisonMethod.Parent)
    expect(result).toBe(true)
  })

  it('should return true when urlToCompare is children of url', () => {
    const result = CryptoCoinIdentity.compareCoinIds('bc-coin://child.seckp256/60', 'bc-coin://seckp256/60', ComparisonMethod.Child)
    expect(result).toBe(true)
  })

  it('should return true when urlToCompare is grand-child of url', () => {
    const result = CryptoCoinIdentity.compareCoinIds('bc-coin://child.parent.seckp256/60', 'bc-coin://seckp256/60', ComparisonMethod.Child)
    expect(result).toBe(true)
  })

  it('should return true when urlToCompare is grand-child of child of url', () => {
    const result = CryptoCoinIdentity.compareCoinIds('bc-coin://child.parent.seckp256/60', 'bc-coin://parent.seckp256/60', ComparisonMethod.Child)
    expect(result).toBe(true)
  })

  it('should return true for different coinIds', () => {
    const result = CryptoCoinIdentity.compareCoinIds('bc-coin://seckp256/60', 'bc-coin://seckp256/0', ComparisonMethod.NotEqual)
    expect(result).toBe(true)
  })

  it('should return true for LessThanOrEqual when coin URLs are equal or coinUrl1 is a child', () => {
    const coinUrl1 = 'child.seckp256/60'
    const coinUrl2 = 'seckp256/60'
    const comparison = ComparisonMethod.LessThanOrEqual
    const result = CryptoCoinIdentity.compareCoinIds(coinUrl1, coinUrl2, comparison)
    expect(result).toBe(true)
  })

  it('should return true for GreaterThanOrEqual when coin URLs are equal or coinUrl2 is a parent', () => {
    const coinUrl1 = 'seckp256/60'
    const coinUrl2 = 'child.seckp256/60'
    const comparison = ComparisonMethod.GreaterThanOrEqual
    const result = CryptoCoinIdentity.compareCoinIds(coinUrl1, coinUrl2, comparison)
    expect(result).toBe(true)
  })

  it('should return false for ExactMatch when coin URLs are not equal', () => {
    const coinUrl1 = 'seckp256/60'
    const coinUrl2 = 'seckp256/0'
    const comparison = ComparisonMethod.ExactMatch
    const result = CryptoCoinIdentity.compareCoinIds(coinUrl1, coinUrl2, comparison)
    expect(result).toBe(false)
  })

  it('should return false for Child when coinUrl1 is not a child of coinUrl2', () => {
    const coinUrl1 = 'seckp256/60'
    const coinUrl2 = 'child.seckp256/60'
    const comparison = ComparisonMethod.Child
    const result = CryptoCoinIdentity.compareCoinIds(coinUrl1, coinUrl2, comparison)
    expect(result).toBe(false)
  })

  it('should return false for Parent when coinUrl2 is not a parent of coinUrl1', () => {
    const coinUrl1 = 'child.seckp256/60'
    const coinUrl2 = 'seckp256/60'
    const comparison = ComparisonMethod.Parent
    const result = CryptoCoinIdentity.compareCoinIds(coinUrl1, coinUrl2, comparison)
    expect(result).toBe(false)
  })

  it('should return false when urlToCompare is not grand-child of url', () => {
    const result = CryptoCoinIdentity.compareCoinIds('bc-coin://child.parent.ed256/60', 'bc-coin://seckp256/60', ComparisonMethod.Child)
    expect(result).toBe(false)
  })

  it('should return false when urlToCompare is grand-child of child of url', () => {
    const result = CryptoCoinIdentity.compareCoinIds('bc-coin://child.parent.seckp256/60', 'bc-coin://child.seckp256/60', ComparisonMethod.Child)
    expect(result).toBe(false)
  })

  it('should return false for NotEqual when coin URLs are equal', () => {
    const coinUrl1 = 'seckp256/60'
    const coinUrl2 = 'seckp256/60'
    const comparison = ComparisonMethod.NotEqual
    const result = CryptoCoinIdentity.compareCoinIds(coinUrl1, coinUrl2, comparison)
    expect(result).toBe(false)
  })

  it('should return false for LessThanOrEqual when coinUrl1 is not a child and not equal', () => {
    const coinUrl1 = 'seckp256/60'
    const coinUrl2 = 'seckp256/0'
    const comparison = ComparisonMethod.LessThanOrEqual
    const result = CryptoCoinIdentity.compareCoinIds(coinUrl1, coinUrl2, comparison)
    expect(result).toBe(false)
  })

  it('should return false for GreaterThanOrEqual when coinUrl2 is not a parent and not equal', () => {
    const coinUrl1 = 'seckp256/60'
    const coinUrl2 = 'seckp256/0'
    const comparison = ComparisonMethod.GreaterThanOrEqual
    const result = CryptoCoinIdentity.compareCoinIds(coinUrl1, coinUrl2, comparison)
    expect(result).toBe(false)
  })
});

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

