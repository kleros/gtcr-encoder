/* eslint-disable no-unused-expressions */

import BN from 'bn.js'
import { expect } from 'chai'
import {
  gtcrEncode,
  gtcrDecode,
  ItemTypes,
  MIN_SIGNED_INTEGER,
  MAX_SIGNED_INTEGER,
} from '../src/index'

describe('Encoding and Decoding', () => {
  it('handling of list of lists properly', () => {
    const columns = [
      {
        label: 'Address',
        type: 'GTCR address',
      },
    ]
    const inputValues = {
      Address: '0x1E9c3b5f57974beAdbd8C28Ba918d85b8477C618',
    }

    const encodedValues = gtcrEncode({ columns, values: inputValues })
    expect(encodedValues).to.deep.equal(
      '0xd5941e9c3b5f57974beadbd8c28ba918d85b8477c618',
    )

    const decoded = gtcrDecode({ columns, values: encodedValues })
    expect(decoded).to.deep.equal([
      '0x1E9c3b5f57974beAdbd8C28Ba918d85b8477C618',
    ])
  })

  it('handling multi column items', () => {
    const columns = [
      {
        label: 'Title',
        type: ItemTypes.TEXT,
      },
      {
        label: 'Subtitle',
        type: ItemTypes.TEXT,
      },
      {
        label: 'Author',
        type: ItemTypes.ADDRESS,
      },
      {
        label: 'ListAddr',
        type: ItemTypes.GTCR_ADDRESS,
      },
      {
        label: 'RichAddr',
        type: ItemTypes.RICH_ADDRESS,
      },
      {
        label: 'Link',
        type: ItemTypes.LINK,
      },
      {
        label: 'NegativeNumber',
        type: ItemTypes.NUMBER,
      },
      {
        label: 'PositiveNumber',
        type: ItemTypes.NUMBER,
      },
      {
        label: 'Boolean',
        type: ItemTypes.BOOLEAN,
      },
      {
        label: 'Twitter User Profile',
        type: ItemTypes.TWITTER_USER_ID,
      },
      {
        label: 'Description',
        type: ItemTypes.LONG_TEXT,
      },
    ]

    const inputValues = {
      Title: 'some title',
      Subtitle: '0xdeadbeef', // Checking that strings that look like hex work properly.
      Author: '0x79d0Ffb6109B45D539cC3E291088C11D34ffFFF9',
      ListAddr: '0x79d0Ffb6109B45D539cC3E291088C11D34ffFFF9',
      RichAddr: 'eth:0x79d0Ffb6109B45D539cC3E291088C11D34ffFFF9',
      Link: 'https://example.com',
      NegativeNumber: MAX_SIGNED_INTEGER.toString(),
      PositiveNumber: MIN_SIGNED_INTEGER.toString(),
      Boolean: true,
      'Twitter User Profile': new BN(65516516161).toString(),
      Description:
        'Repudiandae rerum nobis ut velit quia repellendus. Laudantium reiciendis qui voluptate. Sit officiis molestiae omnis rerum fugiat natus. Sunt totam magnam laboriosam. Et error et',
    }

    const encodedValues = gtcrEncode({ columns, values: inputValues })
    const decoded = gtcrDecode({ columns, values: encodedValues })
    expect(decoded).to.deep.equal([
      inputValues.Title,
      inputValues.Subtitle,
      inputValues.Author,
      inputValues.ListAddr,
      inputValues.RichAddr,
      inputValues.Link,
      inputValues.NegativeNumber,
      inputValues.PositiveNumber,
      inputValues.Boolean,
      inputValues['Twitter User Profile'],
      inputValues.Description,
    ])
  })

  it('handle decoding image column types', () => {
    // Note that image column types are really stored as text fields. We
    // Upload the file to some storage (usually ipfs) and store its link on-chain.
    const columns = [
      {
        label: 'Thumbnail',
        type: 'image',
      },
      {
        label: 'Title',
        type: 'text',
      },
      {
        label: 'Link',
        type: 'text',
      },
      {
        label: 'Author',
        type: 'text',
      },
    ]

    const inputValues = {
      Thumbnail:
        '/ipfs/QmbfE4m4esbQ8gSYi83ptpRZggENaHhCWYTr6796Y1iRrk/high-impact-logo-.png',
      Title: 'some title',
      Link:
        'http://localhost:3000/tcr/0x691C328745E4E090c80f4534f646684b418D1F6F',
      Author: '0xdeadbeef',
    }

    const encodedValues = gtcrEncode({ columns, values: inputValues })
    const decoded = gtcrDecode({ columns, values: encodedValues })
    expect(decoded).to.deep.equal([
      inputValues.Thumbnail,
      inputValues.Title,
      inputValues.Link,
      inputValues.Author,
    ])
  })
})
