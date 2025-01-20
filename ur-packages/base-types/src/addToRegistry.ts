import { UrRegistry } from '@ngraveio/bc-ur'
import { CoinInfo } from './CoinInfo'
import { PSBT } from './PSBT'

// Add Classes to the global registry
UrRegistry.addItem(CoinInfo)
UrRegistry.addItem(PSBT)
