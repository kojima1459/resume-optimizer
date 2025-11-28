import { useState, useCallback, DragEvent } from 'react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

export interface UseFileDropOptions {
  onFileDrop: (file: File) => void;
  accept?: string[];
  maxSizeMB?: number;
  onError?: (error: string) => void;
}

export function useFileDrop({ onFileDrop, accept, maxSizeMB = 5, onError }: UseFileDropOptions) {
  const { t } = useTranslation();
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = useCallback((e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Only set dragging to false if we're leaving the drop zone entirely
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    
    if (x <= rect.left || x >= rect.right || y <= rect.top || y >= rect.bottom) {
      setIsDragging(false);
    }
  }, []);

  const handleDragOver = useCallback((e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    
    if (files.length === 0) {
      return;
    }

    const file = files[0];
    
    // Check file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSizeMB) {
      const errorMsg = t('toast.fileSizeError', { maxSize: maxSizeMB, currentSize: fileSizeMB.toFixed(2) });
      toast.error(errorMsg);
      onError?.(errorMsg);
      return;
    }
    
    // Check file type if accept is specified
    if (accept && accept.length > 0) {
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      const mimeType = file.type;
      
      const isAccepted = accept.some(acceptType => {
        if (acceptType.startsWith('.')) {
          return fileExtension === acceptType.toLowerCase();
        }
        if (acceptType.includes('*')) {
          const [type] = acceptType.split('/');
          return mimeType.startsWith(type + '/');
        }
        return mimeType === acceptType;
      });
      
      if (!isAccepted) {
        const supportedFormats = accept.map(type => {
          if (type.startsWith('.')) return type.toUpperCase();
          if (type.includes('*')) {
            const [typePrefix] = type.split('/');
            return typePrefix.toUpperCase();
          }
          return type.split('/')[1]?.toUpperCase() || type;
        }).join(', ');
        const errorMsg = t('toast.fileFormatError', { supportedFormats });
        toast.error(errorMsg);
        onError?.(errorMsg);
        return;
      }
    }

    onFileDrop(file);
  }, [onFileDrop, accept, maxSizeMB, onError, t]);

  return {
    isDragging,
    dragHandlers: {
      onDragEnter: handleDragEnter,
      onDragLeave: handleDragLeave,
      onDragOver: handleDragOver,
      onDrop: handleDrop,
    },
  };
}
