import { Move } from "../tectonic/Move";
import { PartyPokemon } from "../types/PartyPokemon";

export class StepScalingMove extends Move {
    public getPower(user: PartyPokemon): number {
        const basePower = this.bp;
        const totalSteps = Object.values(user.statSteps).reduce((total, current) => total + Math.max(current, 0), 0);
        return basePower + totalSteps * 10;
    }

    static moveCodes = ["ScalesUsersPositiveStatSteps"];
}
