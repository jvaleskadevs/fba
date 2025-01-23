import { useCallback, useState } from 'react';
import { API_URL } from '../config';
import { Cast } from '../types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const formatCasts = (casts: any[] | undefined): Cast[] => {
  if (!casts) return [];
  
  const result: Cast[] = [];
  for (const cast of casts) {
    result.push({
      username: cast?.author?.username,
      text: cast?.text,
      hash: cast?.hash,
      channel: cast?.channel?.id,
      quoted: cast?.embeds
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .filter((x: any) => x?.cast?.text)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any 
        .map((y: any) => ({ 
          author: y?.cast?.author?.username, text: y.cast.text 
      })),
      url: `https://warpcast.com/${cast?.author?.username}/${cast?.hash?.substring(0, 10)}`
    });
  }
  
  return result;
};

type UseGetCastsResponse = {
  casts?: Cast[];
  error?: Error;
  getCasts: (fids: number[]) => Promise<{ casts: Cast[]; error: null; } | { casts: never[]; error: Error; }>;
  isLoading: boolean;
};

type UseGetCastsProps = {
  onSuccess: (casts: Cast[]) => void;
};

export default function useGetCasts({
  onSuccess
}: UseGetCastsProps): UseGetCastsResponse {
  const [isLoading, setIsLoading] = useState(false);

  const getCasts = useCallback(async (fids: number[]) => {
    setIsLoading(true);

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let allCasts: any[] = [];
      for (const fid of fids) {   
        try { 
          const response = await fetch(`${API_URL}/api/casts?fid=${encodeURIComponent(fid)}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            }
          });

          if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
          }

          const casts = await response.json();
          allCasts = [...allCasts, ...casts];
        } catch (err) {
          console.log(err);
        }
      }

      onSuccess(formatCasts(allCasts));

      return { casts: allCasts, error: null };
    } catch (error) {
      console.error('Error fetching casts:', error);
      return { casts: [], error: error as Error };
    } finally {
      setIsLoading(false);
    }
  }, [onSuccess]);

  return { getCasts, isLoading };
}
