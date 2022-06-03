import { Listener } from "@bot/structures/Listener";
import { ListenerOption } from "@bot/typings";
import { syncApplicationCommands } from "@bot/utils";
import { ApplyOptions } from "@bot/utils/decorators/ApplyOptions";

@ApplyOptions<ListenerOption>({
  name: "ready",
  once: true,
})
export class Ready extends Listener {
  public run(): void {
    this.client.log.info(`${this.client.listeners2.size} listener(s) loaded`);
    this.client.log.info(`${this.client.commands.size} command(s) loaded`);
    this.client.log.info(`${this.client.user?.tag} Connected to Discord!`);

    syncApplicationCommands(this.client);

    this.client.user?.setActivity({
      name: `${this.client.user?.username} | Party with me.`,
    });
  }
}
