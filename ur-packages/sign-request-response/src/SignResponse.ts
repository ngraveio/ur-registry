import { registryItemFactory, UrRegistry } from '@ngraveio/bc-ur'
import { UUID } from '@ngraveio/bc-ur-registry-uuid'
import { Buffer } from 'buffer/'
// Define Node.js Buffer type without importing `node:buffer`
type NodeBuffer = typeof globalThis extends { Buffer: infer T } ? T : never;
type CompatibleBuffer = Buffer | InstanceType<NodeBuffer>

export interface SignResponseInput {
  requestId?: UUID | string | Uint8Array // Accept UUID, string, or Uint8Array
  signature: CompatibleBuffer | Uint8Array
  origin?: string
}

export interface SignResponseData {
  requestId?: UUID // Changed to UUID
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
  `,
}) {
  data: SignResponseData

  constructor(data: SignResponseInput) {
    super(data)
    //@ts-ignore
    this.data = data

    // Convert requestId to UUID if it is not already an instance of UUID
    if (data.requestId !== undefined) {
      if (typeof data.requestId === 'string' || data.requestId instanceof Uint8Array) {
        this.data.requestId = new UUID(data.requestId)
      } else if (!(data.requestId instanceof UUID)) {
        throw new Error('Invalid requestId. Expected a UUID, string, or Uint8Array.')
      }
    }

    // Convert signature to Buffer
    if (!(data.signature instanceof Buffer)) {
      this.data.signature = Buffer.from(data.signature)
    }
  }

  public getRequestId = () => this.data.requestId
  public getSignature = () => this.data.signature
  public getOrigin = () => this.data.origin

  override verifyInput(input: any): { valid: boolean; reasons?: Error[] } {
    const reasons = []

    if (!input) {
      reasons.push(new Error('Input is undefined'))
      return { valid: false, reasons }
    }

    // If request id is present it must be a valid UUID
    if (input.requestId !== undefined) {
      if (!(input.requestId instanceof UUID)) {
        try {
          new UUID(input.requestId)
        } catch (error) {
          reasons.push(new Error('Invalid requestId: ' + (error as Error).message))
        }
      }
    }

    // Signature must be present and must be a buffer
    if (input.signature === undefined || !(input.signature instanceof Uint8Array)) {
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