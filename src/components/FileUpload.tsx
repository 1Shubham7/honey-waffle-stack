import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface FileUploadProps {
  onFilesSelect: (files: File[]) => void;
  selectedFiles: File[];
  onRemoveFile: (index: number) => void;
  maxFiles?: number;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFilesSelect,
  selectedFiles,
  onRemoveFile,
  maxFiles = 3
}) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = [...selectedFiles, ...acceptedFiles].slice(0, maxFiles);
    onFilesSelect(newFiles);
  }, [selectedFiles, onFilesSelect, maxFiles]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    maxFiles: maxFiles - selectedFiles.length,
    disabled: selectedFiles.length >= maxFiles
  });

  return (
    <div className="space-y-4">
      <Card 
        {...getRootProps()} 
        className={`p-8 border-2 border-dashed cursor-pointer transition-colors ${
          isDragActive 
            ? 'border-primary bg-primary/5' 
            : selectedFiles.length >= maxFiles 
              ? 'border-muted bg-muted/50 cursor-not-allowed' 
              : 'border-border hover:border-primary hover:bg-primary/5'
        }`}
      >
        <input {...getInputProps()} />
        <div className="text-center">
          <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          {selectedFiles.length >= maxFiles ? (
            <p className="text-muted-foreground">Maximum {maxFiles} images allowed</p>
          ) : isDragActive ? (
            <p className="text-primary font-medium">Drop your food photos here...</p>
          ) : (
            <>
              <p className="text-foreground font-medium mb-2">
                Drop your food photos here, or click to select
              </p>
              <p className="text-sm text-muted-foreground">
                JPG, JPEG, PNG files only. Maximum {maxFiles} images.
              </p>
            </>
          )}
        </div>
      </Card>

      {selectedFiles.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {selectedFiles.map((file, index) => (
            <Card key={index} className="relative p-4">
              <div className="aspect-square relative mb-2">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Food photo ${index + 1}`}
                  className="w-full h-full object-cover rounded-md"
                />
                <Button
                  size="icon"
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-6 w-6"
                  onClick={() => onRemoveFile(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground truncate">
                {file.name}
              </p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};