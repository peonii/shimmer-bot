import { ApplicationCommandOptionType, ChatInputCommandInteraction } from 'discord.js';
import { Bot } from '../../bot/index';
import { Argument, Command, Runner, ShimmerSlashCommandMeta } from '../../types/commands';
import fs from 'node:fs';

export default class TestCommand extends Command {
    meta: ShimmerSlashCommandMeta = { name: 'test', description: 'Test command' };

    @Argument({
        type: ApplicationCommandOptionType.String,
        description: 'Plz'
    })
        message = 'Default value';

    @Runner
    async runner(bot: Bot, interaction: ChatInputCommandInteraction): Promise<boolean> {
        await interaction.editReply(this.message);
        return true;
    }
}