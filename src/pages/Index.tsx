import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FileUpload } from '@/components/FileUpload';
import { NutritionResults, NutritionData } from '@/components/NutritionResults';
import { ApiKeyInput } from '@/components/ApiKeyInput';
import { NutritionService } from '@/services/nutritionService';
import { exportToCSV, exportToPDF } from '@/utils/exportUtils';
import { Camera, Download, RotateCcw, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [apiKey, setApiKey] = useState<string>('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [results, setResults] = useState<NutritionData[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const handleApiKeySet = (key: string) => {
    setApiKey(key);
    toast({
      title: "API Key Set",
      description: "You can now upload and analyze your food photos!",
    });
  };

  const handleFilesSelect = (files: File[]) => {
    setSelectedFiles(files);
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(files => files.filter((_, i) => i !== index));
  };

  const handleAnalyzeImages = async () => {
    if (!apiKey || selectedFiles.length === 0) return;

    setIsAnalyzing(true);
    const nutritionService = new NutritionService(apiKey);
    const newResults: NutritionData[] = [];

    try {
      for (const file of selectedFiles) {
        toast({
          title: "Analyzing...",
          description: `Processing ${file.name}...`,
        });
        
        const result = await nutritionService.analyzeImage(file);
        newResults.push(result);
      }

      setResults(newResults);
      toast({
        title: "Analysis Complete",
        description: `Successfully analyzed ${newResults.filter(r => !r.error).length} of ${selectedFiles.length} images.`,
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "There was an error analyzing your images. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setSelectedFiles([]);
    setResults([]);
    toast({
      title: "Session Reset",
      description: "All data cleared. Upload new photos to start again.",
    });
  };

  const handleExportCSV = () => {
    exportToCSV(results);
    toast({
      title: "CSV Downloaded",
      description: "Your nutrition data has been exported to CSV.",
    });
  };

  const handleExportPDF = () => {
    exportToPDF(results);
    toast({
      title: "PDF Export",
      description: "Opening print dialog for PDF export...",
    });
  };

  if (!apiKey) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Camera className="h-12 w-12 text-primary mr-3" />
              <h1 className="text-4xl font-bold text-foreground">FoodSnap</h1>
            </div>
            <p className="text-xl text-muted-foreground mb-2">
              AI-Powered Calorie Tracker from Food Photos
            </p>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Upload photos of your meals and get instant nutrition analysis including calories, protein, carbs, and fat content.
            </p>
          </div>
          
          <ApiKeyInput onApiKeySet={handleApiKeySet} isLoading={isAnalyzing} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Camera className="h-12 w-12 text-primary mr-3" />
            <h1 className="text-4xl font-bold text-foreground">FoodSnap</h1>
          </div>
            <p className="text-xl text-muted-foreground mb-4">
              AI-Powered Calorie Tracker from Food Photos 📸
            </p>
          
          <Alert className="max-w-2xl mx-auto">
            <Info className="h-4 w-4" />
            <AlertDescription>
              No data is saved between sessions. Your API key is only used for this session and is not stored anywhere.
            </AlertDescription>
          </Alert>
        </div>

        {/* Upload Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Upload Food Photos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FileUpload
              onFilesSelect={handleFilesSelect}
              selectedFiles={selectedFiles}
              onRemoveFile={handleRemoveFile}
              maxFiles={3}
            />
            
            {selectedFiles.length > 0 && (
              <div className="flex gap-4 mt-6">
                <Button 
                  onClick={handleAnalyzeImages}
                  disabled={isAnalyzing}
                  className="flex-1"
                >
                  {isAnalyzing ? 'Analyzing Images...' : `Analyze ${selectedFiles.length} Image${selectedFiles.length > 1 ? 's' : ''}`}
                </Button>
                
                {results.length > 0 && (
                  <Button 
                    variant="outline" 
                    onClick={handleReset}
                    className="flex items-center gap-2"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Reset Session
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results Section */}
        {results.length > 0 && (
          <>
            <NutritionResults results={results} />
            
            {/* Export Section */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  Export Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <Button onClick={handleExportCSV} variant="outline">
                    Download CSV
                  </Button>
                  <Button onClick={handleExportPDF} variant="outline">
                    Export PDF
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default Index;
