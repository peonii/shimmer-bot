import { Client, Collection } from 'discord.js';
import { PrismaClient } from '@prisma/client';

import { ShimmerDiscordEvent } from '../types/events';
import * as Events from '../lib/events';
import * as Commands from '../lib/commands';
import { Command } from '../types/commands';
import {updateCache} from '../lib/warsaw/cache';
import {Configuration, OpenAIApi} from 'openai';
import '../types/interaction';

type UserID = string;

class Bot {
    discord: Client;
    db: PrismaClient;
    commands = new Collection<string, Command>();
    openai: OpenAIApi;
    cooldowns = new Collection<UserID, Collection<string, Date>>();

    constructor() {
        this.discord = new Client({ intents: [] });
        this.db = new PrismaClient();

        const configuration = new Configuration({
            apiKey: process.env.OPENAI_KEY
        });

        this.openai = new OpenAIApi(configuration);
    }

    async registerEvents() {
        Object.values(Events).forEach(event => {
            const eventRunner = new event() as ShimmerDiscordEvent;

            const runner = Reflect.getMetadata('events:runner', eventRunner) as string;

            if (runner == null) {
                return;
            }
            if (!eventRunner.name) {
                return;
            }

            if (eventRunner.once) {
                // This is disabled because we're sure runner exists on eventRunner
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                //@ts-ignore next-line
                this.discord.once(eventRunner.name, (...args) => eventRunner[runner](this, ...args));
            } else {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                //@ts-ignore next-line
                this.discord.on(eventRunner.name, (...args) => eventRunner[runner](this, ...args));
            }
            console.log('Registered event ' + eventRunner.name);
        });
    }

    async registerCommands() {
        Object.values(Commands).forEach(command => {
            const commandRunner = new command();

            const commandData = commandRunner.construct();

            this.commands.set(commandData.name, commandRunner);
        });
    }

    async start() {
        //await updateCache();

        await this.registerEvents();
        await this.registerCommands();
        await this.discord.login(process.env.BOT_TOKEN);
    }
}


export { Bot };
