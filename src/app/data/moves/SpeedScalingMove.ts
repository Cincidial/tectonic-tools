import { Move } from "../tectonic/Move";
import { PartyPokemon } from "../types/PartyPokemon";

export class SpeedScalingMove extends Move {
    public getPower(user: PartyPokemon, target: PartyPokemon): number {
        // getStats takes a MoveData input to see if crits etc should ignore stat steps
        // thankfully at least as of writing nothing like that affects speed so we don't need it here
        const ratio = user.getStats().speed / target.getStats().speed;
        let basePower = 10 + Math.floor(7 * ratio) * 5;
        basePower = Math.min(basePower, 150);
        basePower = Math.max(basePower, 40);
        return basePower;
    }

    static moveCodes = ["ScalesFasterThanTarget"];
}
