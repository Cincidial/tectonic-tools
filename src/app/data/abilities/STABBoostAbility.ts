import { LoadedAbility } from "@/preload/loadedDataClasses";
import { Ability } from "../tectonic/Ability";

const stabBoostAbilities: Record<string, number> = {
    ADAPTED: 4 / 3,
    ULTRAADAPTED: 3 / 2,
};

export class STABBoostAbility extends Ability {
    public boost: number;
    constructor(ability: LoadedAbility) {
        super(ability);
        this.boost = stabBoostAbilities[ability.key];
    }

    static abilityIds = Object.keys(stabBoostAbilities);
}
