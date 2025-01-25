import { UrRegistry } from '@ngraveio/bc-ur'
import { Bytes } from './Bytes'
import { CoinInfo } from './CoinInfo'
import { PSBT } from './PSBT'
import { Keypath } from './Keypath'
import { HDKey } from './HDKey'
import { Address } from './Address'
import { ECKey } from './ECKey'
import { OutputDescriptor } from './OutputDescriptor'

// Add Classes to the global registry
UrRegistry.addItem(Bytes)
UrRegistry.addItem(CoinInfo)
UrRegistry.addItem(PSBT)
UrRegistry.addItem(Keypath)
UrRegistry.addItem(HDKey)
UrRegistry.addItem(Address)
UrRegistry.addItem(ECKey)
UrRegistry.addItem(OutputDescriptor)
