import { WeatherCondition } from "./conditions";

export const battleBooleans = ["Multi Battle", "Aurora Veil", "Reflect", "Light Screen", "Gravity"] as const;
export type BattleBoolean = (typeof battleBooleans)[number];
export type BattleBools = Record<BattleBoolean, boolean>;
export interface BattleState {
    bools: BattleBools;
    weather: WeatherCondition;
}

export const nullState: BattleState = {
    bools: Object.fromEntries(battleBooleans.map((b) => [b, false])) as BattleBools,
    weather: "None",
};
