import {
  ChannelType,
  PermissionFlagsBits,
  SlashCommandBuilder,
  EmbedBuilder,
} from "discord.js";
import { SlashCommand } from "../types";

const command: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName("thisday")
    .setDescription("What Happened Today?"),
  execute: async (interaction) => {
    const api_url = "https://today.zenquotes.io/api";
    try {
      const response = await fetch(api_url);
      var data = await response.json();
      const randomImage = await fetch(
        "https://source.unsplash.com/random/640x640?history"
      );
      const embed = new EmbedBuilder()
        .setColor("#0099ff")
        .setTitle("This Day in History")
        .setDescription("Here are some events that happened today in history:")
        .setImage(randomImage.url);

      data.data.Events.slice(0, 3).forEach((eventText: any) => {
        const year = eventText.text.slice(0, 4);
        const event = eventText.text.slice(12);
        embed.addFields({ name: `Year ${year}`, value: event, inline: true });
      });

      // Reply with the embed
      interaction.reply({
        embeds: [embed],
      });
    } catch (error) {
      console.log("error on this day command", error);
    }
  },
};

export default command;
