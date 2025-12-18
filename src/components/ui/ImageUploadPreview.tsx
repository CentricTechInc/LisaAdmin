import React, { useRef } from 'react';
import { AppImage } from './AppImage';

interface ImageUploadPreviewProps {
  imageName: string;
  alt: string;
  onFileSelect: (file: File) => void;
  className?: string;
  imageWrapperClassName?: string;
  imageClassName?: string;
  buttonLabel?: string;
}

export const ImageUploadPreview: React.FC<ImageUploadPreviewProps> = ({
  imageName,
  alt,
  onFileSelect,
  className,
  imageWrapperClassName,
  imageClassName,
  buttonLabel
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChangeImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <div className={`rounded-lg border border-dashed border-gray-300 p-8 w-full ${className || ''}`}>
      <div className="flex flex-col items-center justify-center gap-4">
        <div className={`relative overflow-hidden rounded-xl ${imageWrapperClassName || "h-24 w-24"}`}>
          <AppImage
            imageName={imageName}
            alt={alt}
            fill
            className={imageClassName}
          />
        </div>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />
        <button
          type="button"
          onClick={handleChangeImageClick}
          className="rounded border border-[#FF4460] px-4 py-2 text-sm font-medium text-[#FF4460] hover:bg-red-50"
        >
          {buttonLabel || "Change Image"}
        </button>
      </div>
    </div>
  );
};
 
