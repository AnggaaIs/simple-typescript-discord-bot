import { PermissionString } from "discord.js";

export const botConfig = {
  token: "BOT TOKEN",
  mongo_uri: "MONGO URL",
  owners: ["OWNER ID/DEVELOPER ID"],
  defaultPermissions: ["SEND_MESSAGES", "EMBED_LINKS"] as PermissionString[],
  guild_id_dev: "GUILD ID FOR DEVELOPMENT",
};

export default {
  botConfig,
};
