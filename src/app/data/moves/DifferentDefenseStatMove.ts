import { LoadedMove } from "../loading/moves";
import { Move } from "../types/Move";
import { Stat } from "../types/Pokemon";

const differentDefenseStatMoveCodes: Record<string, Stat> = {
    DoesPhysicalDamage: "defense",
    DoesSpecialDamage: "spdef",
    TargetsAttackDefends: "attack",
    TargetsSpAtkDefends: "spatk",
};

export class DifferentDefenseStatMove extends Move {
    defenseStat: Stat;
    constructor(move: LoadedMove) {
        super(move);
        this.defenseStat = differentDefenseStatMoveCodes[move.functionCode];
    }

    public getDefendingStat(): Stat {
        return this.defenseStat;
    }

    static moveCodes = Object.keys(differentDefenseStatMoveCodes);
}
