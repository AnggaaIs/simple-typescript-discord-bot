import { Collection } from "discord.js";
import { dir } from "node:console";
import { readdirSync } from "fs";
import { BotClient } from "../Client";
import { Command as CCommand } from "../Command";
import { promisify } from "node:util";

const sleep = promisify(setTimeout);

export default class CommandManager extends Collection<string, CCommand> {
  public constructor(public client: BotClient) {
    super();
  }

  public init(path: string): void {
    const directory = readdirSync(path, { withFileTypes: true });

    directory.forEach((a) => {
      if (a.isDirectory()) {
        return this.init(`${path}/${a.name}`);
      }

      const ImportedCommand = require(`${path}/${a.name}`);
      const Command: CCommand = new ImportedCommand[Object.keys(ImportedCommand)[0]](this.client);

      this.set(Command.options.name, Command);
    });
  }

  public getCommandByName(name: string): CCommand | null {
    const command = this.get(name);
    if (!command) return null;
    return command;
  }

  public getCommandsByCategory(category: string): Array<CCommand> {
    const commands = this.filter((command) => command.options.category === category);
    return Array.from(commands.values());
  }
}
