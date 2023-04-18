import { TOKENS, VERIFIED_WALLETS } from '../config'
import { Lootbox } from '../lootbox-program-libs/types';
import { getLootboxPda } from '../lootbox-program-libs/utils';
import { Claim, NftData, NftPrize, OffChainPrize } from '../types';
import { PublicKey } from '@solana/web3.js'

export const getTokenSymbol = (mint: PublicKey) => {
  const index = TOKENS.map(token => token.mint.toString()).indexOf(mint.toString());
  if (index === -1) return '';
  return TOKENS[index].symbol;
}

export const getTokenIndex = (mint: PublicKey) => {
  return TOKENS.map(token => token.mint.toString()).indexOf(mint.toString());  
}

export const getUnselectedPrizes = (lootboxNfts: Array<NftData>, nftPrizes: Array<Array<NftPrize>>) => {
  return lootboxNfts.filter((nft, index) => {
    const allPrizes: Array<NftPrize> = [];
    nftPrizes.forEach(prizes => {
      allPrizes.push(...prizes);
    });
    return !allPrizes.map(prize => prize.index).includes(index);
  });
}

export const getTotalPrizeIndex = (lootbox: Lootbox, mint: PublicKey) => {
  let totalIndex = 0;
  for (const prizeItem of lootbox.prizeItems) {
    if (prizeItem.onChainItem && lootbox.splVaults[prizeItem.onChainItem.splIndex].mint.toString() === mint.toString()) {
      return totalIndex;
    }
    totalIndex++;
  }
  return -1;
}

export const getLootbox = (lootboxKey: PublicKey, lootboxes: Array<Lootbox>) => {
  let index = lootboxes.map(lootbox => getLootboxPda(lootbox.name)[0].toString()).indexOf(lootboxKey.toString());
  const lootbox = lootboxes[index];
  return lootbox;
}

export const getSliceAddress = (str: string) => {
  return str.slice(0, 4) + '...' + str.slice(-4);
}

export const isClaimed = (claims: Array<Claim>, prize: OffChainPrize) => {
  return claims.some((claim) => claim.prizeIndex === prize.prizeIndex && claim.itemIndex === prize.itemIndex && claim.lootboxName === prize.lootboxName);
}

export const getRole = (key: PublicKey) => {
  // @ts-ignore
  return VERIFIED_WALLETS[key.toString()];
}