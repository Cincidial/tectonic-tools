import Link from "next/link";
import { ReactNode } from "react";

export enum PageType {
    Home,
    Pokedex,
    Builder,
    Calc,
}

export default function PageHeader({ currentPage }: { currentPage: PageType }): ReactNode {
    function getLinkClass(type: PageType) {
        return `px-4 py-2 text-2xl text-white hover:text-amber-200 ${type == currentPage ? "bg-white/15" : ""}`;
    }

    return (
        <>
            <nav className="flex justify-around mb-3 bg-white/10 border-b">
                <Link href={"../"} className={getLinkClass(PageType.Home)}>
                    Pokémon Tectonic Tools
                </Link>
                <Link href={"/damagecalc"} className={getLinkClass(PageType.Calc)}>
                    Damage Calculator
                </Link>
                <Link href={"/pokedex"} className={getLinkClass(PageType.Pokedex)}>
                    Pokédex
                </Link>
                <Link href={"/teambuilder"} className={getLinkClass(PageType.Builder)}>
                    Team Builder
                </Link>
            </nav>
        </>
    );
}
