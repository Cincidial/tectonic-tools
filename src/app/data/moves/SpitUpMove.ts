import { BattleState } from "@/app/data/battleState";
import { Move } from "../tectonic/Move";
import { PartyPokemon } from "../types/PartyPokemon";

export class SpitUpMove extends Move {
    customVarName: string = "Stockpiles";
    customVarType: string = "number";
    needsInput: boolean = true;

    public getPower(user: PartyPokemon, target: PartyPokemon, battleState: BattleState, stockpiles: number): number {
        stockpiles = Math.max(stockpiles, 0);
        stockpiles = Math.min(stockpiles, 3);
        return stockpiles * 150;
    }

    static moveCodes = ["PowerDependsOnUserStockpile"];
}
