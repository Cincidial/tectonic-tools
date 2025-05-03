import { MoveData } from "@/app/damagecalc/components/MoveCard";
import { DamageMultipliers } from "@/app/damagecalc/damageCalc";
import { LoadedItem } from "../loading/items";
import { Item } from "../types/Item";
import { PartyPokemon } from "../types/PartyPokemon";

export class EvioliteItem extends Item {
    constructor(item: LoadedItem) {
        super(item);
    }

    public defensiveMultiplier(
        multipliers: DamageMultipliers,
        move: MoveData,
        target: PartyPokemon
    ): DamageMultipliers {
        if (!target.species.getEvoNode().isLeaf()) {
            multipliers.defense_multiplier *= 1.5;
        }
        return multipliers;
    }
    static itemIds = ["EVIOLITE"];
}
