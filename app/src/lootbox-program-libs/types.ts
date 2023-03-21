import { PublicKey } from '@solana/web3.js';
import BN from 'bn.js';

export type Lootbox = {
  name: string;
  authority: PublicKey;
  fee: BN;
  feeWallet: PublicKey;
  ticketMint: PublicKey;
  ticketPrice: BN;
  rarities: Array<Rarity>;
  splVaults: Array<SplVault>;
  prizeItems: Array<PrizeItem>;
  bump: number;
}

export type Rarity = {
  dropPercent: number;
  minSpins: number;
}

export type SplVault = {
  mint: PublicKey;
  amount: BN;
}

export type PrizeItem = {
  onChainItem?: OnChainItem;
  offChainItem?: OffChainItem;
  rarity: number;
}

export type OnChainItem = {
  splIndex: number;
  amount: BN;
}

export type OffChainItem = {
  itemIndex: number;
  totalItems: number;
  usedItems: number;
  claimed: boolean;
}

export type PlayerBox = {
  lootbox: PublicKey;
  raritySpins: Array<number>;
  onChainPrizes: Array<OnChainItem>;
  offChainPrizes: Array<OffChainItem>;
}

export type Player = {
  key: PublicKey;
  lootboxes: Array<PlayerBox>;
  bump: number;
}

export type PlayEvent = {
  player: PublicKey;
  lootbox: PublicKey;
  prizeItem: PrizeItem;
  timeStamp: BN;
}