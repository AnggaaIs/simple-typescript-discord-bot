import { BotClient } from "@loop/structures/Client";
import mongoose from "mongoose";
import GuildModel from "./models/Guild";

export class DatabaseManager {
  public constructor(private client: BotClient) {}
  public guild: typeof GuildModel = GuildModel;

  public async connect(): Promise<any> {
    new Promise(async (resolve, reject) => {
      await mongoose
        .connect(this.client.config.botConfig.mongo_uri)
        .then((a) => resolve(a))
        .catch((reason) => reject(reason));
    });
  }
}
