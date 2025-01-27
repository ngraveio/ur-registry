import { HDKey, OutputDescriptor, ECKey, Address, Keypath } from '../src/index';

// https://github.com/BlockchainCommons/Research/blob/master/papers/bcr-2023-010-output-descriptor.md
describe('OutputDescriptor', () => {

  it('Example/Test Vector 1 - P2PK script ', () => {

    // pk(03e220e776d811c44075a4a260734445c8967865f5357ba98ead3bc6a6552c36f2)
    const text = "pk(@0)"
    const eckey = new ECKey({
      data: Buffer.from("03e220e776d811c44075a4a260734445c8967865f5357ba98ead3bc6a6552c36f2", "hex")
    });

    const outputDescriptor = new OutputDescriptor({
      source: text,
      keys: [eckey],
    });


      /*
      40308(   / output-descriptor /
        {
            1:
            "pk(@0)",
            2:
            [
              40306(   / eckey /
                  {
                    3:
                    h'03e220e776d811c44075a4a260734445c8967865f5357ba98ead3bc6a6552c36f2'
                  }
              )
            ]
        }
      )
      */
    // NOTE: expected cbor encodes the type 40308()
    // const expectedCBOR = "d99d74a20166706b284030290281d99d72a103582103e220e776d811c44075a4a260734445c8967865f5357ba98ead3bc6a6552c36f2";
    const expectedCBOR = "a20166706b284030290281d99d72a103582103e220e776d811c44075a4a260734445c8967865f5357ba98ead3bc6a6552c36f2";

    // convert UR
    const ur = outputDescriptor.toUr();
    // get CBOR
    const cbor = ur.getPayloadHex();

    expect(cbor).toEqual(expectedCBOR);
  });

  it('Example/Test Vector 2 - testnet P2WPKH (native segwit) address  ', () => {

    // addr(tb1qfm7nmm28m9n7gy3fsfpze8vymds9qwtjwn4w7y)
    const text = "addr(@0)"
    const address = Address.fromAddress("tb1qfm7nmm28m9n7gy3fsfpze8vymds9qwtjwn4w7y");

    const outputDescriptor = new OutputDescriptor({
      source: text,
      keys: [address],
    });

    /*
    40308(   / output-descriptor /
      {
          1:
          "addr(@0)",
          2:
          [
            40307(   / address /
                {
                  1:
                  40305(   / coin-info /
                      {2: 1}
                  ),
                  2:
                  2,
                  3:
                  h'4efd3ded47d967e4122982422c9d84db60503972'
                }
            )
          ]
      }
    )
    */

    // const expectedCBOR = "d99d74a2016861646472284030290281d99d73a301d99d71a10201020203544efd3ded47d967e4122982422c9d84db60503972";
    const expectedCBOR = "a2016861646472284030290281d99d73a301d99d71a10201020203544efd3ded47d967e4122982422c9d84db60503972";

    // convert UR
    const ur = outputDescriptor.toUr();
    // get CBOR
    const cbor = ur.getPayloadHex();

    expect(cbor).toEqual(expectedCBOR);
  });

  it('Example/Test Vector 3 - P2PKH with a private key in WIF format ', () => {

    // pkh(Kxyjdi2KhJMBtPBJia5bmhZFfdMi1YrVYcq41QbnGToa2JXokeAu)
    const text = "pkh(@0)"
    const eckey = new ECKey({
      isPrivate: true,
      data: Buffer.from("347c4acb73f7bf2268b958230e215986eda87a984959c4ddbd4d62c07de6310e", 'hex'),
    })

    const outputDescriptor = new OutputDescriptor({
      source: text,
      keys: [eckey],
    });

      /*
      40308(   / output-descriptor /
        {
            1:
            "pkh(@0)",
            2:
            [
              40306(   / eckey /
                  {
                    2:
                    true,
                    3:
                    h'347c4acb73f7bf2268b958230e215986eda87a984959c4ddbd4d62c07de6310e'
                  }
              )
            ]
        }
      )
    */    

    // const expectedCBOR = "d99d74a20167706b68284030290281d99d72a202f5035820347c4acb73f7bf2268b958230e215986eda87a984959c4ddbd4d62c07de6310e";
    const expectedCBOR = "a20167706b68284030290281d99d72a202f5035820347c4acb73f7bf2268b958230e215986eda87a984959c4ddbd4d62c07de6310e";

    // convert UR
    const ur = outputDescriptor.toUr();
    // get CBOR
    const cbor = ur.getPayloadHex();

    expect(cbor).toEqual(expectedCBOR);
  });

  it('Example/Test Vector 4 - A descriptor for a 2-of-3 multisig wallet, including the use the name field to give it the name "Satoshis Stash" (448 bytes):', () => {

    /*
      wsh(
          sortedmulti(
              2,
              [dc567276/48'/0'/0'/2']xpub6DiYrfRwNnjeX4vHsWMajJVFKrbEEnu8gAW9vDuQzgTWEsEHE16sGWeXXUV1LBWQE1yCTmeprSNcqZ3W74hqVdgDbtYHUv3eM4W2TEUhpan/<0;1>/*,
              [f245ae38/48'/0'/0'/2']xpub6DnT4E1fT8VxuAZW29avMjr5i99aYTHBp9d7fiLnpL5t4JEprQqPMbTw7k7rh5tZZ2F5g8PJpssqrZoebzBChaiJrmEvWwUTEMAbHsY39Ge/<0;1>/*,
              [c5d87297/48'/0'/0'/2']xpub6DjrnfAyuonMaboEb3ZQZzhQ2ZEgaKV2r64BFmqymZqJqviLTe1JzMr2X2RfQF892RH7MyYUbcy77R7pPu1P71xoj8cDUMNhAMGYzKR4noZ/<0;1>/*
          )
      )
    */
    const text = 'wsh(sortedmulti(2,@0,@1,@2))'

    // Create HDKey objects
    const hdkey1 = HDKey.fromXpub("xpub6DiYrfRwNnjeX4vHsWMajJVFKrbEEnu8gAW9vDuQzgTWEsEHE16sGWeXXUV1LBWQE1yCTmeprSNcqZ3W74hqVdgDbtYHUv3eM4W2TEUhpan");
    const sourceFingerprint = Buffer.from("dc567276", "hex").readUint32BE();
    // @ts-ignore
    hdkey1.data.origin = new Keypath({
      sourceFingerprint: sourceFingerprint,
      path: "48'/0'/0'/2'"
    });
    // @ts-ignore
    hdkey1.data.children = new Keypath({
      path: "<0;1>/*",
    });

    const hdkey2 = HDKey.fromXpub("xpub6DnT4E1fT8VxuAZW29avMjr5i99aYTHBp9d7fiLnpL5t4JEprQqPMbTw7k7rh5tZZ2F5g8PJpssqrZoebzBChaiJrmEvWwUTEMAbHsY39Ge");
    // @ts-ignore
    hdkey2.data.origin = new Keypath({
      sourceFingerprint: Buffer.from("f245ae38", "hex").readUint32BE(),
      path: "48'/0'/0'/2'"
    });
    // @ts-ignore
    hdkey2.data.children = new Keypath({
      path: "<0;1>/*",
    });

    const hdkey3 = HDKey.fromXpub("xpub6DjrnfAyuonMaboEb3ZQZzhQ2ZEgaKV2r64BFmqymZqJqviLTe1JzMr2X2RfQF892RH7MyYUbcy77R7pPu1P71xoj8cDUMNhAMGYzKR4noZ");
    // @ts-ignore
    hdkey3.data.origin = new Keypath({
      sourceFingerprint: Buffer.from("c5d87297", "hex").readUint32BE(),
      path: "48'/0'/0'/2'"
    });
    // @ts-ignore
    hdkey3.data.children = new Keypath({
      path: "<0;1>/*",
    });

    const outputDescriptor = new OutputDescriptor({
      source: text,
      keys: [hdkey1, hdkey2, hdkey3],
      name: "Satoshi's Stash",
    });

      /**
      40308(
        {
          1: "wsh(sortedmulti(2,@0,@1,@2))", 
          2: [
            40303({
              3: h'021c0b479ecf6e67713ddf0c43b634592f51c037b6f951fb1dc6361a98b1e5735e',
              4: h'6b3a4cfb6a45f6305efe6e0e976b5d26ba27f7c344d7fc7abef7be2d06d52dfd',
              6: 40304({1: [48, true, 0, true, 0, true, 2, true], 2: 3696652918}), 
              7: 40304({1: [[0, false, 1, false], [], false]}), 
              8: 418956007
            }), 
            40303({
              3: h'0397fcf2274abd243d42d42d3c248608c6d1935efca46138afef43af08e9712896',
              4: h'c887c72d9d8ac29cddd5b2b060e8b0239039a149c784abe6079e24445db4aa8a',
              6: 40304({1: [48, true, 0, true, 0, true, 2, true], 2: 4064652856}),
              7: 40304({1: [[0, false, 1, false], [], false]}),
              8: 572437920
            }), 
            40303({
              3: h'028342f5f7773f6fab374e1c2d3ccdba26bc0933fc4f63828b662b4357e4cc3791',
              4: h'5afed56d755c088320ec9bc6acd84d33737b580083759e0a0ff8f26e429e0b77',
              6: 40304({1: [48, true, 0, true, 0, true, 2, true], 2: 3319296663}),
              7: 40304({1: [[0, false, 1, false], [], false]}),
              8: 470477062
            })
          ],
          3: "Satoshi's Stash"
        })
      */

    // const expectedCBOR = "d99d74a301781c77736828736f727465646d756c746928322c40302c40312c403229290283d99d6fa5035821021c0b479ecf6e67713ddf0c43b634592f51c037b6f951fb1dc6361a98b1e5735e0458206b3a4cfb6a45f6305efe6e0e976b5d26ba27f7c344d7fc7abef7be2d06d52dfd06d99d70a201881830f500f500f502f5021adc56727607d99d70a101838400f401f480f4081a18f8c2e7d99d6fa50358210397fcf2274abd243d42d42d3c248608c6d1935efca46138afef43af08e9712896045820c887c72d9d8ac29cddd5b2b060e8b0239039a149c784abe6079e24445db4aa8a06d99d70a201881830f500f500f502f5021af245ae3807d99d70a101838400f401f480f4081a221eb5a0d99d6fa5035821028342f5f7773f6fab374e1c2d3ccdba26bc0933fc4f63828b662b4357e4cc37910458205afed56d755c088320ec9bc6acd84d33737b580083759e0a0ff8f26e429e0b7706d99d70a201881830f500f500f502f5021ac5d8729707d99d70a101838400f401f480f4081a1c0ae906036f5361746f7368692773205374617368";
    const expectedCBOR = "a301781c77736828736f727465646d756c746928322c40302c40312c403229290283d99d6fa5035821021c0b479ecf6e67713ddf0c43b634592f51c037b6f951fb1dc6361a98b1e5735e0458206b3a4cfb6a45f6305efe6e0e976b5d26ba27f7c344d7fc7abef7be2d06d52dfd06d99d70a201881830f500f500f502f5021adc56727607d99d70a101838400f401f480f4081a18f8c2e7d99d6fa50358210397fcf2274abd243d42d42d3c248608c6d1935efca46138afef43af08e9712896045820c887c72d9d8ac29cddd5b2b060e8b0239039a149c784abe6079e24445db4aa8a06d99d70a201881830f500f500f502f5021af245ae3807d99d70a101838400f401f480f4081a221eb5a0d99d6fa5035821028342f5f7773f6fab374e1c2d3ccdba26bc0933fc4f63828b662b4357e4cc37910458205afed56d755c088320ec9bc6acd84d33737b580083759e0a0ff8f26e429e0b7706d99d70a201881830f500f500f502f5021ac5d8729707d99d70a101838400f401f480f4081a1c0ae906036f5361746f7368692773205374617368";
    // convert UR
    const ur = outputDescriptor.toUr();
    // get CBOR
    const cbor = ur.getPayloadHex();

    expect(cbor).toEqual(expectedCBOR);
  });
});