import { Client, Events, GatewayIntentBits } from "discord.js";

/**
 * @callback GetDiscordClient
 * @param { Object } params
 * @param { import("./config").DiscordClientConfig } params.config
 */

/** @type { GetDiscordClient } */
const getDiscordClient = ({ config }) => {
  const discordClient = new Client({ intents: [GatewayIntentBits.Guilds] });
  discordClient.once(Events.ClientReady, (readyClient) => {
    console.log(`Discord Client Ready! Logged in as ${readyClient.user.tag}`);
  });
  discordClient.login(config.token);

  return discordClient;
};

export { getDiscordClient };
