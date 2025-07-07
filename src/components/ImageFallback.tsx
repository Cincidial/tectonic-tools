import Image from "next/image";
import { ReactNode, useState } from "react";

// Keep adding fallbacks till we can serve everyone for free?
const IMG_CDN_ROOT = "https://tectonictools.sirv.com/Images/public/";
const IMG_GITHUB_FALLBACK = "https://raw.githubusercontent.com/AlphaKretin/tectonic-tools/refs/heads/main/public/";
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
    const [isCDNErrorTryGithub, setIsCDNErrorTryGithub] = useState<boolean>(false);
    const [isError, setError] = useState<boolean>(false);

    // Non prod builds should force use Image so we don't use up CDN limits
    return process.env.NODE_ENV !== "production" ? (
        <Image
            alt={alt}
            title={title}
            src={isError ? IMG_NOT_FOUND : src}
            onError={() => {
                if (!isCDNErrorTryGithub) {
                    setIsCDNErrorTryGithub(true);
                } else {
                    setError(true);
                }
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
    ) : (
        <img
            alt={alt}
            title={title}
            src={
                isCDNErrorTryGithub
                    ? `${IMG_GITHUB_FALLBACK}${src}`
                    : isError
                    ? `${IMG_CDN_ROOT}${IMG_NOT_FOUND}`
                    : `${IMG_CDN_ROOT}${src}`
            }
            onError={() => {
                if (!isCDNErrorTryGithub) {
                    setIsCDNErrorTryGithub(true);
                } else {
                    setError(true);
                }
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
