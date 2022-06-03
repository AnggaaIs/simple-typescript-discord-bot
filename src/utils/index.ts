import { BotClient } from "@loop/structures/Client";
import {
  ApplicationCommand,
  ApplicationCommandDataResolvable,
  ApplicationCommandResolvable,
  ChatInputApplicationCommandData,
  Collection,
} from "discord.js";

export function isProduction(): boolean {
  return process.env.NODE_ENV === "production" ? true : false;
}

export function classForDecorator<T extends (...args: any[]) => any>(target: T): ClassDecorator {
  return target;
}

export async function syncApplicationCommands(client: BotClient): Promise<void> {
  const guildId = client.config.botConfig.guild_id_dev;

  let registerCommands: Collection<string, any>;
  if (isProduction()) registerCommands = await client.application!.commands.fetch();
  else registerCommands = await client.application!.commands.fetch({ guildId });

  const filteredCommands: ApplicationCommandDataResolvable[] = [];
  const commands = Array.from(client.commands.values());

  for (const cmd of commands) {
    const option: ChatInputApplicationCommandData = {
      name: cmd.options.name,
      description: cmd.options.description || "No description provided.",
      type: "CHAT_INPUT",
      options: cmd.options.options || [],
    };

    if (cmd.options.devOnly) continue;
    filteredCommands.push(option);
  }

  //Register commands
  for (const cmd of filteredCommands) {
    await client.application?.commands.create(cmd, isProduction() ? undefined : guildId);
  }
  //Delete commands
  const deletedCommands = registerCommands.filter(
    (cmd: ApplicationCommand) => !filteredCommands.some((c) => c.name === cmd.name)
  );

  if (deletedCommands.size > 0) {
    deletedCommands.forEach(async (cmd: ApplicationCommand) => {
      await client.application!.commands.delete(cmd.id, isProduction() ? undefined : guildId);
    });
  }
}
