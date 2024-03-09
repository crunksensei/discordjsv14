import chalk from "chalk"
import { Guild, GuildMember, PermissionFlagsBits, PermissionResolvable, PermissionsBitField, TextChannel, EmbedBuilder } from "discord.js"
import GuildDB from "./schemas/Guild"
import { GuildOption } from "./types"
import mongoose from "mongoose";
import client from "./index"
require("dotenv").config(); 
const quote = require("./schemas/quote");
const birthday = require("./schemas/birthdays");
const game = require("./schemas/game_events");
const productionChannel = `${process.env.famDiscord}`
const testChannel = `${process.env.test_Channel}`

const activeChannel = productionChannel

type colorType = "text" | "variable" | "error"

const themeColors = {
    text: "#ff8e4d",
    variable: "#ff624d",
    error: "#f5426c"
}

export const getThemeColor = (color: colorType) => Number(`0x${themeColors[color].substring(1)}`)

export const color = (color: colorType, message: any) => {
    return chalk.hex(themeColors[color])(message)
}

export const checkPermissions = (member: GuildMember, permissions: Array<PermissionResolvable>) => {
    let neededPermissions: PermissionResolvable[] = []
    permissions.forEach(permission => {
        if (!member.permissions.has(permission)) neededPermissions.push(permission)
    })
    if (neededPermissions.length === 0) return null
    return neededPermissions.map(p => {
        if (typeof p === "string") return p.split(/(?=[A-Z])/).join(" ")
        else return Object.keys(PermissionFlagsBits).find(k => Object(PermissionFlagsBits)[k] === p)?.split(/(?=[A-Z])/).join(" ")
    })
}

export const sendTimedMessage = (message: string, channel: TextChannel, duration: number) => {
    channel.send(message)
        .then(m => setTimeout(async () => (await channel.messages.fetch(m)).delete(), duration))
    return
}

export const getGuildOption = async (guild: Guild, option: GuildOption) => {
    if (mongoose.connection.readyState === 0) throw new Error("Database not connected.")
    let foundGuild = await GuildDB.findOne({ guildID: guild.id })
    if (!foundGuild) return null;
    return foundGuild.options[option]
}

export const setGuildOption = async (guild: Guild, option: GuildOption, value: any) => {
    if (mongoose.connection.readyState === 0) throw new Error("Database not connected.")
    let foundGuild = await GuildDB.findOne({ guildID: guild.id })
    if (!foundGuild) return null;
    foundGuild.options[option] = value
    foundGuild.save()
}

// function that is called when cron job goes off.
// export async function timed() {

//     try {
//         const channel = await client.channels.fetch(`${testChannel}`);
        
//         if(!channel){
//             console.log('Channel not found')
//             return
        
//         }
//         if (channel.isTextBased()) {
//             await channel.send('I am online');
//         }
//     } catch (error) {
//         console.error('Error sending message:', error);
//     }
// }

export async function GameEvents () {
    const channel = await client.channels.fetch(`${activeChannel}`);
    const today = new Date();
    let year = today.getFullYear();
    let month = today.getMonth();
    // Calculate the first day of the next month
    const firstDayNextMonth = new Date(year, month + 1, 1);
    // Calculate days until the first day of the next month
    const daysUntilFirstDayNextMonth = Math.round((Number(firstDayNextMonth) - Number(today)) / (1000 * 60 * 60 * 24)) + 1;
    
    try {
        if(!channel){
            console.log('Channel not found')
            return
        }
        if (channel.isTextBased()) {
                if (daysUntilFirstDayNextMonth == 5) {
                    await channel.send('Genshin Impact: 5 days left for the Spiral Abyss');
                }
                else if (daysUntilFirstDayNextMonth == 3) {
                    await channel.send('Genshin Impact: 3 days left for the Spiral Abyss');
                }
                else if (daysUntilFirstDayNextMonth == 1) {
                    await channel.send('Genshin Impact: Spiral Abyss reset tomorrow!');
                }
                else if (today.getDate() == 1) {
                    await channel.send('Genshin Impact: Spiral Abyss reset today!');
                }
                return
        }
    }
    catch (error) {
        console.error('Error sending message:', error);
        return "Failed to fetch the quote. Please try again later.";
    }
}

export async function randomQuote () {
    const channel = await client.channels.fetch(`${activeChannel}`);
    const api_url ="https://zenquotes.io/api/today/";
    try {
        if(!channel){
            console.log('Channel not found')
            return
        }
        if (channel.isTextBased()) {
        const response = await fetch(api_url);
        var data = await response.json();
        await channel.send(data[0].q + " -" + data[0].a);
        }
    }
    catch (error) {
        console.error('Error sending message:', error);
        return "Failed to fetch the quote. Please try again later.";
    }

}

export async function birthdayReminder () {
    const channel = await client.channels.fetch(`${activeChannel}`);
    const today = new Date();
    let month:any = String(today.getMonth() + 1);
    let day:any = String(today.getDate());
    if (month.length < 2) {
        month = '0' + month;
    }
    if (day.length < 2) {
        day = '0' + day;
    }
    const birthdayData = await birthday.find({ birthday: `${month}/${day}`});
    const nameList = birthdayData.map((e:any) => `${toTitleCase(e.name)} ` + `<@${e.userId}>`);
    const listString = nameList.join('\n');
    try {
        if(!channel){
            console.log('Channel not found')
            return
        }
        if (channel.isTextBased() && nameList.length > 0) {
            const birthdayEmbed = new EmbedBuilder()
                .setColor('#0099ff') // Set the color of the embed
                .setTitle("Today's Birthdays") // Set the title of the embed
                .setDescription(`\n${listString}`) // Set the description (main content) of the embed
                .setTimestamp() // Optionally, you can add a timestamp
                .setFooter({ text: 'Happy Birthday!' }); // Optionally, add a footer

            await channel.send({ embeds: [birthdayEmbed] });
        }
    }
    catch (error) {
        console.error('Error sending message:', error);
        return "Failed to fetch the quote. Please try again later.";
    }
}

//titleCase function
function toTitleCase(str: string): string {
    return str.toLowerCase().split(' ').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}
