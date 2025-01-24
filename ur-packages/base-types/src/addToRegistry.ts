import { UrRegistry } from '@ngraveio/bc-ur'
import { Bytes } from './Bytes'
import { CoinInfo } from './CoinInfo'
import { PSBT } from './PSBT'
import { Keypath } from './Keypath'
import { HDKey } from './HDKey'

// Add Classes to the global registry
UrRegistry.addItem(Bytes)
UrRegistry.addItem(CoinInfo)
UrRegistry.addItem(PSBT)
UrRegistry.addItem(Keypath)
UrRegistry.addItem(HDKey)
