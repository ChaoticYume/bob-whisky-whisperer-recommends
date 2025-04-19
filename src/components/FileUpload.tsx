
import React, { useCallback, useState } from 'react';
import { Button } from "@/components/ui/button";
import { parseCSV, generateSampleCSV } from "@/utils/csvParser";
import { WhiskyBottle } from "@/types/whisky";

interface FileUploadProps {
  onUpload: (bottles: WhiskyBottle[]) => void;
}

const FileUpload = ({ onUpload }: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
  }, []);

  const handleFiles = (files: FileList) => {
    const file = files[0];
    setFileName(file.name);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const bottles = parseCSV(content);
        onUpload(bottles);
      } catch (error) {
        console.error('Error parsing CSV:', error);
        alert('Error parsing CSV file. Please check the format.');
      }
    };
    reader.readAsText(file);
  };

  const downloadSample = () => {
    const sampleContent = generateSampleCSV();
    const blob = new Blob([sampleContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_whisky_collection.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div 
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging ? 'border-whisky-gold bg-whisky-amber/5' : 'border-whisky-amber/30'
        }`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="mb-4">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-whisky-amber/10 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-whisky-amber" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <h3 className="text-xl font-medium text-whisky-brown mb-2">Upload your collection</h3>
          <p className="text-whisky-wood/70 mb-4">
            Drag and drop your CSV file or click to browse
          </p>
          {fileName && (
            <div className="flex items-center justify-center mb-2">
              <span className="bg-whisky-amber/10 text-whisky-brown px-3 py-1 rounded-full text-sm">
                {fileName}
              </span>
            </div>
          )}
          <div className="relative">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <Button 
              className="bg-whisky-amber hover:bg-whisky-gold text-white"
              size="lg"
            >
              Select CSV file
            </Button>
          </div>
        </div>
      </div>
      
      <div className="mt-4 text-center">
        <Button 
          variant="ghost" 
          onClick={downloadSample}
          className="text-whisky-wood hover:text-whisky-gold"
        >
          Download sample CSV format
        </Button>
      </div>
    </div>
  );
};

export default FileUpload;
