import dotenv from 'dotenv'
dotenv.config()

import { Client, Intents, MessageEmbed, MessageAttachment } from 'discord.js'

import { getPriceData } from './get-price-data.js'

const humblecoinLogo =  new MessageAttachment('./assets/humblecoin.png')
const livecoinwatchLogo = new MessageAttachment('./assets/livecoinwatch.png')

const buyText = '[Buy on pancakeswap](https://pancakeswap.finance/swap?inputCurrency=ETHER&outputCurrency=0xf65e64f2a7a625fbd5635dca9487244bc1983a84)'
const livecoinwatchText = '[View on livecoinwatch.com](https://www.livecoinwatch.com/price/HC-HUMBLECOIN)'
const learnMoreText = '[Learn more at humblecoin.cc](https://humblecoin.cc)'

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
    const price = `$${parseFloat(priceData.price).toFixed(8)}`
    const volume = `$${parseFloat(priceData.volume).toFixed(2)}`
    const cap = priceData.cap === null ? '—' : `$${parseFloat(priceData.cap).toFixed(2)}`

    const msgEmbed = new MessageEmbed()
      .setColor('#0054ff')
      .setAuthor('HumbleCoin', 'attachment://humblecoin.png', 'https://humblecoin.cc')
      .addFields(
        { name: 'Price', value: `_${price}_`, inline: true },
        { name: 'Volume (24h)', value: `${volume}`, inline: true },
        { name: 'Market Cap', value: `${cap}`, inline: true },
      )
      .addField('•', `${buyText}\n${livecoinwatchText}\n${learnMoreText}`, false)
      .setTimestamp()
      .setFooter('Data from Live Coin Watch (wen coingecko?)', 'attachment://livecoinwatch.png')

    interaction.reply({
      embeds: [msgEmbed],
      files: [humblecoinLogo, livecoinwatchLogo]
    })

  })

  bot.login(process.env.DISCORD_TOKEN)

}())
