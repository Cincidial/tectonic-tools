import { BattleState } from "@/app/data/battleState";
import { Move } from "@/app/data/tectonic/Move";
import { PartyPokemon } from "@/app/data/types/PartyPokemon";
import Checkbox from "@/components/Checkbox";
import { getTypeColorClass } from "@/components/colours";
import ImageFallback from "@/components/ImageFallback";
import InputLabel from "@/components/InputLabel";
import TypeBadge, { TypeBadgeElementEnum } from "@/components/TypeBadge";
import { getColourClassForMult, getTextColourForMult } from "@/components/TypeChartCell";
import { Fragment, ReactNode, useEffect, useState } from "react";
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
    const [customInput, setCustomInput] = useState<unknown>(props.moveData.customVar);

    const result = calculateDamage(props.moveData, props.user, props.target, props.battleState);
    useEffect(() => {
        setCrit(props.target.volatileStatusEffects.Jinx || props.moveData.criticalHit);
    }, [props]);

    function getDmgNode() {
        if (result.minTotal && result.minPercentage && result.maxTotal && result.maxPercentage) {
            return (
                <Fragment>
                    <span className="text-2xl">
                        {result.minTotal}-{result.maxTotal}
                    </span>
                    <span>{result.damage} per hit</span>
                    <span>
                        {(result.minPercentage * 100).toFixed(2)}%-{(result.maxPercentage * 100).toFixed(2)}%
                    </span>
                </Fragment>
            );
        } else {
            return (
                <Fragment>
                    <span className="text-2xl">{result.damage}</span>
                    <span>{(result.percentage * 100).toFixed(2)}%</span>
                </Fragment>
            );
        }
    }

    function getCustomVarInput(): ReactNode {
        if (props.moveData.move.customVarType === "number") {
            if (customInput === undefined) {
                setCustomInput(0);
                props.moveData.customVar = 0;
            }
            return (
                <div className="flex mx-auto gap-2">
                    <InputLabel>{props.moveData.move.customVarName}</InputLabel>
                    <input
                        type="number"
                        className="w-18 focus:ring-blue-500 focus:border-blue-500 text-center"
                        value={customInput as number}
                        onChange={(e) => {
                            const value = parseInt(e.target.value);

                            setCustomInput(value);
                            props.moveData.customVar = value;
                        }}
                    />
                </div>
            );
        }
        if (props.moveData.move.customVarType === "boolean") {
            if (customInput === undefined) {
                setCustomInput(false);
                props.moveData.customVar = false;
            }
            return (
                <Checkbox
                    checked={customInput as boolean}
                    onChange={() => {
                        const value = !(customInput as boolean);

                        setCustomInput(value);
                        props.moveData.customVar = value;
                    }}
                >
                    {props.moveData.move.customVarName}
                </Checkbox>
            );
        }
        return <span>Input for type {customInput === "number"} not yet implemented.</span>;
    }

    // TODO: Make this thing not so ugly, all the data needed to be shown should be here though
    return (
        <div className="flex flex-col">
            <div className="flex items-center gap-2 pr-1 py-1 my-1  bg-gray-700 rounded-2xl">
                <div className="flex flex-col gap-2">
                    <div
                        className={`flex w-75 h-full items-center gap-2 p-1 rounded-2xl border-1 border-white/50 ${getTypeColorClass(
                            props.moveData.move.getType(props.user, props.battleState),
                            "bg",
                            "bg"
                        )} ${props.moveData.move.isSTAB(props.user.species) ? "font-bold" : ""} ${
                            props.moveData.move.isSignature ? "text-yellow-300" : ""
                        }`}
                        title={props.moveData.move.description}
                    >
                        <TypeBadge
                            types={[props.moveData.move.getType(props.user, props.battleState)]}
                            element={TypeBadgeElementEnum.ICONS}
                        />
                        <ImageFallback
                            src={Move.getMoveCategoryImgSrc(
                                props.moveData.move.getDamageCategory(props.moveData, props.user, props.target)
                            )}
                            alt={props.moveData.move.category}
                            title={props.moveData.move.category}
                            height={60}
                            width={51}
                            className="w-8 h-8"
                        />
                        <span>
                            {`${props.moveData.move.name} ${props.moveData.move.getPower(
                                props.user,
                                props.target,
                                props.battleState,
                                props.moveData.customVar
                            )} ${props.moveData.move.accuracy}% ${props.moveData.move.priority ?? ""}`}
                        </span>
                    </div>
                    {props.moveData.move.needsInput && getCustomVarInput()}
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
                <div
                    className={`flex w-fit gap-2 p-1 text-center rounded-2xl border-1 border-white/50 ${getColourClassForMult(
                        result.typeEffectMult,
                        "bg-gray-500"
                    )} ${getTextColourForMult(result.typeEffectMult)}`}
                >
                    <div className="flex flex-col">{getDmgNode()}</div>
                    <div className="wrap-break-word w-10 my-auto font-bold">KO in {result.hits}</div>
                </div>
            </div>
            <div></div>
        </div>
    );
}
