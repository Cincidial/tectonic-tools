import { MoveData } from "@/app/damagecalc/components/MoveCard";
import { DamageMultipliers } from "@/app/damagecalc/damageCalc";
import { LoadedItem } from "../loading/items";
import { Item } from "../types/Item";
import { PartyPokemon } from "../types/PartyPokemon";

const itemCategories: Record<string, ["Physical" | "Special", number]> = {
    STRENGTHHERB: ["Physical", 1.3],
    INTELLECTHERB: ["Special", 1.3],
    MUSCLEBAND: ["Physical", 1.1],
    WISEGLASSES: ["Special", 1.1],
};

export class CategoryBoostingItem extends Item {
    boostedCategory: "Physical" | "Special";
    boostMult: number;
    constructor(item: LoadedItem) {
        super(item);
        const boostInfo = itemCategories[item.key];
        this.boostedCategory = boostInfo[0];
        this.boostMult = boostInfo[1];
    }

    public offensiveMultiplier(
        multipliers: DamageMultipliers,
        move: MoveData,
        user: PartyPokemon,
        target: PartyPokemon
    ): DamageMultipliers {
        if (move.move.getDamageCategory(move, user, target) === this.boostedCategory) {
            // 33% is [sic], the code and description disagree currently in Tectonic
            multipliers.final_damage_multiplier *= 1.33;
        }
        return multipliers;
    }

    static itemIds = Object.keys(itemCategories);
}
