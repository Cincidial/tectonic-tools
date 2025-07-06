"use client";

import Column from "@/components/Column";
import { MiniDexFilter } from "@/components/MiniDexFilter";
import PageHeader, { PageType } from "@/components/PageHeader";
import SavedTeamManager from "@/components/SavedTeamManager";
import type { NextPage } from "next";
import Head from "next/head";

const PokemonDamageCalculator: NextPage = () => {
    return (
        <div className="min-h-screen bg-gray-900 pb-10">
            <Head>
                <title>Pokémon Tectonic Damage Calculator</title>
                <meta
                    name="description"
                    content="A damage calculator using the modified mechanics of Pokémon Tectonic"
                />
            </Head>
            <PageHeader currentPage={PageType.Calc} />

            <main className="container mx-auto">
                <div className="flex justify-center">
                    <Column>
                        <MiniDexFilter onMon={(mon) => {}} />
                        <SavedTeamManager onLoad={(loadedParty) => {}} />
                    </Column>

                    <Column>asdf</Column>

                    <Column>
                        <MiniDexFilter onMon={(mon) => {}} />
                        <SavedTeamManager onLoad={(loadedParty) => {}} />
                    </Column>
                </div>
            </main>
        </div>
    );
};

export default PokemonDamageCalculator;
