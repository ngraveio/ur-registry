export type IRange = [number, number]
export type IPairPart = { index: number; hardened: boolean }
export type IPair = [IPairPart, IPairPart]

export interface IPathComponentArgs {
  index?: number
  range?: IRange
  wildcard?: boolean
  hardened?: boolean
  pair?: IPair
}

export class PathComponent {
  public static readonly HARDENED_BIT = 0x80000000

  private index?: number
  private range?: IRange
  private wildcard: boolean = false
  private hardened: boolean = false
  private pair?: IPair

  constructor(args: IPathComponentArgs) {
    const { index, range, wildcard, hardened, pair } = args

    if (index !== undefined) {
      // Index-based component
      if ((index & PathComponent.HARDENED_BIT) !== 0) {
        throw new Error(`#[ur-registry][PathComponent][fn.constructor]: Invalid index ${index} - most significant bit cannot be set`)
      }
      if (range || wildcard || pair) {
        throw new Error('A PathComponent cannot have both index and range, wildcard, or pair.')
      }
      this.index = index
      this.hardened = !!hardened // Default to false if undefined
    } else if (range) {
      // Range-based component
      if (range[0] >= range[1]) {
        throw new Error(`#[ur-registry][PathComponent][fn.constructor]: Invalid range [${range[0]}, ${range[1]}] - low must be less than high.`)
      }
      if (wildcard || pair) {
        throw new Error('A PathComponent cannot have both range and wildcard or pair.')
      }
      this.range = range
      this.hardened = !!hardened // Default to false if undefined
    } else if (wildcard) {
      // Wildcard-based component
      if (pair) {
        throw new Error('A PathComponent cannot have both wildcard and pair.')
      }
      this.wildcard = true
      this.hardened = !!hardened // Default to false if undefined
    } else if (pair) {
      // Pair-based component
      if (hardened) {
        throw new Error('A PathComponent cannot be a pair and hardened at the same time.')
      }
      this.pair = pair
    } else {
      // Wildcard by default when index is undefined
      this.wildcard = true
      this.hardened = !!hardened // Default to false if undefined
    }
  }

  // Getters for compatibility
  public getIndex = () => this.index
  public getRange = () => this.range
  public isWildcard = () => this.wildcard
  public isHardened = () => this.hardened
  public getPair = () => this.pair

  // Type-checking utility functions
  public isIndexComponent = (): boolean => this.index !== undefined

  public isRangeComponent = (): boolean => this.range !== undefined

  public isWildcardComponent = (): boolean => this.wildcard

  public isPairComponent = (): boolean => this.pair !== undefined

  // Converts the component to a string representation
  public toString(hardenedFlag: "'" | 'h' = "'"): string {
    if (this.isIndexComponent()) {
      return `${this.index as number}${this.hardened ? hardenedFlag : ''}`
    }
    if (this.isRangeComponent()) {
      const [low, high] = this.range as IRange
      return `${low}-${high}${this.hardened ? hardenedFlag : ''}`
    }
    if (this.isWildcardComponent()) {
      return `*${this.hardened ? hardenedFlag : ''}`
    }
    if (this.isPairComponent()) {
      const [external, internal] = this.pair as IPair
      return `<${external.index}${external.hardened ? hardenedFlag : ''};${internal.index}${internal.hardened ? hardenedFlag : ''}>`
    }
    throw new Error('Invalid PathComponent: Cannot convert to string.')
  }

  // Parses a string into a PathComponent
  public static fromString(component: string): PathComponent {
    // Do regex check for valid component only allow numeric characters and 'h' or "'" or '[' ']' '-' ';' '<' '>' '*' and ','.
    if (!/^[0-9h'\[\]\-;<>*]+$/g.test(component)) {
      throw new Error(`Invalid character in component: ${component}`)
    }
    if (component === '*' || component === "*'" || component === '*h') {
      const hardened = component.endsWith("'") || component.endsWith('h')
      return new PathComponent({ wildcard: true, hardened })
    }
    if (component.includes('-')) {
      const [low, high] = component.split('-').map(part => {
        const hardened = part.endsWith("'") || part.endsWith('h')
        const index = parseInt(hardened ? part.slice(0, -1) : part, 10)
        if (isNaN(index)) {
          throw new Error(`Invalid range index: ${part}`)
        }
        return { index, hardened }
      })
      if (low.index >= high.index) {
        throw new Error(`Invalid range: ${component}`)
      }
      return new PathComponent({
        range: [low.index, high.index],
        hardened: high.hardened,
      })
    }
    if (component.startsWith('<') && component.endsWith('>')) {
      const [first, second] = component
        .slice(1, -1)
        .split(';')
        .map(part => {
          const hardened = part.endsWith("'") || part.endsWith('h')
          const index = parseInt(hardened ? part.slice(0, -1) : part, 10)
          if (isNaN(index)) {
            throw new Error(`Invalid pair index: ${part}`)
          }
          return { index, hardened }
        })
      return new PathComponent({ pair: [first, second], hardened: false })
    }
    const hardened = component.endsWith("'") || component.endsWith('h')
    const index = parseInt(hardened ? component.slice(0, -1) : component, 10)
    if (isNaN(index)) {
      throw new Error(`Invalid index: ${component}`)
    }
    return new PathComponent({ index, hardened })
  }
}
