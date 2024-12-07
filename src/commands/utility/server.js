import { SlashCommandBuilder } from "discord.js";
import {
  getServerId,
  getServerStatus,
  startServer,
  stopServer,
} from "../../clients/crafty.js";

const statusCommand = async (interaction) => {
  const serverId = await getServerId();
  const status = await getServerStatus(serverId);

  await interaction.reply(
    `Server status is: ${status ? "RUNNING ✅" : "STOPPED ❌"}`,
  );
};

const startCommand = async (interaction) => {
  try {
    const result = await startServer();

    if (!result) {
      await interaction.reply(
        "That didn't work. Please try again in 10 seconds.",
      );
      return;
    }

    await interaction.reply(
      `Command sent to start the server. Please wait a few seconds for it to boot up completely.`,
    );
  } catch (error) {
    await interaction.reply(error.message);
  }
};

const stopCommand = async (interaction) => {
  try {
    const result = await stopServer();

    if (!result) {
      await interaction.reply(
        "That didn't work. Please try again in 10 seconds.",
      );
      return;
    }

    await interaction.reply(
      `Command sent to stop the server. Please wait a few seconds for it to shut down completely.`,
    );
  } catch (error) {
    await interaction.reply(error.message);
  }
};

/** @type { import("discord.js").SlashCommandBuilder } */
const serverStatusCommand = {
  data: new SlashCommandBuilder()
    .setName("server")
    .setDescription("Commands for Minecraft server lifecycle management.")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("status")
        .setDescription("Check the status of the Minecraft server."),
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("start").setDescription("Start the Minecraft server."),
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("stop").setDescription("Stop the Minecraft server."),
    ),

  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();

    switch (subcommand) {
      case "status":
        return statusCommand(interaction);
      case "start":
        return startCommand(interaction);
      case "stop":
        return stopCommand(interaction);
      default:
        break;
    }
  },
};

export default serverStatusCommand;
