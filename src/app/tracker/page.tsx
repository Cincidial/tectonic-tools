"use client";

import { LoadedEncounterMap, LoadedEncounterTable } from "@/preload/loadedDataClasses";
import { NextPage } from "next";
import Head from "next/head";
import { Fragment } from "react";
import { TectonicData } from "../data/tectonic/TectonicData";

const tableDisplayNameMap: Record<string, string> = {
    Special: "Other",
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

class encounterDisplayData {
    map: LoadedEncounterMap;
    tableDisplayName: string;
    maxLevel: number;
    minLevel: number;
    displayMonNames: string[];

    constructor(map: LoadedEncounterMap, table: LoadedEncounterTable) {
        this.map = map;
        this.tableDisplayName = tableDisplayNameMap[table.type];
        this.minLevel = 10000;
        this.maxLevel = -1;
        this.displayMonNames = [];

        for (let e of table.encounters) {
            this.minLevel = Math.min(this.minLevel, e.minLevel);
            this.maxLevel = Math.max(this.maxLevel, e.maxLevel ?? e.minLevel);

            const mon = TectonicData.pokemon[e.pokemon];
            const monName = mon?.name ?? `Not Found - ${e.pokemon}`;
            const formName = mon == undefined ? undefined : mon.getFormName(e.form ?? 0);
            this.displayMonNames.push(`${monName}${formName ? ` - ${formName}` : ""}`);
        }

        this.displayMonNames = this.displayMonNames.sort();
    }
}

const regularTables = Object.values(TectonicData.encounters).flatMap((m) =>
    m.tables.filter((t) => t.type != "Special").map((t) => new encounterDisplayData(m, t))
);
const specialTables = Object.values(TectonicData.encounters).flatMap((m) =>
    m.tables.filter((t) => t.type == "Special").map((t) => new encounterDisplayData(m, t))
);
const displayData = regularTables.concat(specialTables).sort((a, b) => a.maxLevel - b.maxLevel);

const EncounterTracker: NextPage = () => {
    return (
        <Fragment>
            <Head>
                <title>Pokémon Tectonic Encounter Tracker</title>
                <meta name="description" content="Pokémon encounter tracker for the fangame Pokémon Tectonic" />
            </Head>

            <main className="flex flex-col space-y-3 p-3 bg-gray-900 text-white">
                {displayData.map((data, index) => (
                    <div key={index} className="w-full md:w-150 border rounded-2xl p-2 mx-auto">
                        <div className="flex justify-between">
                            <div className="flex flex-col md:flex-row md:space-x-2 text-xl">
                                <div>{data.map.name}</div>
                                <div className="hidden md:inline">-</div>
                                <div>{data.tableDisplayName}</div>
                            </div>
                            <span className="text-sm rounded-full my-auto px-2 py-1 bg-blue-700">
                                Lvl. {data.maxLevel}
                            </span>
                        </div>
                        <hr className="mt-1 mb-3" />
                        <div className="flex flex-wrap space-x-2 space-y-2">
                            {data.displayMonNames.map((name, index) => (
                                <div key={index} className="w-fit px-2 py-1 border rounded-full">
                                    {name}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </main>
        </Fragment>
    );
};
export default EncounterTracker;
