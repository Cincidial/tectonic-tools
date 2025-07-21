import { BattleState } from "@/app/data/battleState";
import { Move } from "@/app/data/tectonic/Move";
import { PartyPokemon } from "@/app/data/types/PartyPokemon";
import Checkbox from "@/components/Checkbox";
import { getTypeColorClass } from "@/components/colours";
import ImageFallback from "@/components/ImageFallback";
import TypeBadge, { TypeBadgeElementEnum } from "@/components/TypeBadge";
import { ReactNode, useEffect, useState } from "react";
import { calculateDamage } from "../damageCalc";

export interface MoveData {
    move: Move;
    customVar: unknown;
    criticalHit: boolean;
}

export interface MoveCardProps {
    moveData: MoveData;
    user: PartyPokemon;
    target: PartyPokemon;
    battleState: BattleState;
}

export default function MoveCard(props: MoveCardProps): ReactNode {
    const [crit, setCrit] = useState<boolean>(props.target.volatileStatusEffects.Jinx || props.moveData.criticalHit);
    let result = calculateDamage(props.moveData, props.user, props.target, props.battleState);

    console.log(props.moveData.criticalHit);
    useEffect(() => {
        setCrit(props.target.volatileStatusEffects.Jinx || props.moveData.criticalHit);
    }, [props]);

    // TODO: Show prio & flags along with other data in a nicer format
    return (
        <div className="flex flex-col">
            <div className="flex items-center gap-2 pr-1 py-1 my-1  bg-gray-700 rounded-2xl">
                <div
                    className={`flex w-75 items-center gap-2 p-1 cursor-pointer rounded-2xl border-1 border-white/50 ${getTypeColorClass(
                        props.moveData.move.getType(props.user, props.battleState),
                        "bg",
                        "bg"
                    )}`}
                    onClick={() => {}}
                    title={props.moveData.move.description}
                >
                    <TypeBadge
                        types={[props.moveData.move.getType(props.user, props.battleState)]}
                        element={TypeBadgeElementEnum.ICONS}
                    />
                    <ImageFallback
                        src={
                            props.moveData.move.category == "Adaptive"
                                ? Move.getMoveCategoryImgSrc(
                                      props.user.getStats().attack > props.user.getStats().spatk
                                          ? "Physical"
                                          : "Special"
                                  )
                                : props.moveData.move.getCategoryImgSrc()
                        }
                        alt={props.moveData.move.category}
                        title={props.moveData.move.category}
                        height={60}
                        width={51}
                        className="w-8 h-8"
                    />
                    <span className="overflow-hidden text-ellipsis">{props.moveData.move.name} |</span>
                    <span>
                        {props.moveData.move.getPower(props.user, props.target, props.battleState, props.moveData)}
                    </span>
                    <span>{props.moveData.move.accuracy}%</span>
                </div>
                <Checkbox
                    checked={crit}
                    disabled={props.target.volatileStatusEffects.Jinx}
                    onChange={() => {
                        setCrit(!crit);
                        props.moveData.criticalHit = !crit;
                    }}
                >
                    Crit
                </Checkbox>
                <span className="w-15 p-1 text-center text-2xl font-bold text-shadow-xs/100 text-white bg-orange-400 rounded-2xl border-1 border-white/50">
                    {result.damage}
                </span>
            </div>
            <div></div>
        </div>
    );
}
