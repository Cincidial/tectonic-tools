import { calcTypeMatchup } from "@/app/data/typeChart";
import { PokemonType } from "@/app/data/types/PokemonType";

interface TypeChartCellProps {
    atk: PokemonType | undefined;
    def: PokemonType | undefined;
    mult: number | undefined;
}

function getColourClassForMult(mult: number): string {
    if (mult >= 4) {
        return "bg-hyper-effective";
    }
    if (mult >= 2) {
        return "bg-super-effective";
    }
    if (mult == 0) {
        return "bg-not-effective";
    }
    if (mult < 0.5) {
        return "bg-barely-effective";
    }
    if (mult < 1) {
        return "bg-not-very-effective";
    }
    // if neutrally effective, no special colour
    return "";
}

function getTextColourForMult(mult: number): string {
    if (mult !== 1) {
        return "text-black";
    }
    return "";
}

function getTooltipForMult(mult: number, data: TypeChartCellProps): string {
    if (!data.atk || !data.def) {
        return "";
    }

    const prefix = `${data.atk.name} → ${data.def.name} = `;
    if (mult >= 4) {
        return prefix + "Hyper Effective";
    }
    if (mult >= 2) {
        return prefix + "Super Effective";
    }
    if (mult == 0) {
        return prefix + "No Effect";
    }
    if (mult < 0.5) {
        return prefix + "Barely Effective";
    }
    if (mult < 1) {
        return prefix + "Not Very Effective";
    }

    return prefix + "Normal Effectiveness";
}

function getTextForMult(mult: number): string {
    if (mult === 0.125) {
        return "⅛";
    }
    if (mult === 0.25) {
        return "¼";
    }
    if (mult === 0.5) {
        return "½";
    }
    if (mult == 1.0) {
        return "";
    }

    return mult.toString();
}

export default function TypeChartCell(props: TypeChartCellProps) {
    const mult = props.mult ?? calcTypeMatchup({ type: props.atk! }, { type1: props.def! });
    const colourClass = getColourClassForMult(mult);
    const textClass = getTextColourForMult(mult);
    const tooltip = getTooltipForMult(mult, props);
    const content = getTextForMult(mult);

    return (
        <td
            className={`border border-gray-600 text-lg text-center cursor-default font-bold ${colourClass} ${textClass}`}
            title={tooltip}
        >
            {content}
        </td>
    );
}
