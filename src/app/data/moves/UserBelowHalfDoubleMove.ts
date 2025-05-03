import { BattleState } from "@/app/data/battleState";
import { Move } from "../tectonic/Move";
import { PartyPokemon } from "../types/PartyPokemon";

export class UserBelowHalfDoubleMove extends Move {
    customVarName: string = "HP";
    customVarType: string = "number";
    needsInput: boolean = true;
    public getPower(user: PartyPokemon, target: PartyPokemon, battleState: BattleState, hp: number): number {
        hp = Math.max(hp, 1);
        hp = Math.min(hp, user.getStats().hp);
        const hpRatio = hp / user.getStats().hp;
        return this.bp * (hpRatio < 0.5 ? 2 : 1);
    }

    static moveCodes = ["DoubleDamageUserBelowHalf"];
}
