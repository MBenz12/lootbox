import { TOKENS } from '@/config'
import { PublicKey } from '@solana/web3.js'

export const getTokenSymbol = (mint: PublicKey) => {
  const index = TOKENS.map(token => token.mint.toString()).indexOf(mint.toString());
  if (index === -1) return '';
  return TOKENS[index].symbol;
}