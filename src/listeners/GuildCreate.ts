import { Listener } from "@loop/structures/Listener";
import { ListenerOption } from "@loop/typings";
import { ApplyOptions } from "@loop/utils/decorators/ApplyOptions";
import { Guild } from "discord.js";

@ApplyOptions<ListenerOption>({
  name: "guildCreate",
})
export class GuildCreate extends Listener {
  public run(guild: Guild): void {
    this.client.database.guild.findOne({ id: guild.id }).then((data) => {
      if (data) return;
      this.client.database.guild
        .create({ id: guild.id })
        .then(() => this.client.log.info(`Added guild ${guild.name} to database`));
    });
  }
}
