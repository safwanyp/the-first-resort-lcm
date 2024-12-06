import { getConfig } from "./config.js";
import { getDiscordClient } from "./discord.js";

const boot = async () => {
  const config = getConfig();
  const discordClient = await getDiscordClient({
    config: config.discordClient,
  });

  return {
    config,
    discordClient,
  };
};

export { boot };
