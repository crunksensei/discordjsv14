import { ChannelType, PermissionFlagsBits, SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { SlashCommand } from "../types";

const command : SlashCommand = {
    command: new SlashCommandBuilder()
    .setName("quote")
    .setDescription("random quote")
    ,
    execute: async interaction => {
    const api_url ="https://zenquotes.io/api/random/";
    const response = await fetch(api_url);
    var data = await response.json();
        interaction.reply({        
        embeds: [
            new EmbedBuilder()
            .setDescription(data[0].q + " -" + data[0].a)
        ]
        })     
}
}
 
export default command;