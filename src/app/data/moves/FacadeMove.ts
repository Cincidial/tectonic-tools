import { StatusEffect } from "../conditions";
import { Move } from "../tectonic/Move";
import { PartyPokemon } from "../types/PartyPokemon";

export class FacadeMove extends Move {
    public getPower(user: PartyPokemon): number {
        if (user.statusEffect !== "None") {
            return this.bp * 2;
        }
        return this.bp;
    }

    public ignoreStatus(effect: StatusEffect): boolean {
        return effect === "Burn" || effect === "Frostbite";
    }

    static moveCodes = ["DoubleDamageUserStatused"];
}
