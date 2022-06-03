import { Listener } from "@loop/structures/Listener";
import { ListenerOption } from "@loop/typings";
import { syncApplicationCommands } from "@loop/utils";
import { ApplyOptions } from "@loop/utils/decorators/ApplyOptions";

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
