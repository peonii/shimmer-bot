import Discord from 'discord.js';
import dotenv from 'dotenv';
import {Bot} from './bot';

dotenv.config();

if (!process.env.BOT_TOKEN) {
    console.error('Error: no BOT_TOKEN environment variable provided!');
    process.exit(1);
}

if (!process.env.OPENAI_KEY) {
    console.error('Error: no OPENAI_KEY environment variable provided!');
    process.exit(1);
}

/*
const shardingManager = new Discord.ShardingManager('./dist/bot/start.js', {
    token: process.env.BOT_TOKEN
});

shardingManager.on('shardCreate', shard => {
    console.log(`Launched shard ${shard.id}`);
});

shardingManager.spawn();
 */

const bot = new Bot();
bot.start();
