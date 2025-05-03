import { MoveData } from "@/app/damagecalc/components/MoveCard";
import { DamageMultipliers } from "@/app/damagecalc/damageCalc";
import { LoadedItem } from "@/preload/loadedDataClasses";
import { BattleState } from "../battleState";
import { PartyPokemon } from "../types/PartyPokemon";
import { Stats } from "./Pokemon";

export class Item {
    id: string = "";
    name: string = "";
    description: string = "";
    pocket: number = 0;
    flags: string[] = [];

    static NULL: Item = null!;

    constructor(loaded?: LoadedItem) {
        if (!loaded) return;

        this.id = loaded.key;
        this.name = loaded.name;
        this.description = loaded.description;
        this.pocket = loaded.pocket;
        this.flags = loaded.flags;
    }

    public getImage() {
        return `/Items/${this.id}.png`;
    }

    // to be modified by subclasses
    // function signature will be updated as necessary to implement items
    public offensiveMultiplier(
        multipliers: DamageMultipliers,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        move: MoveData,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        user: PartyPokemon,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        target: PartyPokemon,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        battleState: BattleState,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        typeEffectMult: number
    ): DamageMultipliers {
        return multipliers;
    }

    // note that because of the context in which this is called, "target" is the mon holding the item
    public defensiveMultiplier(
        multipliers: DamageMultipliers,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        move: MoveData,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        user: PartyPokemon,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        target: PartyPokemon,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        battleState: BattleState,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        typeEffectMult: number
    ): DamageMultipliers {
        return multipliers;
    }

    public baseStats(stats: Stats): Stats {
        return stats;
    }

    public modifyStats(stats: Stats): Stats {
        return stats;
    }

    static itemIds: string[] = [];
}
