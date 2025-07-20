import { BattleState } from "@/app/data/battleState";
import { Move } from "@/app/data/tectonic/Move";
import { PartyPokemon } from "@/app/data/types/PartyPokemon";
import Checkbox from "@/components/Checkbox";
import { getTypeColorClass } from "@/components/colours";
import ImageFallback from "@/components/ImageFallback";
import TypeBadge, { TypeBadgeElementEnum } from "@/components/TypeBadge";
import { ReactNode, useState } from "react";
import { calculateDamage } from "../damageCalc";

export interface MoveData {
    move: Move;
    customVar: unknown;
    criticalHit: boolean;
}

export interface MoveCardProps {
    move: Move;
    user: PartyPokemon;
    target: PartyPokemon;
    battleState: BattleState;
}

export default function MoveCard(props: MoveCardProps): ReactNode {
    const [crit, setCrit] = useState<boolean>(props.target.volatileStatusEffects.Jinx);

    const result = calculateDamage(
        { move: props.move, customVar: 0, criticalHit: crit },
        props.user,
        props.target,
        props.battleState
    );
    return (
        <div className="flex items-center gap-2 bg-gray-700 pr-1 py-1 my-1 rounded-2xl">
            <div
                className={`flex w-50 items-center gap-2 p-1 cursor-pointer rounded-2xl border-1 border-white/50 ${getTypeColorClass(
                    props.move.getType(props.user, props.battleState),
                    "bg",
                    "bg"
                )}`}
                onClick={() => {}}
                title={props.move.description}
            >
                <div className="flex justify-center space-x-1">
                    <TypeBadge
                        types={[props.move.getType(props.user, props.battleState)]}
                        element={TypeBadgeElementEnum.ICONS}
                    />
                    <ImageFallback
                        src={props.move.getCategoryImgSrc()}
                        alt={props.move.category}
                        title={props.move.category}
                        height={60}
                        width={51}
                        className="w-8 h-8"
                    />
                </div>
                <span className="overflow-hidden text-ellipsis">{props.move.name}</span>
            </div>
            <Checkbox checked={crit} disabled={props.target.volatileStatusEffects.Jinx} onChange={() => setCrit(!crit)}>
                Crit
            </Checkbox>
            <span className="text-2xl font-bold text-shadow-xs/100 text-white bg-orange-400 p-1 rounded-2xl border-1 border-white/50">
                {result.damage}
            </span>
        </div>
    );
}
