import {
  CryptoCoinIdentity,
  CryptoKeypath,
  EllipticCurve,
  PathComponent,
} from '@ngraveio/bc-ur-registry-crypto-coin-identity';
import { CryptoSignRequest } from '../src';
import { EthSignRequestMeta, IrfanSignRequestMeta, PolygonMeta } from '../src/metadatas/Ethereum.metadata';
import { SignRequestMeta } from '../src/SignRequestMetadata';

describe('CryptoSignRequest checks', () => {
  // Initialize some values
  const ethCoinId = new CryptoCoinIdentity(EllipticCurve.secp256k1, 60);
  const maticCoinId = new CryptoCoinIdentity(EllipticCurve.secp256k1, 60, [137]);
  const ethPath = new CryptoKeypath([
    new PathComponent({ index: 44, hardened: true }),
    new PathComponent({ index: 60, hardened: true }),
    new PathComponent({ index: 0, hardened: true }),
    new PathComponent({ index: 0, hardened: false }),
    new PathComponent({ index: 0, hardened: false }),
  ]);

  it('Should create random request id if it is not provided', () => {
    const ethSignRequest = new CryptoSignRequest({
      coinId: ethCoinId,
      derivationPath: ethPath,
      signData: Buffer.from('abbacaca', 'hex'),
    });

    expect(ethSignRequest.getRequestId().length).toEqual(16);
  });
  
  it('Should prepend zeros to request id if its less than 16 bytes', () => {
    const requestId = Buffer.from('babe', 'hex');

    const ethSignRequest = new CryptoSignRequest({
      requestId,
      coinId: ethCoinId,
      derivationPath: ethPath,
      signData: Buffer.from('abbacaca', 'hex'),
    });

    expect(ethSignRequest.getRequestId().toString('hex')).toEqual('0000000000000000000000000000babe');
  });

  it('Should throw error if request id is more than 16 bytes', () => {
    const requestId = Buffer.from('babe'.repeat(10), 'hex');

    expect(() => {
      new CryptoSignRequest({
        requestId,
        coinId: ethCoinId,
        derivationPath: ethPath,
        signData: Buffer.from('abbacaca', 'hex'),
      });
    }).toThrowError('Request id should not be longer than 16 bytes');
  });

  it('Should throw an error of coinId typecheck fails', () => {
    expect(() => {
      new CryptoSignRequest({
        coinId: 'ethCoinId',
        derivationPath: ethPath,
        signData: Buffer.from('abbacaca', 'hex'),
      } as any);
    }).toThrowError('Coin id is required and should be of type CryptoCoinIdentity');
  });

  it('Should convert string derivation path into CryptoKeypath correctly', () => {
    const ethSignRequest = new CryptoSignRequest({
      coinId: ethCoinId,
      derivationPath: "m/44'/60'/0'/0/0",
      signData: Buffer.from('abbacaca', 'hex'),
    });

    expect(ethSignRequest.getDerivationPath()).toBeInstanceOf(CryptoKeypath);
    expect(ethSignRequest.getDerivationPath().getPath()).toEqual("44'/60'/0'/0/0");
  });

  it('Should throw an error if derivationPath typecheck fails', () => {
    expect(() => {
      new CryptoSignRequest({
        coinId: ethCoinId,
        derivationPath: 15,
        signData: Buffer.from('abbacaca', 'hex'),
      } as any);
    }).toThrowError('Derivation path should be of type CryptoKeypath or string');
  });

  it('Should throw an error if derivation path doesnt cointain a path component', () => {
    expect(() => {
      new CryptoSignRequest({
        coinId: ethCoinId,
        derivationPath: new CryptoKeypath([]),
        signData: Buffer.from('abbacaca', 'hex'),
      });
    }).toThrowError('Derivation path should have a valid path');
  })

  it('Should throw error if derivation path is not valid BIP44 path string', () => {
    expect(() => {
      new CryptoSignRequest({
        coinId: ethCoinId,
        derivationPath: 'test',
        signData: Buffer.from('abbacaca', 'hex'),
      });
    }).toThrowError('Derivation path should be a valid BIP44 path');

    expect(() => {
      new CryptoSignRequest({
        coinId: ethCoinId,
        derivationPath: '-15',
        signData: Buffer.from('abbacaca', 'hex'),
      });
    }).toThrowError('Derivation path should be a valid BIP44 path');    

    expect(() => {
      new CryptoSignRequest({
        coinId: ethCoinId,
        derivationPath: 'm/naber/60/0/0',
        signData: Buffer.from('abbacaca', 'hex'),
      });
    }).toThrowError('Derivation path should be a valid BIP44 path');    
  });

  it('Should throw an error if signdata doesnt contain any data', () => {
    expect(() => {
      new CryptoSignRequest({
        coinId: ethCoinId,
        derivationPath: ethPath,
        signData: Buffer.from('', 'hex'),
      });
    }).toThrowError('Sign data is required');
  });

  it('Should throw an error if masterfingerprint is present but lonfer than 4 bytes', () => {
    expect(() => {
      new CryptoSignRequest({
        coinId: ethCoinId,
        derivationPath: ethPath,
        signData: Buffer.from('abbacaca', 'hex'),
        masterFingerprint: Buffer.from('abbacacaff', 'hex'),
      });
    }).toThrowError('Master fingerprint should not be longer than 4 bytes');
  });

  it('Should throw an error if origin is present but not string', () => {
    expect(() => {
      new CryptoSignRequest({
        coinId: ethCoinId,
        derivationPath: ethPath,
        signData: Buffer.from('abbacaca', 'hex'),
        origin: 123,
      } as any);
    }).toThrowError('Origin should be a string');
  });

});

describe('Metadata checks', () => {
  // Initialize some values
  const ethCoinId = new CryptoCoinIdentity(EllipticCurve.secp256k1, 60);
  const maticCoinId = new CryptoCoinIdentity(EllipticCurve.secp256k1, 60, [137]);
  const ethPath = new CryptoKeypath([
    new PathComponent({ index: 44, hardened: true }),
    new PathComponent({ index: 60, hardened: true }),
    new PathComponent({ index: 0, hardened: true }),
    new PathComponent({ index: 0, hardened: false }),
    new PathComponent({ index: 0, hardened: false }),
  ]);

  // Some metadatas
  const ethSignMeta = new EthSignRequestMeta({
    dataType: 1,
  });

  const ethSignMetaObj = {
    dataType: 1,
  };

  const polySignMeta = new PolygonMeta({
    dataType: 1,
    extraData: 'asd',
  });

  const otherMeta = new SignRequestMeta({
    dataType: 1,
    extraData: 'asd',
  });

  const irfanMeta = new IrfanSignRequestMeta({
    name: 'irfan',
    id: 798,
  });  

  it('Should convert metadata object input to correct metadata type from map', () => {
    const ethSignRequest = new CryptoSignRequest({
      coinId: ethCoinId,
      derivationPath: ethPath,
      signData: Buffer.from('abbacaca', 'hex'),
      metadata: {
        dataType: 1,
      },
    });

    const polySignRequest = new CryptoSignRequest({
      coinId: maticCoinId,
      derivationPath: ethPath,
      signData: Buffer.from('abbacaca', 'hex'),
      metadata: {
        dataType: 1,
      },
    });
    
    // Convert that object to ethereum type of metadata class 
    expect(ethSignRequest.getMetadata()).toBeInstanceOf(EthSignRequestMeta);
    // Convert that object to polygon type of metadata class
    expect(polySignRequest.getMetadata()).toBeInstanceOf(PolygonMeta);
  });

  it('Should do checks and throw error for wrong instance of MetaData', () => {
    expect(() => {
      new CryptoSignRequest({
        coinId: ethCoinId,
        derivationPath: ethPath,
        signData: Buffer.from('abbacaca', 'hex'),
        metadata: new IrfanSignRequestMeta({
          name: 'irfan',
          id: 798,
        }),
      });
    }).toThrowError('Provided Metadata is an instance of IrfanSignRequestMeta, it should be instance of EthSignRequestMeta for coin bc-coin://secp256k1/60');

    expect(() => {
      new CryptoSignRequest({
        coinId: maticCoinId,
        derivationPath: ethPath,
        signData: Buffer.from('abbacaca', 'hex'),
        metadata: new IrfanSignRequestMeta({
          name: 'irfan',
          id: 798,
        }),
      });
    }).toThrowError('Provided Metadata is an instance of IrfanSignRequestMeta, it should be instance of PolygonMeta for coin bc-coin://137.secp256k1/60');
  });


  it('Should do checks and throw error if checks fail', () => {
    expect(() => {
      new CryptoSignRequest({
        coinId: ethCoinId,
        derivationPath: ethPath,
        signData: Buffer.from('abbacaca', 'hex'),
        metadata: {
          dataType: 150,
        },
      });
    }).toThrowError('');

    expect(() => {
      new CryptoSignRequest({
        coinId: maticCoinId,
        derivationPath: ethPath,
        signData: Buffer.from('abbacaca', 'hex'),
        metadata: {
          naber: 'Wrong type'
        },
      });
    }).toThrowError();
  });

  it('Should should fallback to closest parents metadata type if type is not found on the map', () => {
    const irfanSignRequest = new CryptoSignRequest({
      // Lets create a sub type of polygon
      coinId: new CryptoCoinIdentity(EllipticCurve.secp256k1, 60, [798, 137]),
      derivationPath: ethPath,
      signData: Buffer.from('abbacaca', 'hex'),
      metadata: {
        dataType: 1,
      },
    });

    const subEthTypeRequest = new CryptoSignRequest({
      // Lets create a sub type of ethereum
      coinId: new CryptoCoinIdentity(EllipticCurve.secp256k1, 60, ['nonexistent_type']),
      derivationPath: ethPath,
      signData: Buffer.from('abbacaca', 'hex'),
      metadata: {
        dataType: 1,
      },
    });

    // Expect metadata type to be polygon
    expect(irfanSignRequest.getMetadata()).toBeInstanceOf(PolygonMeta);

    // Expect metadata type to be ethereum
    expect(subEthTypeRequest.getMetadata()).toBeInstanceOf(EthSignRequestMeta);
  });

});



describe('CryptoSignRequest', () => {
  // Initialize some values
  const ethCoinId = new CryptoCoinIdentity(EllipticCurve.secp256k1, 60);
  const maticCoinId = new CryptoCoinIdentity(EllipticCurve.secp256k1, 60, [137]);
  const ethPath = new CryptoKeypath([
    new PathComponent({ index: 44, hardened: true }),
    new PathComponent({ index: 60, hardened: true }),
    new PathComponent({ index: 0, hardened: true }),
    new PathComponent({ index: 0, hardened: false }),
    new PathComponent({ index: 0, hardened: false }),
  ]);
  
  it('Should encode/decode to same with required values', () => {

    const ethSignRequest = new CryptoSignRequest({
      coinId: ethCoinId,
      derivationPath: ethPath,
      signData: Buffer.from('abbacaca', 'hex'),
    });

    // Encode
    const cbor = ethSignRequest.toCBOR().toString('hex'); // a401d82550f734a644757d9a411b5bac4c7411113e02d90579a2010802183c03d90130a1018a182cf5183cf500f500f400f40444abbacaca

    // Decode
    const decodedEthSignRequest = CryptoSignRequest.fromCBOR(Buffer.from(cbor, 'hex'));

    // Check all fields
    expect(decodedEthSignRequest.getRequestId().toString('hex')).toEqual(ethSignRequest.getRequestId().toString('hex'));
    expect(decodedEthSignRequest.getCoinId().toURL()).toEqual(ethSignRequest.getCoinId().toURL());
    expect(decodedEthSignRequest.getDerivationPath().getPath()).toEqual(ethSignRequest.getDerivationPath().getPath());
    expect(decodedEthSignRequest.getSignData().toString('hex')).toEqual(ethSignRequest.getSignData().toString('hex'));
    // Metadata and meta types
    expect(decodedEthSignRequest.getMetadata()?.getData()).toStrictEqual(ethSignRequest.getMetadata()?.getData());
    expect(decodedEthSignRequest.getMetadata()?.constructor.name).toEqual(ethSignRequest.getMetadata()?.constructor.name);

    // Expect decoded cbor to be same
    expect(decodedEthSignRequest.toCBOR().toString('hex')).toEqual(cbor);
  });

  it('Should encode/decode to same with all values', () => {

    const ethMetadata = new EthSignRequestMeta({
      dataType: 1,
    });

    const ethSignRequest = new CryptoSignRequest({
      requestId: Buffer.from('cafebabe', 'hex'),
      coinId: ethCoinId,
      derivationPath: ethPath,
      signData: Buffer.from('abbacaca', 'hex'),
      masterFingerprint: Buffer.from('deadbeef', 'hex'),
      origin: 'https://ngrave.io',
      metadata: ethMetadata,
    });

    // Encode
    const cbor = ethSignRequest.toCBOR().toString('hex'); // a701d82550cafebabe00000000000000000000000002d90579a2010802183c03d90130a1018a182cf5183cf500f500f400f40444abbacaca0544deadbeef067168747470733a2f2f6e67726176652e696f07a168646174615479706501

    // Decode
    const decodedEthSignRequest = CryptoSignRequest.fromCBOR(Buffer.from(cbor, 'hex'));

    // Check all fields
    expect(decodedEthSignRequest.getRequestId().toString('hex')).toEqual(ethSignRequest.getRequestId().toString('hex'));
    expect(decodedEthSignRequest.getCoinId().toURL()).toEqual(ethSignRequest.getCoinId().toURL());
    expect(decodedEthSignRequest.getDerivationPath().getPath()).toEqual(ethSignRequest.getDerivationPath().getPath());
    expect(decodedEthSignRequest.getSignData().toString('hex')).toEqual(ethSignRequest.getSignData().toString('hex'));
    // Metadata and meta types
    expect(decodedEthSignRequest.getMetadata()?.getData()).toStrictEqual(ethSignRequest.getMetadata()?.getData());
    expect(decodedEthSignRequest.getMetadata()?.constructor.name).toEqual(ethSignRequest.getMetadata()?.constructor.name);

    // Expect decoded cbor to be same
    expect(decodedEthSignRequest.toCBOR().toString('hex')).toEqual(cbor);
  
  });


  // test('Should encode/decode with required values', () => {
  //   const ethCoinId = new CryptoCoinIdentity(EllipticCurve.secp256k1, 60);
  //   const maticCoinId = new CryptoCoinIdentity(EllipticCurve.secp256k1, 60, [137]);

  //   const ethSignMeta = new EthSignRequestMeta({
  //     dataType: 1,
  //   });

  //   const ethSignMetaObj = {
  //     dataType: 1,
  //   };

  //   const polySignMeta = new PolygonMeta({
  //     dataType: 1,
  //     extraData: 'asd',
  //   });

  //   const otherMeta = new SignRequestMeta({
  //     dataType: 1,
  //     extraData: 'asd',
  //   });

  //   const irfanMeta = new IrfanSignRequestMeta({
  //     name: 'irfan',
  //     id: 798,
  //   });

  //   const path = new CryptoKeypath([
  //     new PathComponent({ index: 44, hardened: true }),
  //     new PathComponent({ index: 60, hardened: true }),
  //     new PathComponent({ index: 0, hardened: true }),
  //     new PathComponent({ index: 0, hardened: false }),
  //     new PathComponent({ index: 0, hardened: false }),
  //   ]);

  //   const ethSignRequest = new CryptoSignRequest({
  //     requestId: Buffer.from('babecafe', 'hex'),
  //     coinId: ethCoinId,
  //     derivationPath: path,
  //     signData: Buffer.from('abbacaca', 'hex'),
  //     metadata: ethSignMeta, //polySignMeta, //ethSignMeta,
  //   });

  //   const cbor = ethSignRequest.toCBOR().toString('hex');
  //   console.log('cbor', cbor);

  //   const ethSignRequest2 = new CryptoSignRequest({
  //     requestId: Buffer.from('babecafe', 'hex'),
  //     coinId: ethCoinId,
  //     derivationPath: path,
  //     signData: Buffer.from('abbacaca', 'hex'),
  //     metadata: ethSignMetaObj,
  //   });

  //   const cbor2 = ethSignRequest2.toCBOR().toString('hex');
  //   console.log('cbor2', cbor2);

  //   // Decode
  //   const decodedEthSignRequest = CryptoSignRequest.fromCBOR(Buffer.from(cbor, 'hex'));

  //   expect(decodedEthSignRequest.getRequestId().toString('hex')).toEqual(ethSignRequest.getRequestId().toString('hex'));
  //   expect(decodedEthSignRequest.getCoinId().toURL()).toEqual(ethSignRequest.getCoinId().toURL());
  //   expect(decodedEthSignRequest.getDerivationPath().getPath()).toEqual(ethSignRequest.getDerivationPath().getPath());
  //   expect(decodedEthSignRequest.getSignData().toString('hex')).toEqual(ethSignRequest.getSignData().toString('hex'));
  //   // Metadata and meta types
  //   expect(decodedEthSignRequest.getMetadata()?.getData()).toStrictEqual(ethSignRequest.getMetadata()?.getData());
  //   expect(decodedEthSignRequest.getMetadata()?.constructor.name).toEqual(ethSignRequest.getMetadata()?.constructor.name);

  //   console.log('decodedEthSignRequest', decodedEthSignRequest.toCBOR().toString('hex'));
  // });

  // // From cbor
  // it('Should decode from cbor', () => {
  //   const cbor =
  //     'a501d82550babecafe00000000000000000000000002d90579a2010802183c03d90130a1018a182cf5183cf500f500f400f40444abbacaca07a168646174615479706501';

  //   const ethSignRequest = CryptoSignRequest.fromCBOR(Buffer.from(cbor, 'hex'));

  //   expect(ethSignRequest.getCoinId);
  // });
});
