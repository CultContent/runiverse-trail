// _app.tsx
import '../app/globals.css';
import { CookiesProvider } from 'react-cookie';
import { reservoirChains } from '@reservoir0x/reservoir-sdk';
import { CharacterProvider } from '../context/CharacterContext';
import CharNavBar from '../components/CharNavbar';

import {
    ReservoirKitProvider
} from '@reservoir0x/reservoir-kit-ui';

// RainbowKit Imports
import '@rainbow-me/rainbowkit/styles.css';
import {
    getDefaultConfig,
    RainbowKitProvider,
    darkTheme
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import {
    mainnet,
    polygon,
    optimism,
    arbitrum,
    base,
} from 'wagmi/chains';
import {
    QueryClientProvider,
    QueryClient,
} from "@tanstack/react-query";

// React SWIE Imports
import { RainbowKitSiweNextAuthProvider, GetSiweMessageOptions } from '@rainbow-me/rainbowkit-siwe-next-auth';
import { SessionProvider } from 'next-auth/react';
import type { Session } from 'next-auth';
import { AppProps } from 'next/app';
import '../app/globals.css';


// React SWIE Custom message config
const getSiweMessageOptions: GetSiweMessageOptions = () => ({
    statement: 'Sign in to Runiverse Trail',
});

//HOST switch
const HOST = process.env.NEXT_PUBLIC_HOST || "http://localhost:3000";

// Wagmi Config
const config = getDefaultConfig({
    appName: 'Runiverse Trail',
    projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID!,
    chains: [mainnet, polygon, optimism, arbitrum, base],
    ssr: true, // If your dApp uses server side rendering (SSR)
});

// W3 Querying Client
const queryClient = new QueryClient();

export default function App({
    Component,
    pageProps,
}: AppProps<{ session: Session }>) {
    return (
        <WagmiProvider config={config}>
            <SessionProvider refetchInterval={0} session={pageProps.session}>
                <QueryClientProvider client={queryClient}>
                <CharacterProvider>
                    <RainbowKitSiweNextAuthProvider getSiweMessageOptions={getSiweMessageOptions}>
                        <RainbowKitProvider
                            appInfo={{
                                appName: "Runiverse Trail"
                            }}
                            theme={darkTheme({
                                accentColor: '#7b3fe4',
                                accentColorForeground: 'white',
                                borderRadius: 'small',
                                fontStack: 'system',
                                overlayBlur: 'small',
                            })}
                        >
                            <ReservoirKitProvider
                                options={{
                                    apiKey: process.env.NEXT_RESERVOIR_API_KEY,
                                    chains: [{
                                        ...reservoirChains.mainnet,
                                        active: true,
                                    }],
                                }}
                            >
                                <CookiesProvider>
                                    
                                        <CharNavBar />
                                        <Component {...pageProps} />
                                    
                                </CookiesProvider>
                            </ReservoirKitProvider>
                        </RainbowKitProvider>
                    </RainbowKitSiweNextAuthProvider>
                    </CharacterProvider>
                </QueryClientProvider>
            </SessionProvider>
        </WagmiProvider>
    );
}
