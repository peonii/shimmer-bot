import { Event } from '../../types/events';
import { Bot } from '../../bot';
import { Interaction } from 'discord.js';

@Event.Name('interactionCreate')
export default class InteractionCreateEvent {
    @Event.Runner()
    async runner(bot: Bot, interaction: Interaction) {
        // Your code runner.

        console.dir(interaction);

        // Command handler
        if (interaction.isChatInputCommand()) {
            const commandClass = bot.commands.get(interaction.commandName);

            if (!commandClass)
                return interaction.reply('This command does not exist.');

            const executor = Reflect.getMetadata('cmd:runner', commandClass) as string;

            console.log('Loading...');
            await commandClass.load(interaction);

            console.log('Loaded.');
            console.dir(commandClass);
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore next-line
            await commandClass[executor](bot, interaction);
        }
    }
}
