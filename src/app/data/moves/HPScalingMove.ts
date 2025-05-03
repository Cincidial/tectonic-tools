import { BattleState } from "@/app/data/battleState";
import { Move } from "../tectonic/Move";
import { PartyPokemon } from "../types/PartyPokemon";

export class HPScalingMove extends Move {
    customVarName: string = "HP";
    customVarType: string = "number";
    needsInput: boolean = true;

    public getPower(user: PartyPokemon, target: PartyPokemon, battleState: BattleState, hp: number): number {
        // From 65 to 130 in increments of 5, Overhealed caps at 195
        let hpFraction = hp / user.getStats().hp;
        hpFraction = Math.max(hpFraction, 0.5);
        hpFraction = Math.min(hpFraction, 1.5);
        const basePower = Math.floor(26 * hpFraction) * 5;
        return basePower;
    }

    static moveCodes = ["ScalesWithUserHP"];
}
