import { Move } from "../tectonic/Move";
import { PartyPokemon } from "../types/PartyPokemon";

export class HeightUserScalingMove extends Move {
    public getPower(user: PartyPokemon, target: PartyPokemon): number {
        let ret = 40;
        let ratio = user.species.height / target.species.height;
        ratio = Math.min(ratio, 10);
        ret += Math.floor((16 * ratio ** 0.75) / 5) * 5;
        return ret;
    }

    static moveCodes = ["ScalesTallerThanTarget"];
}
