import { Move } from "../tectonic/Move";
import { PartyPokemon } from "../types/PartyPokemon";

export class SlownessScalingMove extends Move {
    public getPower(user: PartyPokemon, target: PartyPokemon): number {
        // getStats takes a MoveData input to see if crits etc should ignore stat steps
        // thankfully at least as of writing nothing like that affects speed so we don't need it here
        const ratio = target.getStats().speed / user.getStats().speed;
        let basePower = Math.floor(5 * (5 * ratio));
        basePower = Math.min(basePower, 150);
        basePower = Math.max(basePower, 40);
        return basePower;
    }

    static moveCodes = ["ScalesSlowerThanTarget"];
}
