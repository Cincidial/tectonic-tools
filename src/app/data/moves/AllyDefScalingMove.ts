import { BattleState } from "@/app/data/battleState";
import { Move } from "../types/Move";
import { PartyPokemon } from "../types/PartyPokemon";

export class AllyDefScalingMove extends Move {
    customVarName: string = "Ally Defense";
    customVarType: string = "number";
    needsInput: boolean = true;
    public getPower(user: PartyPokemon, target: PartyPokemon, battleState: BattleState, def: number): number {
        let power = Math.floor(def / 5) * 5;
        power = Math.max(power, 40);
        power = Math.min(power, 200);
        return power;
    }

    static moveCodes = ["HardPlace"];
}
