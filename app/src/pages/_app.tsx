import { SOLANA_DEVNET_RPC_URL, SOLANA_MAINNET_RPC_URL } from '@/config'
import '@/styles/globals.css'
import '@/styles/fonts.css'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { GlowWalletAdapter, PhantomWalletAdapter, SlopeWalletAdapter, SolflareWalletAdapter, TorusWalletAdapter } from '@solana/wallet-adapter-wallets'
import type { AppProps } from 'next/app'
import { useMemo, useState } from 'react'
import { ToastContainer } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";
import "@solana/wallet-adapter-react-ui/styles.css";
import 'react-lazy-load-image-component/src/effects/blur.css';
import ModalProvider from '@/contexts/modal-context'
import "swiper/css";
import "swiper/css/free-mode";
import Layout from '@/components/Layout'
import ReloadProvider from '@/contexts/reload-context'

export default function App({ Component, pageProps }: AppProps) {
  const [network] = useState(WalletAdapterNetwork.Mainnet);
  const endpoint = useMemo(() => network === WalletAdapterNetwork.Mainnet ? SOLANA_MAINNET_RPC_URL : SOLANA_DEVNET_RPC_URL, [network]);
  const wallets = useMemo(() => [
    new PhantomWalletAdapter(),
    new GlowWalletAdapter(),
    new SlopeWalletAdapter(),
    new SolflareWalletAdapter({ network }),
    new TorusWalletAdapter()
  ], [network]);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <ToastContainer
            theme="dark"
            hideProgressBar={true}
            pauseOnFocusLoss={false}
            toastClassName={() => "bg-black text-white relative flex p-1 min-h-[50px] rounded-md justify-between overflow-hidden cursor-pointer shadow-2xl"}
          />
          <ModalProvider>
            <ReloadProvider>
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </ReloadProvider>
          </ModalProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>

  )
}