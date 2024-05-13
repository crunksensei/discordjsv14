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

function scheduleJob(cronTime:string, jobFunction:any) {
  return schedule.scheduleJob(cronTime, function() {
    try {
      jobFunction();
    } catch (error) {
      console.log(error);
    }
  });
}

// async function testing(){
//   try {
//   // GameEvents();
//   // randomQuote();
//   birthdayReminder();
//   // firstOfDaMonth();
//   // dailyIdeaBoard();
//   // fridayMemes();
//   // devMeetings();
//   } catch (error) {
//     console.log(error);
//   }
// }
// //OHHH MY GOODNESS Y SO DUMBBBOOO
// const testingjob = scheduleJob('*/10 * * * * *', testing);

// Define job functions
function jobFunctions() {
  GameEvents();
  randomQuote();
  birthdayReminder();
  firstOfDaMonth();
  dailyIdeaBoard();
}

function fridayMemesFunction() {
  fridayMemes();
}

function devMeetingsFunction() {
  devMeetings();
}

function dailyTrackerResetFunction() {
  dailyTrackerReset();
}

// Schedule jobs using the helper function
const job = scheduleJob('0 0 9 * * *', jobFunctions);
const jobFriday = scheduleJob('0 0 9 * * 5', fridayMemesFunction);
const jobDev = scheduleJob('0 0 9 * * 4', devMeetingsFunction);
const dailyResets = scheduleJob('0 0 0 * * *', dailyTrackerResetFunction);





client.on('messageCreate', async message => {
    if (message.author.bot) return;
    const channel = await client.channels.fetch(`${process.env.IDEACORECHANNEL}`)
    const channel2 = await client.channels.fetch(`${process.env.IDEAPROGRESSCHANNEL}`)
    const channel3 = await client.channels.fetch(`${process.env.IDEAMISCCHANNEL}`)
    if (!channel || !channel2 || !channel3 || !channel.isTextBased() || !channel2.isTextBased() || !channel3.isTextBased()) return;
    if (message.channelId === channel.id || message.channelId === channel2.id || message.channelId === channel3.id){
      ideaChecker(message.author.id, message.content)
    }
})


client.login(process.env.TOKEN)

export default client
