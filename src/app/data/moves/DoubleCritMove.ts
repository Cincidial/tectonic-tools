import { Move } from "../tectonic/Move";

export class DoubleCritMove extends Move {
    public getCriticalMultiplier(): number {
        return 3;
    }

    static moveCodes = ["DoubleDamageOnCrit"];
}
