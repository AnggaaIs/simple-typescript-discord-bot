import config from "@bot/config";
import { GuildData } from "@bot/typings";
import { model, Schema } from "mongoose";

const GuildModel = new Schema<GuildData>({
  id: { type: String, required: true },
});

export default model<GuildData>("Guild", GuildModel);
