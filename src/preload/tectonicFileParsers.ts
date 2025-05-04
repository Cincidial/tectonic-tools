import { KVPair, LoadedData, RawEncounterMap, RawEncounterTable } from "./loadedDataClasses";

export function parseVersionFile(file: string): string {
    // parsing ruby code as text is So Normal
    let version: string = "";
    let dev: boolean = false;
    file.split(/\r?\n/).forEach((line) => {
        const terms = line.split(" = ");
        if (terms.length > 1) {
            if (terms[0].trim() === "GAME_VERSION") {
                version = terms[1].trim().replace(/"/g, "");
            }
            if (terms[0].trim() === "DEV_VERSION") {
                if (terms[1].trim() === "true") {
                    dev = true;
                }
            }
        }
    });

    if (dev) {
        version += "-dev";
    }
    return version;
}

export function parseStandardFile<T extends LoadedData<T>>(
    tectonicVersion: string,
    ctor: new () => T,
    populateMap: Record<string, (version: string, self: T, value: string) => void>,
    files: string[]
): Record<string, T> {
    const map: Record<string, T> = {};

    files.forEach((file) => {
        const pairs: KVPair[] = [];

        file.split(/\r?\n/).forEach((line) => {
            if (line.startsWith("#-")) {
                if (pairs.length !== 0) {
                    const value = LoadedData.populate(tectonicVersion, new ctor(), populateMap, pairs);
                    map[value.key] = value;
                }

                pairs.length = 0;
            } else if (!line.trim().startsWith("#") && line.length > 0) {
                if (line.startsWith("[")) {
                    pairs.push(new KVPair("Bracketvalue", line.substring(1, line.length - 1)));
                } else {
                    const split = line.split("=");
                    pairs.push(new KVPair(split[0].trim(), split[1].trim()));
                }
            }
        });

        if (pairs.length !== 0) {
            const value = LoadedData.populate(tectonicVersion, new ctor(), populateMap, pairs);
            map[value.key] = value;

            pairs.length = 0;
        }
    });

    return map;
}

export function parseNewLineCommaFile<T extends LoadedData<T>>(
    tectonicVersion: string,
    ctor: new () => T,
    populateMap: Record<string, (version: string, self: T, value: string) => void>,
    file: string
): Record<string, T> {
    const map: Record<string, T> = {};
    file.split(/\r?\n/)
        .filter((line) => line.length > 0)
        .forEach((line) => {
            const splitKV = line.split(",").map((x, index) => new KVPair(index.toString(), x));
            const value = LoadedData.populate(tectonicVersion, new ctor(), populateMap, splitKV);
            map[value.key] = value;
        });

    return map;
}

export function parseEncounterFile(file: string): RawEncounterMap[] {
    const rawMaps: RawEncounterMap[] = [];
    let currentMap = new RawEncounterMap();
    let currentTable = new RawEncounterTable();

    file.split(/\r?\n/)
        .filter((line) => line.length > 0)
        .forEach((line) => {
            if (line.startsWith("#")) {
                return;
            }

            // New map - first add current table to current map, then finalize current map
            if (line.startsWith("[")) {
                if (currentMap.mapLine !== "") {
                    if (currentTable.tableLine !== "") {
                        currentMap.tables.push(currentTable);
                    }
                    rawMaps.push(currentMap);
                }

                currentMap = new RawEncounterMap(line);
                currentTable = new RawEncounterTable();
                return;
            }

            if (line.startsWith(" ")) {
                currentTable.encounterSplits.push(line.split(","));
                return;
            }

            // New table
            if (currentTable.tableLine !== "") {
                currentMap.tables.push(currentTable);
            }
            currentTable = new RawEncounterTable(line);
        });

    if (currentTable.tableLine !== "") {
        currentMap.tables.push(currentTable);
    }
    if (currentMap.mapLine !== "") {
        rawMaps.push(currentMap);
    }

    return rawMaps;
}
