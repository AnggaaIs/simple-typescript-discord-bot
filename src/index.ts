import { ShardingManager } from "discord.js";
import { botConfig } from "./config";
import { isProduction } from "./utils";
import { LoopLogger } from "@loop/structures/Logger";

const logger = new LoopLogger();

const shard = new ShardingManager("dist/app.js", {
  respawn: true,
  token: botConfig.token,
  totalShards: isProduction() ? "auto" : 1,
});

shard.on("shardCreate", (shard) => {
  logger.info(`[Shard] Shard ${shard.id} created`);
});

shard.spawn();
