import {
  CryptoCoinIdentity,
  CryptoKeypath,
  EllipticCurve,
  PathComponent,
} from '@ngraveio/bc-ur-registry-crypto-coin-identity';
import { CryptoSignRequest } from '../src';
import { SolSignRequestMeta, SolSignType, TezosDataType, TezosKeyType, TezosSignRequestMeta } from '../src/metadatas';
import { EthDataType, EthSignRequestMeta, IrfanSignRequestMeta, PolygonMeta } from '../src/metadatas/ethereum.metadata';
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


describe('Coin Tests', () => {
  it('Should encode/decode ethereum without metadata correctly', () => {

    const ethSignRequest = new CryptoSignRequest({
      coinId: new CryptoCoinIdentity(EllipticCurve.secp256k1, 60),
      derivationPath: "m/44'/60'/0'/0/0",
      signData: Buffer.from('e906850963bf08ed8252589442cda393bbe6d079501b98cc9ccf1906901b10bf80856e61626572808080', 'hex'),
    });

    // Encode
    const cbor = ethSignRequest.toCBOR().toString('hex'); // a401d825501927215f7371bb645c5fbeb5409778d402d90579a2010802183c03d90130a1018a182cf5183cf500f500f400f404582ae906850963bf08ed8252589442cda393bbe6d079501b98cc9ccf1906901b10bf80856e61626572808080

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

  it('Should encode/decode ethereum with metadata correctly', () => {

    const ethSignRequest = new CryptoSignRequest({
      coinId: new CryptoCoinIdentity(EllipticCurve.secp256k1, 60),
      derivationPath: "m/44'/60'/0'/0/0",
      signData: Buffer.from('e906850963bf08ed8252589442cda393bbe6d079501b98cc9ccf1906901b10bf80856e61626572808080', 'hex'),
      metadata: new EthSignRequestMeta({
        dataType: EthDataType.transaction,
      }),
    });

    // Encode
    const cbor = ethSignRequest.toCBOR().toString('hex'); // a501d82550ee61d8625149f73eabaaa0ed7c7ab93102d90579a2010802183c03d90130a1018a182cf5183cf500f500f400f404582ae906850963bf08ed8252589442cda393bbe6d079501b98cc9ccf1906901b10bf80856e6162657280808007a168646174615479706501

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


  it('Should encode/decode solana without metadata correctly', () => {

    const nativeTx = '01000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100020420771c01ee4ef0cd64de8aca6761ec53d81f2af4d82a6f901875b3eb6656aca1f71cd55949eaf3eb16b17a2760e5bc2141f45583263996a513788ce66ba3ed1c0000000000000000000000000000000000000000000000000000000000000000054a535a992921064d24e87160da387c7c35b5ddbc92bb81e41fa8404105448d4ab54ac2b31a0eacb2d4d88715857164550b21b55a69e7f326a5392230b41c9e02020200010c02000000002d3101000000000301000b48656c6c6f20576f726c64';

    const solSignRequest = new CryptoSignRequest({
      coinId: new CryptoCoinIdentity(EllipticCurve.Ed25519, 501),
      derivationPath: "44'/501'/0'/0'",
      signData: Buffer.from(nativeTx, 'hex'),
    });

    // Encode
    const cbor = solSignRequest.toCBOR().toString('hex'); // a401d8255042564b6be35281f202261db069ba047602d90579a20106021901f503d90130a10188182cf51901f5f500f500f50459010601000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100020420771c01ee4ef0cd64de8aca6761ec53d81f2af4d82a6f901875b3eb6656aca1f71cd55949eaf3eb16b17a2760e5bc2141f45583263996a513788ce66ba3ed1c0000000000000000000000000000000000000000000000000000000000000000054a535a992921064d24e87160da387c7c35b5ddbc92bb81e41fa8404105448d4ab54ac2b31a0eacb2d4d88715857164550b21b55a69e7f326a5392230b41c9e02020200010c02000000002d3101000000000301000b48656c6c6f20576f726c64

    // Decode
    const decodedSolSignRequest = CryptoSignRequest.fromCBOR(Buffer.from(cbor, 'hex'));

    // Check all fields
    expect(decodedSolSignRequest.getRequestId().toString('hex')).toEqual(solSignRequest.getRequestId().toString('hex'));
    expect(decodedSolSignRequest.getCoinId().toURL()).toEqual(solSignRequest.getCoinId().toURL());
    expect(decodedSolSignRequest.getDerivationPath().getPath()).toEqual(solSignRequest.getDerivationPath().getPath());
    expect(decodedSolSignRequest.getSignData().toString('hex')).toEqual(solSignRequest.getSignData().toString('hex'));
    // Metadata and meta types
    expect(decodedSolSignRequest.getMetadata()?.getData()).toStrictEqual(solSignRequest.getMetadata()?.getData());
    expect(decodedSolSignRequest.getMetadata()?.constructor.name).toEqual(solSignRequest.getMetadata()?.constructor.name);
    expect(decodedSolSignRequest.getMetadata()?.getData()).toStrictEqual(solSignRequest.getMetadata()?.getData());

    // Expect decoded cbor to be same
    expect(decodedSolSignRequest.toCBOR().toString('hex')).toEqual(cbor);      
  });

  it('Should encode/decode solana with metadata correctly', () => {

    const nativeTx = '01000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100020420771c01ee4ef0cd64de8aca6761ec53d81f2af4d82a6f901875b3eb6656aca1f71cd55949eaf3eb16b17a2760e5bc2141f45583263996a513788ce66ba3ed1c0000000000000000000000000000000000000000000000000000000000000000054a535a992921064d24e87160da387c7c35b5ddbc92bb81e41fa8404105448d4ab54ac2b31a0eacb2d4d88715857164550b21b55a69e7f326a5392230b41c9e02020200010c02000000002d3101000000000301000b48656c6c6f20576f726c64';

    const solSignRequest = new CryptoSignRequest({
      coinId: new CryptoCoinIdentity(EllipticCurve.Ed25519, 501),
      derivationPath: "44'/501'/0'/0'",
      signData: Buffer.from(nativeTx, 'hex'),
      metadata: new SolSignRequestMeta({
        type: SolSignType.signTypeTransaction,
        address: Buffer.from("3BjPTqppzsSFtrEzv4iJ28SW97ubkRHrQVwmzoBqT8ZN"), // base58
      })
    });

    // Encode
    const cbor = solSignRequest.toCBOR().toString('hex'); // a501d82550e382f18c7b5b1d8a9eda5d8a2305279e02d90579a20106021901f503d90130a10188182cf51901f5f500f500f50459010601000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100020420771c01ee4ef0cd64de8aca6761ec53d81f2af4d82a6f901875b3eb6656aca1f71cd55949eaf3eb16b17a2760e5bc2141f45583263996a513788ce66ba3ed1c0000000000000000000000000000000000000000000000000000000000000000054a535a992921064d24e87160da387c7c35b5ddbc92bb81e41fa8404105448d4ab54ac2b31a0eacb2d4d88715857164550b21b55a69e7f326a5392230b41c9e02020200010c02000000002d3101000000000301000b48656c6c6f20576f726c6407a26474797065016761646472657373582c33426a50547170707a7353467472457a7634694a32385357393775626b5248725156776d7a6f427154385a4e

    // Decode
    const decodedSolSignRequest = CryptoSignRequest.fromCBOR(Buffer.from(cbor, 'hex'));

    // Check all fields
    expect(decodedSolSignRequest.getRequestId().toString('hex')).toEqual(solSignRequest.getRequestId().toString('hex'));
    expect(decodedSolSignRequest.getCoinId().toURL()).toEqual(solSignRequest.getCoinId().toURL());
    expect(decodedSolSignRequest.getDerivationPath().getPath()).toEqual(solSignRequest.getDerivationPath().getPath());
    expect(decodedSolSignRequest.getSignData().toString('hex')).toEqual(solSignRequest.getSignData().toString('hex'));
    // Metadata and meta types
    expect(decodedSolSignRequest.getMetadata()?.getData()).toStrictEqual(solSignRequest.getMetadata()?.getData());
    expect(decodedSolSignRequest.getMetadata()?.constructor.name).toEqual(solSignRequest.getMetadata()?.constructor.name);
    expect(decodedSolSignRequest.getMetadata()?.getData()).toStrictEqual(solSignRequest.getMetadata()?.getData());

    // Expect decoded cbor to be same
    expect(decodedSolSignRequest.toCBOR().toString('hex')).toEqual(cbor);      
  });

  it('Should encode/decode tezos tz1(ed25519) transaction without metadata correctly', () => {
    // Ed25519 tz1
    const nativeTx = '4478f49a92c565e944b6021ea10d78e4d357217f07d7b04120ee8089a5df75566c004c740575091c360d45d820711afef7be6f30b972904ec0a9a312f90a84020a000036a21afaa10f9470af5db383080017a46a459edd00';

    const tezSignRequest = new CryptoSignRequest({
      coinId: new CryptoCoinIdentity(EllipticCurve.Ed25519, 1729),
      derivationPath: "m/44'/1729'/0'/0'/0'",
      signData: Buffer.from(nativeTx, 'hex'),
    });

    // Encode
    const cbor = tezSignRequest.toCBOR().toString('hex'); // a401d825508c6902f2ce3c8b90824c70f59442173602d90579a20106021906c103d90130a1018a182cf51906c1f500f500f500f50458584478f49a92c565e944b6021ea10d78e4d357217f07d7b04120ee8089a5df75566c004c740575091c360d45d820711afef7be6f30b972904ec0a9a312f90a84020a000036a21afaa10f9470af5db383080017a46a459edd00

    // Decode
    const decodedTezSignRequest = CryptoSignRequest.fromCBOR(Buffer.from(cbor, 'hex'));

    // Check all fields
    expect(decodedTezSignRequest.getRequestId().toString('hex')).toEqual(tezSignRequest.getRequestId().toString('hex'));
    expect(decodedTezSignRequest.getCoinId().toURL()).toEqual(tezSignRequest.getCoinId().toURL());
    expect(decodedTezSignRequest.getDerivationPath().getPath()).toEqual(tezSignRequest.getDerivationPath().getPath());
    expect(decodedTezSignRequest.getSignData().toString('hex')).toEqual(tezSignRequest.getSignData().toString('hex'));
    // Metadata and meta types
    expect(decodedTezSignRequest.getMetadata()?.getData()).toStrictEqual(tezSignRequest.getMetadata()?.getData());
    expect(decodedTezSignRequest.getMetadata()?.constructor.name).toEqual(tezSignRequest.getMetadata()?.constructor.name);
    expect(decodedTezSignRequest.getMetadata()?.getData()).toStrictEqual(tezSignRequest.getMetadata()?.getData());

    // Expect decoded cbor to be same
    expect(decodedTezSignRequest.toCBOR().toString('hex')).toEqual(cbor);      
  });

  it('Should encode/decode tezos tz1(ed25519) transaction with metadata correctly', () => {
    // Ed25519 tz1
    const nativeTx = '4478f49a92c565e944b6021ea10d78e4d357217f07d7b04120ee8089a5df75566c004c740575091c360d45d820711afef7be6f30b972904ec0a9a312f90a84020a000036a21afaa10f9470af5db383080017a46a459edd00';

    const tezSignRequest = new CryptoSignRequest({
      coinId: new CryptoCoinIdentity(EllipticCurve.Ed25519, 1729),
      derivationPath: "m/44'/1729'/0'/0'/0'",
      signData: Buffer.from(nativeTx, 'hex'),
      metadata: new TezosSignRequestMeta({
        type: TezosDataType.dataTypeOperation,
        keyType: TezosKeyType.ed25519,
      }),
    });

    // Encode
    const cbor = tezSignRequest.toCBOR().toString('hex'); // a501d82550abb87ab7b0e9924009d4c775d7158cdf02d90579a20106021906c103d90130a1018a182cf51906c1f500f500f500f50458584478f49a92c565e944b6021ea10d78e4d357217f07d7b04120ee8089a5df75566c004c740575091c360d45d820711afef7be6f30b972904ec0a9a312f90a84020a000036a21afaa10f9470af5db383080017a46a459edd0007a2647479706501676b65795479706501

    // Decode
    const decodedTezSignRequest = CryptoSignRequest.fromCBOR(Buffer.from(cbor, 'hex'));

    // Check all fields
    expect(decodedTezSignRequest.getRequestId().toString('hex')).toEqual(tezSignRequest.getRequestId().toString('hex'));
    expect(decodedTezSignRequest.getCoinId().toURL()).toEqual(tezSignRequest.getCoinId().toURL());
    expect(decodedTezSignRequest.getDerivationPath().getPath()).toEqual(tezSignRequest.getDerivationPath().getPath());
    expect(decodedTezSignRequest.getSignData().toString('hex')).toEqual(tezSignRequest.getSignData().toString('hex'));
    // Metadata and meta types
    expect(decodedTezSignRequest.getMetadata()?.getData()).toStrictEqual(tezSignRequest.getMetadata()?.getData());
    expect(decodedTezSignRequest.getMetadata()?.constructor.name).toEqual(tezSignRequest.getMetadata()?.constructor.name);
    expect(decodedTezSignRequest.getMetadata()?.getData()).toStrictEqual(tezSignRequest.getMetadata()?.getData());

    // Expect decoded cbor to be same
    expect(decodedTezSignRequest.toCBOR().toString('hex')).toEqual(cbor);      
  });   

  it('Should encode/decode a stellar transaction', () => {
    const nativeTx = 'thisIsAMockTransaction';

    const xrpSignRequest = new CryptoSignRequest({
      coinId: new CryptoCoinIdentity(EllipticCurve.Ed25519, 148),
      derivationPath: "m/44'/148'/0'",
      signData: Buffer.from(nativeTx, 'hex'),
    });

    // Encode
    const cbor = xrpSignRequest.toCBOR().toString('hex');

    // Decode
    const decodedXrpSignRequest = CryptoSignRequest.fromCBOR(Buffer.from(cbor, 'hex'));

    // Check all fields
    expect(decodedXrpSignRequest.getRequestId().toString('hex')).toEqual(xrpSignRequest.getRequestId().toString('hex'));
    expect(decodedXrpSignRequest.getCoinId().toURL()).toEqual(xrpSignRequest.getCoinId().toURL());
    expect(decodedXrpSignRequest.getDerivationPath().getPath()).toEqual(xrpSignRequest.getDerivationPath().getPath());
    expect(decodedXrpSignRequest.getSignData().toString('hex')).toEqual(xrpSignRequest.getSignData().toString('hex'));
    // Metadata and meta types
    expect(decodedXrpSignRequest.getMetadata()?.getData()).toStrictEqual(xrpSignRequest.getMetadata()?.getData());
    expect(decodedXrpSignRequest.getMetadata()?.constructor.name).toEqual(xrpSignRequest.getMetadata()?.constructor.name);
    expect(decodedXrpSignRequest.getMetadata()?.getData()).toStrictEqual(xrpSignRequest.getMetadata()?.getData());

    // Expect decoded cbor to be same
    expect(decodedXrpSignRequest.toCBOR().toString('hex')).toEqual(cbor);      
  });

  it('Should encode/decode a multiversX transaction', () => {
    const nativeTx = 'f849808609184e72a00082271094000000000000000000000000000000000000000080a47f7465737432000000000000000000000000000000000000000000000000000000600057808080';

    const egldSignRequest = new CryptoSignRequest({
      coinId: new CryptoCoinIdentity(EllipticCurve.Ed25519, 508),
      derivationPath: "m/44'/508'/0'/0'/0'",
      signData: Buffer.from(nativeTx, 'hex'),
    });

    // Encode
    const cbor = egldSignRequest.toCBOR().toString('hex');

    // Decode
    const decodedEgldSignRequest = CryptoSignRequest.fromCBOR(Buffer.from(cbor, 'hex'));

    // Check all fields
    expect(decodedEgldSignRequest.getRequestId().toString('hex')).toEqual(egldSignRequest.getRequestId().toString('hex'));
    expect(decodedEgldSignRequest.getCoinId().toURL()).toEqual(egldSignRequest.getCoinId().toURL());
    expect(decodedEgldSignRequest.getDerivationPath().getPath()).toEqual(egldSignRequest.getDerivationPath().getPath());
    expect(decodedEgldSignRequest.getSignData().toString('hex')).toEqual(egldSignRequest.getSignData().toString('hex'));
    // Metadata and meta types
    expect(decodedEgldSignRequest.getMetadata()?.getData()).toStrictEqual(egldSignRequest.getMetadata()?.getData());
    expect(decodedEgldSignRequest.getMetadata()?.constructor.name).toEqual(egldSignRequest.getMetadata()?.constructor.name);
    expect(decodedEgldSignRequest.getMetadata()?.getData()).toStrictEqual(egldSignRequest.getMetadata()?.getData());

    // Expect decoded cbor to be same
    expect(decodedEgldSignRequest.toCBOR().toString('hex')).toEqual(cbor);      
  });
});