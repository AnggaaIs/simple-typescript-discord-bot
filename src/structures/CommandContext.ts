import { CommandContextReplyOption, MessageInteractionAction } from "@bot/typings";
import { CommandInteraction, InteractionReplyOptions, PermissionString } from "discord.js";
import { BotClient } from "./Client";

export class CommandContext {
  public constructor(public client: BotClient, public interaction: CommandInteraction) {}

  public async reply(
    messageContent: string | InteractionReplyOptions,
    options?: CommandContextReplyOption
  ): Promise<void> {
    if (options && options.ephemeral && options.timeout) {
      throw new Error("Cannot set both ephemeral and timeout.");
    }
    const isTimeout = options && options.timeout !== undefined ? true : false;
    const type: MessageInteractionAction = options && options.type !== undefined ? options.type : "reply";

    if (typeof messageContent === "string") {
      await this.interaction[type]({
        content: messageContent,
        ephemeral: options?.ephemeral,
      });
      if (isTimeout) setTimeout(() => this.interaction.deleteReply().catch(() => {}), options?.timeout);
    } else {
      if (messageContent.ephemeral && isTimeout) {
        throw new Error("Cannot set both ephemeral and timeout.");
      }
      await this.interaction[type](messageContent);
      if (isTimeout) setTimeout(() => this.interaction.deleteReply().catch(() => {}), options?.timeout);
    }
  }

  public checkUserPermission(permissions: PermissionString): boolean {
    const { user, guild } = this.interaction;
    return guild!.members!.cache.get(user.id)!.permissions.has(permissions);
  }

  public checkClientPermission(permissions: PermissionString): boolean {
    const { guild } = this.interaction;
    return guild!.me!.permissions.has(permissions);
  }

  public checkUserPermissions(permissions: PermissionString[]): PermissionString[] {
    const missingPermissions: PermissionString[] = [];

    for (const perm of permissions) {
      if (!this.checkUserPermission(perm)) missingPermissions.push(perm);
    }

    return missingPermissions;
  }

  public checkClientPermissions(permissions: PermissionString[]): PermissionString[] {
    const missingPermissions: PermissionString[] = [];

    for (const perm of permissions) {
      if (!this.checkClientPermission(perm)) missingPermissions.push(perm);
    }

    return missingPermissions;
  }

  public defer(): void {
    this.interaction.deferReply();
  }

  public get user(): CommandInteraction["user"] {
    return this.interaction.user;
  }

  public get options(): CommandInteraction["options"] {
    return this.interaction.options;
  }

  public get isDev(): boolean {
    return this.client.config.botConfig.owners.includes(this.interaction.user.id) ? true : false;
  }

  public get inGuild(): boolean {
    return this.interaction.inGuild() ? true : false;
  }

  public get inDM(): boolean {
    return this.interaction.channel?.type === "DM" ? true : false;
  }
}
