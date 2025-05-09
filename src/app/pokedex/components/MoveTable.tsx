import { Move } from "@/app/data/tectonic/Move";
import TypeBadge, { TypeBadgeElementEnum } from "@/components/TypeBadge";
import Image from "next/image";
import { ReactNode } from "react";

function TableHeader({ children }: { children: ReactNode }) {
    return <th className="px-2 py-3 text-center text-sm font-medium text-gray-500 dark:text-gray-300">{children}</th>;
}

function TableCell({ children }: { children: ReactNode }) {
    return <td className="border-y px-2 py-3 text-center text-sm text-gray-900 dark:text-gray-200">{children}</td>;
}

export default function MoveTable({ moves, showLevel }: { moves: [number, Move][]; showLevel: boolean }) {
    return (
        <table className="w-full divide-gray-200 dark:divide-gray-700">
            <thead className="sticky top-0 bg-gray-50 dark:bg-gray-700">
                <tr>
                    {showLevel && <TableHeader>Level</TableHeader>}
                    <TableHeader>Name</TableHeader>
                    <TableHeader>Type</TableHeader>
                    <TableHeader>Cat</TableHeader>
                    <TableHeader>Power</TableHeader>
                    <TableHeader>Acc</TableHeader>
                    <TableHeader>PP</TableHeader>
                    <TableHeader>Effect</TableHeader>
                </tr>
            </thead>
            <tbody>
                {moves.map(([level, m], index) => (
                    <tr key={index}>
                        {showLevel && <TableCell>{level == 0 ? "E" : level}</TableCell>}
                        <TableCell>
                            <span className={m.isSignature ? "text-yellow-500" : ""}>{m.name}</span>
                        </TableCell>
                        <TableCell>
                            <TypeBadge
                                key={m.type.id}
                                types={[m.type]}
                                useShort={false}
                                element={TypeBadgeElementEnum.ICONS}
                            />
                        </TableCell>
                        <TableCell>
                            <Image
                                src={`/move_categories/${m.category}.png`}
                                alt={m.category}
                                title={m.category}
                                height="60"
                                width="51"
                                className="w-8 h-6"
                            />
                        </TableCell>
                        <TableCell>{m.bp}</TableCell>
                        <TableCell>{m.accuracy}</TableCell>
                        <TableCell>{m.pp}</TableCell>
                        <TableCell>{m.description}</TableCell>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
