import { InteractionCommandContext } from "@loop/structures/CommandContext";
import { RegularCommandContext } from "./RegularCommandContext";
import {
  ApplicationCommandOptionData,
  ClientEvents,
  ColorResolvable,
  CommandInteraction,
  MessageEmbedOptions,
  PermissionString,
  Message,
} from "discord.js";

export interface GuildData {
  id: string;
}

export interface CommandOption {
  name: string;
  category?: string;
  cooldown?: number;
  description?: string;
  devOnly?: boolean;
  allowDm?: boolean;
  clientPermissions?: PermissionString[];
  userPermissions?: PermissionString[];
  options?: ApplicationCommandOptionData[];
}

export interface ListenerOption {
  name: keyof ClientEvents;
  once?: boolean;
}

export interface BaseCommandContextReplyOption {
  timeout?: number;
  ephemeral?: boolean;
}

export interface CommandContextReplyOption extends BaseCommandContextReplyOption {
  type?: MessageActionType;
}

export type MessageInteractionAction = "reply" | "editReply" | "followUp";

export type Awaitable<T> = Promise<T> | T;

export type ValidOptionsForDecorator = ListenerOption | CommandOption;
