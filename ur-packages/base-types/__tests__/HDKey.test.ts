import { CoinInfo, HDKey } from '../src/index'
import { PathComponent } from '../src/classes/PathComponent'
import { Keypath } from '../src/index'
import { Ur } from '@ngraveio/bc-ur'

describe('HDKey', () => {
  /**
   * @brief Test the encoding of the test vector 1 of BCR-2020-007-hdkey paper
   * Source: https://github.com/BlockchainCommons/Research/blob/master/papers/bcr-2020-007-hdkey.md
   * Key: xprv9s21ZrQH143K3QTDL4LXw2F7HEK3wJUD2nW2nRk4stbPy6cq3jPPqjiChkVvvNKmPGJxWUtg6LnF5kejMRNNU3TGtRBeJgk33yuGBxrMPHi
   * CDDL:
   * {
   *    1: true, / is-master /
   *    3: h'00e8f32e723decf4051aefac8e2c93c9c5b214313817cdb01a1494b917c8436b35', / key-data /
   *    4: h'873dff81c02f525623fd1fe5167eac3a55a049de3d314bb42ee227ffed37d508' / chain-code /
   * }
   */
  it('should encode a master key', () => {
    // Expected values
    const expectedUr =
      'ur:hdkey/otadykaxhdclaevswfdmjpfswpwkahcywspsmndwmusoskprbbehetchsnpfcybbmwrhchspfxjeecaahdcxltfszmlyrtdlgmhfcnzcctvwcmkbpsftgonbgauefsehgrqzdmvodizmweemtlaybakiylat'
    const expectedBytes =
      'a301f503582100e8f32e723decf4051aefac8e2c93c9c5b214313817cdb01a1494b917c8436b35045820873dff81c02f525623fd1fe5167eac3a55a049de3d314bb42ee227ffed37d508'

    const keyData = Buffer.from('00e8f32e723decf4051aefac8e2c93c9c5b214313817cdb01a1494b917c8436b35', 'hex')
    const chainCode = Buffer.from('873dff81c02f525623fd1fe5167eac3a55a049de3d314bb42ee227ffed37d508', 'hex')
    const hdkey = new HDKey({
      isMaster: true,
      keyData,
      chainCode,
    })

    // Encoding
    const ur = hdkey.toUr()
    const hex = ur.getPayloadHex()

    expect(ur.type).toBe('hdkey')
    expect(ur.getPayloadHex()).toBe(expectedBytes)
    expect(ur.toString()).toBe(expectedUr)

    // Decoding UR
    const decodedUr = Ur.fromString(expectedUr)
    const decodedCBOR = decodedUr.getPayloadHex()

    expect(decodedUr.type).toBe('hdkey')
    expect(decodedCBOR).toBe(hex)

    // Decoding Item
    const decodedItem = decodedUr.decode()
    expect(decodedItem instanceof HDKey).toBe(true)
    expect(decodedItem.data.isMaster).toBe(true)
    expect(decodedItem.data.keyData.toString()).toBe(keyData.join())
    expect(decodedItem.data.chainCode.toString()).toBe(chainCode.join())

    // xprv9s21ZrQH143K3QTDL4LXw2F7HEK3wJUD2nW2nRk4stbPy6cq3jPPqjiChkVvvNKmPGJxWUtg6LnF5kejMRNNU3TGtRBeJgk33yuGBxrMPHi

    // Encode same example using deserialization method
    const xpubDecoded = HDKey.fromXpub(
      'xprv9s21ZrQH143K3QTDL4LXw2F7HEK3wJUD2nW2nRk4stbPy6cq3jPPqjiChkVvvNKmPGJxWUtg6LnF5kejMRNNU3TGtRBeJgk33yuGBxrMPHi',
      "m/44'/1'/1'/0/1"
    )

    const xpubUr = xpubDecoded.toUr()
    const xpubHex = xpubUr.getPayloadHex()

    expect(xpubHex).toBe(expectedBytes)
    expect(xpubUr.toString()).toBe(expectedUr)
  })

  // //@ts-ignore
  // xpubDecoded.data.useInfo = new CoinInfo(0,1);

  /**
   * @brief Test the encoding of the test vector 2 of BCR-2020-007-hdkey paper
   * Source: https://github.com/BlockchainCommons/Research/blob/master/papers/bcr-2020-007-hdkey.md
   * Key: tpubDHW3GtnVrTatx38EcygoSf9UhUd9Dx1rht7FAL8unrMo8r2NWhJuYNqDFS7cZFVbDaxJkV94MLZAr86XFPsAPYcoHWJ7sWYsrmHDw5sKQ2K
   * CDDL:
   * {
   *    3: h'026fe2355745bb2db3630bbc80ef5d58951c963c841f54170ba6e5c12be7fc12a6', / key-data /
   *    4: h'ced155c72456255881793514edc5bd9447e7f74abb88c6d6b6480fd016ee8c85', / chain-code /
   *    5: 40305({ / use-info /
   *        1: 1 /// Where is bitcoin testnet?
   *        2: 1 / network: testnet-btc /
   *    }),
   *    6: 40304({ / origin /
   *        1: [44, true, 1, true, 1, true, 0, false, 1, false] / components `m/44'/1'/1'/0/1` /
   *    }),
   *    8: 3910671603 / parent-fingerprint /
   * }
   *
   */
  it('should encode a btc testnet xpub key', () => {
    // Expected values
    const expectedUr =
      'ur:hdkey/onaxhdclaojlvoechgferkdpqdiabdrflawshlhdmdcemtfnlrctghchbdolvwsednvdztbgolaahdcxtottgostdkhfdahdlykkecbbweskrymwflvdylgerkloswtbrpfdbsticmwylklpahtantjsoyaoadamtantjooyadlecsdwykadykadykaewkadwkaycywlcscewfjnkpvllt'
    const expectedBytes =
      'a5035821026fe2355745bb2db3630bbc80ef5d58951c963c841f54170ba6e5c12be7fc12a6045820ced155c72456255881793514edc5bd9447e7f74abb88c6d6b6480fd016ee8c8505d99d71a1020106d99d70a1018a182cf501f501f500f401f4081ae9181cf3'

    const keyData = Buffer.from('026fe2355745bb2db3630bbc80ef5d58951c963c841f54170ba6e5c12be7fc12a6', 'hex')
    const chainCode = Buffer.from('ced155c72456255881793514edc5bd9447e7f74abb88c6d6b6480fd016ee8c85', 'hex')
    const hdkey = new HDKey({
      keyData,
      chainCode,
      useInfo: new CoinInfo(1, 1),
      origin: new Keypath({ path: "m/44'/1'/1'/0/1" }),
      parentFingerprint: 3910671603,
    })

    // Encoding
    const ur = hdkey.toUr()
    const hex = ur.getPayloadHex()

    expect(ur.type).toBe('hdkey')
    expect(ur.getPayloadHex()).toBe(expectedBytes)
    expect(ur.toString()).toBe(expectedUr)

    // Decoding UR
    const decodedUr = Ur.fromString(expectedUr)
    const decodedCBOR = decodedUr.getPayloadHex()

    expect(decodedUr.type).toBe('hdkey')
    expect(decodedCBOR).toBe(hex)

    // Encode same example using deserialization method
    const xpubDecoded = HDKey.fromXpub(
      'tpubDHW3GtnVrTatx38EcygoSf9UhUd9Dx1rht7FAL8unrMo8r2NWhJuYNqDFS7cZFVbDaxJkV94MLZAr86XFPsAPYcoHWJ7sWYsrmHDw5sKQ2K',
      "m/44'/1'/1'/0/1"
    )
    // @ts-ignore
    xpubDecoded.data.useInfo = new CoinInfo(undefined, 1)

    const xpubUr = xpubDecoded.toUr()
    const xpubHex = xpubUr.getPayloadHex()

    expect(xpubHex).toBe(expectedBytes)
    expect(xpubUr.toString()).toBe(expectedUr)
  })

  /**
   * @brief Test the encoding of the layer 1 test vector of NBCR-2023-002-multi-layer-sync paper
   * Source: https://github.com/ngraveio/Research/blob/main/papers/nbcr-2023-002-multi-layer-sync.md
   * Key: xpub6CRQif2S43vtEYf5cZdMhrFpuBFkgFkALM6qhJZz7ws2cfEf1f8Jiv8dXSkizobckHyfH1mFDFZn46AJoh8d4FpB6ydFFg49yPkJF69GsHq
   * CDDL:
   * {
   *  1: false,
   *  3: h'0204FA032947600AAE94A889DFC31B5C96AFCB7F7E23A189114B71E0254C4B88B5',
   *  4: h'1D710954E58073F927F283C61BC1428AC30A3D86D04DACB3A78613401F781839',
   *  5: 40305({2: 0}), // where is ETH?
   *  6: 40304({1: [44, true, 60, true, 0, true], 2: 1756817576}),
   *  8: 1756817576,
   *  9: "NGRAVE"
   * }
   *
   * Legacy version:
   * {
   *  1: false,
   *  3: h'0204FA032947600AAE94A889DFC31B5C96AFCB7F7E23A189114B71E0254C4B88B5',
   *  4: h'1D710954E58073F927F283C61BC1428AC30A3D86D04DACB3A78613401F781839',
   *  5: 305({2: 0}), // where is ETH?
   *  6: 304({1: [44, true, 60, true, 0, true], 2: 1756817576}),
   *  8: 1756817576,
   *  9: "NGRAVE"
   * }
   *
   */

  it('should encode an eth xpub key', () => {
    // Expected values
    const expectedUr =
      'ur:hdkey/osadwkaxhdclaoaazsaxdtflhnbkplmwpdldursrcwhhmtpesblbkbcnoyldbygrjsvtdagsgrloreaahdcxcajsasghvwlajkytdiwzlsswcwsefwlesrbkfslntigtpsqdoslnbwfzctkscsesahtantjsoyaoaeamtantjooeadlncsdwykcsfnykaeykaocyisrpvspdaycyisrpvspdasiyglflgmfphfferttovymh'
    const expectedBytes =
      'A701F40358210204FA032947600AAE94A889DFC31B5C96AFCB7F7E23A189114B71E0254C4B88B50458201D710954E58073F927F283C61BC1428AC30A3D86D04DACB3A78613401F78183905D99D71A1020006D99D70A20186182CF5183CF500F5021A68B6E8A8081A68B6E8A809664E4752415645'.toLowerCase();

    const keyData = Buffer.from('0204FA032947600AAE94A889DFC31B5C96AFCB7F7E23A189114B71E0254C4B88B5', 'hex')
    const chainCode = Buffer.from('1D710954E58073F927F283C61BC1428AC30A3D86D04DACB3A78613401F781839', 'hex')
    const hdkey = new HDKey({
      isMaster: false,
      keyData,
      chainCode,
      useInfo: new CoinInfo(60, 0),
      origin: new Keypath({ path: "m/44'/60'/0'", sourceFingerprint: 1756817576 }),
      parentFingerprint: 1756817576,
      name: 'NGRAVE',
    })

    // Encoding
    const ur = hdkey.toUr()
    const hex = ur.getPayloadHex()

    expect(ur.type).toBe('hdkey')
    expect(hex).toBe(expectedBytes)
    expect(ur.toString()).toBe(expectedUr)

    // Decoding UR
    const decodedUr = Ur.fromString(expectedUr)
    const decodedCBOR = decodedUr.getPayloadHex()

    expect(decodedUr.getPayloadHex()).toBe(hex)
    expect(decodedUr.toString()).toBe(expectedUr)

    //Encode same example using deserialization method
    const xpubDecoded = HDKey.fromXpub(
      'xpub6CRQif2S43vtEYf5cZdMhrFpuBFkgFkALM6qhJZz7ws2cfEf1f8Jiv8dXSkizobckHyfH1mFDFZn46AJoh8d4FpB6ydFFg49yPkJF69GsHq',
      "m/44'/60'/0'"
    )
    xpubDecoded.data.isMaster = false
    // @ts-ignore
    xpubDecoded.data.useInfo = new CoinInfo(undefined, 0)
    // @ts-ignore
    xpubDecoded.data.origin = new Keypath({ path: "m/44'/60'/0'", sourceFingerprint: 1756817576 })
    // @ts-ignore
    xpubDecoded.data.name = 'NGRAVE'

    const xpubUr = xpubDecoded.toUr()
    const xpubHex = xpubUr.getPayloadHex()

    expect(xpubHex).toBe(expectedBytes)
    expect(xpubUr.toString()).toBe(expectedUr)
  })

  /**
   * @brief Test the encoding of this CDDL example
   * {
   *  2: true,
   *  3: h'00e8f32e723decf4051aefac8e2c93c9c5b214313817cdb01a1494b917c8436b35',
   *  4: h'873dff81c02f525623fd1fe5167eac3a55a049de3d314bb42ee227ffed37d508',
   *  6: 40304({1: [44, true, 60, true, 0, true]}),
   *  7: 40304({1: [0, true, [0, 10], true]}),
   *  9: "Test",
   *  10: "This is an xpriv with hardened children"
   * }
   *
   * Legacy version:
   * {
   *  2: true,
   *  3: h'00e8f32e723decf4051aefac8e2c93c9c5b214313817cdb01a1494b917c8436b35',
   *  4: h'873dff81c02f525623fd1fe5167eac3a55a049de3d314bb42ee227ffed37d508',
   *  6: 304({1: [44, true, 60, true, 0, true]}),
   *  7: 304({1: [0, true, [0, 10], true]}),
   *  9: "Test",
   *  10: "This is an xpriv with hardened children"
   * }
   *
   */
  it('should encode ethereum extended private key with hardened children', () => {
    const expectedUr =
      'ur:hdkey/osaoykaxhdclaevswfdmjpfswpwkahcywspsmndwmusoskprbbehetchsnpfcybbmwrhchspfxjeecaahdcxltfszmlyrtdlgmhfcnzcctvwcmkbpsftgonbgauefsehgrqzdmvodizmweemtlayamtantjooyadlncsdwykcsfnykaeykattantjooyadlraeyklfaebkykasieghihjkjybkksdighisinjkcxinjkcxhsjtcxksjojpinkocxktinjyiscxishsjpieihjtihiecxiaisinjziejpihjtjzetfpzt'
    const expectedBytes =
      'a702f503582100e8f32e723decf4051aefac8e2c93c9c5b214313817cdb01a1494b917c8436b35045820873dff81c02f525623fd1fe5167eac3a55a049de3d314bb42ee227ffed37d50806d99d70a10186182cf5183cf500f507d99d70a1018400f582000af50964546573740a78275468697320697320616e20787072697620776974682068617264656e6564206368696c6472656e'
    const derivationPath = "m/44'/60'/0'"
    const childrenPath = "m/0'/0-10'"

    const keyData = Buffer.from('00e8f32e723decf4051aefac8e2c93c9c5b214313817cdb01a1494b917c8436b35', 'hex')
    const chainCode = Buffer.from('873dff81c02f525623fd1fe5167eac3a55a049de3d314bb42ee227ffed37d508', 'hex')

    const hdkey = new HDKey({
      isPrivateKey: true,
      keyData,
      chainCode,
      origin: new Keypath({ path: derivationPath }),
      children: new Keypath({ path: childrenPath }),
      name: 'Test',
      note: 'This is an xpriv with hardened children',
    })

    // Encoding
    const ur = hdkey.toUr()
    const hex = ur.getPayloadHex()

    expect(ur.type).toBe('hdkey')
    expect(ur.getPayloadHex()).toBe(expectedBytes)
    expect(ur.toString()).toBe(expectedUr)

    // Decoding UR
    const decodedUr = Ur.fromString(expectedUr)
    const decodedCBOR = decodedUr.getPayloadHex()

    expect(decodedUr.getPayloadHex()).toBe(hex)
    expect(decodedUr.toString()).toBe(expectedUr)
  })

  /**
   * @brief Test the encoding of this CDDL example
   * {
   *  3: h'02a1f7b8c912d4e34a12c5b9f83e2ac5d3b4a7e12d3c9127f45b9e34a2f1d3c99b', 
   *  4: h'd3a7c9e2b134f7b89a12c45ed3a912f45bd7e123af9c5d3c45a12ed78a345d9f', 
   *  6: 40304({1: [600, false, [1, false, 2, true]]}), 
   *  7: 40304({1: [0, false, [], false]}),
   *  8: 908765, 
   *  9: "NGR@v3", 
   *  10: "test!$"
   * }
   * 
   * Legacy version:
   * {
   *  3: h'02a1f7b8c912d4e34a12c5b9f83e2ac5d3b4a7e12d3c9127f45b9e34a2f1d3c99b', 
   *  4: h'd3a7c9e2b134f7b89a12c45ed3a912f45bd7e123af9c5d3c45a12ed78a345d9f', 
   *  6: 304({1: [600, false, [1, false, 2, true]]}), 
   *  7: 304({1: [0, false, [], false]}),
   *  8: 908765, 
   *  9: "NGR@v3", 
   *  10: "test!$"
   * }
   * 
   */
  it('should encode random xpub with children', () => {
    const expectedUr =
      'ur:hdkey/osaxhdclaooyylrosobgtyvlgebgskrhyafmdrskteqzosvydpfnmediwkhpnneeoewntesondaahdcxteossovopaeeylronybgsshyteptbgwkhptsvycnpenshlfnfeoydmtsleeehlneamtantjooyadlscfaohdwklradwkaoykattantjooyadlraewklawkaycyaebtututasiyglflgmfzkoeobkiyjyihjkjycldkcsfzbknn'
    const expectedBytes =
      'a703582102a1f7b8c912d4e34a12c5b9f83e2ac5d3b4a7e12d3c9127f45b9e34a2f1d3c99b045820d3a7c9e2b134f7b89a12c45ed3a912f45bd7e123af9c5d3c45a12ed78a345d9f06d99d70a10183190258f48401f402f507d99d70a1018400f480f4081a000ddddd09664e47524076330a66746573742124'
    const derivationPath = "m/600/<1;2'>"
    const childrenPath = "m/0/*"

    const keyData = Buffer.from('02a1f7b8c912d4e34a12c5b9f83e2ac5d3b4a7e12d3c9127f45b9e34a2f1d3c99b', 'hex')
    const chainCode = Buffer.from('d3a7c9e2b134f7b89a12c45ed3a912f45bd7e123af9c5d3c45a12ed78a345d9f', 'hex')

    const hdkey = new HDKey({
      keyData,
      chainCode,
      origin: new Keypath({ path: derivationPath }),
      children: new Keypath({ path: childrenPath }),
      parentFingerprint: 908765,
      name: 'NGR@v3',
      note: 'test!$',
    })

    // Encoding
    const ur = hdkey.toUr()
    const hex = ur.getPayloadHex()

    expect(ur.type).toBe('hdkey')
    expect(ur.getPayloadHex()).toBe(expectedBytes)
    expect(ur.toString()).toBe(expectedUr)

    // Decoding UR
    const decodedUr = Ur.fromString(expectedUr)
    const decodedCBOR = decodedUr.getPayloadHex()

    expect(decodedUr.type).toBe('hdkey')
    expect(decodedCBOR).toBe(hex)

    // Decoding Item
    const decodedItem = decodedUr.decode()
    expect(decodedItem instanceof HDKey).toBe(true)
    expect(decodedItem.data.keyData.toString()).toBe(keyData.join())
    expect(decodedItem.data.chainCode.toString()).toBe(chainCode.join())
    expect(decodedItem.data.parentFingerprint).toBe(908765)
    expect(decodedItem.data.name).toBe('NGR@v3')
    expect(decodedItem.data.note).toBe('test!$')
  })

  /**
   * @brief Test the encoding of this CDDL example
   * {
   *  3: h'02e913d4c5a3f7b89c3e2a14c5b9f7d2a12345e9b34c12a78d3f5c9e1234b7a967', 
   *  4: h'd3a7c9e2b134f7b89a12c45ed3a912f45bd7e123af9c5d3c45a12ed78a345d9f', 
   *  6: 40304({1: [44, true, 0, true, 0, true]}),
   *  7: 40304({1: [160000, false, 45, false]})
   * }
   */
  it('should encode derived key with BTC BIP44 defined in use info', () => {
    const expectedUr =
      'ur:hdkey/oxaxhdclaowlbwtyskotylronsfmdrbbskrhyltdoycnfewlqdgsbgoslgfhhhnnbgeerlptioahtantjsoyadaeamtantjooyadlncsdwykaeykaeykattantjooyadlrcyaeaojsaewkcsdpwkoycfbesp'
    const expectedBytes =
      'A403582102E913D4C5A3F7B89C3E2A14C5B9F7D2A12345E9B34C12A78D3F5C9E1234B7A96705D99D71A1010006D99D70A10186182CF500F500F507D99D70A101841A00027100F4182DF4'.toLowerCase();
    const derivationPath = "m/44'/0'/0'"
    const childrenPath = "m/160000/45"

    const keyData = Buffer.from('02e913d4c5a3f7b89c3e2a14c5b9f7d2a12345e9b34c12a78d3f5c9e1234b7a967', 'hex')

    const hdkey = new HDKey({
      keyData,
      origin: new Keypath({ path: derivationPath }),
      children: new Keypath({ path: childrenPath }),
      useInfo: new CoinInfo(0),
    })

    // Encoding
    const ur = hdkey.toUr()
    const hex = ur.getPayloadHex()

    expect(ur.type).toBe('hdkey')
    expect(ur.getPayloadHex()).toBe(expectedBytes)
    expect(ur.toString()).toBe(expectedUr)

    // Decoding UR
    const decodedUr = Ur.fromString(expectedUr)
    const decodedCBOR = decodedUr.getPayloadHex()

    expect(decodedUr.type).toBe('hdkey')
    expect(decodedCBOR).toBe(hex)

    // Decoding Item
    const decodedItem = decodedUr.decode()
    expect(decodedItem instanceof HDKey).toBe(true)
    expect(decodedItem.data.keyData.toString()).toBe(keyData.join())
    expect(decodedItem.data.origin.toString()).toBe("44'/0'/0'")
    expect(decodedItem.data.children.toString()).toBe("160000/45")
    expect(decodedItem.data.useInfo.getType()).toBe(0)
    expect(decodedItem.data.useInfo.getNetwork()).toBe(0)
  })

  /**
   * @brief Test the encoding of this CDDL example
   * {
   *   3: h'023a7c9d8e12b3f5a9c45d2a12345b78e9d3a7c12f5e34b9c12a7f45b9d3a12ebf'
   * }
   */
  it('should encode single key data', () => {
    const expectedUr =
      'ur:hdkey/oyaxhdclaoftkentmnbgqdykptsshldrbgeehpkswlteossedlhyeerhsedrlbferhteoydmrsvyditiwk'
    const expectedBytes =
      'A1035821023A7C9D8E12B3F5A9C45D2A12345B78E9D3A7C12F5E34B9C12A7F45B9D3A12EBF'.toLowerCase()

    const keyData = Buffer.from('023a7c9d8e12b3f5a9c45d2a12345b78e9d3a7c12f5e34b9c12a7f45b9d3a12ebf', 'hex')

    const hdkey = new HDKey({
      keyData,
    })

    // Encoding
    const ur = hdkey.toUr()
    const hex = ur.getPayloadHex()

    expect(ur.type).toBe('hdkey')
    expect(ur.getPayloadHex()).toBe(expectedBytes)
    expect(ur.toString()).toBe(expectedUr)

    // Decoding UR
    const decodedUr = Ur.fromString(expectedUr)
    const decodedCBOR = decodedUr.getPayloadHex()

    expect(decodedUr.type).toBe('hdkey')
    expect(decodedCBOR).toBe(hex)

    // Decoding Item
    const decodedItem = decodedUr.decode()
    expect(decodedItem instanceof HDKey).toBe(true)
    expect(decodedItem.data.keyData.toString()).toBe(keyData.join())
  })

  /**
   * @brief Test the encoding of this CDDL example
   * {
   *  1: false,
   *  2: true,
   *  3: h'005c3d2e93cfe413e9a1b3f6edc9314b3a9127e4c5d9f83acb4512e7c34a12d43e',
   *  4: h'bd1345c7abf12ed3458af7c9e2b13a7c9f452ed3a123a7bd45f12e9d37c5b43c',
   *  5: 40305({1: 60, 2: 4}),
   *  6: 40304({1: [44, true, 60, true, 0, true], 2: 4509876, 3: 3}),
   *  7: 40304({1: [[0, 5], true, [], false], 2: 1080655, 3: 2}),
   *  8: 4509876,
   *  9: "ZERO",
   *  10: "Fully defined HDKey"
   * }
   */
  it('should encode private key fully defined', () => {
    const expectedUr =
      'ur:hdkey/pkadwkaoykaxhdclaehhfsdmmutkvebwwloyqdynwesoehgrftmedivesktayaftsbfebgvdsrgebgtyfmaahdcxrybwfestpywndmtefeleylsovopaftkenefedmteoycnosryfewndmntemskqzfnahtantjsoeadcsfnaoaaamtantjootadlncsdwykcsfnykaeykaocyaefytiqzaxaxattantjootadlrlfaeahyklawkaocyaebekigwaxaoaycyaefytiqzasiehtfegmgwbkjkfgkpjzjzkkcxieihiyinjtihiecxfdfygrihkksrpytolp'
    const expectedBytes =
      'aa01f402f5035821005c3d2e93cfe413e9a1b3f6edc9314b3a9127e4c5d9f83acb4512e7c34a12d43e045820bd1345c7abf12ed3458af7c9e2b13a7c9f452ed3a123a7bd45f12e9d37c5b43c05d99d71a201183c020406d99d70a30186182cf5183cf500f5021a0044d0b4030307d99d70a30184820005f580f4021a00107d4f0302081a0044d0b409645a45524f0a7346756c6c7920646566696e65642048444b6579'

    const keyData = Buffer.from('005c3d2e93cfe413e9a1b3f6edc9314b3a9127e4c5d9f83acb4512e7c34a12d43e', 'hex')
    const chainCode = Buffer.from('bd1345c7abf12ed3458af7c9e2b13a7c9f452ed3a123a7bd45f12e9d37c5b43c', 'hex')
    const derivationPath = "m/44'/60'/0'"
    const childrenPath = "m/0-5'/*"
    const origin = new Keypath({ path: derivationPath, sourceFingerprint: 4509876 })
    origin.setDepth();
    const children = new Keypath({ path: childrenPath, sourceFingerprint: 1080655 })
    children.setDepth();

    // TODO: passing because super(input) inject everything into data
    const hdkey = new HDKey({
      isMaster: false,
      isPrivateKey: true,
      keyData,
      chainCode,
      origin,
      children,
      //@ts-ignore
      useInfo: new CoinInfo(60, 4),
      parentFingerprint: 4509876,
      name: 'ZERO',
      note: 'Fully defined HDKey',
    })

    // Encoding
    const ur = hdkey.toUr()
    const hex = ur.getPayloadHex()

    expect(ur.type).toBe('hdkey')
    expect(ur.getPayloadHex()).toBe(expectedBytes)
    expect(ur.toString()).toBe(expectedUr)

    // Decoding UR
    const decodedUr = Ur.fromString(expectedUr)
    const decodedCBOR = decodedUr.getPayloadHex()

    expect(decodedUr.type).toBe('hdkey')
    expect(decodedCBOR).toBe(hex)

    // Decoding Item
    const decodedItem = decodedUr.decode()
    expect(decodedItem instanceof HDKey).toBe(true)
    expect(decodedItem.data.keyData.toString()).toBe(keyData.join())
    expect(decodedItem.data.chainCode.toString()).toBe(chainCode.join())
    expect(decodedItem.data.origin.toString()).toBe("44'/60'/0'")
    expect(decodedItem.data.children.toString()).toBe("0-5'/*")
    expect(decodedItem.data.useInfo.getType()).toBe(60)
    expect(decodedItem.data.useInfo.getNetwork()).toBe(4)
    expect(decodedItem.data.parentFingerprint).toBe(4509876)
    expect(decodedItem.data.name).toBe('ZERO')
    expect(decodedItem.data.note).toBe('Fully defined HDKey')
  })

  // TODO: handle error cases later
  describe("Error handling", () => {
    /**
     * @brief Test returning an error
     */
    it('should return an error for master key without chain code', () => {
      const keyData = Buffer.from('00e8f32e723decf4051aefac8e2c93c9c5b214313817cdb01a1494b917c8436b35', 'hex')
      expect(() => {
        new HDKey({
          isMaster: true,
          keyData,
        })
      }).toThrow('Invalid input: chainCode is required for master key')
    })

    /**
     * @brief Test returning an error
     */
    it('should return an error for master key with excluded fields', () => {
      expect(() => {
        const hdkey = HDKey.fromXpub(
          'xprv9s21ZrQH143K3QTDL4LXw2F7HEK3wJUD2nW2nRk4stbPy6cq3jPPqjiChkVvvNKmPGJxWUtg6LnF5kejMRNNU3TGtRBeJgk33yuGBxrMPHi'
        )
        //@ts-ignore
        hdkey.data.parentFingerprint = 0
        hdkey.toUr()
      }).toThrow('Master key cannot contain a parent fingerprint')
    })

    /**
     * @brief Test returning an error
     */
    it('should return an error for incorrect parent fingerprint for single derivation path', () => {
      const keyData = Buffer.from('026fe2355745bb2db3630bbc80ef5d58951c963c841f54170ba6e5c12be7fc12a6', 'hex')
      const chainCode = Buffer.from('ced155c72456255881793514edc5bd9447e7f74abb88c6d6b6480fd016ee8c85', 'hex')
      expect(() => {
        new HDKey({
          keyData,
          chainCode,
          origin: new Keypath({ path: "m/44'", sourceFingerprint: 10101 }),
          parentFingerprint: 202,
        })
      }).toThrow('Parent fingerprint for single derivation path should match the source fingerprint of the origin keypath.')
    })

    /**
     * @brief Test returning an error
     */
    it('should return an error for incorrect BIP44 in use info', () => {
      const keyData = Buffer.from('026fe2355745bb2db3630bbc80ef5d58951c963c841f54170ba6e5c12be7fc12a6', 'hex')
      const chainCode = Buffer.from('ced155c72456255881793514edc5bd9447e7f74abb88c6d6b6480fd016ee8c85', 'hex')
      expect(() => {
        new HDKey({
          keyData,
          chainCode,
          origin: new Keypath({ path: "m/44'/777'/0'" }),
          useInfo: new CoinInfo(60, 0),
        })
      }).toThrow('When BIP44 is specified, the derivation path should contain the coin type value.')
    })

    /**
     * @brief Test returning an error
     */
    it('should return an error for BIP44 with too short derivation', () => {
      const keyData = Buffer.from('026fe2355745bb2db3630bbc80ef5d58951c963c841f54170ba6e5c12be7fc12a6', 'hex')
      const chainCode = Buffer.from('ced155c72456255881793514edc5bd9447e7f74abb88c6d6b6480fd016ee8c85', 'hex')
      expect(() => {
        new HDKey({
          keyData,
          chainCode,
          origin: new Keypath({ path: "m/44'" }),
          useInfo: new CoinInfo(60, 0),
        })
      }).toThrow('When BIP44 is specified, the derivation path should contain at least two components.')
    })

    /**
     * @brief Test returning an error
     */
    it('should return an error for BIP44 with invalid child type', () => {
      const keyData = Buffer.from('026fe2355745bb2db3630bbc80ef5d58951c963c841f54170ba6e5c12be7fc12a6', 'hex')
      const chainCode = Buffer.from('ced155c72456255881793514edc5bd9447e7f74abb88c6d6b6480fd016ee8c85', 'hex')
      expect(() => {
        new HDKey({
          keyData,
          chainCode,
          origin: new Keypath({ path: "m/44'/1-60'" }),
          useInfo: new CoinInfo(60, 0),
        })
      }).toThrow('When BIP44 is specified, the derivation path should contain the coin type value.')
    })

    /**
     * @brief Test returning an error
     */
    it('should return an error for hardened children without private key', () => {
      const keyData = Buffer.from('005c3d2e93cfe413e9a1b3f6edc9314b3a9127e4c5d9f83acb4512e7c34a12d43e', 'hex')
      expect(() => {
        new HDKey({
          keyData,
          children: new Keypath({ path: "m/5'" }),
        })
      }).toThrow('Only a private key can have hardened children keys.')
    })

    /**
     * @brief Test to extract the source fingerprints from different xpub
     */
    it('should extract xpub parent fingerprints', () => {
      expect(HDKey.extractParentFingerprint("xpub6CLDw1BZtqgJ6v7jKZDh7nnKGkTzgysHHcr9b9WUmVVrST5NHM5Gew57op52MwMZnVefPzaLf2f7Sc9qzsTNHADC3wDBMjkxaLG7KjVFXkC")).toBe(1552725994)
      expect(HDKey.extractParentFingerprint("xpub6BnYDGDnB5xCv8Ltci3SQgbrgQMM1FfCLpmTAkRjQ87PQcnSXctVLEmz1sYbcYS3T4tTtybaG7skytEM2aXL9oZ1DYRLi44sUyw6TXpnf8j")).toBe(305787212)
      expect(HDKey.extractParentFingerprint("xpub6CVDAP5Ae2wxTNoDXtFqBiwyWU13ejtf16LJXbwMXMmW8i8HdDpWdaC75ss8c1oAmsFFvHXvmJi5MCU1nJZUkvJ3ZsHkCzHRwczDheGWrp3")).toBe(1906394030)
    })

    /**
     * @brief Test to extract the source fingerprints from different xprv
     */
    it('should extract xprv parent fingerprints', () => {
      expect(HDKey.extractParentFingerprint("xprvA41z7zogVVwxVSgdKUHDy1SKmdb533PjDz7J6N6mV6uS3ze1ai8FHa8kmHScGpWmj4WggLyQjgPie1rFSruoUihUZREPSL39UNdE3BBDu76")).toBe(3632322520)
      expect(HDKey.extractParentFingerprint("xprv9zFnWC6h2cLgpmSA46vutJzBcfJ8yaJGg8cX1e5StJh45BBciYTRXSd25UEPVuesF9yog62tGAQtHjXajPPdbRCHuWS6T8XA2ECKADdw4Ef")).toBe(3635104055)
      expect(HDKey.extractParentFingerprint("xprvA2nrNbFZABcdryreWet9Ea4LvTJcGsqrMzxHx98MMrotbir7yrKCEXw7nadnHM8Dq38EGfSh6dqA9QWTyefMLEcBYJUuekgW4BYPJcr9E7j")).toBe(832899000)
    })

    /**
     * @brief Test to get the source fingerprints from invalid extended keys
     * Source: https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki
     */
    it.skip('should return zero fingerprint for invalid extended keys', () => {
      expect(HDKey.extractParentFingerprint("xpub6CLDw1BZtqgJ6v7jKZDh7nnKGkTzgysHHcr9b9WUmVVrST5NHM5Gew57op52MwMZnVefPzaLf2f7Sc9qzsTNHADC3wDBMjkxaLG7KjVFXkCINCORRECT")).toBe(0)
      expect(HDKey.extractParentFingerprint("xpub661MyMwAqRbcEYS8w7XLSVeEsBXy79zSzH1J8vCdxAZningWLdN3zgtU6LBpB85b3D2yc8sfvZU521AAwdZafEz7mnzBBsz4wKY5fTtTQBm")).toBe(0)
      expect(HDKey.extractParentFingerprint("xprv9s21ZrQH143K24Mfq5zL5MhWK9hUhhGbd45hLXo2Pq2oqzMMo63oStZzFGTQQD3dC4H2D5GBj7vWvSQaaBv5cxi9gafk7NF3pnBju6dwKvH")).toBe(0)
      expect(HDKey.extractParentFingerprint("xpub661MyMwAqRbcEYS8w7XLSVeEsBXy79zSzH1J8vCdxAZningWLdN3zgtU6Txnt3siSujt9RCVYsx4qHZGc62TG4McvMGcAUjeuwZdduYEvFn")).toBe(0)
      expect(HDKey.extractParentFingerprint("xprv9s21ZrQH143K24Mfq5zL5MhWK9hUhhGbd45hLXo2Pq2oqzMMo63oStZzFGpWnsj83BHtEy5Zt8CcDr1UiRXuWCmTQLxEK9vbz5gPstX92JQ")).toBe(0)
      expect(HDKey.extractParentFingerprint("xpub661MyMwAqRbcEYS8w7XLSVeEsBXy79zSzH1J8vCdxAZningWLdN3zgtU6N8ZMMXctdiCjxTNq964yKkwrkBJJwpzZS4HS2fxvyYUA4q2Xe4")).toBe(0)
      expect(HDKey.extractParentFingerprint("xprv9s21ZrQH143K24Mfq5zL5MhWK9hUhhGbd45hLXo2Pq2oqzMMo63oStZzFAzHGBP2UuGCqWLTAPLcMtD9y5gkZ6Eq3Rjuahrv17fEQ3Qen6J")).toBe(0)
      expect(HDKey.extractParentFingerprint("xprv9s2SPatNQ9Vc6GTbVMFPFo7jsaZySyzk7L8n2uqKXJen3KUmvQNTuLh3fhZMBoG3G4ZW1N2kZuHEPY53qmbZzCHshoQnNf4GvELZfqTUrcv")).toBe(0)
      expect(HDKey.extractParentFingerprint("xpub661no6RGEX3uJkY4bNnPcw4URcQTrSibUZ4NqJEw5eBkv7ovTwgiT91XX27VbEXGENhYRCf7hyEbWrR3FewATdCEebj6znwMfQkhRYHRLpJ")).toBe(0)
      expect(HDKey.extractParentFingerprint("xprv9s21ZrQH4r4TsiLvyLXqM9P7k1K3EYhA1kkD6xuquB5i39AU8KF42acDyL3qsDbU9NmZn6MsGSUYZEsuoePmjzsB3eFKSUEh3Gu1N3cqVUN")).toBe(0)
      expect(HDKey.extractParentFingerprint("xpub661MyMwAuDcm6CRQ5N4qiHKrJ39Xe1R1NyfouMKTTWcguwVcfrZJaNvhpebzGerh7gucBvzEQWRugZDuDXjNDRmXzSZe4c7mnTK97pTvGS8")).toBe(0)
      expect(HDKey.extractParentFingerprint("DMwo58pR1QLEFihHiXPVykYB6fJmsTeHvyTp7hRThAtCX8CvYzgPcn8XnmdfHGMQzT7ayAmfo4z3gY5KfbrZWZ6St24UVf2Qgo6oujFktLHdHY4")).toBe(0)
      expect(HDKey.extractParentFingerprint("DMwo58pR1QLEFihHiXPVykYB6fJmsTeHvyTp7hRThAtCX8CvYzgPcn8XnmdfHPmHJiEDXkTiJTVV9rHEBUem2mwVbbNfvT2MTcAqj3nesx8uBf9")).toBe(0)
      expect(HDKey.extractParentFingerprint("xprv9s21ZrQH143K24Mfq5zL5MhWK9hUhhGbd45hLXo2Pq2oqzMMo63oStZzF93Y5wvzdUayhgkkFoicQZcP3y52uPPxFnfoLZB21Teqt1VvEHx")).toBe(0)
      expect(HDKey.extractParentFingerprint("xprv9s21ZrQH143K24Mfq5zL5MhWK9hUhhGbd45hLXo2Pq2oqzMMo63oStZzFAzHGBP2UuGCqWLTAPLcMtD5SDKr24z3aiUvKr9bJpdrcLg1y3G")).toBe(0)
      expect(HDKey.extractParentFingerprint("xpub661MyMwAqRbcEYS8w7XLSVeEsBXy79zSzH1J8vCdxAZningWLdN3zgtU6Q5JXayek4PRsn35jii4veMimro1xefsM58PgBMrvdYre8QyULY")).toBe(0)
      expect(HDKey.extractParentFingerprint("xprv9s21ZrQH143K3QTDL4LXw2F7HEK3wJUD2nW2nRk4stbPy6cq3jPPqjiChkVvvNKmPGJxWUtg6LnF5kejMRNNU3TGtRBeJgk33yuGBxrMPHL")).toBe(0)
    })
  })
})
