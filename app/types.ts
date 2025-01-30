export type Language = 'en' | 'th' | 'zh' | 'gz';

export type StreamEntry = {
  timestamp: Date;
  type:
    | 'create_wallet'
    | 'request_faucet_funds'
    | 'get_balance'
    | 'swap_token'
    | 'transfer_token'
    | 'transfer_nft'
    | 'user'
    | 'tools'
    | 'agent'
    | 'completed';
  content: string | string[];
};

export type AnimatedData = {
  earned: number;
  spent: number;
  nftsOwned: number;
  tokensOwned: number;
  transactions: number;
  thoughts: number;
};

export type AgentMessage = {
  data?: string;
  event: 'agent' | 'tools' | 'completed' | 'error';
  functions?: string[];
};

export type FCUser = {
  username: string;
  fid: number;
}

export type Cast = {
  username: string;
  text: string;
  hash: string;
  channel: string;
  quoted: { author: string; text: string }[];
  url: string;
}

export enum ApiKeyType {
  anthropic = "anthropic",
  openai = "openai",
  venice = "venice",
  warpcast = "warpcast"
}
