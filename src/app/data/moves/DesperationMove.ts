import { BattleState } from "@/app/data/battleState";
import { Move } from "../types/Move";
import { PartyPokemon } from "../types/PartyPokemon";

export class DesperationMove extends Move {
    customVarName: string = "HP";
    customVarType: string = "number";
    needsInput: boolean = true;
    public getPower(user: PartyPokemon, target: PartyPokemon, battleState: BattleState, hp: number): number {
        hp = Math.max(hp, 1);
        hp = Math.min(hp, user.getStats().hp);
        const hpRatio = hp / user.getStats().hp;
        return Math.min(Math.floor(20 / (hpRatio * 5) ** 0.75) * 5, 200);
    }

    static moveCodes = ["ScalesWithLostHP", "SwitchOutUserDamagingMoveScalesWithLostHP"];
}
