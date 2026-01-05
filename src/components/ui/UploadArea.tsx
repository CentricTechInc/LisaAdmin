import React, { useRef } from 'react';

interface UploadAreaProps {
  onFileSelect: (file: File) => void;
  className?: string;
  label?: string | null;
}

export const UploadArea: React.FC<UploadAreaProps> = ({ onFileSelect, className, label = "Upload Your Image" }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <div className={`flex flex-col gap-2 ${className || ''}`}>
      {label && <label className="text-sm text-gray-600">{label}</label>}
      <div 
        onClick={handleClick}
        className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white p-8 cursor-pointer hover:bg-gray-50 transition-colors"
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*"
          onChange={handleFileChange}
        />
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#FF4460] text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
        </div>
        <p className="mb-2 text-sm font-medium text-gray-900">
          Drop your file(s) here to start uploading
        </p>
        <div className="flex w-full items-center gap-2">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-xs text-gray-400">OR</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>
        <button
          type="button"
          className="mt-4 rounded-full border border-[#FF4460] px-6 py-2 text-sm font-medium text-[#FF4460] hover:bg-red-50"
        >
          Browse files
        </button>
      </div>
    </div>
  );
};
