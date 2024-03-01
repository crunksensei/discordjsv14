import { SlashCommandBuilder, ChannelType, TextChannel, EmbedBuilder } from "discord.js"
import { getThemeColor } from "../functions";
import { SlashCommand } from "../types";
const game = require("../schemas/game_events");

const command : SlashCommand = {
    command: new SlashCommandBuilder()
    .setName("add_genshin_event")
    .addStringOption(option =>
        option
        .setName("name")
        .setDescription("Enter the name of the event")
        .setRequired(true)
    )
    .addStringOption(option =>
        option
        .setName("date")
        .setDescription("Enter the date of the event")
        .setRequired(true)
    )
    .setDescription("Adds game event to the database")
    ,
    execute: async interaction => {
        const eventName = interaction.options.getString("name", true).toLowerCase();
        const eventDate = interaction.options.getString("date", true);
        const datePattern = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])$/;
        if (!datePattern.test(eventDate)) {
            await interaction.reply({
                content: "Please enter the date in the correct format (MM/DD).",
                ephemeral: true
            });
            return;
        }
        const settingEvent = new game({
            name: eventName,
            gameName: "Genshin Impact",
            date: eventDate,
            time: ''
        })
        
        const savedGameEvent = await settingEvent.save();
        
        interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setAuthor({name: "MRC License"})
                .setDescription(`🏓 Pong! \n 📡 Ping: ${interaction.client.ws.ping}`)
                .setColor(getThemeColor("text"))
            ]
        })
    },
    cooldown: 10
}
// const GameSchema = new Schema({
//     name: {required:true, type: String},
//     gameName: {required:true, type: String},
//     date: { required: true, type: String},
//     time: { required: false, type: String},
// })

export default command