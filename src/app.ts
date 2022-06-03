import { BotClient } from "@loop/structures/Client";
import { Intents } from "discord.js";

const client = new BotClient({
  allowedMentions: {
    repliedUser: true,
    parse: ["users", "roles"],
  },
  partials: ["MESSAGE", "CHANNEL", "REACTION", "USER", "GUILD_MEMBER"],
  intents: new Intents(32767),
  retryLimit: Infinity,
});

process
  .on("exit", (code) => {
    client.log.info(`Process exiting with code ${code}`);
  })
  .on("unhandleRejection", (reason) => {
    client.log.error(`Unhandled rejection: ${reason}`);
  })
  .on("uncaughtException", (err) => {
    client.log.error(`Uncaught exception: ${err.stack}`);
    process.exit(1);
  });

client.init();
