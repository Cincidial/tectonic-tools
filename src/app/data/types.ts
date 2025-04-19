import loadedTypes from "public/data/types.json";

import { LoadedType } from "./loading/types";
import { PokemonType } from "./types/PokemonType";

function loadType(type: LoadedType): PokemonType {
    return new PokemonType(type);
}

export const types: Record<string, PokemonType> = Object.fromEntries(
    Object.entries(loadedTypes).map(([id, monType]) => [id, loadType(monType)])
);

export const nullType = new PokemonType({
    key: "",
    index: 0,
    name: "",
    weaknesses: "",
    resistances: "",
    immunities: "",
    isRealType: false,
});
