import {ApplicationCommandOptionType, ChatInputCommandInteraction, EmbedBuilder} from 'discord.js';
import { Bot } from '../../bot/index';
import { Argument, Command, Runner, ShimmerSlashCommandMeta } from '../../types/commands';
import fs from 'node:fs';
import {WarsawStops} from '$/types/stops';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import MiniSearch from 'minisearch';

export default class StopCommand extends Command {
    meta: ShimmerSlashCommandMeta = { name: 'stop', description: 'Command description.' };

    @Argument({
        type: ApplicationCommandOptionType.String,
        description: 'Stop name to filter for'
    })
        name = '';

    @Runner
    async runner(bot: Bot, interaction: ChatInputCommandInteraction): Promise<boolean> {
        const stopsCache = JSON.parse(fs.readFileSync('./.cache/warsaw.json').toString()) as WarsawStops;

        const searchOpts = new MiniSearch({
            fields: ['nazwa_zespolu'],
            searchOptions: {
                fuzzy: 0.45,
                prefix: true,
            },
            storeFields: [
                'nazwa_zespolu', 'zespol', 'slupek', 'kierunek'
            ],

        });

        searchOpts.addAll(stopsCache);

        const results = searchOpts.search(this.name);
        const visited = new Set<string>();

        const resultsNames: string[] = [];

        for (const result of results) {
            const nazwa = result['nazwa_zespolu'];
            if (visited.has(nazwa)) continue;

            visited.add(nazwa);
            resultsNames.push(nazwa);
        }

        if (resultsNames.length > 1 && resultsNames[0].toLowerCase() !== this.name.toLowerCase().trim()) {
            await interaction.editReply(
                `Multiple (${resultsNames.length}) stops found with query \`${this.name}\`.
                \nDid you mean one of these?\n\t${resultsNames.slice(0, 10).join('\n\t')}\n\t${resultsNames.length > 10 ? '... (' + (resultsNames.length - 10) + ' left)' : ''}`
            );
            return false;
        }

        if (resultsNames.length === 0) {
            return interaction.throw(`No stop found with query \`${this.name}\`.`);
        }

        const lines = new Set<string>();

        for (const result of results) {
            if (resultsNames[0] !== result.nazwa_zespolu) continue;

            const STOP_ENDPOINT = 'https://api.um.warszawa.pl/api/action/dbtimetable_get?id=88cd555f-6f31-43ca-9de4-66c479ad5942'
                + `&apikey=${process.env.WARSAW_API_KEY}`
                + `&busstopId=${result.zespol}`
                + `&busstopNr=${result.slupek}`;

            try {
                const stopRequest = await fetch(STOP_ENDPOINT, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                const stopData = await stopRequest.json();
                console.log(stopData);
                const stopValues = stopData.result as { values: { key: string, value: string }[] }[];


                for (const stopValuesObj of stopValues) {
                    lines.add(stopValuesObj.values[0].value);
                }
            } catch (err) {
                // idk skip lol
            }
        }

        const result = results[0];

        const linesArr = Array.from(lines).sort();

        const resultEmbed = new EmbedBuilder()
            .setTitle(`Przystanek ${result.nazwa_zespolu}`)
            .setColor('#466aa8')
            .addFields([
                { name: 'ID', value: result.zespol },
                { name: 'Linie', value: linesArr.join(', ') }
            ]);

        await interaction.editReply({ embeds: [resultEmbed], content: '' });
        return true;
    }
}