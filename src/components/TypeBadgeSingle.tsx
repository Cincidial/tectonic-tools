import { PokemonType } from "@/app/data/types/PokemonType";
import { getTypeBadgeColourClass } from "./colours";

interface TypeBadgeHeaderProps {
    type: PokemonType;
    useShort: boolean;
}

export default function TypeBadgeHeader({ type, useShort }: TypeBadgeHeaderProps) {
    return (
        <th className={`py-2 text-white text-xs font-semibold ${getTypeBadgeColourClass(type)}`}>
            {useShort ? type.getShortName() : type.name}
        </th>
    );
}
