'use client';

import { clsx } from 'clsx';
import { Upload, X, FileText } from 'lucide-react';
import { useCallback, useState } from 'react';

interface FileUploadProps {
  label?: string;
  accept?: string;
  maxSizeMB?: number;
  onFileSelect: (file: File | null) => void;
  error?: string;
}

export function FileUpload({
  label,
  accept = 'image/*,.pdf,.doc,.docx',
  maxSizeMB = 10,
  onFileSelect,
  error,
}: FileUploadProps) {
  const [fileName, setFileName] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [sizeError, setSizeError] = useState<string | null>(null);

  const handleFile = useCallback(
    (file: File | null) => {
      if (file && file.size > maxSizeMB * 1024 * 1024) {
        setSizeError(`File must be under ${maxSizeMB}MB`);
        return;
      }
      setSizeError(null);
      setFileName(file?.name ?? null);
      onFileSelect(file);
    },
    [maxSizeMB, onFileSelect]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleClear = () => {
    setFileName(null);
    setSizeError(null);
    onFileSelect(null);
  };

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-foreground">{label}</label>
      )}
      {fileName ? (
        <div className="flex items-center gap-3 rounded-lg border border-primary-200 bg-primary-50 px-4 py-3">
          <FileText className="h-5 w-5 text-primary-600" />
          <span className="flex-1 truncate text-sm text-foreground">{fileName}</span>
          <button
            type="button"
            onClick={handleClear}
            className="rounded p-1 text-muted-foreground hover:bg-primary-100 hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <label
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={clsx(
            'flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed px-6 py-8 transition-colors',
            dragOver
              ? 'border-primary-500 bg-primary-50'
              : 'border-border hover:border-primary-300 hover:bg-muted'
          )}
        >
          <Upload className="h-8 w-8 text-muted-foreground" />
          <div className="text-center">
            <span className="text-sm font-medium text-primary-600">Click to upload</span>
            <span className="text-sm text-muted-foreground"> or drag and drop</span>
          </div>
          <span className="text-xs text-muted-foreground">Max {maxSizeMB}MB</span>
          <input
            type="file"
            accept={accept}
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
          />
        </label>
      )}
      {(error || sizeError) && (
        <p className="text-xs text-red-600">{sizeError || error}</p>
      )}
    </div>
  );
}
