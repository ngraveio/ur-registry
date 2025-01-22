import { PathComponent } from '../src/classes/PathComponent'

describe('PathComponent', () => {
  it('should create an index-based component', () => {
    const component = new PathComponent({ index: 44, hardened: true })
    expect(component.getIndex()).toBe(44)
    expect(component.isHardened()).toBe(true)
    expect(component.isIndexComponent()).toBe(true)
  })

  it('should create a range-based component', () => {
    const component = new PathComponent({ range: [1, 6], hardened: true })
    expect(component.getRange()).toEqual([1, 6])
    expect(component.isHardened()).toBe(true)
    expect(component.isRangeComponent()).toBe(true)
  })

  it('should create a wildcard-based component', () => {
    const component = new PathComponent({ wildcard: true, hardened: true })
    expect(component.isWildcard()).toBe(true)
    expect(component.isHardened()).toBe(true)
    expect(component.isWildcardComponent()).toBe(true)
  })

  it('should create a pair-based component', () => {
    const component = new PathComponent({
      pair: [
        { index: 0, hardened: true },
        { index: 1, hardened: false },
      ],
    })
    expect(component.getPair()).toEqual([
      { index: 0, hardened: true },
      { index: 1, hardened: false },
    ])
    expect(component.isPairComponent()).toBe(true)
  })

  it('should convert to and from string', () => {
    const component = PathComponent.fromString("44'")
    expect(component.toString()).toBe("44'")
  })

  it('should convert to and from CBOR data', () => {
    const component = new PathComponent({ index: 44, hardened: true })
    const cborData = component.toCBORData()
    const parsedComponent = PathComponent.fromCBORData(cborData)
    expect(parsedComponent.getIndex()).toBe(44)
    expect(parsedComponent.isHardened()).toBe(true)
  })

  it('should throw error for invalid index', () => {
    expect(() => new PathComponent({ index: 0x80000001 })).toThrow()
  })

  it('should throw error for invalid range', () => {
    expect(() => new PathComponent({ range: [6, 1] })).toThrow()
  })

  it('should throw error for invalid pair', () => {
    expect(
      () =>
        new PathComponent({
          pair: [
            { index: 0, hardened: true },
            { index: 1, hardened: true },
          ],
        })
    ).toThrow()
  })

  it('should convert index-based component to and from string', () => {
    const component = PathComponent.fromString("44'")
    expect(component.toString()).toBe("44'")
  })

  it('should convert range-based component to and from string', () => {
    const component = PathComponent.fromString('1h-6h')
    expect(component.toString()).toBe('1h-6h')
  })

  it('should convert wildcard-based component to and from string', () => {
    const component = PathComponent.fromString('*h')
    expect(component.toString()).toBe('*h')
  })

  it('should convert pair-based component to and from string', () => {
    const component = PathComponent.fromString('<0h;1>')
    expect(component.toString()).toBe('<0h;1>')
  })

  it('should convert index-based component to and from CBOR data', () => {
    const component = new PathComponent({ index: 44, hardened: true })
    const cborData = component.toCBORData()
    const parsedComponent = PathComponent.fromCBORData(cborData)
    expect(parsedComponent.getIndex()).toBe(44)
    expect(parsedComponent.isHardened()).toBe(true)
  })

  it('should convert range-based component to and from CBOR data', () => {
    const component = new PathComponent({ range: [1, 6], hardened: true })
    const cborData = component.toCBORData()
    const parsedComponent = PathComponent.fromCBORData(cborData)
    expect(parsedComponent.getRange()).toEqual([1, 6])
    expect(parsedComponent.isHardened()).toBe(true)
  })

  it('should convert wildcard-based component to and from CBOR data', () => {
    const component = new PathComponent({ wildcard: true, hardened: true })
    const cborData = component.toCBORData()
    const parsedComponent = PathComponent.fromCBORData(cborData)
    expect(parsedComponent.isWildcard()).toBe(true)
    expect(parsedComponent.isHardened()).toBe(true)
  })

  it('should convert pair-based component to and from CBOR data', () => {
    const component = new PathComponent({
      pair: [
        { index: 0, hardened: true },
        { index: 1, hardened: false },
      ],
    })
    const cborData = component.toCBORData()
    const parsedComponent = PathComponent.fromCBORData(cborData)
    expect(parsedComponent.getPair()).toEqual([
      { index: 0, hardened: true },
      { index: 1, hardened: false },
    ])
  })

  it('should convert mixed components to and from CBOR data', () => {
    const components = [
      new PathComponent({ index: 44, hardened: true }),
      new PathComponent({ range: [1, 6], hardened: true }),
      new PathComponent({ wildcard: true, hardened: true }),
      new PathComponent({
        pair: [
          { index: 0, hardened: true },
          { index: 1, hardened: false },
        ],
      }),
    ]
    const cborData = components.map(component => component.toCBORData())
    const parsedComponents = cborData.map(data => PathComponent.fromCBORData(data))
    expect(parsedComponents[0].getIndex()).toBe(44)
    expect(parsedComponents[0].isHardened()).toBe(true)
    expect(parsedComponents[1].getRange()).toEqual([1, 6])
    expect(parsedComponents[1].isHardened()).toBe(true)
    expect(parsedComponents[2].isWildcard()).toBe(true)
    expect(parsedComponents[2].isHardened()).toBe(true)
    expect(parsedComponents[3].getPair()).toEqual([
      { index: 0, hardened: true },
      { index: 1, hardened: false },
    ])
  })
})
