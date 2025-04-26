import { PartyPokemon } from "@/app/data/types/PartyPokemon";
import { PokemonType } from "@/app/data/types/PokemonType";
import TypeBadge, { TypeBadgeElementEnum } from "@/components/TypeBadge";
import Image from "next/image";

export default function MatchupMonCell({ c, useMoves }: { c: PartyPokemon; useMoves: boolean }) {
    function getMoveTypeOrUndefined(index: number): PokemonType | undefined {
        return c.moves.length > index && c.moves[index].isAttackingMove() ? c.moves[index].getType(c) : undefined;
    }

    return (
        <td>
            <div className="flex pr-2 space-x-1">
                <Image
                    src={c.species.getImage(c.form)}
                    alt={c.species.getFormName(c.form) ?? c.species.name}
                    title={c.species.getFormName(c.form) ?? c.species.name}
                    height="80"
                    width="80"
                    className="m-1"
                />
                {useMoves ? (
                    <>
                        <TypeBadge
                            types={[getMoveTypeOrUndefined(0), getMoveTypeOrUndefined(1)]}
                            useShort={false}
                            element={TypeBadgeElementEnum.CAPSULE_STACK}
                        />
                        <TypeBadge
                            types={[getMoveTypeOrUndefined(2), getMoveTypeOrUndefined(3)]}
                            useShort={false}
                            element={TypeBadgeElementEnum.CAPSULE_STACK}
                        />
                    </>
                ) : (
                    <TypeBadge
                        types={[c.types.type1, c.types.type2]}
                        useShort={false}
                        element={TypeBadgeElementEnum.CAPSULE_STACK}
                    />
                )}
            </div>
        </td>
    );
}
