import { BattleState } from "../battleState";
import { Move } from "../types/Move";
import { PartyPokemon } from "../types/PartyPokemon";

export class SpikeScalingMove extends Move {
    customVarName: string = "Spikes Under Target";
    customVarType: string = "number";
    needsInput: boolean = true;
    public getPower(_: PartyPokemon, __: PartyPokemon, ___: BattleState, spikes: number): number {
        spikes = Math.max(spikes, 0);
        spikes = Math.min(spikes, 3);
        const basePower = this.bp;
        return basePower + spikes * 30;
    }

    static moveCodes = ["UserFaintsExplosiveScalesWithEnemySideSpikes"];
}
