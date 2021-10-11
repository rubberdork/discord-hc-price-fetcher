import dotenv from 'dotenv'
dotenv.config()

import { Client, Intents, MessageEmbed, MessageAttachment } from 'discord.js'

import { getPriceData } from './get-price-data.js'

const humblecoinLogo =  new MessageAttachment('./assets/humblecoin.png')

const buyText = '[Buy on pancakeswap](https://pancakeswap.finance/swap?inputCurrency=ETHER&outputCurrency=0xf65e64f2a7a625fbd5635dca9487244bc1983a84)'
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
    const volume = priceData.volume === null || priceData.volume === 0 ? '—' : `$${parseFloat(priceData.volume).toFixed(2)}`
    const cap = priceData.cap === null || priceData.cap === 0 ? '—' : `$${parseFloat(priceData.cap).toFixed(2)}`

    const sourceLogo = new MessageAttachment(`./assets/${priceData.logo_file}`)
    const chartText = `[${priceData.chart_text}](${priceData.chart_link})`

    const msgEmbed = new MessageEmbed()
      .setColor('#0054ff')
      .setAuthor('HumbleCoin', 'attachment://humblecoin.png', 'https://humblecoin.cc')
      .addFields(
        { name: 'Price', value: `_${price}_`, inline: true },
        { name: 'Volume (24h)', value: `${volume}`, inline: true },
        { name: 'Market Cap', value: `${cap}`, inline: true },
      )
      .addField('•', `${buyText}\n${chartText}\n${learnMoreText}`, false)
      .setTimestamp()
      .setFooter(`Data from ${priceData.title} (wen coingecko?)`, `attachment://${priceData.logo_file}`)

    interaction.reply({
      embeds: [msgEmbed],
      files: [humblecoinLogo, sourceLogo]
    })

  })

  bot.login(process.env.DISCORD_TOKEN)

}())
