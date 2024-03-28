import { ChannelType, PermissionFlagsBits, SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { SlashCommand } from "../types";
const birthday = require("../schemas/birthdays");

const command : SlashCommand = {
    command: new SlashCommandBuilder()
    .setName("personbday")
    .setDescription("get person's birthday from database.")
    .addUserOption(option =>
        option.setName("user")
            .setDescription("Select the user")
            .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    execute: async interaction => {
        const userid = interaction.options.getUser("user", true);
        console.log(userid);
        // Find the birthday in the database
        const birthdayData = await birthday.find({ userId: userid.id});
        console.log(birthdayData);
        if (birthdayData.length === 0) {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(`No birthday found for ${userid}. Why dont you add one? with command /bdays`)
                ]
            });
        }
        else {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle('Birthdays List')
                        .setDescription(`${birthdayData[0].name} ` + `<@${birthdayData[0].userId}>` + ' has a birthday on ' + `${birthdayData[0].birthday}`)
                        .setColor(0x0099FF)
                ]
            });
        }
       

}
}

export default command;