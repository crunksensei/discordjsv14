import chalk from "chalk";
import {
  Guild,
  GuildMember,
  PermissionFlagsBits,
  PermissionResolvable,
  PermissionsBitField,
  TextChannel,
  EmbedBuilder,
  AttachmentBuilder,
} from "discord.js";
import GuildDB from "./schemas/Guild";
import { GuildOption } from "./types";
import mongoose from "mongoose";
import client from "./index";
import { fridayQuotes } from "./textQuotes/fridayQuotes";
import { time, timeStamp } from "console";
require("dotenv").config();
const quote = require("./schemas/quote");
const birthday = require("./schemas/birthdays");
const game = require("./schemas/game_events");
const idea = require("./schemas/ideas");
const tracker = require("./schemas/dailyIdeaTracker");
const productionChannel = `${process.env.famDiscord}`;
const testChannel = `${process.env.test_Channel}`;
const gameStudioGuild = `${process.env.gameStudio}`;
const fs = require("fs");

const activeChannel = gameStudioGuild;

type colorType = "text" | "variable" | "error";

const themeColors = {
  text: "#ff8e4d",
  variable: "#ff624d",
  error: "#f5426c",
};

export const getThemeColor = (color: colorType) =>
  Number(`0x${themeColors[color].substring(1)}`);

export const color = (color: colorType, message: any) => {
  return chalk.hex(themeColors[color])(message);
};

export const checkPermissions = (
  member: GuildMember,
  permissions: Array<PermissionResolvable>
) => {
  let neededPermissions: PermissionResolvable[] = [];
  permissions.forEach((permission) => {
    if (!member.permissions.has(permission)) neededPermissions.push(permission);
  });
  if (neededPermissions.length === 0) return null;
  return neededPermissions.map((p) => {
    if (typeof p === "string") return p.split(/(?=[A-Z])/).join(" ");
    else
      return Object.keys(PermissionFlagsBits)
        .find((k) => Object(PermissionFlagsBits)[k] === p)
        ?.split(/(?=[A-Z])/)
        .join(" ");
  });
};

export const sendTimedMessage = (
  message: string,
  channel: TextChannel,
  duration: number
) => {
  channel
    .send(message)
    .then((m) =>
      setTimeout(
        async () => (await channel.messages.fetch(m)).delete(),
        duration
      )
    );
  return;
};

export const getGuildOption = async (guild: Guild, option: GuildOption) => {
  if (mongoose.connection.readyState === 0)
    throw new Error("Database not connected.");
  let foundGuild = await GuildDB.findOne({ guildID: guild.id });
  if (!foundGuild) return null;
  return foundGuild.options[option];
};

export const setGuildOption = async (
  guild: Guild,
  option: GuildOption,
  value: any
) => {
  if (mongoose.connection.readyState === 0)
    throw new Error("Database not connected.");
  let foundGuild = await GuildDB.findOne({ guildID: guild.id });
  if (!foundGuild) return null;
  foundGuild.options[option] = value;
  foundGuild.save();
};

export async function GameEvents() {
  const channel = await client.channels.fetch(`${activeChannel}`);
  const today = new Date();
  let year = today.getFullYear();
  let month = today.getMonth();
  const firstDayNextMonth = new Date(year, month + 1, 1);
  const daysUntilFirstDayNextMonth = Math.round(
    (Number(firstDayNextMonth) - Number(today)) / (1000 * 60 * 60 * 24)
  );

  try {
    if (!channel) {
      console.log("Channel not found");
      return;
    }
    if (channel.isTextBased()) {
      if (daysUntilFirstDayNextMonth == 5) {
        await channel.send("Genshin Impact: 5 days left for the Spiral Abyss");
      } else if (daysUntilFirstDayNextMonth == 3) {
        await channel.send("Genshin Impact: 3 days left for the Spiral Abyss");
      } else if (daysUntilFirstDayNextMonth == 1) {
        await channel.send("Genshin Impact: Spiral Abyss reset tomorrow!");
      } else if (today.getDate() == 1) {
        await channel.send("Genshin Impact: Spiral Abyss reset today!");
      }
      return;
    }
  } catch (error) {
    console.error("Error sending message:", error);
    return "Failed to fetch the quote. Please try again later.";
  }
}

export async function randomQuote() {
  const channel = await client.channels.fetch(`${activeChannel}`);
  const api_url = "https://zenquotes.io/api/today/";
  const Day = new Date();
  const notFriday = Day.getDay();
  try {
    if (!channel) {
      console.log("Channel not found");
      return;
    }
    if (channel.isTextBased() && notFriday !== 5) {
      const response = await fetch(api_url);
      var data = await response.json();
      await channel.send(data[0].q + " -" + data[0].a);
    }
  } catch (error) {
    console.error("Error sending message:", error);
    return "Failed to fetch the quote. Please try again later.";
  }
}

export async function devMeetings() {
  const channel = await client.channels.fetch(`${activeChannel}`);

  try {
    if (!channel) {
      console.log("Channel not found");
      return;
    }
    if (channel.isTextBased()) {
      await channel.send("Meetings today at 9pm CST");
    }
  } catch (error) {
    console.error("Error sending message:", error);
    return "Failed send meeting message.";
  }
}

export async function fridayMemes() {
  const channel = await client.channels.fetch(`${activeChannel}`);
  const Memes = ["Videos/flatFuckFriday.mp4", "Videos/rebeccaBlackFriday.mp4"];
  const randomMeme = Math.floor(Math.random() * Memes.length);
  const randomQuote = Math.floor(Math.random() * fridayQuotes.length);

  try {
    if (!channel) {
      console.log("Channel not found");
      return;
    }
    if (channel.isTextBased()) {
      const birthdayEmbed = new EmbedBuilder()
        .setColor("#0000FF")
        .setTitle(`Its Friday`)
        .setDescription(`${fridayQuotes[randomQuote]}`);

      if (fs.existsSync(Memes[0])) {
        const videoAttachment = new AttachmentBuilder(Memes[randomMeme]);
        await channel.send({
          embeds: [birthdayEmbed],
          files: [videoAttachment],
        });
      }
    }
  } catch (error) {
    console.error("Error sending message:", error);
    return "Failed send meeting message.";
  }
}

export async function firstOfDaMonth() {
  const channel = await client.channels.fetch(`${activeChannel}`);
  const Day = new Date();
  const firstOfTheMonth = Day.getDate();
  const video = "Videos/1stoftheMonth.mp4";
  try {
    if (!channel) {
      console.log("Channel not found");
      return;
    }
    if (channel.isTextBased() && firstOfTheMonth == 1) {
      const birthdayEmbed = new EmbedBuilder()
        .setColor("#0000FF")
        .setTitle(`Wake up`);
      if (fs.existsSync(video)) {
        const videoAttachment = new AttachmentBuilder(video);
        await channel.send({
          embeds: [birthdayEmbed],
          files: [videoAttachment],
        });
      }
    }
  } catch (error) {
    console.error("Error sending message:", error);
    return "Failed send meeting message.";
  }
}

export async function birthdayReminder() {
  const channel = await client.channels.fetch(`${activeChannel}`);
  const today = new Date();
  let month: any = String(today.getMonth() + 1);
  let day: any = String(today.getDate());
  if (month.length < 2) {
    month = "0" + month;
  }
  if (day.length < 2) {
    day = "0" + day;
  }
  const birthdayData = await birthday.find({ birthday: `${month}/${day}` });
  const nameList = birthdayData.map(
    (e: any) => `${toTitleCase(e.name)} ` + `<@${e.userId}>`
  );
  const listString = nameList.join("\n");
  try {
    if (!channel) {
      console.log("Channel not found");
      return;
    }
    if (channel.isTextBased() && nameList.length > 0) {
      const birthdayEmbed = new EmbedBuilder()
        .setColor("#0099ff") // Set the color of the embed
        .setTitle("Today's Birthdays") // Set the title of the embed
        .setDescription(`\n${listString}`) // Set the description (main content) of the embed
        .setTimestamp() // Optionally, you can add a timestamp
        .setFooter({ text: "Happy Birthday!" }); // Optionally, add a footer

      await channel.send({ embeds: [birthdayEmbed] });
    }
  } catch (error) {
    console.error("Error sending message:", error);
    return "Failed to fetch the quote. Please try again later.";
  }
}

export async function ideaChecker(messageAuthor: string, message: string) {
  try {
    const newIdea = new idea({
      userId: messageAuthor,
      idea: message,
    });
    const savedIdea = await newIdea.save();
    const trackerLookup = await tracker.findOne({
      userId: messageAuthor,
      date: formatDateToMMDDYYYY(new Date()),
    });

    if (!trackerLookup) {
      const newTracker = new tracker({
        userId: messageAuthor,
        messagedToday: false,
        date: formatDateToMMDDYYYY(new Date()),
      });
      await newTracker.save();
    }
    await dailyMessageChecker(messageAuthor);
  } catch (error) {
    console.log(error);
  }
}
// check if user has reached the 5 ideas per day today
async function dailyMessageChecker(messageAuthor: string) {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);
  const lookup = await idea.find({
    userId: messageAuthor,
    createdAt: {
      $gte: startOfDay,
      $lte: endOfDay,
    },
  });
  if (lookup.length >= 5) {
    const channel = await client.channels.fetch(`${activeChannel}`);
    const trackerLookup = await tracker.findOne({
      userId: messageAuthor,
      date: formatDateToMMDDYYYY(new Date()),
    });
    if (!trackerLookup) return;
    if (!trackerLookup.messagedToday) {
      let filter = {
        userId: messageAuthor,
        date: formatDateToMMDDYYYY(new Date()),
      };
      await tracker.findOneAndUpdate(filter, { messagedToday: true });
      if (channel && channel.isTextBased()) {
        await channel.send(`☀️ <@${messageAuthor}>`);
      }
    }
  }
}

export async function dailyIdeaBoard(){
    const lookup = await tracker.find({
        date: YesterdaysDate(),
      });
    if (!lookup) return;
    const channel = await client.channels.fetch(`${activeChannel}`);
    if (!channel) return;
    const mappingOverAllLookups = lookup.map((e: any) => {return e.messagedToday ? `<@${e.userId}> ☀️\n` : `<@${e.userId}> ⛈️\n`})
    console.log(mappingOverAllLookups)
    if (channel.isTextBased() && mappingOverAllLookups.length > 0){
        const trackerEmbed = new EmbedBuilder()
            .setColor("#0099ff") // Set the color of the embed
            .setTitle("Daily Checkups for yesterdays ideas") // Set the title of the embed
            .setDescription(`${mappingOverAllLookups.join('')}`) // Set the description (main content) of the embed
    
        await channel.send({ embeds: [trackerEmbed] });
        
    }

}


//titleCase function
function toTitleCase(str: string): string {
  return str
    .toLowerCase()
    .split(" ")
    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// formattedDate
export function formatDateToMMDDYYYY(date: any) {
  let month = date.getMonth() + 1;
  let day = date.getDate();
  const year = date.getFullYear();

  // Add leading zeroes if necessary
  month = month < 10 ? "0" + month : month;
  day = day < 10 ? "0" + day : day;

  return `${month}-${day}-${year}`;
}

export function YesterdaysDate() {
    // Subtract one day from the current date
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
  
    let month:any = yesterday.getMonth() + 1; // JavaScript months are zero-indexed
    let day:any = yesterday.getDate();
    const year = yesterday.getFullYear();
  
    // Add leading zeroes if necessary
    month = month < 10 ? "0" + month : month;
    day = day < 10 ? "0" + day : day;
  
    return `${month}-${day}-${year}`;
  }