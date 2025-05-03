import { LoadedMove } from "../loading/moves";
import { types } from "../types";
import { Move } from "../types/Move";
import { PartyPokemon } from "../types/PartyPokemon";
import { PokemonType } from "../types/PokemonType";

// idk if there's a reasonable way to combine VariableTypeMove and ConditionalAutoBoostMove without just rewriting it like this
export class GutCheckMove extends Move {
    constructor(move: LoadedMove) {
        super(move);
    }
    public getPower(user: PartyPokemon): number {
        return this.bp * (user.species.getFormName(user.form) === "Hangry" ? 2 : 1);
    }

    public getType(user: PartyPokemon): PokemonType {
        if (user.species.getFormName(user.form) === "Hangry") {
            return types["DARK"];
        }
        return this.type;
    }

    static moveCodes = ["GutCheck"];
}
