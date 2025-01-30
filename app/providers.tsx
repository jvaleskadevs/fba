'use client';

import { NeynarContextProvider, Theme } from "@neynar/react";
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { type ReactNode, useState } from 'react';
import { http, cookieStorage, createConfig, createStorage } from 'wagmi';
import { type State, WagmiProvider } from 'wagmi';
import { baseSepolia } from 'viem/chains';
import { coinbaseWallet } from 'wagmi/connectors';

const config = createConfig({
  chains: [baseSepolia],
  connectors: [
    coinbaseWallet({
      appName: process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME,
      preference: process.env.NEXT_PUBLIC_ONCHAINKIT_WALLET_CONFIG as
        | 'smartWalletOnly'
        | 'all',
    }),
  ],
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true,
  transports: {
    [baseSepolia.id]: http(),
  },
});

export function Providers(props: {
  children: ReactNode;
  initialState?: State;
}) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={config} initialState={props.initialState}>
      <QueryClientProvider client={queryClient}>
        <NeynarContextProvider
          settings={{
            clientId: process.env.NEXT_PUBLIC_NEYNAR_CLIENT_ID || "",
            defaultTheme: Theme.Light,
            eventsCallbacks: {
              onAuthSuccess: () => {},
              onSignout() {},
            },
          }}
        > 
          <OnchainKitProvider
            apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_CDP_KEY}
            chain={baseSepolia}
            config={{
              appearance: {
                mode: 'auto',
                theme: 'base',
              },
            }}
          >
            {props.children}
          </OnchainKitProvider>
        </NeynarContextProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
