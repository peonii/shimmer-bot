import { ApplicationCommandOptionType, ChatInputCommandInteraction } from 'discord.js';
import { Bot } from '../../bot/index';
import {Argument, Command, Ephemeral, Runner, ShimmerSlashCommandMeta} from '../../types/commands';

@Ephemeral
export default class TestTwoCommand extends Command {
    meta: ShimmerSlashCommandMeta = { name: 'testtwo', description: 'Command description.' };

    @Runner
    async runner(bot: Bot, interaction: ChatInputCommandInteraction): Promise<boolean> {
        // Command runner.
        await interaction.editReply('thats me');
        return true;
    }
}