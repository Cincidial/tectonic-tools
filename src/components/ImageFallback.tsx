import { ReactNode, useState } from "react";

const IMG_GITHUB_ROOT = "https://raw.githubusercontent.com/AlphaKretin/tectonic-tools/refs/heads/main/public/";
export const IMG_NOT_FOUND = "/Items/NOTFOUND.png";
export default function ImageFallback({
    alt,
    src,
    width,
    height,
    className,
    title,
    onClick,
    onContextMenu,
}: {
    alt: string;
    src: string;
    width: number;
    height: number;
    className?: string;
    title?: string;
    onClick?: () => void;
    onContextMenu?: () => void;
}): ReactNode {
    const [isError, setError] = useState<boolean>(false);

    return (
        <img
            alt={alt}
            title={title}
            src={isError ? `${IMG_GITHUB_ROOT}${IMG_NOT_FOUND}` : `${IMG_GITHUB_ROOT}${src}`}
            onError={() => {
                setError(true);
            }}
            width={width}
            height={height}
            className={className}
            onClick={onClick}
            onContextMenu={(e) => {
                onContextMenu?.();
                e.preventDefault();
            }}
        />
    );
}
