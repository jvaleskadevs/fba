import React, { useState } from 'react';
import { NeynarAuthButton, SIWN_variant } from "@neynar/react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/app/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';
import { ApiKeyType } from '@/app/types';

interface ApiKeyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  setApiKey: (provider: ApiKeyType, key: string) => void;
}

const ApiKeyDialog: React.FC<ApiKeyDialogProps> = ({ isOpen, onClose, setApiKey }) => {
  const [provider, setProvider] = useState<ApiKeyType>(ApiKeyType.openai);
  const [key, setKey] = useState('');

  const handleSubmit = () => {
    if (key.trim()) {
      setApiKey(provider, key);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enter API Key</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Select value={provider} onValueChange={(val) => setProvider(val as ApiKeyType)}>
            <SelectTrigger>
              <SelectValue placeholder="Select Provider" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ApiKeyType.openai}>OpenAI</SelectItem>
              <SelectItem value={ApiKeyType.anthropic}>Anthropic</SelectItem>
              <SelectItem value={ApiKeyType.warpcast}>Warpcast</SelectItem>
            </SelectContent>
          </Select>
          <Input 
            type="password" 
            placeholder="Enter API Key" 
            value={key}
            onChange={(e) => setKey(e.target.value)}
          />
          <div className="w-full flex flex-row justify-between px-4">
            <Button onClick={handleSubmit} variant="outline">Save API Key</Button>
            <NeynarAuthButton variant={SIWN_variant.FARCASTER} className="max-w-[240px]" />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ApiKeyDialog;
