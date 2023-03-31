import { Lootbox } from '@/idl/lootbox';
import { BN, Program } from '@project-serum/anchor';
import { createCloseAccountInstruction, createSyncNativeInstruction, getAssociatedTokenAddressSync, NATIVE_MINT, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { PublicKey, SystemProgram, SYSVAR_INSTRUCTIONS_PUBKEY, SYSVAR_SLOT_HASHES_PUBKEY } from '@solana/web3.js';
import { Rarity } from './types';
import { getCreateAtaInstruction, getLootboxPda, getPlayerPda } from './utils';

export const getCreateLootboxInstruction = async (
  program: Program<Lootbox>,
  name: string,
  authority: PublicKey,
  fee: BN,
  feeWallet: PublicKey,
  ticketMint: PublicKey,
  ticketPrice: BN,
  rarities: Array<Rarity>,
) => {
  const [lootbox] = getLootboxPda(name);
  return await program.methods.createLootbox(
    name,
    fee,
    feeWallet,
    ticketMint,
    ticketPrice,
    rarities,
  ).accounts({
    authority,
    lootbox,
    systemProgram: SystemProgram.programId,
  }).instruction()
}

export const getUpdateLootboxInstruction = async (
  program: Program<Lootbox>,
  name: string,
  authority: PublicKey,
  fee: BN,
  feeWallet: PublicKey,
  ticketPrice: BN,
  rarities: Array<Rarity>,
) => {
  const [lootbox] = getLootboxPda(name);
  return await program.methods.updateLootbox(
    fee,
    feeWallet,
    ticketPrice,
    rarities,
  ).accounts({
    authority,
    lootbox,
    systemProgram: SystemProgram.programId,
  }).instruction()
}

export const getFundInstructions = async (
  program: Program<Lootbox>,
  name: string,
  funder: PublicKey,
  prizeMint: PublicKey,
  amount: BN,
) => {
  const [lootbox] = getLootboxPda(name);
  const funderAta = getAssociatedTokenAddressSync(prizeMint, funder);
  const lootboxAta = getAssociatedTokenAddressSync(prizeMint, lootbox, true);

  const instructions = [];

  let instruction = await getCreateAtaInstruction(program.provider.connection, funder, funderAta, prizeMint, funder);
  if (instruction) instructions.push(instruction);

  if (prizeMint.toString() === NATIVE_MINT.toString()) {
    instructions.push(SystemProgram.transfer({
      fromPubkey: funder,
      toPubkey: funderAta,
      lamports: amount.toNumber()
    }));
    instructions.push(createSyncNativeInstruction(funderAta));
  }

  instruction = await getCreateAtaInstruction(program.provider.connection, funder, lootboxAta, prizeMint, lootbox);
  if (instruction) instructions.push(instruction);

  instructions.push(
    await program.methods.fund(
      amount,
      amount.toNumber() === 1
    ).accounts({
      funder,
      lootbox,
      prizeMint,
      funderAta,
      lootboxAta,
      tokenProgram: TOKEN_PROGRAM_ID,
    }).instruction()
  );

  return instructions;
}

export const getDrainInstructions = async (
  program: Program<Lootbox>,
  name: string,
  drainer: PublicKey,
  prizeMint: PublicKey,
  amount: BN,
) => {
  const [lootbox] = getLootboxPda(name);
  const drainerAta = getAssociatedTokenAddressSync(prizeMint, drainer);
  const lootboxAta = getAssociatedTokenAddressSync(prizeMint, lootbox, true);

  const instructions = [];

  let instruction = await getCreateAtaInstruction(program.provider.connection, drainer, drainerAta, prizeMint, drainer);
  if (instruction) instructions.push(instruction);

  instructions.push(
    await program.methods.drain(
      amount
    ).accounts({
      drainer,
      lootbox,
      prizeMint,
      drainerAta,
      lootboxAta,
      tokenProgram: TOKEN_PROGRAM_ID,
    }).instruction()
  );

  if (prizeMint.toString() === NATIVE_MINT.toString()) {
    instructions.push(
      createCloseAccountInstruction(
        drainerAta,
        drainer,
        drainer,
      )
    );
  }

  return instructions;
}

export const getAddOnChainItemInstruction = async (
  program: Program<Lootbox>,
  name: string,
  authority: PublicKey,
  prizeMint: PublicKey,
  amount: BN,
  rarity: number,
) => {
  const [lootbox] = getLootboxPda(name);
  return program.methods.addOnChainItem(
    prizeMint,
    amount,
    rarity,
  ).accounts({
    authority,
    lootbox,
  }).instruction()
}

export const getUpdateOnChainItemInstruction = async (
  program: Program<Lootbox>,
  name: string,
  authority: PublicKey,
  index: number,
  amount: BN,
) => {
  const [lootbox] = getLootboxPda(name);
  return program.methods.updateOnChainItem(
    index,
    amount,
  ).accounts({
    authority,
    lootbox,
  }).instruction()
}

export const getAddOffChainItemInstruction = async (
  program: Program<Lootbox>,
  name: string,
  authority: PublicKey,
  itemIndex: number,
  totalItems: number,
  unlimited: boolean,
  rarity: number,
) => {
  const [lootbox] = getLootboxPda(name);
  return program.methods.addOffChainItem(
    itemIndex,
    totalItems,
    unlimited,
    rarity,
  ).accounts({
    authority,
    lootbox,
  }).instruction()
}

export const getCreatePlayerInstruction = async (
  program: Program<Lootbox>,
  authority: PublicKey,
) => {
  const [player] = getPlayerPda(authority);
  return program.methods.createPlayer(
  ).accounts({
    authority,
    player,
    systemProgram: SystemProgram.programId,
  }).instruction()
}

export const getPlayInstructions = async (
  program: Program<Lootbox>,
  name: string,
  user: PublicKey,
  feeWallet: PublicKey,
  ticketMint: PublicKey,
  ticketPrice: BN,
) => {
  const [player] = getPlayerPda(user);
  const [lootbox] = getLootboxPda(name);
  const userAta = getAssociatedTokenAddressSync(ticketMint, user);
  const lootboxAta = getAssociatedTokenAddressSync(ticketMint, lootbox, true);

  const instructions = [];

  if (!(await program.provider.connection.getAccountInfo(player))) {
    instructions.push(await getCreatePlayerInstruction(program, user));
  }

  let instruction = await getCreateAtaInstruction(program.provider.connection, user, userAta, ticketMint, user);
  if (instruction) instructions.push(instruction);

  if (ticketMint.toString() === NATIVE_MINT.toString()) {
    instructions.push(SystemProgram.transfer({
      fromPubkey: user,
      toPubkey: userAta,
      lamports: ticketPrice.toNumber()
    }));
    instructions.push(createSyncNativeInstruction(userAta));
  }

  instruction = await getCreateAtaInstruction(program.provider.connection, user, lootboxAta, ticketMint, lootbox);
  if (instruction) instructions.push(instruction);

  instructions.push(
    await program.methods.play(
      ).accounts({
        user,
        feeWallet,
        lootbox,
        player,
        userAta,
        lootboxAta,
        instructionSysvarAccount: SYSVAR_INSTRUCTIONS_PUBKEY,
        recentSlothashes: SYSVAR_SLOT_HASHES_PUBKEY,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      }).instruction()
  );

  return instructions;
}

export const getClaimInstructions = async (
  program: Program<Lootbox>,
  name: string,
  claimer: PublicKey,
  prizeMint: PublicKey,
) => {
  const [player] = getPlayerPda(claimer);
  const [lootbox] = getLootboxPda(name);
  const claimerAta = getAssociatedTokenAddressSync(prizeMint, claimer);
  const lootboxAta = getAssociatedTokenAddressSync(prizeMint, lootbox, true);

  const instructions = [];

  let instruction = await getCreateAtaInstruction(program.provider.connection, claimer, claimerAta, prizeMint, claimer);
  if (instruction) instructions.push(instruction);

  instructions.push(
    await program.methods.claim(
      ).accounts({
        claimer,
        lootbox,
        player,
        prizeMint,
        lootboxAta,
        claimerAta,
        instructionSysvarAccount: SYSVAR_INSTRUCTIONS_PUBKEY,
        tokenProgram: TOKEN_PROGRAM_ID,
      }).instruction()
  );

  if (prizeMint.toString() === NATIVE_MINT.toString()) {
    instructions.push(
      createCloseAccountInstruction(
        claimerAta,
        claimer,
        claimer,
      )
    );
  }

  return instructions;
}

export const getSetClaimedInstruction = async (
  program: Program<Lootbox>,
  name: string,
  authority: PublicKey,
  user: PublicKey,
  itemIndex: number,
) => {
  const [player] = getPlayerPda(user);
  const [lootbox] = getLootboxPda(name);

  return program.methods.setClaimed(
    itemIndex
  ).accounts({
    authority,
    user,
    lootbox,
    player,
  }).instruction()
}

export const getClosePdaInstruction = async (
  program: Program<Lootbox>,
  authority: PublicKey,
  pda: PublicKey,
) => {
  return program.methods.closePda().accounts({
    signer: authority,
    pda,
    systemProgram: SystemProgram.programId
  }).instruction();
}