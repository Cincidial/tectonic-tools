import { Side } from "@/app/damagecalc/damageCalc";
import { Move } from "../tectonic/Move";

export class TargetAttackMove extends Move {
    public getAttackStatSide(): Side {
        return "opponent";
    }

    static moveCodes = ["AttacksWithTargetsStats"];
}
