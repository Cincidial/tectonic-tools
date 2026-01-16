import { decodeTeam } from "./teamExport";
import { Ability } from "./tectonic/Ability";
import { Item } from "./tectonic/Item";
import { Move } from "./tectonic/Move";
import { Pokemon } from "./tectonic/Pokemon";
import { PokemonType } from "./tectonic/PokemonType";
import { TectonicData } from "./tectonic/TectonicData";
import { PartyPokemon } from "./types/PartyPokemon";
import { convertBase64UrlToBuffer, convertToBase64Url } from "./util";

const PokePartyFormatVersion = 1;
const VERSION_BYTES = 4;
const CHAR_A = 65;

// Byte protocol shift
const POKE_PARTY_VERSION_SHIFT = 8;
const VERSION_MAJOR_SHIFT = 0;
const VERSION_MINOR_SHIFT = 5;
const VERSION_PATCH_SHIFT = 10;
const VERSION_DEV_SHIFT = 15; // End of header, not repeated - u16
const STYLE_HP_SHIFT = 0;
const STYLE_ATK_SHIFT = 5;
const STYLE_DEF_SHIFT = 10;
const STYLE_SDEF_SHIFT = 15;
const STYLE_SPEED_SHIFT = 20;
const LEVEL_SHIFT = 25;
const STATS_UPPER_SHIFT = 16;
const STRING_ID_NUM_U16_SHIFT = 8;

// Byte protocol masks
const OLD_CODE_CHECK_MASK = 0xff;
const POKE_PARTY_VERSION_MASK = 0xff << POKE_PARTY_VERSION_SHIFT;
const VERSION_MAJOR_MASK = 0b11111 << VERSION_MAJOR_SHIFT;
const VERSION_MINOR_MASK = 0b11111 << VERSION_MINOR_SHIFT;
const VERSION_PATCH_MASK = 0b11111 << VERSION_PATCH_SHIFT;
const VERSION_DEV_MASK = 0b1 << VERSION_DEV_SHIFT; // End of header, not repeated - u16
const STYLE_HP_MASK = 0b11111 << STYLE_HP_SHIFT;
const STYLE_ATK_MASK = 0b11111 << STYLE_ATK_SHIFT;
const STYLE_DEF_MASK = 0b11111 << STYLE_DEF_SHIFT;
const STYLE_SDEF_MASK = 0b11111 << STYLE_SDEF_SHIFT;
const STYLE_SPEED_MASK = 0b11111 << STYLE_SPEED_SHIFT;
const LEVEL_MASK = 0b1111111 << LEVEL_SHIFT;
const STATS_LOWER_MASK = 0xffff;
const STATS_UPPER_MASK = 0xffff_0000;
const STRING_ID_NUM_CHARS_MASK = 0xff;
const STRING_ID_NUM_U16_MASK = 0xff << STRING_ID_NUM_U16_SHIFT;

// TODO: Handle migrations

// TODO for later poke party work: Store alongside the entry in local storage the name for the entry (ie. single mon name / team name)
export class PokePartyEncoding {
    // Can encode a team of any size. Pokemon can have any ability and any move
    static encode(party: PartyPokemon[]): string {
        const pokePartyU16 = PokePartyFormatVersion << POKE_PARTY_VERSION_SHIFT;
        const versionSplit = TectonicData.version.replace("dev", "").split(".");
        let versionU16 = TectonicData.version.includes("-dev") ? VERSION_DEV_MASK : 0;
        versionU16 |= (parseInt(versionSplit[0]) & 0x1f) << VERSION_MAJOR_SHIFT;
        versionU16 |= (parseInt(versionSplit[1]) & 0x1f) << VERSION_MINOR_SHIFT;
        versionU16 |= (parseInt(versionSplit[2]) & 0x1f) << VERSION_PATCH_SHIFT;

        const u16sToEncode = [pokePartyU16, versionU16];
        for (const pokemon of party.filter((x) => x.species.id != Pokemon.NULL.id)) {
            const has1Item = pokemon.items.length == 1;
            const has2Items = pokemon.items.length == 2;

            encodeStringId(pokemon.species.id, u16sToEncode);
            encodeStringId(pokemon.ability.id, u16sToEncode);
            encodeStringId(has1Item ? pokemon.items[0].id : "", u16sToEncode);
            encodeStringId(pokemon.itemType?.id ?? "", u16sToEncode);
            encodeStringId(has2Items ? pokemon.items[1].id : "", u16sToEncode);
            encodeStringId(pokemon.moves[0]?.id ?? "", u16sToEncode);
            encodeStringId(pokemon.moves[1]?.id ?? "", u16sToEncode);
            encodeStringId(pokemon.moves[2]?.id ?? "", u16sToEncode);
            encodeStringId(pokemon.moves[3]?.id ?? "", u16sToEncode);
            u16sToEncode.push(pokemon.form);

            let stats = 0;
            stats |= (pokemon.stylePoints.hp << STYLE_HP_SHIFT) & STYLE_HP_MASK;
            stats |= (pokemon.stylePoints.attacks << STYLE_ATK_SHIFT) & STYLE_ATK_MASK;
            stats |= (pokemon.stylePoints.defense << STYLE_DEF_SHIFT) & STYLE_DEF_MASK;
            stats |= (pokemon.stylePoints.spdef << STYLE_SDEF_SHIFT) & STYLE_SDEF_MASK;
            stats |= (pokemon.stylePoints.speed << STYLE_SPEED_SHIFT) & STYLE_SPEED_MASK;
            stats |= (pokemon.level << LEVEL_SHIFT) & LEVEL_MASK;
            u16sToEncode.push(stats & STATS_LOWER_MASK);
            u16sToEncode.push((stats & STATS_UPPER_MASK) >>> STATS_UPPER_SHIFT);
        }

        const view = new DataView(new ArrayBuffer(u16sToEncode.length * 2));
        for (let i = 0; i < u16sToEncode.length; i++) {
            view.setUint16(i * 2, u16sToEncode[i]);
        }
        return convertToBase64Url(view.buffer);
    }

    static decode(base64: string): PartyPokemon[] {
        const view = new DataView(convertBase64UrlToBuffer(base64));
        const party: PartyPokemon[] = [];

        if (view.byteLength >= VERSION_BYTES) {
            let pokePartyVersion = view.getUint16(0);
            if ((pokePartyVersion & OLD_CODE_CHECK_MASK) != 0) {
                // TOOD: This must be an old code, for now use the old decoder, but eventually we will want to phase these out.
                return decodeTeam(base64);
            }

            const tectonicVersion = view.getUint16(2);
            let versionString = "";
            versionString += `${(tectonicVersion & VERSION_MAJOR_MASK) >>> VERSION_MAJOR_SHIFT}.`;
            versionString += `${(tectonicVersion & VERSION_MINOR_MASK) >>> VERSION_MINOR_SHIFT}.`;
            versionString += `${(tectonicVersion & VERSION_PATCH_MASK) >>> VERSION_PATCH_SHIFT}`;
            if ((tectonicVersion & VERSION_DEV_MASK) > 0) {
                versionString += "-dev";
            }
            console.log(versionString); // TODO: Logging to get rid of variable unused error
            pokePartyVersion = (pokePartyVersion & POKE_PARTY_VERSION_MASK) >>> POKE_PARTY_VERSION_SHIFT;

            let offset = VERSION_BYTES;
            let monId, abilityId, item1Id, item1TypeId, item2Id, move1Id, move2Id, move3Id, move4Id: string;
            while (offset < view.byteLength) {
                [monId, offset] = decodeStringId(view, offset);
                [abilityId, offset] = decodeStringId(view, offset);
                [item1Id, offset] = decodeStringId(view, offset);
                [item1TypeId, offset] = decodeStringId(view, offset);
                [item2Id, offset] = decodeStringId(view, offset);
                [move1Id, offset] = decodeStringId(view, offset);
                [move2Id, offset] = decodeStringId(view, offset);
                [move3Id, offset] = decodeStringId(view, offset);
                [move4Id, offset] = decodeStringId(view, offset);
                const form = view.getUint16(offset);
                const lowerStats = view.getUint16(offset + 2);
                const upperStats = view.getUint16(offset + 4);
                offset += 6;

                const stats = (upperStats << STATS_UPPER_SHIFT) | lowerStats;
                const styleHp = (stats & STYLE_HP_MASK) >>> STYLE_HP_SHIFT;
                const styleAtk = (stats & STYLE_ATK_MASK) >>> STYLE_ATK_SHIFT;
                const styleDef = (stats & STYLE_DEF_MASK) >>> STYLE_DEF_SHIFT;
                const styleSDef = (stats & STYLE_SDEF_MASK) >>> STYLE_SDEF_SHIFT;
                const styleSpeed = (stats & STYLE_SPEED_MASK) >>> STYLE_SPEED_SHIFT;
                const level = (stats & LEVEL_MASK) >>> LEVEL_SHIFT;

                const mon = new PartyPokemon();
                mon.species = TectonicData.pokemon[monId];
                mon.ability = TectonicData.abilities[abilityId] || Ability.NULL;
                if (item1Id.length > 0) mon.items[0] = TectonicData.items[item1Id] || Item.NULL;
                if (item2Id.length > 0) mon.items[1] = TectonicData.items[item2Id] || Item.NULL;
                if (item1TypeId.length > 0) mon.itemType = TectonicData.types[item1TypeId] || PokemonType.NULL;
                if (move1Id.length > 0) mon.moves[0] = TectonicData.moves[move1Id] || Move.NULL;
                if (move2Id.length > 0) mon.moves[1] = TectonicData.moves[move2Id] || Move.NULL;
                if (move3Id.length > 0) mon.moves[2] = TectonicData.moves[move3Id] || Move.NULL;
                if (move4Id.length > 0) mon.moves[3] = TectonicData.moves[move4Id] || Move.NULL;

                const formIndex = mon.species.forms.findIndex((f) => f.formId === form);
                mon.form = Math.max(formIndex, 0);
                mon.stylePoints = {
                    hp: styleHp,
                    attacks: styleAtk,
                    defense: styleDef,
                    spdef: styleSDef,
                    speed: styleSpeed,
                };
                mon.level = level;

                party.push(mon);
            }
        }

        return party;
    }
}

// Encodes the string id as (num u16s (upper) | num chars (lower)) (u16 value 1, 2, 3...)
function encodeStringId(id: string, u16sToEncode: number[]): void {
    const count = Math.floor(id.length / 3) + (id.length % 3 == 0 ? 0 : 1);
    u16sToEncode.push((count << STRING_ID_NUM_U16_SHIFT) | id.length);

    let currentU16 = 0;
    for (let i = 0; i < id.length; i++) {
        const value = id.charCodeAt(i) - CHAR_A;
        currentU16 |= value << ((i % 3) * 5);

        if (i % 3 == 2) {
            u16sToEncode.push(currentU16);
            currentU16 = 0;
        }
    }
    if (id.length % 3 != 0) {
        // The loop ended without pushing, so do so now
        u16sToEncode.push(currentU16);
    }
}

// Decodes the string id from (num u16s (upper) | num chars (lower)) (u16 value 1, 2, 3...). Returns [id, newOffset]
function decodeStringId(view: DataView<ArrayBuffer>, offset: number): [string, number] {
    const counts = view.getUint16(offset);
    let numChars = counts & STRING_ID_NUM_CHARS_MASK;
    const numU16s = (counts & STRING_ID_NUM_U16_MASK) >>> STRING_ID_NUM_U16_SHIFT;

    let id = "";
    for (let i = 0; i < numU16s; i++) {
        const chars = view.getUint16(offset + 2 + i * 2);
        for (let j = 0; j < 3 && numChars > 0; j++, numChars--) {
            id += String.fromCharCode(((chars & ((1 << ((j + 1) * 5)) - 1)) >>> (j * 5)) + CHAR_A);
        }
    }

    return [id, offset + 2 + numU16s * 2];
}
