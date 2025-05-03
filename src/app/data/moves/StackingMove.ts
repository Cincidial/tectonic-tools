import { BattleState } from "@/app/data/battleState";

import { Move } from "../tectonic/Move";
import { PartyPokemon } from "../types/PartyPokemon";

export class StackingMove extends Move {
    customVarName: string = "Times Used Consecutively";
    customVarType: string = "number";
    needsInput: boolean = true;

    public getPower(_: PartyPokemon, __: PartyPokemon, ___: BattleState, turns: number): number {
        return this.bp * Math.pow(2, turns);
    }

    static moveCodes = ["EchoedVoice", "RockRoll", "FuryCutter", "IceBall"];
}
