import dotenv from 'dotenv'
dotenv.config()

import fetch from 'node-fetch'

const TOKEN_ADDRESS = '0xf65e64f2a7a625fbd5635dca9487244bc1983a84'

const PANCAKESWAP_API_URL = `https://api.pancakeswap.info/api/v2/tokens/${TOKEN_ADDRESS}`

const LIVECOINWATCH_API_URL = 'https://api.livecoinwatch.com/coins/single'
const LIVECOINWATCH_HC_TICKER = 'HUMBLECOIN'
const { LIVECOINWATCH_API_KEY } = process.env

const BSC_CHAIN_ID = 56
const DEXGURU_API_URL = `https://api.dev.dex.guru/v1/chain/${BSC_CHAIN_ID}/tokens/${TOKEN_ADDRESS}/market`
const { DEXGURU_API_KEY } = process.env
const DEXGURU_API_ARGS = { headers: { 'api-key': DEXGURU_API_KEY } }

const DEFAULT_SOURCE = 'livecoinwatch'

function extractData (source, data) {
  const common = { source }
  if (source === 'pancakeswap') {
    return {
      ...common,
      price: data.data.price,
      last_update: data.updated_at
    }
  }

  if (source === 'livecoinwatch') {
    return {
      ...common,
      price: data.rate,
      volume: data.volume,
      cap: data.cap
    }
  }

  if (source === 'dexguru') {
    return {
      ...common,
      price: data.price_usd,
      last_update: data.timestamp
    }
  }
}

export async function getPriceData (source=DEFAULT_SOURCE) {
  let url = ''
  let args = {}

  if (source === 'livecoinwatch') {
    url = LIVECOINWATCH_API_URL
    args = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': LIVECOINWATCH_API_KEY
      },
      body: JSON.stringify({
        currency: 'USD',
        code: LIVECOINWATCH_HC_TICKER,
        meta: true
      })
    }
  }

  if (source === 'pancakeswap') {
    url = PANCAKESWAP_API_URL
  }

  if (source === 'dexguru') {
    url = DEXGURU_API_URL
    args = DEXGURU_API_ARGS
  }

  const res = await fetch(url, args)
  const data = await res.json()

  data.source = source
  console.log(data)
  return extractData(source, data)
}
