import type { CSSProperties, ImgHTMLAttributes } from "react";

// Minimal stand-in for next/image so the case-study pages run under Vite.
type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  src: string | { src: string };
  fill?: boolean;
  priority?: boolean;
  unoptimized?: boolean;
  quality?: number;
};

export default function Image({ src, fill, priority, unoptimized: _unoptimized, quality: _quality, style, loading, ...rest }: Props) {
  const fillStyle: CSSProperties | undefined = fill ? { position: "absolute", inset: 0, width: "100%", height: "100%" } : undefined;

  return (
    <img
      {...rest}
      src={typeof src === "string" ? src : src.src}
      loading={priority ? "eager" : (loading ?? "lazy")}
      decoding="async"
      style={{ ...fillStyle, ...style }}
    />
  );
}
