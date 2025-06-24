import { LoadedAbility } from "@/preload/loadedDataClasses";

export class Ability {
    id: string = "";
    name: string = "";
    description: string = "";
    flags: string[] = [];
    isSignature: boolean = false;

    static NULL: Ability = null!;

    constructor(loaded?: LoadedAbility) {
        if (!loaded) return;

        this.id = loaded.key;
        this.name = loaded.name;
        this.description = loaded.description;
        this.flags = loaded.flags;
        this.isSignature = loaded.isSignature;
    }

    public movePowerMultiplier(): number {
        return 1;
    }

    public hasSunSynergy() {
        return this.flags.includes("SunshineSynergy");
    }

    public hasRainSynergy() {
        return this.flags.includes("RainstormSynergy");
    }

    public hasHailSynergy() {
        return this.flags.includes("HailSynergy");
    }

    public hasSandSynergy() {
        return this.flags.includes("SandstormSynergy");
    }

    public hasEclipseSynergy() {
        return this.flags.includes("EclipseSynergy");
    }

    public hasMoonglowSynergy() {
        return this.flags.includes("MoonglowSynergy");
    }

    public hasAllWeatherSynergy() {
        return this.flags.includes("AllWeatherSynergy");
    }

    static abilityIds: string[] = [];
}
