import { LoadedAbility } from "@/preload/loadedDataClasses";

export class Ability {
    id: string = "";
    name: string = "";
    description: string = "";
    flags: string[] = [];
    isSignature: boolean = false;

    static NULL: Ability = new Ability();

    constructor(loaded?: LoadedAbility) {
        if (!loaded) return;

        this.id = loaded.key;
        this.name = loaded.name;
        this.description = loaded.description;
        this.flags = loaded.flags;
        this.isSignature = loaded.isSignature;
    }
}
