export class PokemonType {
    id: string;
    index: number;
    name: string;
    weaknesses: string;
    resistances: string;
    immunities: string;
    isRealType: boolean;

    constructor(
        id: string,
        index: number,
        name: string,
        weaknesses: string,
        resistances: string,
        immunities: string,
        isRealType: boolean
    ) {
        this.id = id;
        this.index = index;
        this.name = name;
        this.weaknesses = weaknesses;
        this.resistances = resistances;
        this.immunities = immunities;
        this.isRealType = isRealType;
    }

    getShortName(): string {
        return this.name.substring(0, 3).toUpperCase();
    }
}
