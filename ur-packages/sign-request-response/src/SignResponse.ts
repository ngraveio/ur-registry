import { registryItemFactory } from '@ngraveio/bc-ur'
import { Buffer } from 'buffer/'

interface SignResponseInput {
  requestId?: Buffer
  signature: Buffer
  origin?: string
}

export class SignResponse extends registryItemFactory({
  tag: 41412,
  URType: 'sign-response',
  allowKeysNotInMap: true,
  keyMap: {
    requestId: 1,
    signature: 2,
    origin: 3,
  },
  CDDL: `
    sign-response = {
      ?request-id: uuid,     ; Identifier of the signing request 
      signature: bytes,      ; Signature result
      ?origin: text,         ; The device info providing this signature
    }

    ; request-id must be present in case of response to a sign-request where 
    ; the request-id is specified

    request-id = 1
    signature = 2
    origin = 3
  `
}) {
  data: SignResponseInput

  constructor(data: SignResponseInput) {
    super()
    this.data = data
  }

  public getRequestId = () => this.data.requestId
  public getSignature = () => this.data.signature
  public getOrigin = () => this.data.origin

  override verifyInput(input: any): { valid: boolean; reasons?: Error[] } {
    const reasons = []

    // If request id is present it must be a buffer
    if (input.requestId !== undefined && !Buffer.isBuffer(input.requestId)) {
      reasons.push(new Error('Request id must be a buffer'))
    }

    // Signature must be present and must be a buffer
    if (input.signature === undefined || !Buffer.isBuffer(input.signature)) {
      reasons.push(new Error('Signature must be a buffer'))
    }

    // Origin must be a string if present
    if (input.origin !== undefined && typeof input.origin !== 'string') {
      reasons.push(new Error('Origin must be a string'))
    }

    return {
      valid: reasons.length === 0,
      reasons: reasons.length > 0 ? reasons : undefined,
    }
  }
}