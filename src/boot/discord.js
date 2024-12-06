import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Client, Collection, Events, GatewayIntentBits } from "discord.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * @callback GetDiscordClient
 * @param { Object } params
 * @param { import("./config").DiscordClientConfig } params.config
 */

/** @type { GetDiscordClient } */
const getDiscordClient = async ({ config }) => {
  const discordClient = new Client({ intents: [GatewayIntentBits.Guilds] });
  discordClient.once(Events.ClientReady, (readyClient) => {
    console.log(`Discord Client Ready! Logged in as ${readyClient.user.tag}`);
  });
  discordClient.login(config.token);

  discordClient.commands = new Collection();

  const foldersPath = path.join(__dirname, "../commands");
  const commandFolders = fs.readdirSync(foldersPath);

  for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs
      .readdirSync(commandsPath)
      .filter((file) => file.endsWith(".js"));
    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);
      const commandObj = await import(filePath);
      const command = commandObj.default;

      if ("data" in command && "execute" in command) {
        discordClient.commands.set(command.data.name, command);
      } else {
        console.error(
          `Invalid command file: ${filePath}. Missing "data" or "execute" function`,
        );
      }
    }
  }

  return discordClient;
};

export { getDiscordClient };
