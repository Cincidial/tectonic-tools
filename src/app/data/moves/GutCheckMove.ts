import { Move } from "../tectonic/Move";
import { PokemonType } from "../tectonic/PokemonType";
import { TectonicData } from "../tectonic/TectonicData";
import { PartyPokemon } from "../types/PartyPokemon";

// idk if there's a reasonable way to combine VariableTypeMove and ConditionalAutoBoostMove without just rewriting it like this
export class GutCheckMove extends Move {
    public getPower(user: PartyPokemon): number {
        return this.bp * (user.species.getFormName(user.form) === "Hangry" ? 2 : 1);
    }

    public getType(user: PartyPokemon): PokemonType {
        if (user.species.getFormName(user.form) === "Hangry") {
            return TectonicData.types["DARK"];
        }
        return this.type;
    }

    static moveCodes = ["GutCheck"];
}
