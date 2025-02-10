import { UrRegistry } from '@ngraveio/bc-ur'
import { DetailedAccount } from './DetailedAccount'
import { PortfolioCoin } from './PortfolioCoin'
import { Portfolio } from './Portfolio'

UrRegistry.addItem(DetailedAccount)
UrRegistry.addItem(PortfolioCoin)
UrRegistry.addItem(Portfolio)
