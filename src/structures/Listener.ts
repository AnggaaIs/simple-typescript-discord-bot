import { Awaitable, ListenerOption } from "@bot/typings";
import { BotClient } from "./Client";

export abstract class Listener {
  public constructor(public client: BotClient, public options: ListenerOption) {}

  public abstract run(...params: unknown[]): Awaitable<unknown>;
}
