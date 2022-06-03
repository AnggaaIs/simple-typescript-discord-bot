import { Collection } from "discord.js";
import { readdirSync } from "node:fs";
import { BotClient } from "../Client";
import { Listener as LListener } from "../Listener";

export default class ListenerManager extends Collection<string, LListener> {
  public constructor(public client: BotClient) {
    super();
  }

  public init(path: string): void {
    const directory = readdirSync(path, { withFileTypes: true });

    directory.forEach(async (a) => {
      if (a.isDirectory()) {
        return this.init(`${path}/${a.name}`);
      }

      const ImportedListener = require(`${path}/${a.name}`);
      const Listener = new ImportedListener[Object.keys(ImportedListener)[0]](this.client);
      const options = Listener.options;

      this.set(options.once ? `${options.name}once` : options.name, Listener);
      this.client[options.once ? "once" : "on"](options.name, (...params) => Listener.run(...params));
    });
  }
}
