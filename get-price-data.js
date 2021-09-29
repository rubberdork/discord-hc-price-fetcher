import dotenv from 'dotenv'
dotenv.config()

import fetch from 'node-fetch'

const TOKEN_ADDRESS = '0xf65e64f2a7a625fbd5635dca9487244bc1983a84'

const PANCAKESWAP_API_URL = `https://api.pancakeswap.info/api/v2/tokens/${TOKEN_ADDRESS}`

const BSC_CHAIN_ID = 56
const DEXGURU_API_URL = `https://api.dev.dex.guru/v1/chain/${BSC_CHAIN_ID}/tokens/${TOKEN_ADDRESS}/market`
const { DEXGURU_API_KEY } = process.env
const DEXGURU_API_ARGS = { headers: { 'api-key': DEXGURU_API_KEY } }

const DEFAULT_SOURCE = 'pancakeswap'
const DEFAULT_API_URL = PANCAKESWAP_API_URL

function extractData (source, data) {
  if (source === 'pancakeswap') {
    return {
      price: data.data.price,
      last_update: data.updated_at
    }
  }

  if (source === 'dexguru') {
    return {
      price: data.price_usd
    }
  }
}

export async function getPriceData (source=DEFAULT_SOURCE) {
  let url = DEFAULT_API_URL
  let args = {}
  if (source === 'dexguru') {
    url = DEXGURU_API_URL
    args = DEXGURU_API_ARGS
  }

  const res = await fetch(url, args)
  const data = await res.json()

  return extractData(source, data)
}
