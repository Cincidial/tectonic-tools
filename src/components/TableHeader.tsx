import { ReactNode } from "react";

export default function TableHeader({ children }: { children: ReactNode }) {
    return <th className="px-6 py-3 text-center text-white">{children}</th>;
}
