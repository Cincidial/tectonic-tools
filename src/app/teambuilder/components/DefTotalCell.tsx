import { calcTypeMatchup } from "@/app/data/typeChart";
import { PartyPokemon } from "@/app/data/types/PartyPokemon";
import { PokemonType } from "@/app/data/types/PokemonType";

function compare(num: number, total: "weak" | "strong") {
    if (total === "weak") {
        return num > 1;
    }
    return num < 1;
}

export default function DefTotalCell({
    cards,
    type,
    total,
}: {
    cards: PartyPokemon[];
    type: PokemonType;
    total: "weak" | "strong";
}): React.ReactNode {
    const num = cards.filter((c) =>
        compare(
            calcTypeMatchup({ type: type }, { type1: c.types.type1, type2: c.types.type2, ability: c.ability }),
            total
        )
    ).length;

    return (
        <td className={`border border-gray-600 text-lg text-center cursor-default font-bold`}>{num > 0 ? num : ""}</td>
    );
}
