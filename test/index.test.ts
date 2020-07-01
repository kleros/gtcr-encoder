/* eslint-disable no-unused-expressions */

import { expect } from 'chai'
import { gtcrEncode, gtcrDecode } from '../src/index'

describe('decode', () => {
  it('handling of list of lists properly', () => {
    const columns = [{
      label: 'Address',
      type: 'GTCR address'
    }]
    const inputValues = {
      Address: '0x1E9c3b5f57974beAdbd8C28Ba918d85b8477C618'
    }

    const encodedValues = gtcrEncode({ columns, values: inputValues })
    expect(encodedValues).to.deep.equal('0xd5941e9c3b5f57974beadbd8c28ba918d85b8477c618')

    const decoded = gtcrDecode({ columns, values: encodedValues })
    expect(decoded).to.deep.equal([
      '0x1E9c3b5f57974beAdbd8C28Ba918d85b8477C618'
    ])
  })

  it('handling multi column items', () => {
    const columns = [
      {
        label: 'Title',
        type: 'text'
      },
      {
        label: 'Author',
        type: 'text'
      },
      {
        label: 'Link',
        type: 'link'
      }
    ]

    const inputValues = {
      Title: 'Обзор платформы Kleros – справедливое решение споров',
      Author: 'pushkaroman',
      Link: 'https://steemit.com/blockchain/@pushkaroman/obzor-platformy-kleros-spravedlivoe-reshenie-sporov'
    }

    const encodedValues = gtcrEncode({ columns, values: inputValues })
    const expectedEncodedValues = '0xf8ccb85dd09ed0b1d0b7d0bed18020d0bfd0bbd0b0d182d184d0bed180d0bcd18b204b6c65726f7320e2809320d181d0bfd180d0b0d0b2d0b5d0b4d0bbd0b8d0b2d0bed0b520d180d0b5d188d0b5d0bdd0b8d0b520d181d0bfd0bed180d0bed0b28b707573686b61726f6d616eb85f68747470733a2f2f737465656d69742e636f6d2f626c6f636b636861696e2f40707573686b61726f6d616e2f6f627a6f722d706c6174666f726d792d6b6c65726f732d737072617665646c69766f652d72657368656e69652d73706f726f76'

    expect(encodedValues).to.deep.equal(expectedEncodedValues)

    const expected = [
      'Обзор платформы Kleros – справедливое решение споров',
      'pushkaroman',
      'https://steemit.com/blockchain/@pushkaroman/obzor-platformy-kleros-spravedlivoe-reshenie-sporov'
    ]

    const decoded = gtcrDecode({ columns, values: encodedValues })
    expect(decoded).to.deep.equal(expected)
  })

  it('handle decoding image column types', () => {
    // Note that image column types are really stored as text fields. We
    // Upload the file to some storage (usually ipfs) and store its link on-chain.
    const columns = [
      {
        label: 'Thumbnail',
        type: 'image'
      },
      {
        label: 'Title',
        type: 'text'
      },
      {
        label: 'Link',
        type: 'text'
      },
      {
        label: 'Author',
        type: 'text'
      }
    ]

    const inputValues = {
      Thumbnail: '/ipfs/QmbfE4m4esbQ8gSYi83ptpRZggENaHhCWYTr6796Y1iRrk/high-impact-logo-.png',
      Title: 'asd',
      Link: 'http://localhost:3000/tcr/0x691C328745E4E090c80f4534f646684b418D1F6F',
      Author: '0xdeadbeef'
    }

    const encodedValues = gtcrEncode({ columns, values: inputValues })
    const expectedEncodedValues = '0xf89bb84a2f697066732f516d626645346d346573625138675359693833707470525a6767454e61486843575954723637393659316952726b2f686967682d696d706163742d6c6f676f2d2e706e6783617364b844687474703a2f2f6c6f63616c686f73743a333030302f7463722f30783639314333323837343545344530393063383066343533346636343636383462343138443146364684deadbeef'

    expect(encodedValues).to.deep.equal(expectedEncodedValues)

    const expected = [
      '/ipfs/QmbfE4m4esbQ8gSYi83ptpRZggENaHhCWYTr6796Y1iRrk/high-impact-logo-.png',
      'asd',
      'http://localhost:3000/tcr/0x691C328745E4E090c80f4534f646684b418D1F6F',
      '0xdeadbeef'
    ]

    const decoded = gtcrDecode({ columns, values: encodedValues })
    expect(decoded).to.deep.equal(expected)
  })
})
