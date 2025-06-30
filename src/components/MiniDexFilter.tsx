import { Pokemon } from "@/app/data/tectonic/Pokemon";
import { PokemonType } from "@/app/data/tectonic/PokemonType";
import { TectonicData } from "@/app/data/tectonic/TectonicData";
import { JSX, useState } from "react";
import FilterOptionButton from "./FilterOptionButton";
import ImageFallback from "./ImageFallback";
import TypeBadge, { TypeBadgeElementEnum } from "./TypeBadge";

export function MiniDexFilter({ onMon }: { onMon: (mon: Pokemon) => void }): JSX.Element {
    const [name, setName] = useState<string>("");
    const [ability, setAbility] = useState<string>("");
    const [move, setMove] = useState<string>("");
    const [tribe, setTribe] = useState<string>("");
    const [type1, setType1] = useState<PokemonType | undefined>(undefined);
    const [type2, setType2] = useState<PokemonType | undefined>(undefined);

    return (
        <div className="w-full">
            <div className="flex flex-wrap justify-center space-x-2 py-2">
                <input
                    className="border rounded px-2 py-1 bg-gray-700 text-white border-gray-600"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Pokemon"
                />
                <input
                    className="border rounded px-2 py-1 bg-gray-700 text-white border-gray-600"
                    type="text"
                    value={ability}
                    onChange={(e) => setAbility(e.target.value)}
                    placeholder="Ability"
                />
                <input
                    className="border rounded px-2 py-1 bg-gray-700 text-white border-gray-600"
                    type="text"
                    value={move}
                    onChange={(e) => setMove(e.target.value)}
                    placeholder="Move"
                />
                <input
                    className="border rounded px-2 py-1 bg-gray-700 text-white border-gray-600"
                    list="tribesData"
                    value={tribe}
                    onChange={(e) => setTribe(e.target.value)}
                    placeholder="Tribe"
                />
                <datalist id="tribesData">
                    {Object.values(TectonicData.tribes).map((t) => (
                        <option key={t.name} value={t.name} />
                    ))}
                </datalist>
            </div>
            <div className="grid grid-rows-2 grid-flow-col justify-center space-x-3 space-y-3">
                {Object.values(TectonicData.types).map((t) => (
                    <FilterOptionButton
                        key={t.id}
                        padding="p-2"
                        onClick={() => {
                            if (type1 == t) {
                                setType1(undefined);
                            } else if (type2 == t) {
                                setType2(undefined);
                            } else if (!type1) {
                                setType1(t);
                            } else {
                                setType2(t);
                            }
                        }}
                        isSelected={type1 == t || type2 == t}
                    >
                        <TypeBadge types={[t]} element={TypeBadgeElementEnum.ICONS} />
                    </FilterOptionButton>
                ))}
            </div>
            <div className="w-fit h-48 overflow-auto mx-auto">
                <div className="flex flex-wrap mx-auto">
                    {TectonicData.pokemonList
                        .filter(
                            (x) =>
                                (name.length <= 1 || x.name.toLowerCase().includes(name.toLowerCase())) &&
                                (ability.length <= 2 ||
                                    x.abilities.find(
                                        (a) =>
                                            a.name.toLowerCase().includes(ability.toLowerCase()) ||
                                            a.description.toLowerCase().includes(ability.toLowerCase())
                                    )) &&
                                (move.length <= 2 ||
                                    x.allMoves().find((m) => m.name.toLowerCase().includes(move.toLowerCase()))) &&
                                (tribe.length == 0 ||
                                    x.tribes.find((t) => t.name.toLowerCase().includes(tribe.toLowerCase()))) &&
                                (!type1 || x.type1 == type1 || x.type2 == type1) &&
                                (!type2 || x.type1 == type2 || x.type2 == type2)
                        )
                        .map((mon) => (
                            <ImageFallback
                                key={mon.id}
                                className="hover:bg-yellow-highlight"
                                src={mon.getIcon()}
                                alt={mon.name}
                                width={64}
                                height={64}
                                onClick={() => onMon(mon)}
                                title={mon.name}
                            />
                        ))}
                </div>
            </div>
        </div>
    );
}
