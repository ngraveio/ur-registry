import { UrRegistry } from '@ngraveio/bc-ur'
import { Bytes } from './Bytes'
import { CoinInfo } from './CoinInfo'
import { PSBT } from './PSBT'
import { Keypath } from './Keypath'
import { HDKey } from './HDKey'
import { Address } from './Address'
import { ECKey } from './ECKey'
import { OutputDescriptor } from './OutputDescriptor'
import { AccountDescriptor } from './AccountDescriptor'

// Add Classes to the global registry
UrRegistry.addItemOnce(Bytes)
UrRegistry.addItemOnce(CoinInfo)
UrRegistry.addItemOnce(PSBT)
UrRegistry.addItemOnce(Keypath)
UrRegistry.addItemOnce(HDKey)
UrRegistry.addItemOnce(Address)
UrRegistry.addItemOnce(ECKey)
UrRegistry.addItemOnce(OutputDescriptor)
UrRegistry.addItemOnce(AccountDescriptor)
