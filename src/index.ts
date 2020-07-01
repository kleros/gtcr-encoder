import BN from 'bn.js'
import * as RLP from 'rlp'
import { toUtf8String, getAddress } from 'ethers/utils'
import { solidityTypes, typeToSolidity } from './item-types'

interface Column {
  type: string;
  label: string;
}

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

const bufferToHex = (buf: Buffer) => {
  const bufferString = buf.toString('hex')

  if (bufferString.substring(0, 2) === '0x') return bufferString
  return `0x${bufferString}`
}

const MAX_SIGNED_INTEGER = new BN(1).iushln(255).sub(new BN(1)) //  int(~(uint(1) << 255))
const MIN_SIGNED_INTEGER = new BN(1).iushln(255).neg() // int(uint(1) << 255)

export const gtcrEncode = ({ columns, values }: { columns: Column[], [values: string]: any }) => {
  const itemArr = columns.map(col => {
    switch (typeToSolidity[col.type]) {
      case solidityTypes.STRING:
        return values[col.label] || ''
      case solidityTypes.INT256: {
        if (new BN(values[col.label]).gt(MAX_SIGNED_INTEGER)) { throw new Error('Number exceeds maximum supported signed integer.') }
        if (new BN(values[col.label]).lt(MIN_SIGNED_INTEGER)) {
          throw new Error(
            'Number smaller than minimum supported signed integer.'
          )
        }
        return new BN(values[col.label] || '0').toTwos(256) // Two's complement
      }
      case solidityTypes.ADDRESS:
        return new BN(
          values[col.label]
            ? values[col.label].slice(2)
            : ZERO_ADDRESS.slice(2),
          16
        )
      case solidityTypes.BOOL:
        return new BN(values[col.label] ? 1 : 0)
      default:
        throw new Error(`Unhandled item type ${col.type}`)
    }
  })

  return bufferToHex(RLP.encode(itemArr))
}

const padAddr = (rawAddr: string) => `${'0'.repeat(40 - rawAddr.length)}${rawAddr}`

// TODO: Add over/underflow checks for numbers greater or smaller than
// MAX_SIGNED_INTEGER and MIN_SINED_INTEGER and mark the item in the UI.
export const gtcrDecode = ({ columns, values }: { columns: Column[], values: any }) => {
  const item = RLP.decode(values) as any
  return columns.map((col, i) => {
    try {
      switch (typeToSolidity[col.type]) {
        case solidityTypes.STRING: {
          try {
            return toUtf8String(item[i])
          } catch (err) {
            // If the string was a hex value, the decoder fails.
            // return the raw hex.
            if (
              err.message ===
              'invalid utf8 byte sequence; unexpected continuation byte'
            ) { return `0x${item[i].toString('hex')}` } else throw err
          }
        }
        case solidityTypes.INT256:
          return new BN(item[i], 16).fromTwos(256).toString(10) // Two's complement
        case solidityTypes.ADDRESS: {
          // If addresses are small, we must left pad them with zeroes
          const rawAddr = item[i].toString('hex')
          return getAddress(`0x${padAddr(rawAddr)}`)
        }
        case solidityTypes.BOOL:
          return Boolean(new BN(item[i].toString('hex'), 16).toNumber())
        default:
          throw new Error(`Unhandled item type ${col.type}`)
      }
    } catch (err) {
      console.error(`Error decoding ${col.type}`, err)
      return `Error decoding ${col.type}`
    }
  })
}
