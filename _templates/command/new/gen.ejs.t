---
to: src/lib/commands/<%= h.changeCase.camel(name) %>.ts
---
import { ApplicationCommandOptionType, ChatInputCommandInteraction } from 'discord.js';
import { Bot } from '../../bot/index';
import { Argument, Command, Runner, ShimmerSlashCommandMeta } from '../../types/commands';

export default class <%= h.changeCase.pascal(name) %>Command extends Command {
    meta: ShimmerSlashCommandMeta = { name: '<%= h.changeCase.lower(name) %>', description: 'Command description.' };

    @Runner
    async runner(bot: Bot, interaction: ChatInputCommandInteraction): Promise<boolean> {
        // Command runner.

        return true;
    }
}