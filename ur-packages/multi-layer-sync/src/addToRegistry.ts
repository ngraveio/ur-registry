import { UrRegistry } from '@ngraveio/bc-ur'
import { PortfolioMetadata } from './PortfolioMetadata'
import { DetailedAccount } from './DetailedAccount'
import { PortfolioCoin } from './PortfolioCoin'
import { Portfolio } from './Portfolio'

UrRegistry.addItemOnce(PortfolioMetadata)
UrRegistry.addItemOnce(DetailedAccount)
UrRegistry.addItemOnce(PortfolioCoin)
UrRegistry.addItemOnce(Portfolio)
