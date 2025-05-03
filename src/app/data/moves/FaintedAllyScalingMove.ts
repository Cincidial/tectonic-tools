import { BattleState } from "@/app/data/battleState";
import { Move } from "../types/Move";
import { PartyPokemon } from "../types/PartyPokemon";

export class FaintedAllyScalingMove extends Move {
    customVarName: string = "Fainted Allies";
    customVarType: string = "number";
    needsInput: boolean = true;
    public getPower(_: PartyPokemon, __: PartyPokemon, battleState: BattleState, faintedAllies: number): number {
        return this.bp + faintedAllies * 20;
    }

    static moveCodes = ["ScalesFaintedPartyMembers"];
}
