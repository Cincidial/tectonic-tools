import loadedTypes from "public/data/types.json";

import { LoadedType } from "./loading/types";
import { PokemonType } from "./types/PokemonType";

function loadType(item: LoadedType): PokemonType {
    return new PokemonType(
        item.key,
        item.index,
        item.name,
        item.weaknesses,
        item.resistances,
        item.immunities,
        item.isRealType
    );
}

export const types: Record<string, PokemonType> = Object.fromEntries(
    Object.entries(loadedTypes).map(([id, monType]) => [id, loadType(monType)])
);

export const nullType = new PokemonType("", 0, "", "", "", "", false);
