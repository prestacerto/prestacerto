import Image, { ImageProps } from "next/image";
import { CSSProperties } from "react";

interface OptimizedImageProps extends Omit<ImageProps, "width" | "height"> {
  width?: number;
  height?: number;
  aspectRatio?: number;
  containerClassName?: string;
}

export function OptimizedImage({
  width = 1200,
  height = 630,
  aspectRatio = width / height,
  containerClassName = "",
  ...props
}: OptimizedImageProps) {
  const containerStyle: CSSProperties = {
    position: "relative",
    width: "100%",
    paddingBottom: `${(1 / aspectRatio) * 100}%`,
  };

  const imageStyle: CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  };

  return (
    <div style={containerStyle} className={containerClassName}>
      <Image
        {...props}
        width={width}
        height={height}
        loading="lazy"
        style={imageStyle}
        quality={75}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
      />
    </div>
  );
}
