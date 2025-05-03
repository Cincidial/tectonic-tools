import { Move } from "../tectonic/Move";

export class BreakScreensMove extends Move {
    public ignoresScreens(): boolean {
        return true;
    }

    static moveCodes = ["RemoveScreens"];
}
