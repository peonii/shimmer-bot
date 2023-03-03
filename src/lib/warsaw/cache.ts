import fs from 'node:fs';

export async function updateCache() {
    // &apikey=wartość
    console.log('running');

    const ENDPOINT = 'https://api.um.warszawa.pl/api/action/dbstore_get?id=ab75c33d-3a26-4342-b36a-6e5fef0a3ac3'
        + `&apikey=${process.env.WARSAW_API_KEY}`;

    const stopsRequest = await fetch(ENDPOINT, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const stops = (await stopsRequest.json()).result as { values: { value: string, key: string }[] }[];
    let i = 0;

    const stopsParsed = stops.map(stop => {
        const stopsValues = stop.values;

        const currentStop: { [key: string]: string | number } = {};

        stopsValues.forEach(val => {
            currentStop[val.key] = val.value;
        });

        currentStop['id'] = i;
        i++;

        return currentStop;
    });

    fs.writeFileSync('./.cache/warsaw.json', JSON.stringify(stopsParsed));
}