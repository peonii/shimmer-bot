import { ApplicationCommandOptionType, ChatInputCommandInteraction } from 'discord.js';
import { Bot } from '../../bot/index';
import {Argument, Command, Cooldown, Runner, ShimmerSlashCommandMeta} from '../../types/commands';

@Cooldown(300)
export default class AiCommand extends Command {
    meta: ShimmerSlashCommandMeta = { name: 'ai', description: 'Generate an AI prompt using OpenAI\'s API!' };

    @Argument({
        type: ApplicationCommandOptionType.String,
        description: 'Chat prompt (max 50 characters)'
    })
        prompt = '';

    @Runner
    async runner(bot: Bot, interaction: ChatInputCommandInteraction): Promise<boolean> {
        if (this.prompt.length > 100) {
            return interaction.throw('Prompt must be 100 characters or shorter!');
        }

        const completion = await bot.openai.createCompletion({
            model: 'text-curie-001',
            prompt: this.prompt,
            max_tokens: 1000
        });

        console.dir(completion, { depth: 9999 });

        await interaction.editReply({ content: `**${this.prompt}**\n\n\`\`\`${completion.data.choices[0].text}\`\`\`` });

        return true;
    }
}