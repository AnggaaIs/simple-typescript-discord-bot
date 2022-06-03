import { BotClient } from "@bot/structures/Client";
import { ValidOptionsForDecorator } from "@bot/typings";
import { classForDecorator } from "..";

export function ApplyOptions<T extends ValidOptionsForDecorator>(
  option: T | ((params: BotClient) => T)
): ClassDecorator {
  return classForDecorator((target) => {
    return new Proxy(target, {
      construct: (tgt, [client]) => new tgt(client, option instanceof Function ? option(client) : option),
    });
  });
}
