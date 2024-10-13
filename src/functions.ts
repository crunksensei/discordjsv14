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
import path from 'path';
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



const activeChannel = testChannel;

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

//Game Events

export async function GameEvents() {
  //Genshin Impact
  SprialAbyss();
  ImaginariamTheater();

}

//Spiral Abyss Reset

export async function SprialAbyss() {
  const channel = await client.channels.fetch(`${activeChannel}`);
  const today = new Date();
  let year = today.getFullYear();
  let month = today.getMonth();
  const midMonthReset = new Date(
    year,
    month + (today.getDate() > 16 ? 1 : 0),
    16
  );
  const daysUntil = (date: any) =>
    Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  const daysUntilMidMonthReset = daysUntil(midMonthReset);
  try {
    if (!channel) {
      console.log("Channel not found");
      return;
    }
    if (channel.isTextBased()) {
      if (daysUntilMidMonthReset == 5) {
        await channel.send("Genshin Impact: 5 days left for the Spiral Abyss");
      } else if (daysUntilMidMonthReset == 3) {
        await channel.send("Genshin Impact: 3 days left for the Spiral Abyss");
      } else if (daysUntilMidMonthReset == 1) {
        await channel.send("Genshin Impact: Spiral Abyss reset tomorrow!");
      }
      return;
    }
  } catch (error) {
    console.error("Error sending message:", error);
    return "Failed to fetch the quote. Please try again later.";
  }
}

//Imaginarium Theater Reset

export async function ImaginariamTheater() {
  const channel = await client.channels.fetch(`${activeChannel}`);
  const today = new Date();
  const firstOfNextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
  const daysUntil = (date: Date) =>
    Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  const daysUntilFirstOfMonth = daysUntil(firstOfNextMonth);

  try {
    if (!channel) {
      console.log("Channel not found");
      return;
    }
    if (channel.isTextBased()) {
      if (daysUntilFirstOfMonth == 5) {
        await channel.send("Imaginarium Theater: 5 days left until the new show!");
      } else if (daysUntilFirstOfMonth == 3) {
        await channel.send("Imaginarium Theater: 3 days left until the new show!");
      } else if (daysUntilFirstOfMonth == 1) {
        await channel.send("Imaginarium Theater: New show starts tomorrow!");
      }
    }
  } catch (error) {
    console.error("Error sending message:", error);
    return "Failed to send Imaginarium Theater reminder. Please try again later.";
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
      await channel.send("Meetings today at 8pm CST");
    }
  } catch (error) {
    console.error("Error sending message:", error);
    return "Failed send meeting message.";
  }
}

export async function fridayMemes() {
  const channel = await client.channels.fetch(`${activeChannel}`);
  const memesFolder = 'Videos/friday'; // Specify the folder containing the memes
  
  try {
    if (!channel || !channel.isTextBased()) {
      return;
    }

    // Read all files in the memes folder
    const files: any = await new Promise((resolve, reject) => {
      fs.readdir(memesFolder, (err:any, files:any) => {
        if (err) {
          reject(err);
        } else {
          resolve(files);
        }
      });
    });
    console.log(files);
    const videoFiles = files.filter((file:string) => 
      ['.mp4', '.mov', '.avi'].includes(path.extname(file).toLowerCase())
    );

    if (videoFiles.length === 0) {
      console.log("No video files found in the memes folder");
      return;
    }

    const randomMeme = videoFiles[Math.floor(Math.random() * videoFiles.length)];
    const randomQuote = Math.floor(Math.random() * fridayQuotes.length);

    const fridayEmbed = new EmbedBuilder()
      .setColor("#0000FF")
      .setTitle(`It's Friday`)
      .setDescription(`${fridayQuotes[randomQuote]}`);

    const videoAttachment = new AttachmentBuilder(path.join(memesFolder, randomMeme));
    
    await channel.send({
      embeds: [fridayEmbed],
      files: [videoAttachment],
    });

  } catch (error) {
    console.error("Error sending Friday meme:", error);
    return "Failed to send Friday meme.";
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
  if (!birthdayData || birthdayData.length === 0) return;
  const nameList = birthdayData.map(
    (e: any) => `${toTitleCase(e.name)} ` + `<@${e.userId}>`
  );
  try {
    if (!channel || !channel.isTextBased()) return;
    const birthdayEmbed = new EmbedBuilder()
      .setColor("#0099ff") // Set the color of the embed
      .setTitle("Today's Birthdays") // Set the title of the embed
      .setDescription(`${nameList.join("\n")}`) // Set the description (main content) of the embed
      .setFooter({ text: "Happy Birthday!" }); // Optionally, add a footer
    await channel.send({ embeds: [birthdayEmbed] });
  } catch (error) {
    console.error("Error sending message:", error);
    return "Failed to fetch the quote. Please try again later.";
  }
}

export async function ideaChecker(messageAuthor: string, message: string) {
  try {
    const newIdea = new idea({ userId: messageAuthor, idea: message });
    await newIdea.save();
    const currentDate = formatDateToMMDDYYYY(new Date());
    const trackerLookup = await tracker.findOneAndUpdate(
      { userId: messageAuthor, date: currentDate },
      { $setOnInsert: { messagedToday: false } },
      { upsert: true, new: true }
    );
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
    createdAt: { $gte: startOfDay, $lte: endOfDay },
  });
  if (lookup.length < 5) return;
  if (lookup.length >= 5) {
    const channel = await client.channels.fetch(`${activeChannel}`);
    if (!channel || !channel.isTextBased()) return;
    const trackerDate = formatDateToMMDDYYYY(new Date());
    const trackerLookup = await tracker.findOne({
      userId: messageAuthor,
      date: trackerDate,
    });
    if (!trackerLookup || trackerLookup.messagedToday) return;
    if (!trackerLookup.messagedToday) {
      await tracker.findOneAndUpdate(
        { userId: messageAuthor, date: trackerDate },
        { messagedToday: true }
      );
      await channel.send(`☀️ <@${messageAuthor}>`);
    }
  }
}

//everyday at 9am CST it shows who made the 5 ideas
export async function dailyIdeaBoard() {
  const lookup = await tracker.find({
    date: YesterdaysDate(),
  });
  if (!lookup || lookup.length === 0) return;
  const channel = await client.channels.fetch(`${activeChannel}`);
  if (!channel || !channel.isTextBased()) return;
  const messages = lookup
    .map((e: any) => `<@${e.userId}> ${e.messagedToday ? "☀️" : "⛈️"}`)
    .join("\n");
  if (!messages) return;
  const trackerEmbed = new EmbedBuilder()
    .setColor("#0099ff")
    .setTitle("Daily Checkups for yesterday's ideas")
    .setDescription(messages);
  await channel.send({ embeds: [trackerEmbed] });
}

//Daily Reset for the tracker

export async function dailyTrackerReset() {
  const trackerLookup = await tracker.find({
    date: YesterdaysDate(),
  });
  if (!trackerLookup || trackerLookup.length === 0) return;
  const newTrackers = trackerLookup.map(({ userId }: { userId: string }) => {
    return new tracker({
      userId,
      messagedToday: false,
      date: formatDateToMMDDYYYY(new Date()),
    }).save();
  });
  await Promise.all(newTrackers);
}

//UTILITIES

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

  let month: any = yesterday.getMonth() + 1; // JavaScript months are zero-indexed
  let day: any = yesterday.getDate();
  const year = yesterday.getFullYear();

  // Add leading zeroes if necessary
  month = month < 10 ? "0" + month : month;
  day = day < 10 ? "0" + day : day;

  return `${month}-${day}-${year}`;
}
