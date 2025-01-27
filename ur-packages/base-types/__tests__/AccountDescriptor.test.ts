import { Ur } from '@ngraveio/bc-ur';
import { HDKey, OutputDescriptor, Keypath, AccountDescriptor } from '../src/index';

// https://github.com/BlockchainCommons/Research/blob/master/papers/bcr-2023-019-account-descriptor.md
describe('AccountDescriptor', () => {

  /**
     Defines the #0 account for BTC mainnet for the following BIP39 seed:
    `shield group erode awake lock sausage cash glare wave crew flame glove`

    The account-descriptor encodes the following output descriptors as output-descriptor:
      ```
        pkh([37b5eed4/44'/0'/0']xpub6CnQkivUEH9bSbWVWfDLCtigKKgnSWGaVSRyCbN2QNBJzuvHT1vUQpgSpY1NiVvoeNEuVwk748Cn9G3NtbQB1aGGsEL7aYEnjVWgjj9tefu)
        sh(wpkh([37b5eed4/49'/0'/0']xpub6CtR1iF4dZPkEyXDwVf3HE74tSwXNMcHtBzX4gwz2UnPhJ54Jz5unHx2syYCCDkvVUmsmoYTmcaHXe1wJppvct4GMMaN5XAbRk7yGScRSte))
        wpkh([37b5eed4/84'/0'/0']xpub6BkU445MSEBXbPjD3g2c2ch6mn8yy1SXXQUM7EwjgYiq6Wt1NDwDZ45npqWcV8uQC5oi2gHuVukoCoZZyT4HKq8EpotPMqGqxdZRuapCQ23)
        sh(cosigner([37b5eed4/45']xpub68JFLJTH96GUqC6SoVw5c2qyLSt776PGu5xde8ddVACuPYyarvSL827TbZGavuNbKQ8DG3VP9fCXPhQRBgPrS4MPG3zaZgwAGuPHYvVuY9X))
        sh(wsh(cosigner([37b5eed4/48'/0'/0'/1']xpub6EC9f7mLFJQoPaqDJ72Zbv67JWzmpXvCYQSecER9GzkYy5eWLsVLbHnxoAZ8NnnsrjhMLduJo9dG6fNQkmMFL3Qedj2kf5bEy5tptHPApNf)))
        wsh(cosigner([37b5eed4/48'/0'/0'/2']xpub6EC9f7mLFJQoRQ6qiTvWQeeYsgtki6fBzSUgWgUtAujEMtAfJSAn3AVS4KrLHRV2hNX77YwNkg4azUzuSwhNGtcq4r2J8bLGMDkrQYHvoed))
        tr([37b5eed4/86'/0'/0']xpub6DAvL2L5bgGSpDygSQUDpjwE47saoMk2rSRtYhN7Dma7HvnFLTXNrcSC1AmEN8G2SCD958bUwgc6Bew4sAFa2kqYynF8Rmu6P5jMt2FDPtm)
      ```
   */

  it('Example/Test Vector 1 - Account Descriptor ', () => {

    const masterFingerprint = 934670036;

    const hdkey1 = HDKey.fromXpub("xpub6CnQkivUEH9bSbWVWfDLCtigKKgnSWGaVSRyCbN2QNBJzuvHT1vUQpgSpY1NiVvoeNEuVwk748Cn9G3NtbQB1aGGsEL7aYEnjVWgjj9tefu");
    // @ts-ignore
    hdkey1.data.origin = new Keypath({
      sourceFingerprint: masterFingerprint,
      path: "44'/0'/0'"
    });
    // @ts-ignore
    hdkey1.data.parentFingerprint = 2583285239;

    const hdkey2 = HDKey.fromXpub("xpub6CtR1iF4dZPkEyXDwVf3HE74tSwXNMcHtBzX4gwz2UnPhJ54Jz5unHx2syYCCDkvVUmsmoYTmcaHXe1wJppvct4GMMaN5XAbRk7yGScRSte");
    // @ts-ignore
    hdkey2.data.origin = new Keypath({
      sourceFingerprint: masterFingerprint,
      path: "49'/0'/0'"
    });
    // @ts-ignore
    hdkey2.data.parentFingerprint = 2819587291;

    const hdkey3 = HDKey.fromXpub("xpub6BkU445MSEBXbPjD3g2c2ch6mn8yy1SXXQUM7EwjgYiq6Wt1NDwDZ45npqWcV8uQC5oi2gHuVukoCoZZyT4HKq8EpotPMqGqxdZRuapCQ23");
    // @ts-ignore
    hdkey3.data.origin = new Keypath({
      sourceFingerprint: masterFingerprint,
      path: "84'/0'/0'"
    });
    // @ts-ignore
    hdkey3.data.parentFingerprint = 224256471;

    const hdkey4 = HDKey.fromXpub("xpub68JFLJTH96GUqC6SoVw5c2qyLSt776PGu5xde8ddVACuPYyarvSL827TbZGavuNbKQ8DG3VP9fCXPhQRBgPrS4MPG3zaZgwAGuPHYvVuY9X");
    // @ts-ignore
    hdkey4.data.origin = new Keypath({
      sourceFingerprint: masterFingerprint,
      path: "45'"
    });
    // @ts-ignore
    hdkey4.data.parentFingerprint = masterFingerprint;

    const hdkey5 = HDKey.fromXpub("xpub6EC9f7mLFJQoPaqDJ72Zbv67JWzmpXvCYQSecER9GzkYy5eWLsVLbHnxoAZ8NnnsrjhMLduJo9dG6fNQkmMFL3Qedj2kf5bEy5tptHPApNf");
    // @ts-ignore
    hdkey5.data.origin = new Keypath({
      sourceFingerprint: masterFingerprint,
      path: "48'/0'/0'/1'"
    });
    // @ts-ignore
    hdkey5.data.parentFingerprint = 1505139498;

    const hdkey6 = HDKey.fromXpub("xpub6EC9f7mLFJQoRQ6qiTvWQeeYsgtki6fBzSUgWgUtAujEMtAfJSAn3AVS4KrLHRV2hNX77YwNkg4azUzuSwhNGtcq4r2J8bLGMDkrQYHvoed");
    // @ts-ignore
    hdkey6.data.origin = new Keypath({
      sourceFingerprint: masterFingerprint,
      path: "48'/0'/0'/2'"
    });
    // @ts-ignore
    hdkey6.data.parentFingerprint = 1505139498;

    const hdkey7 = HDKey.fromXpub("xpub6DAvL2L5bgGSpDygSQUDpjwE47saoMk2rSRtYhN7Dma7HvnFLTXNrcSC1AmEN8G2SCD958bUwgc6Bew4sAFa2kqYynF8Rmu6P5jMt2FDPtm");
    // @ts-ignore
    hdkey7.data.origin = new Keypath({
      sourceFingerprint: masterFingerprint,
      path: "86'/0'/0'"
    });
    // @ts-ignore
    hdkey7.data.parentFingerprint = 3469149964;

    const outputDescriptor1 = new OutputDescriptor({
      source: "pkh(@0)",
      keys: [hdkey1],
    });

    const outputDescriptor2 = new OutputDescriptor({
      source: "sh(wpkh(@0))",
      keys: [hdkey2],
    });

    const outputDescriptor3 = new OutputDescriptor({
      source: "wpkh(@0)",
      keys: [hdkey3],
    });

    const outputDescriptor4 = new OutputDescriptor({
      source: "sh(cosigner(@0))",
      keys: [hdkey4],
    });

    const outputDescriptor5 = new OutputDescriptor({
      source: "sh(wsh(cosigner(@0)))",
      keys: [hdkey5],
    });

    const outputDescriptor6 = new OutputDescriptor({
      source: "wsh(cosigner(@0))",
      keys: [hdkey6],
    });

    const outputDescriptor7 = new OutputDescriptor({
      source: "tr(@0)",
      keys: [hdkey7],
    });

    const accountDescriptor = new AccountDescriptor({
      masterFingerprint,
      outputDescriptors: [
        outputDescriptor1,
        outputDescriptor2,
        outputDescriptor3,
        outputDescriptor4,
        outputDescriptor5,
        outputDescriptor6,
        outputDescriptor7,
      ],
    });

    // Expected CBOR encoding
    /**
       {
        1: 934670036, ; master public key fingerprint
        2: [ ; array of output descriptors
          40308({ ; output-descriptor
            1: "pkh(@0)", ; source (text descriptor)
            2: [ ; keys array
              40303({ ; hdkey
                3: h'03EB3E2863911826374DE86C231A4B76F0B89DFA174AFB78D7F478199884D9DD32', ; key-data
                4: h'6456A5DF2DB0F6D9AF72B2A1AF4B25F45200ED6FCC29C3440B311D4796B70B5B', ; chain-code
                6: 40304({ ; origin: keypath
                  1: [44, true, 0, true, 0, true], ; components 44'/0'/0'
                  2: 934670036 ; source-fingerprint (master key fingerprint)
                }),
                8: 2583285239 ; parent fingerprint
              })
            ]
          }),
          40308({ ; output-descriptor
            1: "sh(wpkh(@0))", ; source (text descriptor)
            2: [ ; keys array
              40303({ ; hdkey
                3: h'02C7E4823730F6EE2CF864E2C352060A88E60B51A84E89E4C8C75EC22590AD6B69', ; key-data
                4: h'9D2F86043276F9251A4A4F577166A5ABEB16B6EC61E226B5B8FA11038BFDA42D', ; chain-code
                6: 40304({ ; origin: keypath
                  1: [49, true, 0, true, 0, true], ; components 49'/0'/0'
                  2: 934670036 ; source-fingerprint (master key fingerprint)
                }),
                8: 2819587291 ; parent fingerprint
              })
            ]
          }),
          40308({ ; output-descriptor
            1: "wpkh(@0)", ; source (text descriptor)
            2: [ ; keys array
              40303({ ; hdkey
                3: h'03FD433450B6924B4F7EFDD5D1ED017D364BE95AB2B592DC8BDDB3B00C1C24F63F', ; key-data
                4: h'72EDE7334D5ACF91C6FDA622C205199C595A31F9218ED30792D301D5EE9E3A88', ; chain-code
                6: 40304({ ; origin: keypath
                  1: [84, true, 0, true, 0, true], ; components 84'/0'/0'
                  2: 934670036 ; source-fingerprint (master key fingerprint)
                }),
                8: 224256471 ; parent fingerprint
              })
            ]
          }),
          40308({ ; output-descriptor
            1: "sh(cosigner(@0))", ; source (text descriptor)
            2: [ ; keys array
              40303({ ; hdkey
                3: h'035CCD58B63A2CDC23D0812710603592E7457573211880CB59B1EF012E168E059A', ; key-data
                4: h'88D3299B448F87215D96B0C226235AFC027F9E7DC700284F3E912A34DAEB1A23', ; chain-code
                6: 40304({ ; origin: keypath
                  1: [45, true], ; components 45'
                  2: 934670036 ; source-fingerprint (master key fingerprint)
                }),
                8: 934670036 ; parent fingerprint
              })
            ]
          }),
          40308({ ; output-descriptor
            1: "sh(wsh(cosigner(@0)))", ; source (text descriptor)
            2: [ ; keys array
              40303({ ; hdkey
                3: h'032C78EBFCABDAC6D735A0820EF8732F2821B4FB84CD5D6B26526938F90C050711', ; key-data
                4: h'7953EFE16A73E5D3F9F2D4C6E49BD88E22093BBD85BE5A7E862A4B98A16E0AB6', ; chain-code
                6: 40304({ ; origin: keypath
                  1: [48, true, 0, true, 0, true, 1, true], ; components 48'/0'/0'/1'
                  2: 934670036 ; source-fingerprint (master key fingerprint)
                }),
                8: 1505139498 ; parent fingerprint
              })
            ]
          }),
          40308({ ; output-descriptor
            1: "wsh(cosigner(@0))", ; source (text descriptor)
            2: [ ; keys array
              40303({ ; hdkey
                3: h'0260563EE80C26844621B06B74070BAF0E23FB76CE439D0237E87502EBBD3CA346', ; key-data
                4: h'2FA0E41C9DC43DC4518659BFCEF935BA8101B57DBC0812805DD983BC1D34B813', ; chain-code
                6: 40304({ ; origin: keypath
                  1: [48, true, 0, true, 0, true, 2, true], ; components 48'/0'/0'/2'
                  2: 934670036 ; source-fingerprint (master key fingerprint)
                }),
                8: 1505139498 ; parent fingerprint
              })
            ]
          }),
          40308({ ; output-descriptor
            1: "tr(@0)", ; source (text descriptor)
            2: [ ; keys array
              40303({ ; hdkey
                3: h'02BBB97CF9EFA176B738EFD6EE1D4D0FA391A973394FBC16E4C5E78E536CD14D2D', ; key-data
                4: h'4B4693E1F794206ED1355B838DA24949A92B63D02E58910BF3BD3D9C242281E6', ; chain-code
                6: 40304({ ; origin: keypath
                  1: [86, true, 0, true, 0, true], ; components 86'/0'/0'
                  2: 934670036 ; source-fingerprint (master key fingerprint)
                }),
                8: 3469149964 ; parent fingerprint
              })
            ]
          })
        ]
      }
    */

    const expectedCBOR = "a2011a37b5eed40287d99d74a20167706b68284030290281d99d6fa403582103eb3e2863911826374de86c231a4b76f0b89dfa174afb78d7f478199884d9dd320458206456a5df2db0f6d9af72b2a1af4b25f45200ed6fcc29c3440b311d4796b70b5b06d99d70a20186182cf500f500f5021a37b5eed4081a99f9cdf7d99d74a2016c73682877706b6828403029290281d99d6fa403582102c7e4823730f6ee2cf864e2c352060a88e60b51a84e89e4c8c75ec22590ad6b690458209d2f86043276f9251a4a4f577166a5abeb16b6ec61e226b5b8fa11038bfda42d06d99d70a201861831f500f500f5021a37b5eed4081aa80f7cdbd99d74a2016877706b68284030290281d99d6fa403582103fd433450b6924b4f7efdd5d1ed017d364be95ab2b592dc8bddb3b00c1c24f63f04582072ede7334d5acf91c6fda622c205199c595a31f9218ed30792d301d5ee9e3a8806d99d70a201861854f500f500f5021a37b5eed4081a0d5de1d7d99d74a20170736828636f7369676e657228403029290281d99d6fa4035821035ccd58b63a2cdc23d0812710603592e7457573211880cb59b1ef012e168e059a04582088d3299b448f87215d96b0c226235afc027f9e7dc700284f3e912a34daeb1a2306d99d70a20182182df5021a37b5eed4081a37b5eed4d99d74a2017573682877736828636f7369676e65722840302929290281d99d6fa4035821032c78ebfcabdac6d735a0820ef8732f2821b4fb84cd5d6b26526938f90c0507110458207953efe16a73e5d3f9f2d4c6e49bd88e22093bbd85be5a7e862a4b98a16e0ab606d99d70a201881830f500f500f501f5021a37b5eed4081a59b69b2ad99d74a2017177736828636f7369676e657228403029290281d99d6fa40358210260563ee80c26844621b06b74070baf0e23fb76ce439d0237e87502ebbd3ca3460458202fa0e41c9dc43dc4518659bfcef935ba8101b57dbc0812805dd983bc1d34b81306d99d70a201881830f500f500f502f5021a37b5eed4081a59b69b2ad99d74a201667472284030290281d99d6fa403582102bbb97cf9efa176b738efd6ee1d4d0fa391a973394fbc16e4c5e78e536cd14d2d0458204b4693e1f794206ed1355b838da24949a92b63d02e58910bf3bd3d9c242281e606d99d70a201861856f500f500f5021a37b5eed4081acec7070c";
    const expectedUr = "ur:account-descriptor/oeadcyemrewytyaolttantjyoeadiojojeisdefzdydtaolytantjloxaxhdclaxwmfmdeiamecsdsemgtvsjzcncygrkowtrontzschgezokstswkkscfmklrtauteyaahdcxiehfonurdppfyntapejpproypegrdawkgmaewejlsfdtsrfybdehcaflmtrlbdhpamtantjooeadlncsdwykaeykaeykaocyemrewytyaycynlytsnyltantjyoeadjzjkisdektjojeisdefzdydtdtaolytantjloxaxhdclaostvelfemdyynwydwyaievosrgmambklovabdgypdglldvespsthysadamhpmjeinaahdcxntdllnaaeykoytdacygegwhgjsiyonpywmcmrpwphsvodsrerozsbyaxluzcoxdpamtantjooeadlncsehykaeykaeykaocyemrewytyaycypdbskeuytantjyoeadisktjojeisdefzdydtaolytantjloxaxhdclaxzcfxeegdrpmogrgwkbzctlttweadkiengrwlhtprremouoluutqdpfbncedkynfhaahdcxjpwevdeogthttkmeswzcolcpsaahcfnshkhtehytclmnteatmoteadtlwynnftloamtantjooeadlncsghykaeykaeykaocyemrewytyaycybthlvytstantjyoeadjojkisdeiajljkiniojtihjpdefzdydtdtaolytantjloxaxhdclaxhhsnhdrpftdwuocntilydibehnecmovdfekpjkclcslasbhkpawsaddmcmmnahnyaahdcxlotedtndfymyltclhlmtpfsadscnhtztaolbnnkistaedegwfmmedreetnwmcycnamtantjooeadlfcsdpykaocyemrewytyaycyemrewytytantjyoeadkpjkisdektjkisdeiajljkiniojtihjpdefzdydtdtdtaolytantjloxaxhdclaxdwkswmztpytnswtsecnblfbayajkdldeclqzzolrsnhljedsgminetytbnahatbyaahdcxkkguwsvyimjkvwteytwztyswvendtpmncpasfrrylprnhtkblndrgrmkoyjtbkrpamtantjooeadlocsdyykaeykaeykadykaocyemrewytyaycyhkrpnddrtantjyoeadjsktjkisdeiajljkiniojtihjpdefzdydtdtaolytantjloxaxhdclaohnhffmvsbndslrfgclpfjejyatbdpebacnzokotofxntaoemvskpaowmryfnotfgaahdcxdlnbvecentssfsssgylnhkrstoytecrdlyadrekirfaybglahltalsrfcaeerobwamtantjooeadlocsdyykaeykaeykaoykaocyemrewytyaycyhkrpnddrtantjyoeadiyjyjpdefzdydtaolytantjloxaxhdclaorkrhkeytwsoykorletwstbwycagtbsotmeptjkesgwrfcmveskvdmngujzttgtdpaahdcxgrfgmuvyylmwcxjtttechplslgoegagaptdniatidmhdmebdwfryfsnsdkcplyvaamtantjooeadlncshfykaeykaeykaocyemrewytyaycytostatbnyadleoeh";

    // Convert to UR and get CBOR
    const ur = accountDescriptor.toUr();
    const cbor = ur.getPayloadHex();

    expect(cbor).toEqual(expectedCBOR);
    expect(ur.toString()).toEqual(expectedUr);
  });


  it('Example/Test Vector 1 - Decode ', () => {
    const expectedUr = "ur:account-descriptor/oeadcyemrewytyaolttantjyoeadiojojeisdefzdydtaolytantjloxaxhdclaxwmfmdeiamecsdsemgtvsjzcncygrkowtrontzschgezokstswkkscfmklrtauteyaahdcxiehfonurdppfyntapejpproypegrdawkgmaewejlsfdtsrfybdehcaflmtrlbdhpamtantjooeadlncsdwykaeykaeykaocyemrewytyaycynlytsnyltantjyoeadjzjkisdektjojeisdefzdydtdtaolytantjloxaxhdclaostvelfemdyynwydwyaievosrgmambklovabdgypdglldvespsthysadamhpmjeinaahdcxntdllnaaeykoytdacygegwhgjsiyonpywmcmrpwphsvodsrerozsbyaxluzcoxdpamtantjooeadlncsehykaeykaeykaocyemrewytyaycypdbskeuytantjyoeadisktjojeisdefzdydtaolytantjloxaxhdclaxzcfxeegdrpmogrgwkbzctlttweadkiengrwlhtprremouoluutqdpfbncedkynfhaahdcxjpwevdeogthttkmeswzcolcpsaahcfnshkhtehytclmnteatmoteadtlwynnftloamtantjooeadlncsghykaeykaeykaocyemrewytyaycybthlvytstantjyoeadjojkisdeiajljkiniojtihjpdefzdydtdtaolytantjloxaxhdclaxhhsnhdrpftdwuocntilydibehnecmovdfekpjkclcslasbhkpawsaddmcmmnahnyaahdcxlotedtndfymyltclhlmtpfsadscnhtztaolbnnkistaedegwfmmedreetnwmcycnamtantjooeadlfcsdpykaocyemrewytyaycyemrewytytantjyoeadkpjkisdektjkisdeiajljkiniojtihjpdefzdydtdtdtaolytantjloxaxhdclaxdwkswmztpytnswtsecnblfbayajkdldeclqzzolrsnhljedsgminetytbnahatbyaahdcxkkguwsvyimjkvwteytwztyswvendtpmncpasfrrylprnhtkblndrgrmkoyjtbkrpamtantjooeadlocsdyykaeykaeykadykaocyemrewytyaycyhkrpnddrtantjyoeadjsktjkisdeiajljkiniojtihjpdefzdydtdtaolytantjloxaxhdclaohnhffmvsbndslrfgclpfjejyatbdpebacnzokotofxntaoemvskpaowmryfnotfgaahdcxdlnbvecentssfsssgylnhkrstoytecrdlyadrekirfaybglahltalsrfcaeerobwamtantjooeadlocsdyykaeykaeykaoykaocyemrewytyaycyhkrpnddrtantjyoeadiyjyjpdefzdydtaolytantjloxaxhdclaorkrhkeytwsoykorletwstbwycagtbsotmeptjkesgwrfcmveskvdmngujzttgtdpaahdcxgrfgmuvyylmwcxjtttechplslgoegagaptdniatidmhdmebdwfryfsnsdkcplyvaamtantjooeadlncshfykaeykaeykaocyemrewytyaycytostatbnyadleoeh";
    
    // Decode UR
    const ur = Ur.fromString(expectedUr);

    const accountDescriptor = ur.decode();

    // Convert back to UR
    const ur2 = accountDescriptor.toUr();
    expect(ur2.toString()).toEqual(expectedUr);
  });
});