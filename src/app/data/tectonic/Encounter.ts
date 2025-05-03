interface Encounter {
    weight: number;
    pokemon: string;
}

export interface EncounterTable {
    type: string;
    encounters: Encounter[];
}

export interface EncounterMap {
    id: string;
    name: string;
    tables: EncounterTable[];
}
