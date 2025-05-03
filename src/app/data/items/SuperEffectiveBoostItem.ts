import { MoveData } from "@/app/damagecalc/components/MoveCard";
import { DamageMultipliers } from "@/app/damagecalc/damageCalc";
import { BattleState } from "../battleState";
import { Item } from "../tectonic/Item";
import { PartyPokemon } from "../types/PartyPokemon";

export class SuperEffectiveBoostItem extends Item {
    public offensiveMultiplier(
        multipliers: DamageMultipliers,
        move: MoveData,
        user: PartyPokemon,
        target: PartyPokemon,
        battleState: BattleState,
        typeEffectMult: number
    ): DamageMultipliers {
        if (typeEffectMult > 1) {
            multipliers.final_damage_multiplier *= 1.2;
        }

        return multipliers;
    }

    static itemIds = ["EXPERTBELT"];
}
