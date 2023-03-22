import { TOKENS } from '@/config'
import { Lootbox } from '@/lootbox-program-libs/types';
import { NftData, NftPrize, SplPrize, TOKEN } from '@/types';
import { PublicKey } from '@solana/web3.js'

export const getTokenSymbol = (mint: PublicKey) => {
  const index = TOKENS.map(token => token.mint.toString()).indexOf(mint.toString());
  if (index === -1) return '';
  return TOKENS[index].symbol;
}

export const getUnselectedPrizes = (lootbox: Lootbox | undefined, lootboxNfts: Array<NftData>, nftPrizes: Array<Array<NftPrize>>) => {
  return lootboxNfts.filter((nft) => {
    const allPrizes: Array<NftPrize> = [];
    nftPrizes.forEach(prizes => {
      allPrizes.push(...prizes.filter(prize => !prize.lootbox));
    });
    const splMints = lootbox ? lootbox.splVaults.map(splVault => splVault.mint.toString()) : [];
    let index = splMints.indexOf(nft.mint.toString());
    return !allPrizes.map(prize => prize.index).includes(index);
  });
}