import { PokemonType } from "@/app/data/types/PokemonType";
import { Pokemon } from "../app/data/types/Pokemon";
import "./PokemonGradient.css";

export function getTypeColorClass(type: PokemonType, isBadge: boolean, prefix: string = "bg"): string {
    return `${prefix}-${type.id.toLowerCase()}${isBadge ? "" : "-bg"}`;
}

export function getTypeGradient(pokemon: Pokemon): string {
    if (pokemon.type2) {
        const color1 = getTypeColorClass(pokemon.type1, false, "from");
        const color2 = getTypeColorClass(pokemon.type2, false, "to");
        return `bg-gradient-to-r ${color1} ${color2} pokemonGradient`;
    }
    return `${getTypeColorClass(pokemon.type1, false)} pokemonGradient`;
}
