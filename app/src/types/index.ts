import { PublicKey } from '@solana/web3.js'

export type NftData = {
  mint: PublicKey;
  name: string;
  image: string;
  creator: PublicKey;
  floorPrice: number;
}