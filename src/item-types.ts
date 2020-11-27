const ADDRESS = 'address'
const NUMBER = 'number'
const TEXT = 'text'
const BOOLEAN = 'boolean'
const GTCR_ADDRESS = 'GTCR address'
const IMAGE = 'image'
const FILE = 'file'
const LINK = 'link'
const TWITTER_USER_ID = 'Twitter User'

export default {
  ADDRESS,
  NUMBER,
  TEXT,
  BOOLEAN,
  GTCR_ADDRESS,
  IMAGE,
  FILE,
  LINK,
  TWITTER_USER_ID,
}

export const solidityTypes = {
  ADDRESS: 'address',
  INT256: 'int256',
  STRING: 'string',
  BOOL: 'bool',
}

export const typeToSolidity: { [typeToSolidity: string]: any } = {
  [ADDRESS]: solidityTypes.ADDRESS,
  [NUMBER]: solidityTypes.INT256,
  [TEXT]: solidityTypes.STRING,
  [BOOLEAN]: solidityTypes.BOOL,
  [GTCR_ADDRESS]: solidityTypes.ADDRESS,
  [IMAGE]: solidityTypes.STRING, // We only store a link to the file onchain.
  [FILE]: solidityTypes.STRING, // We only store a link to the file onchain.
  [LINK]: solidityTypes.STRING,
  [TWITTER_USER_ID]: solidityTypes.INT256,
}

export const typeDefaultValues = {
  [ADDRESS]: '',
  [TEXT]: '',
  [BOOLEAN]: false,
  [NUMBER]: 0,
  [GTCR_ADDRESS]: '',
  [IMAGE]: '',
  [FILE]: 'pdf doc mp3',
  [LINK]: '',
  [TWITTER_USER_ID]: 0,
}

export const searchableFields = [ADDRESS, GTCR_ADDRESS, TEXT]
