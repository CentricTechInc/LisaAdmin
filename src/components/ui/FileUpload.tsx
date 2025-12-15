import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export type FileUploadProps = {
  label?: string;
  fileName?: string;
  onDelete?: () => void;
  onDownload?: () => void;
  wrapperClassName?: string;
  className?: string;
};

export const FileUpload: React.FC<FileUploadProps> = ({
  label,
  fileName,
  onDelete,
  onDownload,
  wrapperClassName,
  className,
}) => {
  return (
    <div className={cn("flex flex-col gap-2", wrapperClassName)}>
      {label && (
        <label className="text-sm text-[color-mix(in_oklab,var(--color-foreground)_85%,transparent)]">
          {label}
        </label>
      )}
      <div
        className={cn(
          "flex items-center justify-between rounded-[1.25rem] border border-[color-mix(in_oklab,var(--color-muted)_60%,transparent)] bg-white px-4 py-3",
          className
        )}
      >
        <span className="text-[#FF4460] underline decoration-[#FF4460] underline-offset-4">
          {fileName || "No file uploaded"}
        </span>
        <div className="flex items-center gap-3">
          {onDownload && (
            <button
              type="button"
              onClick={onDownload}
              className="text-[color-mix(in_oklab,var(--color-foreground)_85%,transparent)] hover:text-[#FF4460]"
            >
               <Image
                src="/icons/import.svg"
                alt="download"
                width={20}
                height={20}
              />
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="text-[#FF4460] hover:text-[#D12E48]"
            >
              <Image
                src="/icons/trash.svg"
                alt="delete"
                width={20}
                height={20}
              />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
