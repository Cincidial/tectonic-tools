import { DamageMultipliers } from "@/app/damagecalc/damageCalc";
import { Item } from "../tectonic/Item";
import { Stats } from "../tectonic/Pokemon";

export class LumberAxeItem extends Item {
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
