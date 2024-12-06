import { SlashCommandBuilder } from "discord.js";

/** @type { import("discord.js").SlashCommandBuilder } */
const pingCommand = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!"),
  async execute(interaction) {
    await interaction.reply("Pong!");
  },
};

export default pingCommand;
