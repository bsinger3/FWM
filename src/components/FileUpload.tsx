import React, { useState, useRef } from "react";
import { Upload, X } from "lucide-react";

interface FileUploadProps {
  onFileChange: (file: File | null) => void;
  acceptedFileTypes?: string; // Optional prop to specify accepted file types
  maxSizeMB?: number; // Optional prop to specify max file size in MB
}

export default function FileUpload({ 
  onFileChange, 
  acceptedFileTypes = "*/*",
  maxSizeMB = 10 
}: FileUploadProps) {
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError(null);

    if (file) {
      // Check file size
      if (file.size > maxSizeMB * 1024 * 1024) {
        setError(`File size must be less than ${maxSizeMB}MB`);
        return;
      }

      onFileChange(file);
      setFileName(file.name);
    }
  };

  const removeFile = () => {
    onFileChange(null);
    setFileName(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex items-center justify-center w-full">
      {fileName ? (
        <div className="w-full p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">{fileName}</span>
            <button
              type="button"
              onClick={removeFile}
              className="text-red-500 hover:text-red-700"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      ) : (
        <label
          htmlFor="file"
          className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-8 h-8 mb-3 text-gray-400" />
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500">
              {acceptedFileTypes === "*/*" 
                ? "Any file type accepted" 
                : `Accepted types: ${acceptedFileTypes}`}
            </p>
          </div>
          <input
            type="file"
            id="file"
            accept={acceptedFileTypes}
            onChange={handleFileChange}
            className="hidden"
            ref={fileInputRef}
          />
        </label>
      )}
      {error && (
        <p className="mt-2 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
} 