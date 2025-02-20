import { registryItemFactory } from '@ngraveio/bc-ur'

interface IECKeyArgs {
  curve?: number
  isPrivate?: boolean
  data: Buffer | Uint8Array
}

export class ECKey extends registryItemFactory({
  tag: 40306,
  URType: 'eckey',
  keyMap: {
    curve: 1,
    isPrivate: 2,
    data: 3,
  },
  CDDL: `
    tagged-eckey = #6.40306(eckey)

    eckey = {
      ? curve: uint .default 0,
      ? is-private: bool .default false,
      data: bytes
    }

    curve = 1
    is-private = 2
    data = 3
  `,
}) {
  data: IECKeyArgs

  constructor(input: IECKeyArgs) {
    // Pass a data object
    super(input)
    this.data = input
  }

  public getCurve = () => this.data.curve || 0
  public getIsPrivate = () => this.data.isPrivate || false
  public getData = () => this.data.data

  override verifyInput(input: IECKeyArgs): { valid: boolean; reasons?: Error[] } {
    const errors: Error[] = []

    if (input.data == undefined || !(input.data instanceof Uint8Array)) {
      errors.push(new Error('data must be a Buffer or Uint8Array'))
    }
    if (input.curve !== undefined && typeof input.curve !== 'number') {
      errors.push(new Error('curve must be a number'))
    }
    if (input.isPrivate !== undefined && typeof input.isPrivate !== 'boolean') {
      errors.push(new Error('isPrivate must be a boolean'))
    }

    return {
      valid: errors.length === 0,
      reasons: errors.length > 0 ? errors : undefined,
    }
  }
}
