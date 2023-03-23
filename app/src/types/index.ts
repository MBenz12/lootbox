import { PublicKey } from '@solana/web3.js'

export type NftData = {
  mint: PublicKey;
  name: string;
  image: string;
  creator: PublicKey;
  floorPrice: number;
}

export type TOKEN = {
  mint: PublicKey;
  symbol: string;
  balance: number;
  decimals: number;
}

export type SplPrize = { 
  lootboxName?: string,
  index: number, 
  amount: number, 
  lootbox: boolean,
};

export type NftPrize = { 
  lootboxName?: string,
  index: number, 
  lootbox: boolean,
};

export type OffChainPrize = { 
  lootboxName?: string,
  index: number, 
  name: string, 
  image: string, 
  totalItems?: number, 
  remainigItems?: number,
  lootbox?: boolean,
};