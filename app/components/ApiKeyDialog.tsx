import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/app/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';

interface ApiKeyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  setApiKey: (provider: 'openai' | 'anthropic', key: string) => void;
}

const ApiKeyDialog: React.FC<ApiKeyDialogProps> = ({ isOpen, onClose, setApiKey }) => {
  const [provider, setProvider] = useState<'openai' | 'anthropic'>('openai');
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
          <Select value={provider} onValueChange={(val) => setProvider(val as 'openai' | 'anthropic')}>
            <SelectTrigger>
              <SelectValue placeholder="Select Provider" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="openai">OpenAI</SelectItem>
              <SelectItem value="anthropic">Anthropic</SelectItem>
            </SelectContent>
          </Select>
          <Input 
            type="password" 
            placeholder="Enter API Key" 
            value={key}
            onChange={(e) => setKey(e.target.value)}
          />
          <Button onClick={handleSubmit} variant="outline">Save API Key</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ApiKeyDialog;
