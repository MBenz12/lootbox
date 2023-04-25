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
  lootboxName?: string;
  index: number;
  amount: number;
  lootbox: boolean;
};

export type NftPrize = {
  lootboxName?: string;
  index: number;
  lootbox: boolean;
};

export type OffChainPrize = {
  lootboxName?: string;
  itemIndex: number;
  prizeIndex?: number;
  name: string;
  image: string;
  totalItems?: number;
  unlimited?: boolean;
  remainigItems?: number;
  lootbox?: boolean;
  isDeleted?: boolean;
};

export type Claim = {
  _id: string,
  user: string;
  username: string;
  discordId: string;
  lootboxName: string;
  prizeIndex: number;
  itemIndex: number;
}

export type Event = {
  signature: string;
  lootboxName: string;
  user: string;
  rarity: number;
  timestamp: number;
  image: string;
  name: string;
  symbol?: string;
  amount?: number;
  mint?: string;
}

export type WinnablePrize = {
  rarity: number;
  name: string;
  image: string;
  lootbox: string;
  value: number;
}

export type OpenedPrize = {
  rarity: number;
  image: string;
}

export type Box = {
  id: string;
  name: string;
  description: string;
  image: string;
}