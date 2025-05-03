import { DamageMultipliers } from "@/app/damagecalc/damageCalc";
import { LoadedItem } from "../loading/items";
import { Item } from "../types/Item";
import { Stats } from "../types/Pokemon";

export class LumberAxeItem extends Item {
    constructor(item: LoadedItem) {
        super(item);
    }

    public offensiveMultiplier(multipliers: DamageMultipliers): DamageMultipliers {
        multipliers.final_damage_multiplier *= 1.25;
        return multipliers;
    }

    // different behaviour from dev to current, more future proof to go with dev
    public modifyStats(stats: Stats): Stats {
        const newStats = { ...stats };
        newStats.speed *= 1 - 0.15;
        return newStats;
    }

    static itemIds = ["LUMBERAXE"];
}
