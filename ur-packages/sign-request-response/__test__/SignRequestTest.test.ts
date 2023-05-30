import {
  CryptoCoinIdentity,
  CryptoKeypath,
  EllipticCurve,
  PathComponent,
} from '@ngraveio/bc-ur-registry-crypto-coin-identity';
import { CryptoTxSignature, CryptoSignRequest } from '../src';
import { EthSignRequestMeta, IrfanSignRequestMeta, PolygonMeta } from '../src/metadatas/Ethereum.metadata';
import { SignRequestMeta } from '../src/SignRequestMetadata';

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

  it.only('Should encode/decode to same with all values', () => {

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





  test('Should encode/decode with required values', () => {
    const ethCoinId = new CryptoCoinIdentity(EllipticCurve.secp256k1, 60);
    const maticCoinId = new CryptoCoinIdentity(EllipticCurve.secp256k1, 60, [137]);

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

    const path = new CryptoKeypath([
      new PathComponent({ index: 44, hardened: true }),
      new PathComponent({ index: 60, hardened: true }),
      new PathComponent({ index: 0, hardened: true }),
      new PathComponent({ index: 0, hardened: false }),
      new PathComponent({ index: 0, hardened: false }),
    ]);

    const ethSignRequest = new CryptoSignRequest({
      requestId: Buffer.from('babecafe', 'hex'),
      coinId: ethCoinId,
      derivationPath: path,
      signData: Buffer.from('abbacaca', 'hex'),
      metadata: ethSignMeta, //polySignMeta, //ethSignMeta,
    });

    const cbor = ethSignRequest.toCBOR().toString('hex');
    console.log('cbor', cbor);

    const ethSignRequest2 = new CryptoSignRequest({
      requestId: Buffer.from('babecafe', 'hex'),
      coinId: ethCoinId,
      derivationPath: path,
      signData: Buffer.from('abbacaca', 'hex'),
      metadata: ethSignMetaObj,
    });

    const cbor2 = ethSignRequest2.toCBOR().toString('hex');
    console.log('cbor2', cbor2);

    // Decode
    const decodedEthSignRequest = CryptoSignRequest.fromCBOR(Buffer.from(cbor, 'hex'));

    expect(decodedEthSignRequest.getRequestId().toString('hex')).toEqual(ethSignRequest.getRequestId().toString('hex'));
    expect(decodedEthSignRequest.getCoinId().toURL()).toEqual(ethSignRequest.getCoinId().toURL());
    expect(decodedEthSignRequest.getDerivationPath().getPath()).toEqual(ethSignRequest.getDerivationPath().getPath());
    expect(decodedEthSignRequest.getSignData().toString('hex')).toEqual(ethSignRequest.getSignData().toString('hex'));
    // Metadata and meta types
    expect(decodedEthSignRequest.getMetadata()?.getData()).toStrictEqual(ethSignRequest.getMetadata()?.getData());
    expect(decodedEthSignRequest.getMetadata()?.constructor.name).toEqual(ethSignRequest.getMetadata()?.constructor.name);

    console.log('decodedEthSignRequest', decodedEthSignRequest.toCBOR().toString('hex'));
  });

  // From cbor
  it('Should decode from cbor', () => {
    const cbor =
      'a501d82550babecafe00000000000000000000000002d90579a2010802183c03d90130a1018a182cf5183cf500f500f400f40444abbacaca07a168646174615479706501';

    const ethSignRequest = CryptoSignRequest.fromCBOR(Buffer.from(cbor, 'hex'));

    expect(ethSignRequest.getCoinId);
  });
});
