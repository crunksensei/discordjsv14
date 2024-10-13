import { SlashCommandBuilder, ChannelType, TextChannel, EmbedBuilder } from "discord.js"
import { SlashCommand } from "../types";

const command : SlashCommand = {
    command: new SlashCommandBuilder()
    .setName("imaginarium_theater_reset")
    .setDescription("Days untill Imaginarium Theater resets.")
    ,
    execute: async interaction => {
        //get todays date
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth();   
        //get the first day of the next month
        const firstDayNextMonth = new Date(year, month + 1, 1);
        //calculate the days until the first day of the next month
        const daysUntil = (date: Date) => Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        const daysUntilFirstDayNextMonth = daysUntil(firstDayNextMonth);
        //create a message based on the days until the reset
        const messageReset = today.getDate() == 1 ? "Imaginarium Theater reset today."
                        : daysUntilFirstDayNextMonth === 0 ? "Imaginarium Theater resets today." 
                        : daysUntilFirstDayNextMonth === 1 ? "Imaginarium Theater resets tomorrow!" 
                        : `Imaginarium Theater resets in ${daysUntilFirstDayNextMonth} days.`;
        await interaction.reply({
            content: messageReset,
            ephemeral: true
        });
    },
    cooldown: 10
}

export default command
