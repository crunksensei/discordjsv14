import { Client, GatewayIntentBits, Collection, PermissionFlagsBits, Presence,} from "discord.js";
const { Guilds, MessageContent, GuildMessages, GuildMembers } = GatewayIntentBits
const client = new Client({intents:[Guilds, MessageContent, GuildMessages, GuildMembers]})
require("dotenv").config(); 
import { Command, SlashCommand } from "./types";
import { config, configDotenv } from "dotenv";
import { readdirSync } from "fs";
import { join } from "path";
import { GameEvents, randomQuote, birthdayReminder, fridayMemes, devMeetings, firstOfDaMonth, ideaChecker, dailyIdeaBoard, dailyTrackerReset } from "./functions";
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
  try {
    GameEvents()
    randomQuote()
    birthdayReminder()
    firstOfDaMonth()
    dailyIdeaBoard()
  } catch (error) {
    console.log(error)
  }
    
  });

const jobFriday = schedule.scheduleJob('0 0 9 * * 5', function(){
  try {
    fridayMemes()
  } catch (error) {
    console.log(error)
  }
  
  });

const jobDev = schedule.scheduleJob('0 0 9 * * 4', function(){
  try {
    devMeetings()
  } catch (error) {
    console.log(error)
  }
  
})

const dailyResets = schedule.scheduleJob('0 0 0 * * *', function(){
  try {
    dailyTrackerReset()
  } catch (error) {
    console.log(error)
  }
})


client.on('messageCreate', async message => {
    if (message.author.bot) return;
    const channel = await client.channels.fetch(`${process.env.IDEACORECHANNEL}`)
    const channel2 = await client.channels.fetch(`${process.env.IDEAPROGRESSCHANNEL}`)
    const channel3 = await client.channels.fetch(`${process.env.IDEAMISCCHANNEL}`)
    if (!channel || !channel2 || !channel3) return;
    if (channel.isTextBased() || channel2.isTextBased() || channel3.isTextBased()){
      ideaChecker(message.author.id, message.content)
    }
})


client.login(process.env.TOKEN)

export default client
