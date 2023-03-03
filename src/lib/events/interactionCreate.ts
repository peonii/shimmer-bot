import { Event } from '../../types/events';
import { Bot } from '../../bot';
import {Collection, Interaction} from 'discord.js';

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
            // @ts-ignore
            await interaction.deferReply({ ephemeral: commandClass['ephemeral'] });

            const userCooldowns = bot.cooldowns.get(interaction.user.id);
            const canBypassCooldown = interaction.user.id === '277016821809545216';

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            if (userCooldowns != null && commandClass['cooldown'] != null && !canBypassCooldown) {

                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                const definedCooldown = commandClass['cooldown'] as number;
                const cooldown = userCooldowns.get(interaction.commandName);

                if (cooldown != null) {
                    const time = Math.floor(cooldown.getTime() / 1000) + definedCooldown;
                    const timeTwo = Math.floor(new Date().getTime() / 1000);

                    if (timeTwo < time) {
                        return interaction.throw(`You are on cooldown! ${time - timeTwo} seconds remaining...`);
                    }
                }
            }

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore next-line
            const result: boolean = await commandClass[executor](bot, interaction);

            if (result) {
                if (bot.cooldowns.get(interaction.user.id) == null) {
                    bot.cooldowns.set(interaction.user.id, new Collection());
                }

                const cooldownsCollection = bot.cooldowns.get(interaction.user.id);

                if (cooldownsCollection == null) {
                    return;
                }

                cooldownsCollection.set(interaction.commandName, new Date());

                bot.cooldowns.set(interaction.user.id, cooldownsCollection);
            }
        }
    }
}
