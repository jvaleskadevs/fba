import React, { useState } from 'react';
import ApiKeyPopup from './ApiKeyDialog';

interface ApiKeyDisplayProps {
  apiKeys: { openai?: string, anthropic?: string },
  setApiKey: (provider: 'openai' | 'anthropic', key: string) => void;
}

const ApiKeyDisplay = ({ apiKeys, setApiKey }: ApiKeyDisplayProps) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleSetApiKey = (provider: 'openai' | 'anthropic', key: string) => {
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
        Add API Key
      </button>
    </div>
  );
};

export default ApiKeyDisplay;
