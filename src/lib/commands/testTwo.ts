import { ApplicationCommandOptionType, ChatInputCommandInteraction } from 'discord.js';
import { Bot } from '../../bot/index';
import { Argument, Command, Runner, ShimmerSlashCommandMeta } from '../../types/commands';

export default class TestTwoCommand extends Command {
    meta: ShimmerSlashCommandMeta = { name: 'testtwo', description: 'Command description.' };

    @Runner
    async runner(bot: Bot, interaction: ChatInputCommandInteraction) {
        // Command runner.
        interaction.reply('thats me');
    }
}