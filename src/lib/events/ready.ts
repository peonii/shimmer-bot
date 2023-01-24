import { Bot } from '../../bot/index';
import { Event } from '../../types/events';

@Event.Name('ready')
@Event.Once()
export default class ReadyEvent {
    @Event.Runner()
    async run(bot: Bot) {
        console.log('Ran ready event.');

        console.log('Logged in as ' + bot.discord.user?.tag);
    }
}