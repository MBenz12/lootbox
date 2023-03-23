import { TOKENS } from '@/config'
import { Lootbox, PrizeItem } from '@/lootbox-program-libs/types';
import { NftData, NftPrize, SplPrize, TOKEN } from '@/types';
import { PublicKey } from '@solana/web3.js'

export const getTokenSymbol = (mint: PublicKey) => {
  const index = TOKENS.map(token => token.mint.toString()).indexOf(mint.toString());
  if (index === -1) return '';
  return TOKENS[index].symbol;
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

export const getTotalPrizeIndex = (lootbox: Lootbox, mint: PublicKey | null, itemIndex?: number) => {
  let totalIndex = 0;
  for (const prizeItem of lootbox.prizeItems) {
    if (mint && prizeItem.onChainItem && lootbox.splVaults[prizeItem.onChainItem.splIndex].mint.toString() === mint.toString()) {
      return totalIndex;
    }
    if (itemIndex && prizeItem.offChainItem && prizeItem.offChainItem.itemIndex === itemIndex) {
      return totalIndex;
    }
    totalIndex++;
  }
  return -1;
}