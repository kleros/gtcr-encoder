/* eslint-disable no-unused-expressions */

import { expect } from 'chai'
import { gtcrEncode, gtcrDecode } from '../src/index'

describe('decode', () => {
  it('encodes and decodes list of lists properly', () => {
    const columns = [{
      label: 'Address',
      type: 'GTCR address'
    }]
    const valuesToEncode = {
      Address: '0x1E9c3b5f57974beAdbd8C28Ba918d85b8477C618'
    }

    const encodedValues = gtcrEncode({ columns, values: valuesToEncode })
    expect(encodedValues).to.deep.equal('0xd5941e9c3b5f57974beadbd8c28ba918d85b8477c618')

    const decoded = gtcrDecode({ columns, values: encodedValues })
    expect(decoded).to.deep.equal([
      '0x1E9c3b5f57974beAdbd8C28Ba918d85b8477C618'
    ])
  })
})
