import { NFTMintCard } from '@coinbase/onchainkit/nft';
import { NFTCollectionTitle } from '@coinbase/onchainkit/nft/mint';
import { NFTMedia } from '@coinbase/onchainkit/nft/view';
import { type Token, TokenRow } from '@coinbase/onchainkit/token';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { type Address, erc721Abi } from 'viem';
import { useContractRead, useToken } from 'wagmi';
import { ToggleSwitch } from './ToggleSwitch';
import { type Cast } from '../types'; 

type AgentAssetProps = {
  tokenAddress: Address;
  index?: number;
};

function AgentToken({ tokenAddress }: AgentAssetProps) {
  const { data } = useToken({ address: tokenAddress, chainId: 84532 });
  const token: Token = {
    address: tokenAddress,
    chainId: 84532,
    decimals: data?.decimals || 0,
    name: data?.name || '',
    symbol: data?.symbol || '',
    image: '',
  };

  return <TokenRow token={token} className="w-full rounded font-mono" />;
}

function AgentNFT({ index = 0, tokenAddress }: AgentAssetProps) {
  const { data: name } = useContractRead({
    address: tokenAddress,
    abi: erc721Abi,
    functionName: 'name',
    chainId: 84532,
  });

  const nftData = useMemo(() => {
    return {
      name,
      imageUrl: `https://raw.githubusercontent.com/coinbase/onchain-agent-demo/master/app/images/${(index % 8) + 1}.png`,
    };
  }, [name, index]);

  if (!name) {
    return null;
  }

  return (
    <NFTMintCard
      className="max-w-72"
      contractAddress={tokenAddress}
      useNFTData={() => nftData}
    >
      <NFTMedia />
      <NFTCollectionTitle className="font-mono text-sm" />
    </NFTMintCard>
  );
}

type UserCastProps = {
  cast: Cast;
};

function UserCast({ cast }: UserCastProps) {
  console.log("cast");
  console.log(cast);
  return <p><span className="text-yellow-400">{cast.username}-</span>{cast.text}</p>
}

type AgentAssetsProps = {
  getTokens: () => void;
  getNFTs: () => void;
  getCasts: (fids: number[]) => void;
  nfts: Address[];
  tokens: Address[];
  casts: Cast[];
  fids: number[];
  setAreIncludedCasts: React.Dispatch<React.SetStateAction<boolean>>;
  areIncludedCasts: boolean;
};

export default function AgentAssets({
  getTokens,
  getNFTs,
  getCasts,
  tokens,
  nfts,
  casts,
  fids,
  setAreIncludedCasts,
  areIncludedCasts
}: AgentAssetsProps) {
  const [tab, setTab] = useState('casts');

  const handleTabChange = useCallback((tab: string) => {
    return () => setTab(tab);
  }, []);
  
  console.log("agent")
  console.log(casts);

  useEffect(() => {
    getCasts(fids);
    getNFTs();
    getTokens();
  }, [getNFTs, getTokens, getCasts, fids]);

  return (
    <div className="mr-2 mb-4 w-full rounded-sm border-[#5788FA]/50 border-t bg-black p-4 pb-10 lg:relative lg:z-0 lg:translate-x-0">
      <h2 className="pb-4 font-bold text-[#5788FA] text-xl">Social</h2>
      <div className="flex flex-col items-start gap-4">
        <div className="flex w-full grow gap-6 border-[#5788FA]/50 border-b">
          <button
            type="button"
            onClick={handleTabChange('casts')}
            className={`flex items-center justify-center py-1 ${
              tab === 'casts' ? 'border-[#5788FA] border-b' : ''
            }`}
          >
            Casts
          </button>
          <button
            type="button"
            onClick={handleTabChange('nfts')}
            className={`flex items-center justify-center py-1 ${
              tab === 'nfts' ? 'border-[#5788FA] border-b' : ''
            }`}
          >
            NFTs
          </button>
          <button
            type="button"
            onClick={handleTabChange('tokens')}
            className={`flex items-center justify-center py-1 ${
              tab === 'tokens' ? 'border-[#5788FA] border-b' : ''
            }`}
          >
            Tokens
          </button>
        </div>
        
        { tab === 'casts' &&  
          <ToggleSwitch 
            message="Include casts with the user input" 
            isChecked={areIncludedCasts} 
            onClick={setAreIncludedCasts} 
          /> }
        
        {tab === 'casts' &&
          casts &&
          casts?.map((cast) => cast && (
            <UserCast key={cast.hash} cast={cast} />
          ))}

        {tab === 'tokens' &&
          tokens &&
          tokens?.map((token) => (
            <AgentToken key={token} tokenAddress={token} />
          ))}

        {tab === 'nfts' && nfts && (
          <div className="grid-col-1 grid gap-4 sm:grid-cols-2">
            {nfts?.map((nft, index) => (
              <AgentNFT key={nft} tokenAddress={nft} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
