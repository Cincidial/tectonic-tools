import { LoadedTrainerType } from "@/preload/loadTectonicRepoData";

export class TrainerType {
    id: string = "";
    name: string = "";

    static NULL: TrainerType = new TrainerType();

    constructor(loaded?: LoadedTrainerType) {
        if (!loaded) return;

        this.id = loaded.key;
        this.name = loaded.name;
    }
}
