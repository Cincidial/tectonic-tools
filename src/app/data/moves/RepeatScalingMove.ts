import { BattleState } from "@/app/data/battleState";
import { LoadedMove } from "../loading/moves";
import { Move } from "../types/Move";
import { PartyPokemon } from "../types/PartyPokemon";

export class RepeatScalingMove extends Move {
    customVarName: string = "Times Used Consecutively";
    customVarType: string = "number";
    needsInput: boolean = true;
    constructor(move: LoadedMove) {
        super(move);
    }

    public getPower(_: PartyPokemon, __: PartyPokemon, ___: BattleState, turns: number): number {
        return this.bp * turns * 20;
    }

    static moveCodes = ["HeartRhythm"];
}
