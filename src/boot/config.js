/**
 * @typedef { object } DiscordClientConfig
 * @property { string } token
 * @property { string } clientId
 * @property { string } guildId
 */

/**
 * @typedef { object } Config
 * @property { DiscordClientConfig } discordClient
 */

/**
 * @callback GetConfig
 * @returns { Config }
 */

/** @type { GetConfig } */
const getConfig = () => {
  return {
    discordClient: {
      token: String(process.env.DISCORD_TOKEN),
      clientId: process.env.DISCORD_CLIENT_ID,
      guildId: process.env.DISCORD_GUILD_ID,
    },
  };
};

export { getConfig };
