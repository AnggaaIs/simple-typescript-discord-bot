import { Client, ClientOptions, Collection } from "discord.js";
import { LoopLogger } from "./Logger";

import config from "@bot/config";
import { join } from "node:path";
import ListenerManager from "./managers/Listener";
import CommandManager from "./managers/Command";
import { DatabaseManager } from "@bot/database/Manager";

const listenerFolder = join(__dirname, "../listeners");
const commandFolder = join(__dirname, "../commands");

export class BotClient extends Client {
  public constructor(options: ClientOptions) {
    super(options);
  }
  public log = new LoopLogger();
  public readonly config: typeof config = config;
  public listeners2: ListenerManager = new ListenerManager(this);
  public commands: CommandManager = new CommandManager(this);
  public database: DatabaseManager = new DatabaseManager(this);
  public cooldowns: Collection<string, Collection<string, number>> = new Collection();

  public async init(): Promise<void> {
    this.database
      .connect()
      .then(() => {
        this.log.info("Connected to MongoDB!");

        this.listeners2.init(listenerFolder);
        this.commands.init(commandFolder);
      })
      .catch((reason) => {
        this.log.error("Failed to connect to MongoDB!", reason);
        process.exit(1);
      });

    this.login(this.config.botConfig.token).catch((err: any) => {
      this.log.error(`Failed to start bot`, err);
      process.exit(1);
    });
  }
}
