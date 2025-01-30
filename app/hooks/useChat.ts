import { useCallback, useState } from 'react';
import { API_URL } from '../config';
//import type { AgentMessage } from '../types';
import { generateUUID } from '../utils';

type UseChatResponse = {
  messages?: string[];//AgentMessage[];
  error?: Error;
  postChat: (input: string, apiKey?: string, tag?: string, signerUUID?: string, wcApiKey?: string) => void;
  isLoading: boolean;
};

type UseChatProps = {
  onSuccess: (messages: string[]) => void;
  conversationId?: string;
};

export default function useChat({
  onSuccess,
  conversationId
}: UseChatProps): UseChatResponse {
  const [isLoading, setIsLoading] = useState(false);

  const postChat = useCallback(
    async (input: string, apiKey?: string, tag?: string, signerUUID?: string, wcApiKey?: string) => {
      setIsLoading(true);

      try {
        const response = await fetch(`${API_URL}/api/chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            apiKey,
            tag,
            input,
            conversationId: conversationId || generateUUID(),
            signerUUID,
            wcApiKey
          }),
        });

        if (!response.ok) {
          console.log(response);
          console.log("error");
          //throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        //const text = await response.text();
        const messagesData = await response.json();
        const messages = JSON.stringify(messagesData.messages);
        const parsedMessages = messages
          .trim()
          .split('\n')
          .map((line) => {
            try {
              return JSON.parse(line);
            } catch (error) {
              console.error('Failed to parse line as JSON:', line, error);
              return null;
            }
          })
          .filter(Boolean);
        
        //const messagesArray = parsedMessages[0][0].trim().split('\n');
        //console.log(messagesArray);

        onSuccess(parsedMessages[0]);
        return { messages: parsedMessages[0], error: null };
      } catch (error) {
        console.error('Error posting chat:', error);
        return { messages: [], error: error as Error };
      } finally {
        setIsLoading(false);
      }
    },
    [conversationId, onSuccess],
  );

  return { postChat, isLoading };
}
