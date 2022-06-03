import config from "@loop/config";
import { GuildData } from "@loop/typings";
import { model, Schema } from "mongoose";

const GuildModel = new Schema<GuildData>({
  id: { type: String, required: true },
});

export default model<GuildData>("Guild", GuildModel);
