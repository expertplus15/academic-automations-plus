import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Upload, File, Image, Video, Music, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FileUploadButtonProps {
  onFileSelect: (files: FileList) => Promise<void>;
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in MB
  allowedTypes?: string[];
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  children?: React.ReactNode;
}

interface UploadProgress {
  file: File;
  progress: number;
  status: 'uploading' | 'success' | 'error';
  id: string;
}

export function FileUploadButton({
  onFileSelect,
  accept = "*/*",
  multiple = false,
  maxSize = 10, // 10MB default
  allowedTypes = [],
  variant = "outline",
  size = "default",
  className,
  children
}: FileUploadButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);
  const { toast } = useToast();

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return Image;
    if (file.type.startsWith('video/')) return Video;
    if (file.type.startsWith('audio/')) return Music;
    return File;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateFile = (file: File): boolean => {
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      toast({
        title: "Fichier trop volumineux",
        description: `${file.name} dépasse la taille maximale de ${maxSize}MB`,
        variant: "destructive"
      });
      return false;
    }

    // Check file type if specified
    if (allowedTypes.length > 0 && !allowedTypes.some(type => file.type.includes(type))) {
      toast({
        title: "Type de fichier non autorisé",
        description: `${file.name} n'est pas un type de fichier autorisé`,
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleFileSelection = async (files: FileList) => {
    const validFiles = Array.from(files).filter(validateFile);
    
    if (validFiles.length === 0) return;

    // Initialize progress tracking
    const progressItems: UploadProgress[] = validFiles.map(file => ({
      file,
      progress: 0,
      status: 'uploading' as const,
      id: `upload_${Date.now()}_${Math.random()}`
    }));

    setUploadProgress(progressItems);

    try {
      // Simulate upload progress
      for (const item of progressItems) {
        const interval = setInterval(() => {
          setUploadProgress(prev => 
            prev.map(p => 
              p.id === item.id 
                ? { ...p, progress: Math.min(p.progress + 10, 100) }
                : p
            )
          );
        }, 200);

        // Simulate completion after 2 seconds
        setTimeout(() => {
          clearInterval(interval);
          setUploadProgress(prev => 
            prev.map(p => 
              p.id === item.id 
                ? { ...p, progress: 100, status: 'success' as const }
                : p
            )
          );
        }, 2000);
      }

      await onFileSelect(files);

      toast({
        title: "Upload réussi",
        description: `${validFiles.length} fichier(s) uploadé(s) avec succès`
      });

      // Clear progress after 3 seconds
      setTimeout(() => {
        setUploadProgress([]);
      }, 3000);

    } catch (error) {
      console.error('File upload error:', error);
      setUploadProgress(prev => 
        prev.map(p => ({ ...p, status: 'error' as const }))
      );
      
      toast({
        title: "Erreur d'upload",
        description: "Une erreur est survenue lors de l'upload",
        variant: "destructive"
      });
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      handleFileSelection(files);
    }
    // Reset input value to allow selecting the same file again
    event.target.value = '';
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
    
    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileSelection(files);
    }
  };

  const removeUpload = (id: string) => {
    setUploadProgress(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div className="space-y-3">
      <div
        className={`relative ${isDragOver ? 'opacity-75' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileInputChange}
          className="hidden"
        />
        
        <Button
          variant={variant}
          size={size}
          className={className}
          onClick={handleButtonClick}
        >
          <Upload className="w-4 h-4 mr-2" />
          {children || 'Choisir fichier(s)'}
        </Button>

        {isDragOver && (
          <div className="absolute inset-0 border-2 border-dashed border-primary bg-primary/10 rounded-md flex items-center justify-center">
            <p className="text-primary font-medium">Déposer les fichiers ici</p>
          </div>
        )}
      </div>

      {/* Upload Progress */}
      {uploadProgress.length > 0 && (
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {uploadProgress.map((item) => {
            const IconComponent = getFileIcon(item.file);
            return (
              <div key={item.id} className="flex items-center gap-3 p-3 border rounded-lg">
                <IconComponent className="w-5 h-5 text-muted-foreground" />
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium truncate">{item.file.name}</p>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={
                          item.status === 'success' ? 'default' : 
                          item.status === 'error' ? 'destructive' : 
                          'secondary'
                        }
                      >
                        {item.status === 'uploading' ? `${item.progress}%` : 
                         item.status === 'success' ? 'Terminé' : 
                         'Erreur'}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeUpload(item.id)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Progress 
                      value={item.progress} 
                      className="flex-1 h-2" 
                    />
                    <span className="text-xs text-muted-foreground">
                      {formatFileSize(item.file.size)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}