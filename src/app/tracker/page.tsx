"use client";

import FilterOptionButton from "@/components/FilterOptionButton";
import ImageFallback from "@/components/ImageFallback";
import { LoadedEncounterMap, LoadedEncounterTable } from "@/preload/loadedDataClasses";
import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { Fragment, ReactNode, useEffect, useState } from "react";
import { EncounterPick, Playthrough } from "../data/playthrough";
import { Item } from "../data/tectonic/Item";
import { Pokemon } from "../data/tectonic/Pokemon";
import { TectonicData } from "../data/tectonic/TectonicData";

const tableDisplayNameMap: Record<string, string> = {
    Special: "Special",
    Land: "Grass",
    LandTinted: "Secret Grass",
    FloweryGrass: "Yellow Flowers",
    LandTall: "Tall Grass",
    DarkCave: "Dark Ground",
    LandSparse: "Sparse Grass",
    Puddle: "Puddle",
    Mud: "Mud",
    FloweryGrass2: "Blue Flowers",
    SewerFloor: "Dirty Floor",
    SewerWater: "Sewage",
    Cloud: "Dark Clouds",
    ActiveWater: "Deep Water",
    FishingContest: "Surfing",
};

class EncounterDisplayData {
    key: string;
    map: LoadedEncounterMap;
    tableDisplayName: string;
    maxLevel: number;
    minLevel: number;
    items: Item[];
    displayMonData: [encounterMonId: string, mon: Pokemon, display: string][];

    constructor(map: LoadedEncounterMap, table: LoadedEncounterTable) {
        this.key = `${map.key} - ${table.type}`;
        this.map = map;
        this.tableDisplayName = tableDisplayNameMap[table.type];
        this.minLevel = 10000;
        this.maxLevel = -1;
        this.displayMonData = [];

        const itemsMap: Record<string, Item> = {};
        for (const e of table.encounters) {
            this.minLevel = Math.min(this.minLevel, e.minLevel);
            this.maxLevel = Math.max(this.maxLevel, e.maxLevel ?? e.minLevel);

            const mon = TectonicData.pokemon[e.pokemon];
            const monName = mon?.name ?? `Not Found - ${e.pokemon}`;
            const formName = mon == undefined ? undefined : mon.getFormName(e.form ?? 0);

            mon.items.forEach((item) => (itemsMap[item[0].id] = item[0]));
            this.displayMonData.push([e.pokemon, mon, `${monName}${formName ? ` - ${formName}` : ""}`]);
        }

        this.displayMonData = this.displayMonData.sort(([, displayA], [, displayB]) =>
            displayA.name.localeCompare(displayB.name)
        );
        this.items = Object.values(itemsMap);
    }

    filter(input: string): boolean {
        return (
            this.map.name.toLowerCase().includes(input) ||
            this.tableDisplayName.toLowerCase().includes(input) ||
            this.displayMonData.some((x) => x[2].toLowerCase().includes(input)) ||
            this.items.some((x) => x.name.toLowerCase().includes(input))
        );
    }
}

function EncounterDisplayMon({
    selectedPlaythrough,
    encounterKey,
    eMonId,
    pokemon,
}: {
    selectedPlaythrough: number;
    encounterKey: string;
    eMonId: string;
    pokemon: Pokemon;
}): ReactNode {
    const [pickedHere, setPickedHere] = useState<boolean>(
        Playthrough.getPlayThrough(selectedPlaythrough)!.hasPick(encounterKey, eMonId)
    );

    return (
        <div className="flex flex-col items-center">
            <ImageFallback
                src={pokemon.getIcon()}
                className={`hover:bg-yellow-highlight cursor-pointer ${pickedHere ? "bg-yellow-highlight" : ""}`}
                alt={pokemon.name}
                width={64}
                height={64}
                onClick={() => {
                    const playthrough = Playthrough.getPlayThrough(selectedPlaythrough)!;
                    if (playthrough.hasPick(encounterKey, eMonId)) {
                        playthrough.removePick(encounterKey, eMonId);
                        setPickedHere(false);
                    } else {
                        playthrough.addPick(encounterKey, new EncounterPick(eMonId, pokemon.id));
                        setPickedHere(true);
                    }
                }}
                title={pokemon.name}
            />
            <div className="flex flex-wrap justify-center">
                {pokemon.uniqueItems.map((item) => (
                    <ImageFallback
                        key={item.id}
                        src={item.image}
                        alt={item.name}
                        width={48}
                        height={48}
                        title={item.name}
                        className="w-8 h-8"
                    />
                ))}
            </div>
        </div>
    );
}

function EncounterDisplay({
    selectedPlaythrough,
    data,
}: {
    selectedPlaythrough: number;
    data: EncounterDisplayData;
}): ReactNode {
    const [flagMissing, setflagMissing] = useState<boolean>(
        Playthrough.getPlayThrough(selectedPlaythrough)!.wasPickMissed(data.key)
    );

    return (
        <div className="w-full md:w-150 border rounded-2xl p-2 mx-auto">
            <div>
                <div className="flex justify-between">
                    <div className="flex flex-col md:flex-row md:space-x-2 text-xl">
                        <div>{data.map.name}</div>
                        <div className="hidden md:inline">-</div>
                        <div>{data.tableDisplayName}</div>
                    </div>
                    <div className="flex flex-col md:flex-row gap-2 text-xl">
                        <span className="text-sm rounded-full my-auto px-2 py-1 bg-blue-700">Lvl. {data.maxLevel}</span>
                        <FilterOptionButton
                            isSelected={flagMissing}
                            onClick={() => {
                                Playthrough.getPlayThrough(selectedPlaythrough)!.setPickMissed(data.key, !flagMissing);
                                setflagMissing(!flagMissing);
                            }}
                        >
                            Missed
                        </FilterOptionButton>
                    </div>
                </div>
                <hr className="mt-1 mb-3 text-blue-500/50" />
            </div>
            <div className="flex flex-wrap justify-center gap-1">
                {data.displayMonData.map((eMon, index) => (
                    <EncounterDisplayMon
                        key={index}
                        selectedPlaythrough={selectedPlaythrough}
                        encounterKey={data.key}
                        eMonId={eMon[0]}
                        pokemon={eMon[1]}
                    />
                ))}
            </div>
        </div>
    );
}

const encounterDisplayData: EncounterDisplayData[] = Object.values(TectonicData.encounters)
    .flatMap((m) => m.tables.map((t) => new EncounterDisplayData(m, t)))
    .sort((a, b) => a.maxLevel - b.maxLevel);

const EncounterTracker: NextPage = () => {
    const [loaded, setLoaded] = useState<boolean>(false);
    const [selectedPlaythrough, setSelectedPlaythrough] = useState<number | undefined>(undefined);
    const [playthroughName, setPlaythroughName] = useState<string>("New Playthrough");
    const [locationFilter, setLocationFilter] = useState<string>("");

    useEffect(() => {
        Playthrough.loadLocalData();
        setLoaded(true);
    }, []);

    if (!loaded) return;
    return (
        <Fragment>
            <Head>
                <title>Tectonic Encounter Tracker</title>
                <meta name="description" content="Pokémon encounter tracker for the fangame Pokémon Tectonic" />
            </Head>

            {selectedPlaythrough ? (
                <main className="min-h-screen flex flex-col space-y-3 p-3 bg-gray-900 text-white">
                    <div className="flex justify-between space-x-5 w-full md:w-150 mx-auto pb-2">
                        <button
                            className="text-4xl hover:text-yellow-highlight cursor-pointer"
                            onClick={() => {
                                setSelectedPlaythrough(undefined);
                                setPlaythroughName("New Playthrough");
                            }}
                        >
                            {"\u21A2"}
                        </button>
                        <input
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            type="text"
                            placeholder="Playthrough Name"
                            value={playthroughName}
                            onChange={(e) => {
                                setPlaythroughName(e.target.value);
                                Playthrough.getPlayThrough(selectedPlaythrough)?.setName(e.target.value);
                            }}
                        />
                        <button
                            className="text-4xl hover:text-yellow-highlight cursor-pointer"
                            onClick={() => {
                                if (confirm("Delete playthrough?")) {
                                    Playthrough.getPlayThrough(selectedPlaythrough)?.delete();
                                    setSelectedPlaythrough(undefined);
                                }
                            }}
                        >
                            {"\u2715"}
                        </button>
                    </div>
                    <div className="flex flex-col gap-2 w-full md:w-150 mx-auto ">
                        <input
                            className="w-full border rounded px-2 py-1 bg-gray-700 text-white border-gray-600"
                            value={locationFilter}
                            onChange={(e) => setLocationFilter(e.target.value)}
                            placeholder="Location, Pokemon, or item"
                        />
                        {encounterDisplayData
                            .filter((x) => x.filter(locationFilter.toLocaleLowerCase()))
                            .map((e) => (
                                <EncounterDisplay key={e.key} selectedPlaythrough={selectedPlaythrough} data={e} />
                            ))}
                    </div>
                </main>
            ) : (
                <main className="min-h-screen p-3 bg-gray-900 text-white">
                    <div className="text-3xl text-center">
                        <Link className="hover:text-blue-400" href="../">
                            Tectonic Tracker
                        </Link>
                    </div>
                    <div className="flex w-fit mx-auto mt-2">
                        <input
                            className="px-4 py-2 mt-1.25 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            type="text"
                            value={playthroughName}
                            placeholder="New Playthrough"
                            onChange={(e) => setPlaythroughName(e.target.value)}
                        />
                        <button
                            className="text-5xl ml-2 hover:text-yellow-highlight"
                            onClick={() => {
                                setSelectedPlaythrough(Playthrough.addNewPlaythrough(playthroughName));
                            }}
                        >
                            {"\u2295"}
                        </button>
                    </div>
                    <hr className="my-3" />
                    <div className="text-center text-2xl">Playthroughs</div>
                    {Playthrough.getPlayThroughs().map((x, index) => (
                        <div
                            key={index}
                            className="w-full md:w-150 text-center border rounded-2xl p-2 my-2 mx-auto hover:bg-yellow-highlight hover:text-black cursor-pointer"
                            onClick={() => {
                                setPlaythroughName(Playthrough.getPlayThrough(x)?.getName() ?? playthroughName);
                                setSelectedPlaythrough(x);
                            }}
                        >
                            {Playthrough.getPlayThrough(x)?.getName()}
                        </div>
                    ))}
                </main>
            )}
        </Fragment>
    );
};
export default EncounterTracker;
