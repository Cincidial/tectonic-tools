import { nullState } from "@/app/data/battleState";
import { PartyPokemon } from "@/app/data/types/PartyPokemon";
import { uniq } from "@/app/data/util";
import TypeBadge, { TypeBadgeElementEnum } from "@/components/TypeBadge";
import Image from "next/image";

export default function MatchupMonCell({ c, useMoves }: { c: PartyPokemon; useMoves: boolean }) {
    return (
        <td>
            <div className="flex p-1">
                <Image
                    src={c.species.getImage(c.form)}
                    alt={c.species.getFormName(c.form) ?? c.species.name}
                    title={c.species.getFormName(c.form) ?? c.species.name}
                    className="w-20 h-20"
                    height="192"
                    width="192"
                />
                {useMoves ? (
                    <>
                        <TypeBadge
                            types={uniq(c.moves.filter((m) => m.isAttackingMove()).map((m) => m.getType(c, nullState)))}
                            element={TypeBadgeElementEnum.ICONS}
                        />
                    </>
                ) : (
                    <TypeBadge types={[c.types.type1, c.types.type2]} element={TypeBadgeElementEnum.ICONS} />
                )}
            </div>
        </td>
    );
}
