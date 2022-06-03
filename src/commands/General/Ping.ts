import { Command } from "@bot/structures/Command";
import { CommandContext } from "@bot/structures/CommandContext";

import { CommandOption } from "@bot/typings";
import { EmbedColors } from "@bot/utils/Constants";
import { ApplyOptions } from "@bot/utils/decorators/ApplyOptions";
import { MessageEmbed } from "discord.js";

@ApplyOptions<CommandOption>({
  name: "ping",
  description: "Pong!",
  cooldown: 5,
  allowDm: true,
})
export class PingCommand extends Command {
  public run(ctx: CommandContext): void {
    const ping = this.client.ws.ping;

    const embedPing = new MessageEmbed()
      .setColor(EmbedColors.GENERAL)
      .setAuthor({
        name: `${this.client.user?.tag}`,
        iconURL: this.client.user?.displayAvatarURL(),
      })
      .addField("WebSocket", `${ping}ms`);

    ctx.reply({ embeds: [embedPing] });
  }
}
