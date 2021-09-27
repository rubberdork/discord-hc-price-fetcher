import dotenv from 'dotenv'
dotenv.config()

import { SlashCommandBuilder } from '@discordjs/builders'
import { REST } from '@discordjs/rest'
import { Routes } from 'discord-api-types/v9'

const {
  DISCORD_CLIENT_ID,
  DISCORD_GUILD_ID,
  DISCORD_TOKEN
} = process.env

const commands = [new SlashCommandBuilder().setName('hc').setDescription('Fetch HumbleCoin price').toJSON()]
const rest = new REST({ version: '9' }).setToken(DISCORD_TOKEN)

;(async function () {
  try {
    await rest.put(
      Routes.applicationGuildCommands(DISCORD_CLIENT_ID, DISCORD_GUILD_ID),
      { body: commands }
    )
    console.log('Successfully added slash commands')
  } catch (err) {
    console.error(err)
  }
}())
