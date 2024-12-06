import { Events, MessageFlags } from "discord.js";
import { boot } from "./boot/index.js";

const { discordClient } = await boot();

discordClient.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) {
    return;
  }

  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`Command not found: ${interaction.commandName}`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: "There was an error executing this command.",
        flags: MessageFlags.Ephemeral,
      });
    } else {
      await interaction.reply({
        content: "There was an error executing this command.",
        flags: MessageFlags.Ephemeral,
      });
    }
  }

  console.log(`Interaction received: ${interaction}`);
});
