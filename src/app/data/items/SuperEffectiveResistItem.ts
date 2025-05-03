import { MoveData } from "@/app/damagecalc/components/MoveCard";
import { DamageMultipliers } from "@/app/damagecalc/damageCalc";
import { BattleState } from "../battleState";
import { LoadedItem } from "../loading/items";
import { types } from "../types";
import { Item } from "../types/Item";
import { PartyPokemon } from "../types/PartyPokemon";
import { PokemonType } from "../types/PokemonType";

const itemTypes: Record<string, string> = {
    OCCABERRY: "FIRE",
    PASSHOBERRY: "WATER",
    WACANBERRY: "ELECTRIC",
    RINDOBERRY: "GRASS",
    YACHEBERRY: "ICE",
    CHOPLEBERRY: "FIGHTING",
    KEBIABERRY: "POISON",
    SHUCABERRY: "GROUND",
    COBABERRY: "FLYING",
    PAYAPABERRY: "PSYCHIC",
    TANGABERRY: "BUG",
    CHARTIBERRY: "ROCK",
    KASIBBERRY: "GHOST",
    HABANBERRY: "DRAGON",
    COLBURBERRY: "DARK",
    BABIRIBERRY: "STEEL",
    ROSELIBERRY: "FAIRY",
    CHILANBERRY: "NORMAL",
};

export class SuperEffectiveResistItem extends Item {
    resistedType: PokemonType;
    constructor(item: LoadedItem) {
        super(item);
        this.resistedType = types[itemTypes[item.key]];
    }

    public defensiveMultiplier(
        multipliers: DamageMultipliers,
        move: MoveData,
        user: PartyPokemon,
        target: PartyPokemon,
        battleState: BattleState,
        typeEffectMult: number
    ): DamageMultipliers {
        if (
            (typeEffectMult > 1 || this.resistedType.id === "NORMAL") &&
            move.move.getType(user, battleState).id === this.resistedType.id
        ) {
            multipliers.final_damage_multiplier /= 2;
        }
        return multipliers;
    }

    static itemIds = Object.keys(itemTypes);
}
