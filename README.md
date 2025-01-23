# Farcaster Based Agent

Farcaster Based Agent is a farcaster based fork of Onchain Agent Demo frontend leveraging the Agentkit and the OnchainKit by @coinbase with extended farcaster capablities by @neynar and @warpcast.

Farcaster Based Agent is a tool born in the intersection of onchain and social, of base and farcaster, of an agent and a client. Allowing endless combinations between the best of both worlds.
Imagine retrieving your favorite content from farcaster, ask the agent to summarize it, find trends, and perform some onchain actions based in the input like swaping or launching tokens and nfts.
Imagine asking the agent to write a beauiful haiku based on the content and create a nft, then publish it to farcaster and send some private messages to influencers to spread the word. 

This simple and minimalistic tool could be the starter point for any farcaster creator looking to leverage the power of onchain, agents and social. 
SocialFi just gets better and easier with a Farcater Based Agent on your team. Tho, remember, if you become the dev.. you cannot blame the devs anymore.

A video demo showing some capabilities can be found [here.](https://youtu.be/6CmiZIh8gwU)

### Agent Capabilities aka tools

The toolkit provides the following tools:

#### Onchain Based tools

- get_wallet_details - Get details about the MPC Wallet
- get_balance - Get balance for specific assets
- request_faucet_funds - Request test tokens from faucet
- transfer - Transfer assets between addresses
- trade - Trade assets (Mainnet only)
- deploy_token - Deploy ERC-20 token contracts
- mint_nft - Mint NFTs from existing contracts
- deploy_nft - Deploy new NFT contracts
- register_basename - Register a basename for the wallet
- wow_create_token - Deploy a token using Zora's Wow Launcher (Bonding Curve)
- wow_buy_token - Buy Zora Wow ERC20 memecoin with ETH
- wow_sell_token - Sell Zora Wow ERC20 memecoin for ETH
- wrap_eth - Wrap ETH to WETH
- pyth_fetch_price_feed_id - Fetch the price feed ID for a given token symbol from Pyth Network
- pyth_fetch_price - Fetch the price of a given price feed from Pyth Network
- get_balance_nft - Get balance for specific NFTs (ERC-721)
- transfer_nft - Transfer an NFT (ERC-721)

#### Farcaster Social tools

- send_cast - Publish a cast in the farcaster social network
- send_direct_cast - Send a private message in the farcaster social network


### Backend · API Endpoints

Since the original Onchain Agent Demo backend has been written in Python. We coded a new one for the hackathon. Check `/app/api` endpoints.

- `app/api/chat` - fetch next chat response from the agent 
- `app/api/nfts` - fetch nfts launched by the agent
- `app/api/tokens` - fetch tokens launched by the agent
- `app/api/casts` - fetch casts by FID
- `app/api/fc-search` - fetch users based in a username query
- `app/api/send-cast` - post a new cast in a channel or home
- `app/api/send-direct-cast` - send a direct private cast to a recipient fid

**Env Secrets**

 - Copy the `.env.example` file into `.env` and fill your environmental variables:

```
{
  "CDP_API_KEY_NAME": "get this from https://portal.cdp.coinbase.com/projects/api-keys",
  "CDP_API_KEY_PRIVATE_KEY": "get this from https://portal.cdp.coinbase.com/projects/api-keys",
  
  "OPENAI_API_KEY": "get this from https://platform.openai.com/api-keys",
  "ANTHROPIC_API_KEY": "get this from https://claude.ai",
  
  "NETWORK_ID": "base-sepolia"
  "CURRENT_LLM": "anthropic|openai|frontend",
  "NEXT_PUBLIC_OPEN_AI_API_KEY": "ready|undefined",
  "NEXT_PUBLIC_ANTHROPIC_API_KEY": "ready|undefined",

  "NEYNAR_API_KEY": "get it from https://neynar.com",
  "AGENT_SIGNER_UUID": "your warpcast signer",
  "WC_API_KEY": "your warpcast api key"
}
```

 - A `app/only_test_wallet_data.txt` including the agent wallet data must be included to perform onchain actions. Get it removing the comments in the lines 258 and 259 of the `app/lib/llm_anthropic_with_wallet.ts` file and running the agent. It will export a new wallet to this file. (don't do this on production, use safe methods)

```
{"walletId":"your-wallet-id","seed":"your-private-seed","networkId":"base-sepolia","defaultAddressId":"your-address"}
```

 - The agent supports Anthropic and OpenAI keys from the `.env` file but also from the frontend too by configuring `CURRENT_LLM` as `frontend`. The use of the variables from `env` requires to set `NEXT_PUBLIC_OPENAI_API_KEY` or `NEXT_PUBLIC_ANTHROPIC_API_KEY` as `ready`. Let them empty if you are not using `env` variables.

## OG README · Onchain Agent Demo 

![Token-creation](https://github.com/user-attachments/assets/016c26cd-c599-4f7c-bafd-c8090069b53e)


A web app that enables onchain interactions through a conversational UI using AgentKit, a collaboration between [CDP SDK](https://docs.cdp.coinbase.com/) and [OnchainKit](https://onchainkit.xyz).

## Overview

This project features a Next.js frontend designed to work seamlessly with [CDP's AgentKit backend](https://github.com/coinbase/onchain-agent-demo-backend). Together, they enable the creation of an AI agent capable of performing onchain operations on Base. The agent uses Claude and GPT-4 for natural language understanding and AgentKit for onchain interactions.

## Key Features

- **AI-Powered Chat Interface**: Interactive chat interface for natural language interactions onchain
- **Onchain Operations**: Ability to perform various blockchain operations through Agentkit:
  - Deploy and interact with ERC-20 tokens
  - Create and manage NFTs
  - Check wallet balances
  - Request funds from faucet
- **Real-time Updates**: Server-Sent Events (SSE) for streaming responses
- **Responsive Design**: Modern UI built with Tailwind CSS
- **Wallet Integration**: Secure wallet management through CDP Agentkit

## Tech Stack

- **Frontend**: Next.js 14, React, Tailwind CSS
- **Development**: TypeScript, Biome for formatting/linting

## Prerequisites

- [Bun](https://bun.sh) for package management

## Environment Setup

Create a `.env.local` file with the following variables:

```bash
NEXT_PUBLIC_API_URL= # The base URL for API requests. This must be set to the endpoint of your backend service.
```

## Installation

1. Install dependencies:
```bash
bun i
```

2. Start the development server:
```bash
bun dev
```

## Development

- Format code: `bun run format`
- Lint code: `bun run lint`
- Run CI checks: `bun run ci:check`

## Deploying to Replit

- [Frontend Template](https://replit.com/@alissacrane1/onchain-agent-demo-frontend?v=1)
- [Backend Template](https://replit.com/@alissacrane1/onchain-agent-demo-backend?v=1)

Steps:
- Sign up for a Replit account, or login to your existing one.
- Navigate to the template links, and click `Use Template` on the top right hand side.
- Under `Secrets` in `Workspace Features`, add the environment variables below.
  - Tip: You can click `Edit as JSON` and copy the values below in.
- Click `Deploy` in the top right.
  - Tip: Deploy your backend first, as you'll need the deployment URL to set as `NEXT_PUBLIC_API_URL` in the frontend.
  - Tip: You can click `Run` to test if the applications run properly before deploying.



**Important: Replit resets the SQLite template on every deployment, before sending funds to your agent or using it on Mainnet be sure to read [Agent Wallet](https://github.com/coinbase/onchain-agent-demo-backend?tab=readme-ov-file#agent-wallet) and save your wallet ID and seed in a safe place.**

**Frontend Secrets**
```
{
  "NEXT_PUBLIC_API_URL": "your backend deployment URL here"
}
```

Note: you'll need to include the scheme (`https://`) in `NEXT_PUBLIC_API_URL`.

## License

See [LICENSE.md](LICENSE.md) for details.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to contribute to this project.

Special shoutout to [Shu Ding](https://x.com/shuding) for his amazing generative UI for the NFT art.
