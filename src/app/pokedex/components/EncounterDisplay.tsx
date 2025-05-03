import { EncounterMap, EncounterTable } from "@/app/data/tectonic/Encounter";
import { Pokemon } from "@/app/data/tectonic/Pokemon";

function printEncChance(table: EncounterTable, currentPokemon: Pokemon) {
    const encs = table.encounters;
    const currentEnc = encs.find((e) => e.pokemon === currentPokemon.id);
    if (!currentEnc) {
        return "Error";
    }
    const currentWeight = currentEnc.weight;
    const totalWeight = encs.reduce((sum, enc) => sum + enc.weight, 0);
    return ((currentWeight / totalWeight) * 100).toFixed(0) + "%";
}

function getNameForEncounterType(encounterType: string) {
    switch (encounterType) {
        case "Land":
            return "Grass";
        case "LandSparse":
            return "Sparse Grass";
        case "LandTall":
            return "Tall Grass";
        case "Special":
            return "Other";
        case "FloweryGrass":
            return "Yellow Flowers";
        case "FloweryGrass2":
            return "Blue Flowers";
        case "SewerWater":
            return "Sewage";
        case "SewerFloor":
            return "Dirty Floor";
        case "DarkCave":
            return "Dark Ground";
        case "Mud":
            return "Mud";
        case "Puddle":
            return "Puddle";
        case "LandTinted":
            return "Secret Grass";
        case "Cloud":
            return "Dark Clouds";
        case "ActiveWater":
            return "Deep Water";
        case "FishingContest":
            return "Surfing";
    }
    return "Unknown";
}

export default function EncounterDisplay({ encounters, pokemon }: { encounters: EncounterMap[]; pokemon: Pokemon }) {
    return (
        <div>
            {encounters.length > 0 ? (
                <div>
                    {encounters.map((area, index) => (
                        <div key={index} className="mb-4">
                            <h4 className="font-semibold text-gray-800 dark:text-gray-100">{area.name}</h4>
                            {area.tables
                                .filter((t) => t.encounters.some((e) => e.pokemon === pokemon.id))
                                .map((t) => (
                                    <p key={t.type}>
                                        {t.type === "Special"
                                            ? "Other"
                                            : getNameForEncounterType(t.type) + " (" + printEncChance(t, pokemon) + ")"}
                                    </p>
                                ))}
                        </div>
                    ))}
                </div>
            ) : (
                <></>
            )}
        </div>
    );
}
