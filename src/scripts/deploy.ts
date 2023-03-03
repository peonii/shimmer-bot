import { REST } from 'discord.js';
import path from 'node:path';
import { RESTPostAPIApplicationCommandsJSONBody, Routes } from 'discord.js';
import dotenv from 'dotenv';

import * as Commands from '../lib/commands';

dotenv.config();

const server = '898312474531602493';
const client = '988045225366798398';

const commands: Array<RESTPostAPIApplicationCommandsJSONBody> = [];

(async () => {
    // for (const category of categories) {
    //     for (const command of category.commands) {
    //         if (!command.data) continue // skip loading command if it doesn't exist
    //         commands.push(command.data.toJSON())
    //         console.info(`Loaded command ${command.data?.name}`)
    //     }
    // }
    Object.values(Commands).forEach(command => {
        const commandRunner = new command();

        const commandData = commandRunner.construct();
        console.dir(commandData);

        commands.push(commandData.toJSON());
    });

    if (process.env.BOT_TOKEN == null) {
        console.error('BOT_TOKEN is not set');
        process.exit(1);
    }

    const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);

    try {
        console.info('Registering commands...');

        const data: any = await rest.put(
            Routes.applicationGuildCommands(client, server),
            { body: commands }
        );

        console.info(`Registered ${data.length} commands`);
    } catch (err) {
        console.error(err);
    }
})();