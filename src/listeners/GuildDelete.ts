import { Listener } from "@bot/structures/Listener";
import { ListenerOption } from "@bot/typings";
import { ApplyOptions } from "@bot/utils/decorators/ApplyOptions";
import { Guild } from "discord.js";

@ApplyOptions<ListenerOption>({
  name: "guildDelete",
})
export class GuildDelete extends Listener {
  public run(guild: Guild): void {
    this.client.database.guild
      .findOneAndDelete({ id: guild.id })
      .then((data) => this.client.log.info(`Removed guild ${guild.name} from database`));
  }
}
