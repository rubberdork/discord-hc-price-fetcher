import dotenv from 'dotenv'
dotenv.config()

import { Client, Intents } from 'discord.js'

import { getPriceData } from './get-price-data.js'

;(async function () {
  const bot = new Client({ intents: [Intents.FLAGS.GUILDS] })

  bot.once('ready', (c) => {
    console.log(`Ready! Logged in as ${c.user.tag}`)
  })

  bot.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return

    const { commandName } = interaction

    if (commandName !== 'hc') return

    const priceData = await getPriceData()
    const price = parseFloat(priceData.price).toFixed(8)

    interaction.reply(
      `$${price}\n*data from ${priceData.source} (wen coingecko?)*`
    )
  })

  bot.login(process.env.DISCORD_TOKEN)

}())
