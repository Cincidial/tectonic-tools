import Image from "next/image";
import { ReactNode, useState } from "react";

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
        <Image
            alt={alt}
            title={title}
            src={isError ? IMG_NOT_FOUND : src}
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
