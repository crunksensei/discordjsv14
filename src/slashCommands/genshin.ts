import { SlashCommandBuilder, ChannelType, TextChannel, EmbedBuilder } from "discord.js"
import { SlashCommand } from "../types";

const command : SlashCommand = {
    command: new SlashCommandBuilder()
    .setName("spiral_abyss_reset")
    .setDescription("Days untill Sprial Abyss reset.")
    ,
    execute: async interaction => {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth();   
        const firstDayNextMonth = new Date(year, month + 1, 1);
        const midMonthReset = new Date(year, month + (today.getDate() > 16 ? 1 : 0), 16);
        const daysUntil = (date: Date) => Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        const daysUntilFirstDayNextMonth = daysUntil(firstDayNextMonth);
        const daysUntilMidMonthReset = daysUntil(midMonthReset);
        const nearestReset = Math.min(daysUntilFirstDayNextMonth, daysUntilMidMonthReset);
        const messageReset = today.getDate() == 1 ? "Spiral Abyss reset today."
                        : nearestReset === 0 ? "Spiral Abyss resets today." 
                        : nearestReset === 1 ? "Spiral Abyss resets tomorrow!" 
                        : `Spiral Abyss resets in ${nearestReset} days.`;
        await interaction.reply({
            content: messageReset,
            ephemeral: true
        });
    },
    cooldown: 10
}

export default command
