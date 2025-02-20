import { base58, base16, bech32, bech32m } from '@scure/base'
import { sha256 } from '@noble/hashes/sha256'
import { keccak_256 } from '@noble/hashes/sha3'


/**
 * Bitcoin Address Types Table
 *
 * | Address Type                              | Starts With         | Version Byte (Mainnet)       | Version Byte (Testnet)       | Encoding Type | Prefix Application                                                                 | Mainnet Example                                                      | Testnet Example                                                |
 * |-------------------------------------------|---------------------|------------------------------|------------------------------|---------------|------------------------------------------------------------------------------------|----------------------------------------------------------------------|----------------------------------------------------------------|
 * | Pay-to-Public-Key (P2PK)                  | No address format   | N/A                          | N/A                          | Script-based  | No address prefix; directly uses public key in scripts.                            | No specific address; script usage only.                              | No specific address; script usage only.                        |
 * | Pay-to-Public-Key-Hash (P2PKH)            | 1                   | 0x00                         | 0x6F                         | Base58Check   | Add the version byte (0x00 or 0x6F) before the hashed public key and checksum.     | 18uWvCS2hqV6D5ehQtDJxrftrePAXGeevS                                   | ms5e572mZ1eDKdeyfR6MpRqXHVv6kM6wAP                             |
 * | Pay-to-Script-Hash (P2SH)                 | 3                   | 0x05                         | 0xC4                         | Base58Check   | Add the version byte (0x05 or 0xC4) before the script hash and checksum.           | 3FymWfwDaGzsRWesK47nxFWPDiDmkC8GkR                                   | 2MvJq3ieuKUiwvQP1WVQdfb5WB5fMStTkhH                            |
 * | Pay-to-Witness-Public-Key-Hash (P2WPKH)   | bc1q                | Witness Version 0 (0x00)     | Witness Version 0 (0x00)     | Bech32        | Add the human-readable prefix (bc or tb) and encode the data with Bech32.          | bc1q26mhhmkkddq9zd66fec6tac2lp07c7uuaurgtr                           | tb1q0mt7t7sjn777f4mgpk7u67a82aykkw3kq4kaad                     |
 * | Pay-to-Witness-Script-Hash (P2WSH)        | bc1q                | Witness Version 0 (0x00)     | Witness Version 0 (0x00)     | Bech32        | Add the human-readable prefix (bc or tb) and encode the data with Bech32.          | bc1q6axwlnwlky7jykqqwlrcjy2s6ragcwaesal0nfpv5pnwdmgu72es5kywz8       | tb1qwjnw4rf07n8wyerlnplyeecpfkw5q2puqn0vux04kqpdu689qx0qx6uqvj |
 * | Pay-to-Taproot (P2TR)                     | bc1p                | Witness Version 1 (0x01)     | Witness Version 1 (0x01)     | Bech32m       | Add the human-readable prefix (bc or tb) and encode the data with Bech32m.         | bc1p9cjtuu7rlytzgeuwtdy4fuflmpp00tmpwchr7xjdexs5la94frkqpmcs8f       | tb1p34jjsay897lryzkc0fkxk9wruhvct6vnmknxxaxy75rxnpakqlqs56v2lh |
 * | Pay-to-Multisig (P2MS)                    | No address format   | N/A                          | N/A                          | Script-based  | No address prefix; directly uses multisignature script.                            | No specific address; script usage only.                              | No specific address; script usage only.                        |
 */

interface DecodedAddress {
  // TODO: extend coin support
  type: 0 | 60 // BIP44 coin type integers for Bitcoin and Ethereum
  scriptType?: string
  network?: 'mainnet' | 'testnet'
  payload: Uint8Array
  checksum?: number
}

/**
 * Decode a Bitcoin or Ethereum address into its components.
 * @param address - The address to decode.
 * @param network - Optional network for Ethereum (default: 'mainnet').
 * @returns The decoded address components.
 */
export function decodeAddress(address: string, network?: 'mainnet' | 'testnet'): DecodedAddress {
  if (address.startsWith('1') || address.startsWith('3') || address.startsWith('m') || address.startsWith('2')) {
    // Bitcoin P2PKH or P2SH (Base58Check)
    const decoded = base58.decode(address)
    const version = decoded[0]
    const payload = decoded.slice(1, -4)
    const checksum = decoded.slice(-4)
    const calculatedChecksum = sha256(sha256(decoded.slice(0, -4))).slice(0, 4)

    if (!equalBytes(checksum, calculatedChecksum)) {
      throw new Error('Invalid checksum')
    }

    let scriptType: string
    let addressNetwork: 'mainnet' | 'testnet'

    switch (version) {
      case 0x00:
        scriptType = 'P2PKH'
        addressNetwork = 'mainnet'
        break
      case 0x6F:
        scriptType = 'P2PKH'
        addressNetwork = 'testnet'
        break
      case 0x05:
        scriptType = 'P2SH'
        addressNetwork = 'mainnet'
        break
      case 0xC4:
        scriptType = 'P2SH'
        addressNetwork = 'testnet'
        break
      default:
        throw new Error('Unknown version byte')
    }

    if (network !== undefined && network !== addressNetwork) {
      throw new Error(`Address network mismatch: expected ${network}, got ${addressNetwork}`)
    }

    return {
      type: 0, // BIP44 coin type for Bitcoin
      scriptType,
      network: addressNetwork,
      payload,
      checksum: toUInt32BE(checksum),
    }
  } else if (/^(bc1|tb1)[a-z0-9]{25,}$/i.test(address)) {
    // Bitcoin P2WPKH, P2WSH, or P2TR (Bech32 or Bech32m)
    const isBech32m = address.startsWith('bc1p') || address.startsWith('tb1p')
    const { prefix, words } = isBech32m ? bech32m.decode(address as `${string}1${string}`) : bech32.decode(address as `${string}1${string}`)
    const version = words[0]
    const payload = (isBech32m ? bech32m : bech32).fromWords(words.slice(1))

    let scriptType: string
    let addressNetwork: 'mainnet' | 'testnet'

    switch (prefix) {
      case 'bc':
        addressNetwork = 'mainnet'
        break
      case 'tb':
        addressNetwork = 'testnet'
        break
      default:
        throw new Error('Unknown HRP')
    }

    switch (payload.length) {
      case 20:
        scriptType = 'P2WPKH'
        break
      case 32:
        scriptType = version === 0x01 ? 'P2TR' : 'P2WSH'
        break
      default:
        throw new Error('Unknown witness program length')
    }

    if (network !== undefined && network !== addressNetwork) {
      throw new Error(`Address network mismatch: expected ${network}, got ${addressNetwork}`)
    }

    return {
      type: 0, // BIP44 coin type for Bitcoin
      scriptType,
      network: addressNetwork,
      payload: new Uint8Array(payload),
    }
  } else if (/^0x[a-fA-F0-9]{40}$/.test(address)) {
    // Ethereum address (Hex)
    const payload = address.slice(2).toLowerCase()
    const payloadBuffer = new Uint8Array(payload.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)))
    const checksummedAddress = toChecksumAddress(address)

    return {
      type: 60, // BIP44 coin type for Ethereum
      network,
      payload: payloadBuffer,
      checksum: calculateEthereumChecksum(checksummedAddress),
    }
  } else {
    throw new Error(`Unsupported address format ${address}`)
  }
}

/**
 * Encode a Bitcoin or Ethereum address from its components.
 * @param type - The BIP44 coin type.
 * @param scriptType - The script type for Bitcoin addresses.
 * @param network - The network type (mainnet or testnet).
 * @param payload - The payload to encode.
 * @returns The encoded address.
 */
export function encodeAddress(type: number, scriptType: string | undefined, network: 'mainnet' | 'testnet', payload: Uint8Array): string {
  if (type === 0) {
    // Bitcoin address encoding
    let version: number
    switch (scriptType) {
      case 'P2PKH':
        version = network === 'mainnet' ? 0x00 : 0x6F
        break
      case 'P2SH':
        version = network === 'mainnet' ? 0x05 : 0xC4
        break
      case 'P2WPKH':
      case 'P2WSH':
      case 'P2TR': {
        const prefix = network === 'mainnet' ? 'bc' : 'tb'
        const words = (scriptType === 'P2TR' ? bech32m : bech32).toWords(payload)
        words.unshift(scriptType === 'P2TR' ? 0x01 : 0x00)
        return (scriptType === 'P2TR' ? bech32m : bech32).encode(prefix, words)
      }
      default:
        throw new Error('Unknown script type')
    }
    const checksum = sha256(sha256(new Uint8Array([version, ...payload]))).slice(0, 4)
    return base58.encode(new Uint8Array([version, ...payload, ...checksum]))
  } else if (type === 60) {
    // Ethereum address encoding
    return toChecksumAddress(`0x${base16.encode(payload)}`)
  } else {
    throw new Error(`Unsupported coin type: ${type}`)
  }
}

/**
 * Helper functions remain unchanged
 */
function calculateEthereumChecksum(address: string): number {
  const addressHash = keccak_256(address.slice(2).toLowerCase())
  return parseInt(base16.encode(addressHash.slice(0, 4)), 16)
}

function toChecksumAddress(address: string): string {
  const addressHash = base16.encode(keccak_256(address.slice(2).toLowerCase()))
  let checksumAddress = '0x'

  for (let i = 0; i < 40; i++) {
    checksumAddress += parseInt(addressHash[i], 16) > 7 ? address[i + 2].toUpperCase() : address[i + 2].toLowerCase()
  }

  return checksumAddress
}

function equalBytes(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false
  }
  return true
}

function toUInt32BE(bytes: Uint8Array): number {
  if (bytes.length !== 4) {
    throw new Error('Invalid byte length for UInt32BE conversion.')
  }
  return ((bytes[0] << 24) | (bytes[1] << 16) | (bytes[2] << 8) | bytes[3]) >>> 0
}
