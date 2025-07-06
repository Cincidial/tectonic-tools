import { Playthrough } from "@/app/data/playthrough";
import { decodeTeam, encodeTeam, MAX_LEVEL } from "@/app/data/teamExport";
import { Ability } from "@/app/data/tectonic/Ability";
import { Item } from "@/app/data/tectonic/Item";
import { Move } from "@/app/data/tectonic/Move";
import { Pokemon } from "@/app/data/tectonic/Pokemon";
import { PokemonType } from "@/app/data/tectonic/PokemonType";
import { TectonicData } from "@/app/data/tectonic/TectonicData";
import { PartyPokemon } from "@/app/data/types/PartyPokemon";
import { JSX, useCallback, useEffect, useState } from "react";
import BasicButton from "./BasicButton";

const teamManagementLocalStorageKey = "TeamManagementLocalStorageKey_V1";
const teamManagementMigrationsLocalStorageKey = "TeamManagementMigrationsLocalStorageKey_V1";

function getSavedTeamCodes(): Record<string, string> {
    const base64TeamsString = localStorage.getItem(teamManagementLocalStorageKey);
    const base64Teams: Record<string, string> = base64TeamsString ? JSON.parse(base64TeamsString) : {};

    return base64Teams;
}

function saveTeamCodes(codes: Record<string, string>): void {
    localStorage.setItem(teamManagementLocalStorageKey, JSON.stringify(codes));
}

function legacyLoadOfSavedTeams() {
    // We've already migrated if this is present, no need to do it again
    if (teamManagementMigrationsLocalStorageKey in localStorage) {
        return;
    }

    // Legacy handling for saved team codes not saved under the grouped local storage key
    const migrations: Record<string, string> = {};
    for (const key in localStorage) {
        if (key != Playthrough.localStorageKey) {
            // Everything that is not a playthrough is a saved JSON team - move it to the migrations key for further processing
            const jsonTeam = localStorage.getItem(key);
            if (jsonTeam) {
                migrations[key] = jsonTeam;
            }
        }
    }

    if (Object.keys(migrations).length > 0) {
        localStorage.setItem(teamManagementMigrationsLocalStorageKey, JSON.stringify(migrations));
    }
}

// Trys to migrate saved teams to the base64 grouped key local storage area.
// If someone has an error the idea is we release a fix then we can direct them to run this function from console
export function performSavedLegacyTeamMigrations(forceTry: boolean = false) {
    interface LegacySavedPartyPokemon {
        pokemon: keyof typeof TectonicData.pokemon;
        moves: Array<keyof typeof TectonicData.moves>;
        ability: keyof typeof TectonicData.abilities;
        items: Array<keyof typeof TectonicData.items>;
        itemType?: keyof typeof TectonicData.types;
        form: number;
        level: number;
        sp: number[];
    }

    function legacyLoadTeamFromData(data: LegacySavedPartyPokemon[]) {
        return data.map((c) => {
            // fall back to defaults for newly added fields
            const level = c.level || MAX_LEVEL;
            const sp = c.sp || [10, 10, 10, 10, 10];
            return new PartyPokemon({
                species: TectonicData.pokemon[c.pokemon] || Pokemon.NULL,
                moves: c.moves.map((m) => TectonicData.moves[m] || Move.NULL),
                ability: TectonicData.abilities[c.ability] || Ability.NULL,
                items: c.items.map((i) => TectonicData.items[i] || Item.NULL),
                itemType: c.itemType ? TectonicData.types[c.itemType] || PokemonType.NULL : PokemonType.NULL,
                form: c.form,
                level: level,
                stylePoints: {
                    hp: sp[0],
                    attacks: sp[1],
                    defense: sp[2],
                    spdef: sp[3],
                    speed: sp[4],
                },
            });
        });
    }

    // Migrate when there are migrations & forced or when the migration has not happened yet
    if (
        !(teamManagementMigrationsLocalStorageKey in localStorage) ||
        (!forceTry && teamManagementLocalStorageKey in localStorage)
    ) {
        return;
    }

    const jsonTeams = JSON.parse(localStorage.getItem(teamManagementMigrationsLocalStorageKey)!);
    const teamCodes = getSavedTeamCodes();

    Object.keys(jsonTeams).forEach((k) => {
        const jsonTeam: string = jsonTeams[k];
        try {
            teamCodes[k] = encodeTeam(legacyLoadTeamFromData(JSON.parse(jsonTeam) as LegacySavedPartyPokemon[]));
            saveTeamCodes(teamCodes);
        } catch (e) {
            console.error(e);
            alert(
                `Unable to migrate team: ${k}. The team is not lost, but you'll need a devs help to retry.\nPlease post the error in the Tectonic Discord Website Issues.\n${e}`
            );
        }
    });
}

export default function SavedTeamManager({
    onLoad,
    exportMons,
}: {
    onLoad: (party: PartyPokemon[]) => void;
    exportMons?: PartyPokemon[];
}): JSX.Element {
    const [teamCode, setTeamCode] = useState<string>("");
    const [saveTeamName, setSaveTeamName] = useState<string>("");
    const [savedTeamCodes, setSavedTeamCodes] = useState<Record<string, string>>({});

    function exportTeam() {
        const code = encodeTeam(exportMons!);
        setTeamCode(code);

        navigator.clipboard.writeText(code);
        alert(`Team copied to clipboard!`);
    }

    function importTeam(code: string, showAlert: boolean = true) {
        if (!code || code.length == 0) {
            if (showAlert) {
                alert("No team or code found to load");
            }
            return;
        }

        try {
            setTeamCode(code);
            onLoad(decodeTeam(code).filter((x) => x.species != Pokemon.NULL));
            if (showAlert) {
                alert("Team imported successfully!");
            }
        } catch (error) {
            console.error("Import error:", error);
            alert("Invalid team code! Please check and try again.");
        }
    }

    function saveTeam() {
        if (saveTeamName.length == 0) {
            alert("Team must have a name to save");
            return;
        }

        const newCodes = { ...savedTeamCodes };
        newCodes[saveTeamName] = encodeTeam(exportMons!);

        saveTeamCodes(newCodes);
        setSavedTeamCodes(newCodes);
        alert("Saved!");
    }

    function deleteTeam() {
        const newCodes = { ...savedTeamCodes };
        delete newCodes[saveTeamName];

        saveTeamCodes(newCodes);
        setSavedTeamCodes(newCodes);
        setSaveTeamName("");
    }

    const importTeamCallback = useCallback(importTeam, [onLoad]);
    useEffect(() => {
        if (typeof window !== "undefined") {
            const code = new URLSearchParams(window.location.search).get("team") ?? "";

            setTeamCode(code);
            importTeamCallback(code, false);
        }

        legacyLoadOfSavedTeams();
        performSavedLegacyTeamMigrations();
        setSavedTeamCodes(getSavedTeamCodes());
    }, [importTeamCallback]);

    return (
        <div className="flex gap-20">
            <div className="flex flex-col items-center gap-1">
                <h2 className="text-white text-2xl">Team Code</h2>
                <input
                    type="text"
                    placeholder="Team code"
                    className="border rounded px-2 py-1 bg-gray-700 text-white border-gray-600"
                    value={teamCode}
                    onChange={(e) => setTeamCode(e.target.value)}
                />
                <div className="flex gap-2">
                    <BasicButton onClick={() => importTeam(teamCode)}>Import</BasicButton>
                    {exportMons && <BasicButton onClick={exportTeam}>Export</BasicButton>}
                </div>
            </div>

            <div className="flex flex-col items-center gap-1">
                <h2 className="text-white text-2xl">Saved Teams</h2>
                <input
                    className="border rounded px-2 py-1 bg-gray-700 text-white border-gray-600"
                    list="savedTeamCodes"
                    value={saveTeamName}
                    onChange={(e) => setSaveTeamName(e.target.value)}
                    placeholder="Saved Teams"
                />
                <datalist id="savedTeamCodes">
                    {Object.keys(savedTeamCodes).map((t, i) => (
                        <option key={i} value={t} />
                    ))}
                </datalist>
                <div className="flex gap-2">
                    {" "}
                    <BasicButton onClick={() => importTeam(savedTeamCodes[saveTeamName])}>Load</BasicButton>
                    {exportMons && <BasicButton onClick={saveTeam}>Save</BasicButton>}
                    <BasicButton onClick={deleteTeam}>Delete</BasicButton>
                </div>
            </div>
        </div>
    );
}
