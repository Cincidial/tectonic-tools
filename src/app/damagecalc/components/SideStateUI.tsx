import { nullSideState, SideState } from "@/app/data/battleState";
import Checkbox from "@/components/Checkbox";
import { ReactNode, useState } from "react";

const sideStateNameMap: Record<keyof SideState, string> = {
    reflect: "Reflect",
    lightScreen: "Light Screen",
    auroraVeil: "Aurora Veil",
};

export default function SideStateUI({ onUpdate }: { onUpdate: (sideState: SideState) => void }): ReactNode {
    const [sideState, setSideState] = useState<SideState>(nullSideState);

    return (
        <div className="flex gap-2 mb-1">
            {(Object.keys(sideState) as Array<keyof SideState>).map((k) => (
                <Checkbox
                    key={k}
                    checked={sideState[k]}
                    onChange={() => {
                        const newState = { ...sideState, [k]: !sideState[k] };
                        setSideState(newState);
                        onUpdate(newState);
                    }}
                >
                    {sideStateNameMap[k]}
                </Checkbox>
            ))}
        </div>
    );
}
