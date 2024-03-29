import { ChannelType, PermissionFlagsBits, SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { SlashCommand } from "../types";

const command : SlashCommand = {
    command: new SlashCommandBuilder()
    .setName("roll")
    .addSubcommand(subcommand =>
        subcommand
            .setName("dice")
            .setDescription("Roll a dice with a specified number of sides.")
            .addIntegerOption(option => 
                option
                    .setName("number")
                    .setDescription("Enter the number of sides of the dice.")
                    .setRequired(true)
            )
    )
    .setDescription("Rolls Dice"),
    execute: interaction => {
        const dice:number = Number(interaction.options.get("number")?.value)
        const answer = Math.floor(Math.random() * dice) + 1
        interaction.reply({
        embeds: [
            new EmbedBuilder()
            .setDescription(`You got ${answer}!`)
        ]
        })
       

}
}

export default command;