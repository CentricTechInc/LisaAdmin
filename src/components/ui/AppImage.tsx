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
  const [src, setSrc] = React.useState(() => {
    if (!imageName) return "/images/avatar.png";
    if (imageName.startsWith("data:") || imageName.startsWith("http") || imageName.startsWith("/")) {
      return imageName;
    }
    return `/images/${imageName}`;
  });

  React.useEffect(() => {
    if (!imageName) {
      setSrc("/images/avatar.png");
      return;
    }
    
    // Check if it's a data URL (uploaded image) or external URL
    if (imageName.startsWith("data:") || imageName.startsWith("http") || imageName.startsWith("/")) {
      setSrc(imageName);
    } else {
      // It's a local image in public/images folder
      setSrc(`/images/${imageName}`);
    }
  }, [imageName]);

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
      onError={() => setSrc("/images/avatar.png")}
      {...props}
    />
  );
};

export default AppImage;

