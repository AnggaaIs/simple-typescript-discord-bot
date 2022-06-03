import { Command } from "@loop/structures/Command";
import { CommandContext } from "@loop/structures/CommandContext";

import { CommandOption } from "@loop/typings";
import { EmbedColors } from "@loop/utils/Constants";
import { ApplyOptions } from "@loop/utils/decorators/ApplyOptions";
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
