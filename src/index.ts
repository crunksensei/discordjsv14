import { Client, GatewayIntentBits, Collection, PermissionFlagsBits, Presence,} from "discord.js";
const { Guilds, MessageContent, GuildMessages, GuildMembers } = GatewayIntentBits
const client = new Client({intents:[Guilds, MessageContent, GuildMessages, GuildMembers]})
require("dotenv").config(); 
import { Command, SlashCommand } from "./types";
import { config, configDotenv } from "dotenv";
import { readdirSync } from "fs";
import { join } from "path";
import { GameEvents, randomQuote, birthdayReminder, fridayMemes, devMeetings, firstOfDaMonth } from "./functions";
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
    firstOfDaMonth()
  });

const jobFriday = schedule.scheduleJob('0 0 9 * * 5', function(){
  fridayMemes()
  });

const jobDev = schedule.scheduleJob('0 0 9 * * 4', function(){
  devMeetings()
})

client.login(process.env.TOKEN)

export default client
