import { registryItemFactory } from '@ngraveio/bc-ur'
import { PortfolioCoin } from './PortfolioCoin'
import { PortfolioMetadata } from './PortfolioMetadata'

interface IPortfolioInput {
  coins: PortfolioCoin[]
  metadata?: PortfolioMetadata
}

export class Portfolio extends registryItemFactory({
  tag: 41405,
  URType: 'portfolio',
  keyMap: {
    coins: 1,
    metadata: 2,
  },
  allowKeysNotInMap: false,
  CDDL: `
    ; Top level multi coin sync payload

    sync = {
        coins: [+ #6.41403(portfolio-coin)],           ; Multiple coins with their respective accounts and coin identities
        ? metadata: #6.41404(portfolio-metadata) ; Optional wallet metadata
    }

    coins = 1
    metadata = 2
  `,
}) {
  data: IPortfolioInput

  constructor(data: IPortfolioInput) {
    super(data)
    this.data = data
  }

  override verifyInput(input: IPortfolioInput): { valid: boolean; reasons?: Error[] } {
    const errors: Error[] = []

    // Type check
    if (input.coins == undefined || !Array.isArray(input.coins)) {
      errors.push(new Error('Coins must be an array'))
    }

    // Check if coins is an array of PortfolioCoin
    if (input.coins && !input.coins.every((coin: any) => coin instanceof PortfolioCoin)) {
      errors.push(new Error('Coins must be an array of PortfolioCoin'))
    }

    // Check if metadata is of type PortfolioMetadata
    if (input.metadata && !(input.metadata instanceof PortfolioMetadata)) {
      errors.push(new Error('Metadata must be of type PortfolioMetadata'))
    }

    // TODO: Check for the metadata master fingerprint aligns with the coins master fingerprint

    return {
      valid: errors.length === 0,
      reasons: errors.length > 0 ? errors : undefined,
    }
  }

  public getCoins = () => this.data.coins
  public getMetadata = () => this.data.metadata
}
