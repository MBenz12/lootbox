import { NATIVE_MINT } from '@solana/spl-token';

export const SOLANA_MAINNET_RPC_URL = "https://patient-empty-rain.solana-mainnet.quiknode.pro/dfba1e28dfc6728a18eef1b0e51e5f4c2db4cc05/";
export const SOLANA_DEVNET_RPC_URL = "https://rough-nameless-reel.solana-devnet.quiknode.pro/bc8f88008d8deb00685aa1610e258fda9bf9ddab/";
export const VERIFIED_WALLETS = {
  "3qWq2ehELrVJrTg2JKKERm67cN6vYjm1EyhCEzfQ6jMd": 2,
  "571RWruF1NSQQw6LfwWXVPNBPiKmVqkv3nqcs3EPfoho": 1,
};
export const HYPERSPACE_API_KEY = process.env.NEXT_PUBLIC_HYPERSPACE_API_KEY || '';
export const SKIP_PREFLIGHT = true;
export const DEBUG = true;

export const TOKENS = [
  { symbol: 'SOL', mint: NATIVE_MINT, decimals: 1e9 },
];