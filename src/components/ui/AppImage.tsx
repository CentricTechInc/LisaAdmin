import React from "react";
import Image, { type ImageProps } from "next/image";
import { cn } from "@/lib/utils";

export type AppImageProps = Omit<ImageProps, "src"> & {
  imageName: string;
  rounded?: boolean;
  className?: string;
};

export const AppImage: React.FC<AppImageProps> = ({
  imageName,
  alt,
  width,
  height,
  rounded = true,
  className,
  ...props
}) => {
  const src = `/images/${imageName}`;

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={cn(
        rounded ? "rounded-[1.25rem] object-cover" : "",
        className
      )}
      {...props}
    />
  );
};

export default AppImage;

