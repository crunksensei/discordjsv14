import { PermissionFlagsBits } from "discord.js";
import { Command } from "../types";
const game = require("../schemas/game_events");

const command : Command = {
    name: "genshinevent",
    execute: async (message, args) => {
        const gameData = await game.find({ name: "spiral abyss"});
        
        message.channel.send(`gameData: ${gameData}!`)
    },
    cooldown: 10,
    aliases: ["genshinevent"],
    permissions: ["Administrator", PermissionFlagsBits.ManageEmojisAndStickers] // to test
}

export default command