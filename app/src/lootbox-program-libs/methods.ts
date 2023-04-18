import { Lootbox } from '@/idl/lootbox';
import { BN, Program } from '@project-serum/anchor';
import { WalletContextState } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { getAddOffChainItemInstruction, getAddOnChainItemInstruction, getClaimInstructions, getClosePdaInstruction, getCreateLootboxInstruction, getCreatePlayerInstruction, getDrainInstructions, getFundInstructions, getPlayInstructions, getSetClaimedInstruction, getUpdateLootboxInstruction, getUpdateOnChainItemInstruction } from './instructions';
import { OffChainItem, Rarity } from './types';
import { getLootboxPda, sendTransaction, sendTransactions } from './utils';


export const createLootbox = async (
  program: Program<Lootbox>,
  wallet: WalletContextState,
  name: string,
  fee: BN,
  feeWallet: PublicKey,
  ticketMint: PublicKey,
  ticketPrice: BN,
  rarities: Array<Rarity>,
) => {
  if (!wallet.publicKey) return;
  const instruction = await getCreateLootboxInstruction(
    program,
    name,
    wallet.publicKey,
    fee,
    feeWallet,
    ticketMint,
    ticketPrice,
    rarities,
  );
  return await sendTransaction(wallet, program.provider.connection, instruction);
}

export const updateLootbox = async (
  program: Program<Lootbox>,
  wallet: WalletContextState,
  name: string,
  fee: BN,
  feeWallet: PublicKey,
  ticketPrice: BN,
  rarities: Array<Rarity>,
) => {
  if (!wallet.publicKey) return;
  const instruction = await getUpdateLootboxInstruction(
    program,
    name,
    wallet.publicKey,
    fee,
    feeWallet,
    ticketPrice,
    rarities,
  );
  return sendTransaction(wallet, program.provider.connection, instruction);
}

export const createPlayer = async (
  program: Program<Lootbox>,
  wallet: WalletContextState,
) => {
  if (!wallet.publicKey) return;
  const instruction = await getCreatePlayerInstruction(
    program,
    wallet.publicKey,
  );
  return sendTransaction(wallet, program.provider.connection, instruction);
}

export const fund = async (
  program: Program<Lootbox>,
  name: string,
  wallet: WalletContextState,
  mints: Array<PublicKey>,
  amounts: Array<BN>,
  isNfts: Array<boolean>,
) => {
  if (!wallet.publicKey) return;
  const instructions = [];
  for (let i = 0; i < mints.length && i < amounts.length; i++) {
    instructions.push(
      ...await getFundInstructions(
        program,
        name,
        wallet.publicKey,
        mints[i],
        amounts[i],
        isNfts[i],
      )
    );
  }
  return await sendTransactions(wallet, program.provider.connection, instructions);
}

export const drain = async (
  program: Program<Lootbox>,
  name: string,
  wallet: WalletContextState,
  mints: Array<PublicKey>,
  amounts: Array<BN>,
) => {
  if (!wallet.publicKey) return;
  const instructions = [];
  for (let i = 0; i < mints.length && i < amounts.length; i++) {
    instructions.push(
      ...await getDrainInstructions(
        program,
        name,
        wallet.publicKey,
        mints[i],
        amounts[i],
      )
    );
  }
  return sendTransactions(wallet, program.provider.connection, instructions);
}

export const addItems = async (
  program: Program<Lootbox>,
  name: string,
  wallet: WalletContextState,
  mints: Array<PublicKey>,
  amounts: Array<BN>,
  rarities: Array<number>,
  offChainItems: Array<OffChainItem>,
) => {
  if (!wallet.publicKey) return;
  const instructions = [];
  let i;
  for (i = 0; i < mints.length; i++) {
    instructions.push(
      await getAddOnChainItemInstruction(
        program,
        name,
        wallet.publicKey,
        mints[i],
        amounts[i],
        rarities[i],
      )
    );
  }
  console.log(offChainItems);
  for (let item of offChainItems) {
    instructions.push(
      await getAddOffChainItemInstruction(
        program,
        name,
        wallet.publicKey,
        item.itemIndex,
        item.totalItems,
        item.unlimited,
        rarities[i++],
      )
    )
  }
  return sendTransactions(wallet, program.provider.connection, instructions);
}

export const updateOnChainItem = async (
  program: Program<Lootbox>,
  name: string,
  wallet: WalletContextState,
  index: number,
  amount: BN,
) => {
  if (!wallet.publicKey) return;
  const instruction = await getUpdateOnChainItemInstruction(
    program,
    name,
    wallet.publicKey,
    index,
    amount,
  );
  return await sendTransaction(wallet, program.provider.connection, instruction);
}

export const updateOffChainItem = async (
  program: Program<Lootbox>,
  name: string,
  wallet: WalletContextState,
  itemIndex: number,
  totalItems: number,
  unlimited: boolean,
) => {
  if (!wallet.publicKey) return;
  const instruction = await getAddOffChainItemInstruction(
    program,
    name,
    wallet.publicKey,
    itemIndex,
    totalItems,
    unlimited,
    0
  );
  return await sendTransaction(wallet, program.provider.connection, instruction);
}

export const play = async (
  program: Program<Lootbox>,
  name: string,
  wallet: WalletContextState,
  feeWallet: PublicKey,
  ticketMint: PublicKey,
  ticketPrice: BN,
) => {
  if (!wallet.publicKey) return;
  const instructions = await getPlayInstructions(
    program,
    name,
    wallet.publicKey,
    feeWallet,
    ticketMint,
    ticketPrice,
  );
  return await sendTransactions(wallet, program.provider.connection, instructions);
}

export const claim = async (
  program: Program<Lootbox>,
  name: string,
  wallet: WalletContextState,
  prizeMint: PublicKey,
) => {
  if (!wallet.publicKey) return;
  const instructions = await getClaimInstructions(
    program,
    name,
    wallet.publicKey,
    prizeMint,
  );
  return await sendTransactions(wallet, program.provider.connection, instructions);
}

export const claimAll = async (
  program: Program<Lootbox>,
  names: Array<string>,
  wallet: WalletContextState,
  prizeMints: Array<PublicKey>,
) => {
  if (!wallet.publicKey) return;
  const instructions = [];
  let i = 0;
  for (const prizeMint of prizeMints) {
    instructions.push(
      ...await getClaimInstructions(
        program,
        names[i],
        wallet.publicKey,
        prizeMint,
      )
    );
    i++;
  }
  return await sendTransactions(wallet, program.provider.connection, instructions);
}

export const setClaimed = async (
  program: Program<Lootbox>,
  name: string,
  wallet: WalletContextState,
  user: PublicKey,
  itemIndex: number,
) => {
  if (!wallet.publicKey) return;
  const instruction = await getSetClaimedInstruction(
    program,
    name,
    wallet.publicKey,
    user,
    itemIndex,
  );
  return await sendTransaction(wallet, program.provider.connection, instruction);
}

export const closeLootbox = async (
  program: Program<Lootbox>,
  name: string,
  wallet: WalletContextState,
) => {
  if (!wallet.publicKey) return;
  const [lootbox] = getLootboxPda(name);
  const instruction = await getClosePdaInstruction(
    program,
    wallet.publicKey,
    lootbox,
  );
  return await sendTransaction(wallet, program.provider.connection, instruction);
}

export async function closePda(
  program: Program<Lootbox>,
  wallet: WalletContextState,
  pda: PublicKey,
) {
  if (!wallet.publicKey) return;
  const instruction = await getClosePdaInstruction(program, wallet.publicKey, pda);

  return await sendTransaction(wallet, program.provider.connection, instruction);
}

export async function closePdas(
  program: Program<Lootbox>,
  wallet: WalletContextState,
  pdas: Array<PublicKey>,
) {
  if (!wallet.publicKey || !wallet.signAllTransactions) return;
  const instructions = [];
  for (const pda of pdas) {
    instructions.push(
      await getClosePdaInstruction(program, wallet.publicKey, pda)
    );
  }
  return await sendTransactions(wallet, program.provider.connection, instructions);
}