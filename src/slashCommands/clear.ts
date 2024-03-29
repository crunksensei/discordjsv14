import { ChannelType, PermissionFlagsBits, SlashCommandBuilder, GuildMember } from "discord.js";
import { SlashCommand } from "../types";

const ClearCommand : SlashCommand = {
    command: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Delets messages from the current channel.")
    .addIntegerOption(option => {
        return option
        .setMaxValue(100)
        .setMinValue(1)
        .setName("messagecount")
        .setDescription("Message amount to be cleared")
    })
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    execute: async interaction => {
        const member = interaction.member as GuildMember;
        if (!member.permissions.has(PermissionFlagsBits.ManageMessages)) {
            await interaction.reply({ content: "You do not have permission to use this command.", ephemeral: true });
            return;
        }
        let messageCount = Number(interaction.options.get("messagecount")?.value)
        interaction.channel?.messages.fetch({limit: messageCount})
        .then(async msgs => {
            if(interaction.channel?.type === ChannelType.DM) return;
            const deletedMessages = await interaction.channel?.bulkDelete(msgs,true)   
            if (deletedMessages?.size === 0) interaction.reply("No messages were deleted.")       
            else interaction.reply(`Successfully deleted ${deletedMessages?.size} message(s)`)
            setTimeout(() => interaction.deleteReply(), 5000)
        })
    },
    cooldown: 10
};

export default ClearCommand;

