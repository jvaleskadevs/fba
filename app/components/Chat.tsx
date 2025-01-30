import { cn } from '@coinbase/onchainkit/theme';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNeynarContext } from "@neynar/react";
import useChat from '../hooks/useChat';
import type { /*AgentMessage,*/ StreamEntry } from '../types';
import { generateUUID, markdownToPlainText, formatHumanMessage } from '../utils';
import ChatInput from './ChatInput';
import StreamItem from './StreamItem';
import ApiKeyDisplay from './ApiKeyDisplay';
import { ApiKeyType, Cast } from '../types';


type ChatProps = {
  className?: string;
  getNFTs: () => void;
  getTokens: () => void;
  casts?: Cast[];
};

export default function Chat({ className, getNFTs, getTokens, casts }: ChatProps) {
  const { user } = useNeynarContext();
  
  const [userInput, setUserInput] = useState('');
  const [streamEntries, setStreamEntries] = useState<StreamEntry[]>([]);
  
  const conversationId = useMemo(() => {
    return generateUUID();
  }, []);
  
  const [apiKeys, setApiKeys] = useState<{
    openai?: string;
    anthropic?: string;
    venice?: string;
    warpcast?: string;
  }>({ 
    anthropic: process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY,
    openai: process.env.NEXT_PUBLIC_OPEN_AI_API_KEY,
    venice: process.env.NEXT_PUBLIC_VENICE_API_KEY,
    warpcast: process.env.NEXT_PUBLIC_WC_API_KEY
  });
  const [currentApiKey, setCurrentApiKey] = useState<ApiKeyType>(ApiKeyType.venice);
  
  const bottomRef = useRef<HTMLDivElement>(null);

  const [shouldRefetchNFTs, setShouldRefetchNFTs] = useState(false);
  const [shouldRefetchTokens, setShouldRefetchTokens] = useState(false);

  useEffect(() => {
    if (shouldRefetchNFTs) {
      getNFTs();
      setShouldRefetchNFTs(false);
    }
  }, [getNFTs, shouldRefetchNFTs]);

  useEffect(() => {
    if (shouldRefetchTokens) {
      getTokens();
      setShouldRefetchTokens(false);
    }
  }, [getTokens, shouldRefetchTokens]);
  
  const handleSetApiKeys = (provider: ApiKeyType, key: string) => {
    if (provider === ApiKeyType.openai) {
      setApiKeys(prev => ({ anthropic: prev.anthropic, openai: key, venice: prev.venice, warpcast: prev.warpcast }));      
    } 
    
    if (provider === ApiKeyType.anthropic) {
      setApiKeys(prev => ({ anthropic: key, openai: prev.openai, venice: prev.venice, warpcast: prev.warpcast }));
    }
    
    if (provider === ApiKeyType.venice) {
      setApiKeys(prev => ({ anthropic: prev.anthropic, openai: prev.openai, venice: key, warpcast: prev.warpcast }));
    }
    
    if (provider === ApiKeyType.warpcast) {
      setApiKeys(prev => ({ anthropic: prev.anthropic, openai: prev.openai, venice: prev.venice, warpcast: key }));
    }
    
    setCurrentApiKey(provider !== ApiKeyType.warpcast ? provider : currentApiKey);
  }

/*

  const handleSuccess = useCallback((messages: AgentMessage[]) => {
    const functions =
      messages?.find((msg) => msg.event === 'tools')?.functions || [];
    if (functions?.includes('deploy_nft')) {
      setShouldRefetchNFTs(true);
    }
    if (functions?.includes('deploy_token')) {
      setShouldRefetchTokens(true);
    }

    let message = messages.find((res) => res.event === 'agent');
    if (!message) {
      message = messages.find((res) => res.event === 'tools');
    }
    if (!message) {
      message = messages.find((res) => res.event === 'error');
    }
    const streamEntry: StreamEntry = {
      timestamp: new Date(),
      content: markdownToPlainText(message?.data || ''),
      type: 'agent',
    };
    setStreamEntries((prev) => [...prev, streamEntry]);
  }, []);
*/  
  const handleSuccess = useCallback((messages: string[]) => {
    console.log(messages);
    const streamEntries: StreamEntry[] = [];
    for (const message of messages) {
      console.log(message);
      const streamEntry: StreamEntry = {
        timestamp: new Date(),
        content: markdownToPlainText(message || ''),
        type: 'agent',
      };    
      streamEntries.push(streamEntry);  
    }
    setStreamEntries((prev) => [...prev, ...streamEntries]);    
  }, []);

  const { postChat, isLoading } = useChat({
    onSuccess: handleSuccess,
    conversationId
  });

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!userInput.trim()) {
        return;
      }

      const userMsg = formatHumanMessage(casts) + userInput.trim();

      const userMessage: StreamEntry = {
        timestamp: new Date(),
        type: 'user',
        content: `${
          casts && casts.length > 0 ? "· system: All Casts has been successfully included.\n" : ""
        }· user: ${userInput.trim()}`,
      };

      setStreamEntries((prev) => [...prev, userMessage]);
      setUserInput('');
  
      postChat(
        userMsg, 
        currentApiKey === ApiKeyType.anthropic ? apiKeys.anthropic : currentApiKey === ApiKeyType.openai ? apiKeys.openai : currentApiKey === ApiKeyType.venice ? apiKeys.venice : undefined, 
        currentApiKey,
        user?.signer_uuid, 
        apiKeys.warpcast
      );
    },
    [postChat, userInput, casts, apiKeys, currentApiKey, user?.signer_uuid],
  );

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit(e);
      }
    },
    [handleSubmit],
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: Dependency is required
  useEffect(() => {
    // scrolls to the bottom of the chat when messages change
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [streamEntries]);

  return (
    <div
      className={cn(
        'flex h-full w-full flex-col border-[#5788FA]/50 md:flex md:w-1/2 md:border-r',
        className,
      )}
    >
      <div className="flex grow flex-col overflow-y-auto p-4 pb-20">
        <p className="text-zinc-500">What&apos;s on your mind...</p>
        <div className="mt-4 space-y-2" role="log" aria-live="polite">
          {streamEntries.map((entry, index) => (
            <StreamItem
              key={`${entry.timestamp.toDateString()}-${index}`}
              entry={entry}
            />
          ))}
        </div>

        <div className="mt-3" ref={bottomRef} />
      </div>
      
      <ApiKeyDisplay apiKeys={apiKeys} setApiKey={handleSetApiKeys} />

      <ChatInput
        userInput={userInput}
        handleKeyPress={handleKeyPress}
        handleSubmit={handleSubmit}
        setUserInput={setUserInput}
        disabled={isLoading}
      />
    </div>
  );
}
