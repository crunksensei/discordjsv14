import { ChannelType, PermissionFlagsBits, SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { SlashCommand } from "../types";
const birthday = require("../schemas/birthdays");


const command: SlashCommand = {
    command: new SlashCommandBuilder()
        .setName("bdays")
        .setDescription("Add Birthday to database.")
        .addStringOption(option =>
            option
                .setName("name")
                .setDescription("Enter the name of the person whose birthday it is.")
                .setRequired(true)
        )
        .addUserOption(option =>
            option.setName("user")
                .setDescription("Select the user")
                .setRequired(true))
        .addStringOption(option =>
            option
                .setName("date")
                .setDescription("Enter the birthday date in format (MM/DD/YYYY).")
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    execute: async interaction => {
        const name = interaction.options.getString("name", true).toLowerCase();
        const dateString = interaction.options.getString("date", true);
        
        // Validate date format here using a regular expression for MM/DD
        const datePattern = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])$/;
        if (!datePattern.test(dateString)) {
            await interaction.reply({
                content: "Please enter the date in the correct format (MM/DD).",
                ephemeral: true
            });
            return;
        }
        const user = interaction.options.getUser("user", true);
        // creating the new birthday object
        const newBirthday = new birthday({
            name: name,
            birthday: dateString,
            userId: user.id
        });
        // saving the new birthday to the database

try {
    if (await birthday.findOne({ userId: user.id })) { // Make sure this matches the schema definition
        await interaction.reply({
            content: "This user already has a birthday in the database. Contact server admin to change it.",
            ephemeral: true
        });
        return;
    } else {
        const savedBirthday = await newBirthday.save();
        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`Successfully added ${name}'s birthday.`)
            ]
        });
    }
    } catch (error) {
        console.error("Error saving birthday to the database:", error);
        await interaction.reply({
            content: "There was an error adding the birthday to the database.",
            ephemeral: true
        });
    }
        
    }
};

export default command;