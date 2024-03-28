import { SlashCommandBuilder, ChannelType, TextChannel, EmbedBuilder } from "discord.js"
import { SlashCommand } from "../types";

const command : SlashCommand = {
    command: new SlashCommandBuilder()
    .setName("spiral_abyss_reset")
    .setDescription("Days untill Sprial Abyss reset.")
    ,
    execute: async interaction => {
        const today = new Date();
        let year = today.getFullYear();
        let month = today.getMonth();
        // Calculate the first day of the next month
        const firstDayNextMonth = new Date(year, month + 1, 1);
        // Calculate days until the first day of the next month
        const daysUntilFirstDayNextMonth = Math.round((Number(firstDayNextMonth) - Number(today)) / (1000 * 60 * 60 * 24));
        await interaction.reply({
            content: `There are ${daysUntilFirstDayNextMonth} days until Spiral Abyss reset.`,
            ephemeral: true
        });
    },
    cooldown: 10
}

export default command