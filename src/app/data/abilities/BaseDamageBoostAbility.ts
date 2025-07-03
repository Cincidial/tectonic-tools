import { MoveData } from "@/app/damagecalc/components/MoveCard";
import { LoadedAbility } from "@/preload/loadedDataClasses";
import { Ability } from "../tectonic/Ability";

type damageBoostConditionFunction = (move: MoveData) => boolean;

const baseDamageBoostConditions: Record<string, damageBoostConditionFunction> = {
    RECKLESS: (move: MoveData) => move.move.isRecoil(),
};

const baseDamageBoostValues: Record<string, number> = {
    RECKLESS: 1.3,
};

export class BaseDamageBoostAbility extends Ability {
    private condition: damageBoostConditionFunction;
    private boostValue: number;
    constructor(ability: LoadedAbility) {
        super(ability);
        this.condition = baseDamageBoostConditions[ability.key];
        this.boostValue = baseDamageBoostValues[ability.key];
    }

    public movePowerMultiplier(move: MoveData) {
        return this.condition(move) ? this.boostValue : 1;
    }

    static abilityIds = Object.keys(baseDamageBoostConditions);
}
