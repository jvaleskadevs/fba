import React, { useState } from 'react';
import ApiKeyPopup from './ApiKeyDialog';
import { ApiKeyType } from '@/app/types';

interface ApiKeyDisplayProps {
  apiKeys: { openai?: string, anthropic?: string },
  setApiKey: (provider: ApiKeyType, key: string) => void;
  username?: string;
}

const ApiKeyDisplay = ({ apiKeys, setApiKey, username }: ApiKeyDisplayProps) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleSetApiKey = (provider: ApiKeyType, key: string) => {
    setApiKey(provider, key);
  };

  return (
    <div className="flex flex-row justify-between gap-8 p-4">
      <ApiKeyPopup 
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        setApiKey={handleSetApiKey}
      />

      <div className="mt-4">
        { username && <p className="mb-2">{`welcome ${username}`}</p> }
        {Object.keys(apiKeys).map(provider => (
          <div key={provider}>
            {provider}: {apiKeys[provider as keyof typeof apiKeys] ? 'ready' : 'missing key'}
          </div>
        ))}
      </div>
      
      <button 
        onClick={() => setIsPopupOpen(true)}
        className="border border-[#5788FA]/50 text-[#5788FA] px-4 py-2"
      >
        Config Agent
      </button>
    </div>
  );
};

export default ApiKeyDisplay;
