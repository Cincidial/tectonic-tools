import { LoadedAbility } from "@/preload/loadedDataClasses";
import { TectonicData } from "../tectonic/TectonicData";
import { MatchupModifyAbility } from "./MatchupModifyAbility";

const weaknessAbilities: Record<string, [number, string]> = {
    FLUFFY: [2, "FIRE"],
    PARANOID: [2, "PSYCHIC"],

    // TODO: This doesn't actually work because the ability is also in the TypeImmunityAbility class and that one gets done first.
    // Need to redesign how this is setup to make the abilty work for both immuinity and weakness
    DRYSKIN: [1.25, "FIRE"],
    FINESUGAR: [1.25, "WATER"],
};

export class TypeWeaknessAbility extends MatchupModifyAbility {
    constructor(ability: LoadedAbility) {
        super(ability);
        this.matchup = weaknessAbilities[ability.key][0];
        this.affectedTypes = [TectonicData.types[weaknessAbilities[ability.key][1]]];
    }

    static abilityIds = Object.keys(weaknessAbilities);
}
