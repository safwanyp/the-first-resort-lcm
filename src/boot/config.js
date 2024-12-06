/**
 * @typedef { object } DiscordClientConfig
 * @property { string } token
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
      token: String(process.env.DISCORD_BOT_TOKEN),
    },
  };
};

export { getConfig };
