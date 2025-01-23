import { useCallback, useState } from 'react';
import { FCUser } from '../types';

type UseGetFidsResponse = {
  fids?: number[];
  getFids: (users: FCUser[]) => number[];
  isLoading: boolean;
};

type UseGetFidsProps = {
  onSuccess: (fids: number[]) => void;
};

export default function useGetFids({
  onSuccess
}: UseGetFidsProps): UseGetFidsResponse {
  const [isLoading, setIsLoading] = useState(false);

  const getFids = useCallback((users: FCUser[]) => {
    setIsLoading(true);
    const fids = users.map((user) => user.fid);
    onSuccess(fids);
    setIsLoading(false);
    return fids;
  }, [onSuccess]);

  return { getFids, isLoading };
}
