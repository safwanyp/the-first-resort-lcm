import { getConfig } from "./config.js";
import { getDiscordClient } from "./discord.js";

const boot = () => {
  const config = getConfig();
  const discordClient = getDiscordClient({ config: config.discordClient });

  return {
    config,
    discordClient,
  };
};

export { boot };
