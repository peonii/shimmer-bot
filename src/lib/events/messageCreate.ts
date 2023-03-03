import { Event } from '../../types/events';
import { Bot } from '../../bot';
import {Message} from 'discord.js';

@Event.Name('messageCreate')
export default class MessageCreateEvent {
    @Event.Runner()
    async runner(bot: Bot, message: Message) {
        if (message.content === 'quick alt') {
            await message.reply('блядь а ты что говорить');
        }
    }
}
