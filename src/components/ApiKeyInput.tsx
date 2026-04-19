import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ApiKeyInputProps {
  onApiKeySet: (apiKey: string) => void;
  isLoading?: boolean;
}

export const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ onApiKeySet, isLoading }) => {
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      onApiKeySet(apiKey.trim());
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">OpenAI API Key Required For CaloriTrack</CardTitle>
      </CardHeader>
      <CardContent>
        <Alert className="mb-4">
          <Info className="h-4 w-4" />
          <AlertDescription>
            To use CaloriTrack image recognition, enter your OpenAI API key. Your key is only used for this session and is not stored.
          </AlertDescription>
        </Alert>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="apiKey">OpenAI API Key</Label>
            <div className="relative">
              <Input
                id="apiKey"
                type={showApiKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
                className="pr-10"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1 h-8 w-8"
                onClick={() => setShowApiKey(!showApiKey)}
              >
                {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          
          <Button type="submit" className="w-full" disabled={!apiKey.trim() || isLoading}>
            {isLoading ? 'Processing...' : 'Set API Key & Continue'}
          </Button>
        </form>
        
        <div className="mt-4 text-sm text-muted-foreground">
          <p>Don't have an API key? Get one from{' '}
            <a 
              href="https://platform.openai.com/api-keys" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              OpenAI Platform
            </a>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
