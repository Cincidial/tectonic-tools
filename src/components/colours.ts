import { PokemonType } from "@/app/data/types/PokemonType";
import { Pokemon } from "../app/data/types/Pokemon";

export function getTypeColorClass(type: PokemonType, prefix: string, suffix: string | null = null): string {
    return `${prefix}-${type.id.toLowerCase()}${suffix ? "-" + suffix : ""}`;
}

export function getTypeGradient(pokemon: Pokemon): string {
    if (pokemon.type2) {
        const color1 = getTypeColorClass(pokemon.type1, "from", "bg");
        const color2 = getTypeColorClass(pokemon.type2, "to", "bg");
        return `bg-gradient-to-r ${color1} ${color2} pokemonGradient`;
    }

    return `${getTypeColorClass(pokemon.type1, "bg", "bg")} pokemonGradient`;
}
