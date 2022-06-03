import { CommandContext } from "@bot/structures/CommandContext";
import { Listener } from "@bot/structures/Listener";
import { ListenerOption } from "@bot/typings";
import { ApplyOptions } from "@bot/utils/decorators/ApplyOptions";
import { Collection, Interaction, TextChannel } from "discord.js";

@ApplyOptions<ListenerOption>({
  name: "interactionCreate",
})
export class InteractionCreate extends Listener {
  public async run(interaction: Interaction): Promise<void> {
    if (!interaction.isCommand()) return;

    const ctx = new CommandContext(this.client, interaction);
    const { user, channel, commandName } = ctx.interaction;

    const command = this.client.commands.getCommandByName(commandName);
    if (!command) return;

    if (command.options.devOnly && !ctx.isDev) return;
    if (!command.options.allowDm && ctx.inDM) {
      ctx.reply(":x: **|** You can't use this command in DM!", { timeout: 45000 });
      return;
    }

    if (ctx.inGuild) {
      const { guild } = ctx.interaction;
      const { clientPermissions = [], userPermissions = [] } = command.options;
      const { defaultPermissions } = this.client.config.botConfig;

      //Handle default permissions for bot
      if (defaultPermissions.length > 0) {
        const missingPermissions = ctx.checkClientPermissions(defaultPermissions);
        if (missingPermissions.length > 0) {
          ctx.reply(
            {
              embeds: [
                {
                  title: "Missing permissions",
                  color: "RED",
                  description: `:x: **|** I need ${missingPermissions
                    .map((x) => `\`${x}\``)
                    .join(", ")} permission for it to work properly.`,
                },
              ],
            },
            { timeout: 30000 }
          );
          return;
        }
      }

      //Handle command permissions for bot
      if (clientPermissions.length > 0) {
        const missingPermissions = ctx.checkClientPermissions(clientPermissions);
        if (missingPermissions.length > 0) {
          ctx.reply(
            {
              embeds: [
                {
                  title: "Missing permissions",
                  color: "RED",
                  description: `:x: **|** I need ${missingPermissions
                    .map((x) => `\`${x}\``)
                    .join(", ")} permission to run \`${command.options.name}\` command`,
                },
              ],
            },
            { timeout: 30000 }
          );
          return;
        }
      }

      //Handle command permissions for user
      if (userPermissions.length > 0) {
        const missingPermissions = ctx.checkUserPermissions(userPermissions);
        if (missingPermissions.length > 0) {
          ctx.reply(
            {
              embeds: [
                {
                  title: "Missing permissions",
                  color: "RED",
                  description: `:x: **|** You need ${missingPermissions
                    .map((x) => `\`${x}\``)
                    .join(", ")} permission to use \`${command.options.name}\` command.`,
                },
              ],
            },
            { timeout: 30000 }
          );
          return;
        }
      }
    }

    if (command.options.cooldown || (command.options.cooldown || 3) > 0) {
      if (!this.client.cooldowns.has(command.options.name)) {
        this.client.cooldowns.set(command.options.name, new Collection());
      }

      const timestamp = this.client.cooldowns.get(command.options.name)!;
      const cooldownAmount = (command.options.cooldown || 3) * 1000;

      if (!timestamp.has(user.id)) {
        timestamp.set(user.id, Date.now());
        if (ctx.isDev) timestamp.delete(user.id);
      } else {
        const time = timestamp.get(user.id)!;
        if (Date.now() < time) {
          const timeRemaing = (time - Date.now()) / 1000;
          ctx.reply(
            `⏲️ **|** You need to wait ${timeRemaing.toFixed(1)} more second(s) before using \`${
              command.options.name
            }\``
          );
          return;
        }

        setTimeout(() => timestamp.delete(user.id), cooldownAmount);
      }
    }

    try {
      await command.run(ctx);
    } catch (error) {
      this.client.log.error(error);
    }
  }
}
