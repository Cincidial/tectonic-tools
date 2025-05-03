import { Move } from "../tectonic/Move";

// No special functionality, checked in type chart calculation
// This is for moves that override type calculation to hit flying types and levitators
// *Not* every move that hits Pokemon using fly
export class HitsFliersMove extends Move {
    static moveCodes = ["HitsTargetInSkyGroundsTarget"];
}
