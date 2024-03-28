import { Client, GatewayIntentBits, Collection, PermissionFlagsBits, Presence,} from "discord.js";
const { Guilds, MessageContent, GuildMessages, GuildMembers } = GatewayIntentBits
const client = new Client({intents:[Guilds, MessageContent, GuildMessages, GuildMembers]})
require("dotenv").config(); 
import { Command, SlashCommand } from "./types";
import { config, configDotenv } from "dotenv";
import { readdirSync } from "fs";
import { join } from "path";
import { GameEvents, randomQuote, birthdayReminder, fridayMemes, fridayMeetings } from "./functions";
const schedule = require('node-schedule');

config()
client.slashCommands = new Collection<string, SlashCommand>()
client.commands = new Collection<string, Command>()
client.cooldowns = new Collection<string, number>()

const handlersDir = join(__dirname, "./handlers")
readdirSync(handlersDir).forEach(handler => {
    if (!handler.endsWith(".js")) return;
    require(`${handlersDir}/${handler}`)(client)
})

const job = schedule.scheduleJob('0 0 9 * * *', function(){
    GameEvents()
    randomQuote()
    birthdayReminder()
  });

const jobFriday = schedule.scheduleJob('*/5 * * * * *', function(){
  fridayMemes()
  fridayMeetings()
  });

client.login(process.env.TOKEN)

export default client
