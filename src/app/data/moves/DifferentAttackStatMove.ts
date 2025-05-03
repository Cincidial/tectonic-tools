import { LoadedMove } from "../loading/moves";
import { Move } from "../types/Move";
import { Stat } from "../types/Pokemon";

const differentAttackStatMoveCodes: Record<string, Stat> = {
    AttacksWithDefense: "defense",
    AttacksWithSpDef: "spdef",
};

export class DifferentAttackingStatMove extends Move {
    attackStat: Stat;
    constructor(move: LoadedMove) {
        super(move);
        this.attackStat = differentAttackStatMoveCodes[move.functionCode];
    }

    public getAttackingStat(): Stat {
        return this.attackStat;
    }

    static moveCodes = Object.keys(differentAttackStatMoveCodes);
}
