import BN from 'bn.js'
import * as RLP from 'rlp'
import { toUtf8Bytes, toUtf8String, getAddress } from 'ethers/lib/utils'
import { solidityTypes, typeToSolidity } from './item-types'

interface Column {
  type: string
  label: string
}

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

const bufferToHex = (buf: Buffer) => {
  const bufferString = buf.toString('hex')

  if (bufferString.substring(0, 2) === '0x') return bufferString
  return `0x${bufferString}`
}

export const MAX_SIGNED_INTEGER = new BN(1).iushln(255).sub(new BN(1)) //  int(~(uint(1) << 255))
export const MIN_SIGNED_INTEGER = new BN(1).iushln(255).neg() // int(uint(1) << 255)

export const gtcrEncode = ({
  columns,
  values,
}: {
  columns: Column[]
  [values: string]: any
}): string => {
  const itemArr = columns.map((col) => {
    switch (typeToSolidity[col.type]) {
      case solidityTypes.STRING:
        return toUtf8Bytes((values[col.label] as string) || '')
      case solidityTypes.INT256: {
        if (new BN(values[col.label]).gt(MAX_SIGNED_INTEGER)) {
          throw new Error('Number exceeds maximum supported signed integer.')
        }
        if (new BN(values[col.label]).lt(MIN_SIGNED_INTEGER)) {
          throw new Error(
            'Number smaller than minimum supported signed integer.',
          )
        }
        return new BN(values[col.label] || '0').toTwos(256) // Two's complement
      }
      case solidityTypes.ADDRESS:
        return new BN(
          values[col.label]
            ? values[col.label].slice(2)
            : ZERO_ADDRESS.slice(2),
          16,
        )
      case solidityTypes.BOOL:
        return new BN(values[col.label] ? 1 : 0)
      default:
        throw new Error(`Unhandled item type ${col.type}`)
    }
  })

  return bufferToHex(RLP.encode(itemArr))
}

const padAddr = (rawAddr: string) =>
  `${'0'.repeat(40 - rawAddr.length)}${rawAddr}`

export const gtcrDecode = ({
  columns,
  values,
}: {
  columns: Column[]
  values: any
}): (string | boolean | BN)[] => {
  const item = RLP.decode(values) as any
  return columns.map((col, i) => {
    try {
      switch (typeToSolidity[col.type]) {
        case solidityTypes.STRING: {
          return toUtf8String(item[i])
        }
        case solidityTypes.INT256:
          return String(new BN(item[i], 16).fromTwos(256)) // Two's complement
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
