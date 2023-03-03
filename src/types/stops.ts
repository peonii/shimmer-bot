export interface WarsawStop {
    zespol: string;
    slupek: string;
    nazwa_zespolu: string;
    id_ulicy: string;
    szer_geo: string;
    dlug_geo: string;
    kierunek: string;
    obowiazuje_od: string
}

export type WarsawStops = WarsawStop[];