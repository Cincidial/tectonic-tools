// data loading code adapted from https://github.com/Cincidial/techo

import { readFile, writeFile } from "fs/promises";
import path from "path";
import { parseAbilities } from "./abilities";
import { parseEncounters } from "./encounters";
import { parseForms } from "./forms";
import { parseItems } from "./items";
import { parseMoves } from "./moves";
import { parsePokemon, parsePokemonLegacy, propagatePokemonData } from "./pokemon";
import { parseTrainers } from "./trainers";
import { parseTrainerTypes } from "./trainerTypes";
import { parseTribes, parseTribesLegacy } from "./tribes";
import { buildTypeChart, TypeChart } from "./typeChart";
import { parsePokemonTypes } from "./types";

async function fileFetch(path: string, dev: boolean = false) {
    const baseUrl = `https://raw.githubusercontent.com/xeuorux/Pokemon-Tectonic/refs/heads/${
        dev ? "development" : "main"
    }/`;
    const fullPath = baseUrl + path;
    const response = await fetch(fullPath);

    if (!response.ok) {
        throw new Error(`Fetching ${fullPath} status: ${response.status}`);
    }

    return await response.text();
}

async function dataRead(filePath: string) {
    const basePath = path.join(__dirname, "../../../../public/data/");
    const fullPath = basePath + filePath;

    const fileData = await readFile(fullPath, "utf-8");
    return JSON.parse(fileData);
}

async function dataWrite<T>(filePath: string, contents: Record<string, T> | TypeChart | string) {
    const basePath = path.join(__dirname, "../../../../public/data/");
    const fullPath = basePath + filePath;

    const output = typeof contents === "string" ? contents : JSON.stringify(contents);

    await writeFile(fullPath, output);
}

type ParserFunction<T extends LoadedData> = (pairs: KVPair[]) => T;

export interface LoadedData {
    key: string;
}

export interface KVPair {
    key: string;
    value: string;
}

function standardFilesParser<T extends LoadedData>(files: string[], dataParser: ParserFunction<T>): Record<string, T> {
    const map: Record<string, T> = {};

    files.forEach((file) => {
        const pairs: KVPair[] = [];

        file.split(/\r?\n/).forEach((line) => {
            if (line.startsWith("#-")) {
                if (pairs.length !== 0) {
                    const value = dataParser(pairs);
                    map[value.key] = value;
                }

                pairs.length = 0;
            } else if (!line.includes("#") && line.length > 0) {
                if (line.startsWith("[")) {
                    const value = line.substring(1, line.length - 1);
                    pairs.push({ key: "Bracketvalue", value: value });
                } else {
                    const split = line.split("=");
                    const key = split[0].trim();
                    const value = split[1].trim();

                    pairs.push({ key: key, value: value });
                }
            }
        });

        if (pairs.length !== 0) {
            const value = dataParser(pairs);
            map[value.key] = value;

            pairs.length = 0;
        }
    });

    return map;
}

async function loadData(dev: boolean = false): Promise<void> {
    const tectonicFiles: string[] = [];
    await Promise.all([
        fileFetch("PBS/types.txt", dev),
        fileFetch("PBS/tribes.txt", dev),
        fileFetch("PBS/abilities.txt", dev),
        fileFetch("PBS/abilities_new.txt", dev),
        fileFetch("PBS/moves.txt", dev),
        fileFetch("PBS/moves_new.txt", dev),
        fileFetch("PBS/items.txt", dev),
        fileFetch("PBS/pokemon.txt", dev),
        fileFetch("PBS/pokemonforms.txt", dev),
        fileFetch("PBS/trainertypes.txt", dev),
        fileFetch("PBS/trainers.txt", dev),
        fileFetch("PBS/encounters.txt", dev),
        fileFetch("release_version.txt", dev),
    ])
        .then((values) => tectonicFiles.push(...values))
        .catch((error) => console.error(error));
    // TODO: Where is the version number "3.3.0-dev" stored?
    // Always store the release version last so that we don't have to edit the index every time
    const version = dev ? "dev" : tectonicFiles[tectonicFiles.length - 1].trim();

    const types = standardFilesParser([tectonicFiles[0]], parsePokemonTypes);

    const tribeParser = version.startsWith("3.2") ? parseTribesLegacy : parseTribes;
    const tribes = tribeParser(tectonicFiles[1]);

    const abilities = standardFilesParser([tectonicFiles[2], tectonicFiles[3]], parseAbilities);
    const moves = standardFilesParser([tectonicFiles[4], tectonicFiles[5]], parseMoves);
    const items = standardFilesParser([tectonicFiles[6]], parseItems);
    // const heldItems = filterToHeldItems(items);

    // pokemon.txt schema updated in 3.3/dev - thankfully, for simplicity, this site postdates any older update except 3.2
    const pokemonParser = version.startsWith("3.2") ? parsePokemonLegacy : parsePokemon;
    const pokemon = propagatePokemonData(
        standardFilesParser([tectonicFiles[7]], pokemonParser),
        version.startsWith("3.2")
    );

    const forms = parseForms([tectonicFiles[8]]);
    const typeChart = buildTypeChart(types);
    const trainerTypes = standardFilesParser([tectonicFiles[9]], parseTrainerTypes);
    const trainers = standardFilesParser([tectonicFiles[10]], parseTrainers);
    const encounters = parseEncounters(tectonicFiles[11]);

    const currentVersion = { version };

    const indices = {
        pokemon: Object.fromEntries(Object.keys(pokemon).map((id, i) => [id, i])),
        ability: Object.fromEntries(Object.keys(abilities).map((id, i) => [id, i])),
        item: Object.fromEntries(Object.keys(items).map((id, i) => [id, i])),
        move: Object.fromEntries(Object.keys(moves).map((id, i) => [id, i])),
    };

    const keys = {
        pokemon: Object.keys(pokemon),
        ability: Object.keys(abilities),
        item: Object.keys(items),
        move: Object.keys(moves),
    };

    const versions = await dataRead("versions.json");
    versions[version] = { indices, keys };

    await Promise.all([
        dataWrite("types.json", types),
        dataWrite("tribes.json", tribes),
        dataWrite("abilities.json", abilities),
        dataWrite("moves.json", moves),
        dataWrite("items.json", items),
        dataWrite("pokemon.json", pokemon),
        dataWrite("forms.json", forms),
        dataWrite("typechart.json", typeChart),
        dataWrite("trainertypes.json", trainerTypes),
        dataWrite("trainers.json", trainers),
        dataWrite("encounters.json", encounters),
        dataWrite("currentversion.json", currentVersion),
        dataWrite("versions.json", versions),
    ]);
}

const arg = process.argv[2];

loadData(arg === "dev").catch((e) => console.error(e));
