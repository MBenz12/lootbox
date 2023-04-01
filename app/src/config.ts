import { NATIVE_MINT } from '@solana/spl-token';
import { PublicKey } from '@solana/web3.js';

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
  {
    symbol: 'SOL',
    mint: NATIVE_MINT,
    decimals: 1e9,
    image: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png'
  },
  {
    symbol: 'DUST',
    mint: new PublicKey("DUSTawucrTsGU8hcqRdHDCbuYhCPADMLM2VcCb8VnFnQ"),
    decimals: 1e9,
    image: 'https://arweave.net/iLHBUE18SsWraKU_AIp-pUPs901TwUXckPEfdMQRkIg'
  },
  {
    symbol: 'ZEN',
    mint: new PublicKey("ZEN5PLn2YpFCGVZobQGUocpdzS7PuZRAN4MARaX8qAz"),
    decimals: 1e9,
    image: 'https://shdw-drive.genesysgo.net/e9T5RYnrbiQ1EsQ5xzYSLP897nYD8TAVfWsGV23pgis/ZEN5PLn2YpFCGVZobQGUocpdzS7PuZRAN4MARaX8qAz-918.json'
  },
];

export const RARITY = [
  'Common',
  'Uncommon',
  'Rare',
  'Legendary',
]

export const NFT_STORAGE_TOKEN = process.env.NEXT_PUBLIC_NFT_STORAGE_TOKEN || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGMzMTRkNjcyYjgxM0E4NzEwRUQzMTBiNDU4YTIzNEQ4YmMwQzczOTQiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY3NjkwMDkyMjg2NiwibmFtZSI6Im1iZW56MTIifQ.CeXVQjKNbOkxrkCGspDnBVwqb8FXQI984OC_yQ5dglo';

export const AUTHORIZE_URL = process.env.NEXT_PUBLIC_DISCORD_AUTHORIZE_URL || '';
export const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID || '';
export const CLIENT_SECRET = process.env.NEXT_PUBLIC_CLIENT_SECRET || '';
export const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN || '';