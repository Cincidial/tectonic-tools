import { MoveData } from "@/app/damagecalc/components/MoveCard";
import { LoadedAbility } from "@/preload/loadedDataClasses";
import { BattleState } from "../battleState";
import { Ability } from "../tectonic/Ability";
import { PartyPokemon } from "../types/PartyPokemon";

type damageBoostConditionFunction = (move: MoveData, user: PartyPokemon, battleState: BattleState) => boolean;

const attackMultBoostCondition: Record<string, damageBoostConditionFunction> = {
    PALEOLITHIC: (move: MoveData, user: PartyPokemon, battleState: BattleState) =>
        move.move.getType(user, battleState).id === "ROCK",
};

const attackMultBoostValues: Record<string, number> = {
    PALEOLITHIC: 1.5,
};

export class AttackMultBoostAbility extends Ability {
    private condition: damageBoostConditionFunction;
    private boostValue: number;
    constructor(ability: LoadedAbility) {
        super(ability);
        this.condition = attackMultBoostCondition[ability.key];
        this.boostValue = attackMultBoostValues[ability.key];
    }

    public attackMultiplier(move: MoveData, user: PartyPokemon, battleState: BattleState) {
        return this.condition(move, user, battleState) ? this.boostValue : 1;
    }

    static abilityIds = Object.keys(attackMultBoostCondition);
}
