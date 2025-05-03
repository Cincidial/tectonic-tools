import { NTreeArrayNode, NTreeNode } from "@/app/data/types/NTreeNode";
import { uniq } from "@/app/data/util";

export abstract class LoadedData<SubClass extends LoadedData<SubClass>> {
    static bracketKeyName: string = "Bracketvalue";

    key: string = "";
    protected populateMap: Record<string, (version: string, value: string) => void> = {};

    populate(tectonicVersion: string, pairs: KVPair[]): SubClass {
        pairs.forEach((pair) => {
            if (pair.key in this.populateMap) {
                this.populateMap[pair.key](tectonicVersion, pair.value);
            }
        });
        return this as unknown as SubClass;
    }
}

export class PokemonEvolutionTerms {
    pokemon: string;
    method: string;
    condition: string;

    constructor(pokemon: string, method: string, condition: string) {
        this.pokemon = pokemon;
        this.method = method;
        this.condition = condition;
    }
}

export class LoadedType extends LoadedData<LoadedType> {
    index: number = -1;
    name: string = "";
    weaknesses: string = "";
    resistances: string = "";
    immunities: string = "";
    isRealType: boolean = true;

    constructor() {
        super();
        this.populateMap[LoadedData.bracketKeyName] = (_, value) => (this.index = parseInt(value));
        this.populateMap["Name"] = (_, value) => (this.name = value);
        this.populateMap["InternalName"] = (_, value) => (this.key = value);
        this.populateMap["Weaknesses"] = (_, value) => (this.weaknesses = value);
        this.populateMap["Resistances"] = (_, value) => (this.resistances = value);
        this.populateMap["Immunities"] = (_, value) => (this.immunities = value);
        this.populateMap["IsPseudoType"] = () => (this.isRealType = false);
    }
}

export class LoadedTribe extends LoadedData<LoadedTribe> {
    activationCount: number = 5;
    name: string = "";
    description: string = "";

    constructor() {
        super();
        this.populateMap["0"] = (version, value) => {
            this.key = value;
            if (version.startsWith("3.2")) this.name = this.key[0] + this.key.substring(1).toLowerCase();
        };
        this.populateMap["1"] = (_, value) => (this.activationCount = parseInt(value));
        this.populateMap["2"] = (version, value) => {
            if (version.startsWith("3.2")) this.description = value.replaceAll('"', "");
            else this.name = value;
        };
        this.populateMap["3"] = (_, value) => (this.description = value.replaceAll('"', ""));
    }
}

export class LoadedAbility extends LoadedData<LoadedAbility> {
    name: string = "";
    description: string = "";
    flags: string[] = [];
    isSignature: boolean = false;

    constructor() {
        super();
        this.populateMap[LoadedData.bracketKeyName] = (_, value) => (this.key = value);
        this.populateMap["Name"] = (_, value) => (this.name = value);
        this.populateMap["Description"] = (_, value) => (this.description = value);
        this.populateMap["Flags"] = (_, value) => (this.flags = value.split(","));
    }
}

export class LoadedMove extends LoadedData<LoadedMove> {
    name: string = "";
    description: string = "";
    type: string = "";
    category: string = "";
    power: number = 0;
    accuracy: number = 0;
    pp: number = 0;
    target: string = "";
    functionCode: string = "";
    effectChance?: number;
    priority?: number;
    flags: string[] = [];
    isSignature: boolean = false;

    constructor() {
        super();
        this.populateMap[LoadedData.bracketKeyName] = (_, value) => (this.key = value);
        this.populateMap["Name"] = (_, value) => (this.name = value);
        this.populateMap["Description"] = (_, value) => (this.description = value);
        this.populateMap["Type"] = (_, value) => (this.type = value);
        this.populateMap["Category"] = (_, value) => (this.category = value);
        this.populateMap["Power"] = (_, value) => (this.power = parseInt(value));
        this.populateMap["Accuracy"] = (_, value) => (this.accuracy = parseInt(value));
        this.populateMap["TotalPP"] = (_, value) => (this.pp = parseInt(value));
        this.populateMap["Target"] = (_, value) => (this.target = value);
        this.populateMap["FunctionCode"] = (_, value) => (this.functionCode = value);
        this.populateMap["EffectChance"] = (_, value) => (this.effectChance = parseInt(value));
        this.populateMap["Priority"] = (_, value) => (this.priority = parseInt(value));
        this.populateMap["Flags"] = (_, value) => (this.flags = value.split(","));
    }
}

export class LoadedItem extends LoadedData<LoadedItem> {
    name: string = "";
    description: string = "";
    pocket: number = 0;
    flags: string[] = [];

    constructor() {
        super();
        this.populateMap[LoadedData.bracketKeyName] = (_, value) => (this.key = value);
        this.populateMap["Name"] = (_, value) => (this.name = value);
        this.populateMap["Description"] = (_, value) => (this.description = value);
        this.populateMap["Pocket"] = (_, value) => (this.pocket = parseInt(value));
        this.populateMap["Flags"] = (_, value) => (this.flags = value.split(","));
    }
}

export class LoadedPokemon extends LoadedData<LoadedPokemon> {
    static formMoves: Record<string, (string | undefined)[]> = {
        ROTOM: [undefined, "OVERHEAT", "HYDROPUMP", "BLIZZARD", "AIRSLASH", "LEAFSTORM"],
        URSHIFU: ["WICKEDBLOW", "SURGINGSTRIKES"],
        NECROZMA: [undefined, "SUNSTEELSTRIKE", "MOONGEISTBEAM"],
    };

    name: string = "";
    dexNum: number = 0;
    formId: number = 0;
    formName?: string;
    type1: string = "";
    type2?: string;
    height: number = 0;
    weight: number = 0;
    hp: number = 0;
    attack: number = 0;
    defense: number = 0;
    speed: number = 0;
    spAttack: number = 0;
    spDefense: number = 0;
    bst: number = 0;
    abilities: string[] = [];
    levelMoves: [number, string][] = [];
    lineMoves: string[] = [];
    tutorMoves: string[] = [];
    formSpecificMoves: (string | undefined)[] = [];
    tribes: string[] = [];
    wildItems: string[] = [];
    kind: string = "";
    pokedex: string = "";
    evolutions: PokemonEvolutionTerms[] = [];
    evolutionTree?: NTreeNode<PokemonEvolutionTerms>; // Requires post-load propagation
    evolutionTreeArray?: NTreeArrayNode<PokemonEvolutionTerms>[]; // Pre-write

    constructor() {
        super();
        this.populateMap[LoadedData.bracketKeyName] = (version, value) => {
            if (version.startsWith("3.2") && !value.includes(",")) this.dexNum = parseInt(value);
            else this.key = value;
        };
        this.populateMap["Name"] = (_, value) => (this.name = value);
        this.populateMap["FormName"] = (_, value) => (this.formName = value);
        this.populateMap["InternalName"] = (version, value) => {
            if (version.startsWith("3.2")) this.key = value;
        };
        this.populateMap["Type1"] = (_, value) => (this.type1 = value);
        this.populateMap["Type2"] = (_, value) => (this.type2 = value);
        this.populateMap["Height"] = (_, value) => (this.height = parseFloat(value));
        this.populateMap["Width"] = (_, value) => (this.weight = parseFloat(value));
        this.populateMap["BaseStats"] = (_, value) => {
            const stats = value.split(",");
            this.hp = parseInt(stats[0]);
            this.attack = parseInt(stats[1]);
            this.defense = parseInt(stats[2]);
            this.speed = parseInt(stats[3]);
            this.spAttack = parseInt(stats[4]);
            this.spDefense = parseInt(stats[5]);
            this.bst = this.hp + this.attack + this.defense + this.speed + this.spAttack + this.spDefense;
        };
        this.populateMap["Abilities"] = (_, value) => (this.abilities = value.split(","));
        this.populateMap["Moves"] = (_, value) => {
            const moveSplit = value.split(",");
            for (let i = 0; i < moveSplit.length; i += 2) {
                this.levelMoves.push([parseInt(moveSplit[i]), moveSplit[i + 1]]);
            }
        };
        this.populateMap["LineMoves"] = (_, value) => (this.lineMoves = value.split(","));
        this.populateMap["TutorMoves"] = (_, value) => (this.tutorMoves = value.split(","));
        this.populateMap["Tribes"] = (_, value) => (this.tribes = value.split(","));
        this.populateMap["WildItemCommon"] = (_, value) => this.wildItems.push(value);
        this.populateMap["WildItemUncommon"] = (_, value) => this.wildItems.push(value);
        this.populateMap["WildItemRare"] = (_, value) => this.wildItems.push(value);
        this.populateMap["Kind"] = (_, value) => (this.kind = value);
        this.populateMap["Pokedex"] = (_, value) => (this.pokedex = value);
        this.populateMap["Evolutions"] = (_, value) => {
            const evoSplit = value.split(",");
            for (let i = 0; i < evoSplit.length; i += 3) {
                this.evolutions.push(new PokemonEvolutionTerms(evoSplit[i], evoSplit[i + 1], evoSplit[i + 2]));
            }
        };
    }

    override populate(tectonicVersion: string, pairs: KVPair[]): LoadedPokemon {
        super.populate(tectonicVersion, pairs);
        this.formSpecificMoves = LoadedPokemon.formMoves[this.key];

        return this;
    }

    postProcessKeyForFormEntry() {
        const terms = this.key.split(",");
        this.key = terms[0];
        this.formId = parseInt(terms[1]);
    }

    getAllMoves() {
        let moves: Array<string | undefined> = [];
        // in Tectonic, we first push egg moves here, but that is a leftover from Pokemon Essentials defaults I think

        // TODO: Double check how this worked before the removal of tutormoves. Currently assuming.
        // On dev, when it's empty, this will do nothing and be fine
        moves = moves.concat(this.tutorMoves);
        moves = moves.concat(this.lineMoves);
        moves = moves.concat(this.formSpecificMoves);
        moves = moves.concat(this.levelMoves.map((m) => m[1]));
        moves = uniq(moves);
        const finalMoves: string[] = moves.filter((m) => m !== undefined);
        return finalMoves;
    }
}

export class LoadedTrainerType extends LoadedData<LoadedTrainerType> {
    name: string = "";
    gender: string = "";
    baseMoney: number = 0;
    introBGM?: string;
    battleBGM?: string;

    constructor() {
        super();
        this.populateMap[LoadedData.bracketKeyName] = (_, value) => (this.key = value);
        this.populateMap["Name"] = (_, value) => (this.name = value);
        this.populateMap["BaseMoney"] = (_, value) => (this.baseMoney = parseInt(value));
        this.populateMap["IntroBGM"] = (_, value) => (this.introBGM = value);
        this.populateMap["BattleBGM"] = (_, value) => (this.battleBGM = value);
    }
}

export class LoadedTrainerPokemon {
    id: string = "";
    level: number = 0;
    name?: string;
    gender?: string;
    moves: string[] = [];
    abilityIndex?: number;
    items: string[] = [];
    itemType?: string;
    sp: number[] = [];
}

export class LoadedTrainer extends LoadedData<LoadedTrainer> {
    class: string = "";
    name: string = "";
    version?: number;
    nameForHashing?: string;
    typeLabel?: string;
    extendsVersion?: number;
    policies: string[] = [];
    flags: string[] = [];
    pokemon: LoadedTrainerPokemon[] = [];
    currentPokemon: LoadedTrainerPokemon = new LoadedTrainerPokemon(); //Processing only

    constructor() {
        super();
        this.populateMap[LoadedData.bracketKeyName] = (_, value) => {
            const bracketTerms = value.split(",");
            this.key = value;
            this.class = bracketTerms[0];
            this.name = bracketTerms[1];
            if (bracketTerms.length > 2) {
                this.version = parseInt(bracketTerms[2]);
            }
        };
        this.populateMap["Name"] = (_, value) => (this.name = value);
        this.populateMap["NameForHashing"] = (_, value) => (this.nameForHashing = value);
        this.populateMap["TrainerTypeLabel"] = (_, value) => (this.typeLabel = value);
        this.populateMap["ExtendsVersion"] = (_, value) => (this.extendsVersion = parseInt(value));
        this.populateMap["Policies"] = (_, value) => (this.policies = value.split(","));
        this.populateMap["Flags"] = (_, value) => (this.flags = value.split(","));
        this.populateMap["Pokemon"] = (_, value) => {
            if (this.currentPokemon.id !== "") {
                this.pokemon.push({ ...this.currentPokemon });
                this.currentPokemon = new LoadedTrainerPokemon();
            }
            const monTerms = value.split(",");
            this.currentPokemon.id = monTerms[0];
            this.currentPokemon.level = parseInt(monTerms[1]);
        };
        this.populateMap["Name"] = (_, value) => (this.currentPokemon.name = value);
        this.populateMap["Gender"] = (_, value) => (this.currentPokemon.gender = value);
        this.populateMap["Moves"] = (_, value) => (this.currentPokemon.moves = value.split(","));
        this.populateMap["AbilityIndex"] = (_, value) => (this.currentPokemon.abilityIndex = parseInt(value));
        this.populateMap["Items"] = (_, value) => (this.currentPokemon.items = value.split(","));
        this.populateMap["ItemType"] = (_, value) => (this.currentPokemon.itemType = value);
        this.populateMap["EV"] = (_, value) => (this.currentPokemon.sp = value.split(",").map((v) => parseInt(v)));
    }

    override populate(tectonicVersion: string, pairs: KVPair[]): LoadedTrainer {
        super.populate(tectonicVersion, pairs);

        // Add last pokemon to array after processing completes
        if (this.currentPokemon.id !== "") {
            this.pokemon.push({ ...this.currentPokemon });
        }

        return this;
    }
}

export class KVPair {
    key: string;
    value: string;

    constructor(key: string, value: string) {
        this.key = key;
        this.value = value;
    }
}

export class RawEncounterTable {
    tableLine: string;
    encounterSplits: string[][] = [];

    constructor(tableLine: string = "") {
        this.tableLine = tableLine;
    }
}

export class RawEncounterMap {
    mapLine: string;
    tables: RawEncounterTable[] = [];

    constructor(mapLine: string = "") {
        this.mapLine = mapLine;
    }
}

export class LoadedEncounter {
    weight: number;
    pokemon: string;
    minLevel: number; // Exact level for static encounters
    maxLevel?: number;

    constructor(raw: string[]) {
        this.weight = parseInt(raw[0].trim());
        this.pokemon = raw[1];
        this.minLevel = parseInt(raw[2]);
        if (raw.length > 3) this.maxLevel = parseInt(raw[3]);
    }
}

export class LoadedEncounterTable {
    type: string;
    encounterRate?: number;
    encounters: LoadedEncounter[];

    constructor(raw: RawEncounterTable) {
        const tableTerms = raw.tableLine.split(",");

        this.type = tableTerms[0];
        if (tableTerms.length > 1) {
            this.encounterRate = parseInt(tableTerms[1]);
        }
        this.encounters = raw.encounterSplits.map((x) => new LoadedEncounter(x));
    }
}

export class LoadedEncounterMap {
    key: number;
    name: string;
    tables: LoadedEncounterTable[];

    constructor(raw: RawEncounterMap) {
        this.key = parseInt(raw.mapLine.split("]")[0].slice(1));
        this.name = raw.mapLine.split("#")[1].trim();
        this.tables = raw.tables.map((x) => new LoadedEncounterTable(x));
    }
}

export type LoadedDataJson = {
    version: string;
    types: Record<string, LoadedType>;
    tribes: Record<string, LoadedTribe>;
    abilities: Record<string, LoadedAbility>;
    moves: Record<string, LoadedMove>;
    items: Record<string, LoadedItem>;
    pokemon: Record<string, LoadedPokemon>;
    forms: Record<string, LoadedPokemon[]>;
    trainerTypes: Record<string, LoadedTrainerType>;
    trainers: Record<string, LoadedTrainer>;
    encounters: Record<string, LoadedEncounterMap>;
    typeChart: number[][];
};
