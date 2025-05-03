import { LoadedDataJson } from "@/preload/loadTectonicRepoData";
import { LoadedData } from "@/preload/tectonicFileParsers";
import loadedData from "public/data/loadedData.json";
import { twoItemAbilities, TwoItemAbility } from "../abilities/TwoItemAbility";
import { Ability } from "../types/Ability";
import { PokemonType } from "../types/PokemonType";
import { Tribe } from "../types/Tribe";

const data = loadedData as unknown as LoadedDataJson;

function fromLoaded<L extends LoadedData<L>, T>(load: Record<string, L>, ctor: new (l: L) => T): Record<string, T> {
    return Object.fromEntries(Object.entries(load).map(([k, v]) => [k, new ctor(v)]));
}

function fromLoadedMapped<L extends LoadedData<L>, T>(load: Record<string, L>, map: (l: L) => T): Record<string, T> {
    return Object.fromEntries(Object.entries(load).map(([k, v]) => [k, map(v)]));
}

export const TectonicData = {
    version: data.version,
    types: fromLoaded(data.types, PokemonType),
    tribes: fromLoaded(data.tribes, Tribe),
    abilities: fromLoadedMapped(data.abilities, (x) =>
        x.key in twoItemAbilities ? new TwoItemAbility(x) : new Ability(x)
    ),
    typeChart: data.typeChart,
};
