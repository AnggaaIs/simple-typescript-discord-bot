import { Awaitable, CommandOption } from "@bot/typings";
import { BotClient } from "./Client";
import { CommandContext } from "./CommandContext";

export abstract class Command {
  public constructor(public client: BotClient, public options: CommandOption) {}

  public abstract run(ctx: CommandContext): Awaitable<unknown>;
}
