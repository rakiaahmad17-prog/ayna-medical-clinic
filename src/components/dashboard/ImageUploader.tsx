'use client';

import { useState, useRef, useCallback, DragEvent, ChangeEvent } from 'react';

interface ImageUploaderProps {
  onUploadComplete?: (url: string) => void;
  currentImage?: string;
  label?: string;
  className?: string;
}

type UploadStatus = 'idle' | 'dragging' | 'uploading' | 'success' | 'error';

export default function ImageUploader({
  onUploadComplete,
  currentImage,
  label = 'Upload Image',
  className = '',
}: ImageUploaderProps) {
  const [status, setStatus] = useState<UploadStatus>('idle');
  const [preview, setPreview] = useState<string>(currentImage || '');
  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  const MAX_SIZE = 5 * 1024 * 1024;

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return 'Invalid file type. Please upload JPG, PNG, GIF, or WebP.';
    }
    if (file.size > MAX_SIZE) {
      return 'File size exceeds 5MB limit.';
    }
    return null;
  };

  const uploadFile = async (file: File) => {
    setStatus('uploading');
    setProgress(0);
    setErrorMessage('');

    const formData = new FormData();
    formData.append('image', file);

    try {
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 90));
      }, 100);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }

      const data = await response.json();
      setPreview(data.url);
      setStatus('success');
      onUploadComplete?.(data.url);

      // Reset status after showing success
      setTimeout(() => setStatus('idle'), 2000);
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Upload failed');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setStatus('dragging');
  }, []);

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setStatus('idle');
  }, []);

  const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setStatus('idle');

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      const validationError = validateFile(file);
      if (validationError) {
        setErrorMessage(validationError);
        setStatus('error');
        setTimeout(() => setStatus('idle'), 3000);
        return;
      }
      uploadFile(file);
    }
  }, []);

  const handleFileSelect = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const validationError = validateFile(file);
      if (validationError) {
        setErrorMessage(validationError);
        setStatus('error');
        setTimeout(() => setStatus('idle'), 3000);
        return;
      }
      uploadFile(file);
    }
  }, []);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = () => {
    setPreview('');
    setStatus('idle');
    setProgress(0);
    onUploadComplete?.('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getBorderColor = () => {
    switch (status) {
      case 'dragging':
        return 'border-primary-500 bg-primary-50';
      case 'error':
        return 'border-red-400 bg-red-50';
      case 'success':
        return 'border-green-500 bg-green-50';
      case 'uploading':
        return 'border-primary-400 bg-primary-50/50';
      default:
        return 'border-surface-300 hover:border-primary-300 hover:bg-primary-50/30';
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-2">
          {label}
        </label>
      )}

      {/* Drop Zone */}
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative group cursor-pointer
          border-2 border-dashed rounded-2xl
          transition-all duration-300 ease-out
          ${getBorderColor()}
          ${status === 'uploading' ? 'pointer-events-none' : ''}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={ALLOWED_TYPES.join(',')}
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Empty State */}
        {!preview && status !== 'uploading' && (
          <div className="flex flex-col items-center justify-center py-12 px-6">
            <div className={`
              w-16 h-16 mb-4 rounded-2xl
              bg-gradient-to-br from-primary-100 to-primary-50
              flex items-center justify-center
              transition-transform duration-300 group-hover:scale-110
            `}>
              <svg
                className="w-8 h-8 text-primary-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <p className="text-slate-700 font-medium mb-1">
              {status === 'dragging' ? 'Drop image here' : 'Drag & drop or click to upload'}
            </p>
            <p className="text-sm text-slate-400">
              JPG, PNG, GIF, WebP • Max 5MB
            </p>
          </div>
        )}

        {/* Upload Progress */}
        {status === 'uploading' && (
          <div className="flex flex-col items-center justify-center py-12 px-6">
            <div className="relative w-16 h-16 mb-4">
              <svg className="w-16 h-16 -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-surface-200"
                  strokeWidth="3"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-primary-500 transition-all duration-200"
                  strokeWidth="3"
                  stroke="currentColor"
                  strokeLinecap="round"
                  fill="none"
                  strokeDasharray={`${progress}, 100`}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-semibold text-primary-600">
                  {progress}%
                </span>
              </div>
            </div>
            <p className="text-slate-700 font-medium">Uploading...</p>
          </div>
        )}

        {/* Preview */}
        {preview && status !== 'uploading' && (
          <div className="relative">
            <div className="p-3">
              <div className="relative rounded-xl overflow-hidden bg-surface-100">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-48 object-cover"
                />
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClick();
                      }}
                      className="p-2 rounded-full bg-white/90 hover:bg-white transition-colors"
                    >
                      <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemove();
                      }}
                      className="p-2 rounded-full bg-white/90 hover:bg-white transition-colors"
                    >
                      <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {/* Success badge */}
            {status === 'success' && (
              <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-green-500 text-white text-sm font-medium flex items-center gap-1 animate-fade-in">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Uploaded
              </div>
            )}
          </div>
        )}
      </div>

      {/* Error Message */}
      {status === 'error' && errorMessage && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 border border-red-200 animate-fade-in">
          <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm text-red-700">{errorMessage}</p>
        </div>
      )}

      {/* URL Display */}
      {preview && status !== 'uploading' && (
        <div className="flex items-center gap-2">
          <input
            type="text"
            readOnly
            value={preview}
            className="flex-1 px-3 py-2 text-sm rounded-lg bg-surface-50 border border-surface-200 text-slate-600 font-mono"
          />
          <button
            type="button"
            onClick={() => navigator.clipboard.writeText(preview)}
            className="p-2 rounded-lg bg-surface-100 hover:bg-surface-200 transition-colors"
            title="Copy URL"
          >
            <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
