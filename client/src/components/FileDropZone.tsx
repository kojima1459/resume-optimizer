import { ReactNode } from 'react';
import { Upload } from 'lucide-react';
import { useFileDrop } from '@/hooks/useFileDrop';
import { cn } from '@/lib/utils';

interface FileDropZoneProps {
  onFileDrop: (file: File) => void;
  accept?: string[];
  children: ReactNode;
  className?: string;
}

export function FileDropZone({ onFileDrop, accept, children, className }: FileDropZoneProps) {
  const { isDragging, dragHandlers } = useFileDrop({ onFileDrop, accept });

  return (
    <div
      {...dragHandlers}
      className={cn(
        'relative transition-all',
        className
      )}
    >
      {children}
      
      {isDragging && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-primary/10 border-2 border-dashed border-primary rounded-lg backdrop-blur-sm">
          <div className="flex flex-col items-center gap-2 text-primary">
            <Upload className="h-12 w-12" />
            <p className="text-lg font-semibold">ファイルをドロップ</p>
          </div>
        </div>
      )}
    </div>
  );
}
