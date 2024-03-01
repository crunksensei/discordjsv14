import { ChannelType, PermissionFlagsBits, SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { SlashCommand } from "../types";
const birthday = require("../schemas/birthdays");

const command : SlashCommand = {
    command: new SlashCommandBuilder()
    .setName("personbday")
    .setDescription("get person's birthday from database.")
    .addStringOption(option =>
        option
            .setName("name")
            .setDescription("Enter the name of the person whose birthday you want.")
            .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    execute: async interaction => {
        const name = interaction.options.getString("name", true).toLowerCase();
        // Find the birthday in the database
        const birthdayData = await birthday.find({ name: name});
        const nameList = birthdayData.map((e:any) => `${e.name} ` + `<@${e.userId}>` + ' has a birthday on ' + `${e.birthday}`);
        const listString = nameList.join('\n');
        if (birthdayData.length === 0) {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(`No birthday found for ${name}.`)
                ]
            });
        }
        else {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle('Birthdays List')
                        .setDescription(listString)
                        .setColor(0x0099FF)
                ]
            });
        }
       

}
}

export default command;