import {ChatInputCommandInteraction} from 'discord.js';

declare module 'discord.js' {
    interface ChatInputCommandInteraction {
        throw: (error: string) => Promise<boolean>
    }
}

ChatInputCommandInteraction.prototype.throw = async function (this: ChatInputCommandInteraction, error: string) {
    if (this.replied || this.deferred) {
        await this.editReply(':x: **Error:** ' + error);
    } else {
        await this.reply(':x: **Error** ' + error);
    }

    return false;
}