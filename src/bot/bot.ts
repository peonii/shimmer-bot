import { Client } from 'discord.js';

class Bot {
    discord: Client;

    constructor() {
        this.discord = new Client({ intents: [] });
    }
}

const bot = new Bot();

export { bot, Bot };
