import { ReactNode } from "react";

export default function CloseXButton({
    className,
    svgClassName = "w-7 h-7",
    onClick,
}: {
    className?: string;
    svgClassName?: string;
    onClick: () => void;
}): ReactNode {
    return (
        <button onClick={onClick} className={`text-white hover:text-yellow-highlight cursor-pointer ${className}`}>
            <svg className={`${svgClassName}`} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>
    );
}
