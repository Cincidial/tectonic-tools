import { LoadedType } from "../loading/types";

export class PokemonType {
    id: string;
    index: number;
    name: string;
    weaknesses: string;
    resistances: string;
    immunities: string;
    isRealType: boolean;

    constructor(type: LoadedType) {
        this.id = type.key;
        this.index = type.index;
        this.name = type.name;
        this.weaknesses = type.weaknesses;
        this.resistances = type.resistances;
        this.immunities = type.immunities;
        this.isRealType = type.isRealType;
    }

    getShortName(): string {
        return this.name.substring(0, 3).toUpperCase();
    }
}
