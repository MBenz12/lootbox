/* eslint-disable @next/next/no-img-element */
import useFetchNfts from '@/hooks/useFetchNfts';
import { IDL, Lootbox } from '@/idl/lootbox';
import { createLootbox, createPlayer, updateLootbox } from '@/lootbox-program-libs/methods';
import { Lootobx, Player, Rarity } from '@/lootbox-program-libs/types';
import { getLootboxPda, getPlayerPda, programId } from '@/lootbox-program-libs/utils';
import { AnchorProvider, BN, Program } from '@project-serum/anchor';
import { getMint, NATIVE_MINT } from '@solana/spl-token';
import { useAnchorWallet, useConnection, useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export default function Admin() {
  const [program, setProgram] = useState<Program<Lootbox>>();
  const anchorWallet = useAnchorWallet();
  const wallet = useWallet();
  const { connection } = useConnection();

  useEffect(() => {
    if (!connection || !anchorWallet) return;

    const provider = new AnchorProvider(connection, anchorWallet, AnchorProvider.defaultOptions());
    const program = new Program(IDL, programId.toString(), provider);
    setProgram(program);
  }, [connection, anchorWallet]);

  const [fee, setFee] = useState(0);
  const [feeWallet, setFeeWallet] = useState("3qWq2ehELrVJrTg2JKKERm67cN6vYjm1EyhCEzfQ6jMd");
  const [name, setName] = useState("lootbox");
  const [ticketMint, setTicketMint] = useState(NATIVE_MINT);
  const [ticketPrice, setTicketPrice] = useState(0);
  const [decimals, setDecimals] = useState(1);
  const [rarities, setRarities] = useState<Array<Rarity>>([
    { dropPercent: 7898, minSpins: 1 },
    { dropPercent: 2000, minSpins: 3 },
    { dropPercent: 100, minSpins: 10 },
    { dropPercent: 2, minSpins: 50 },
  ]);

  const [reload, setReload] = useState({});
  const {nfts} = useFetchNfts(reload);

  useEffect(() => {
    fetchData();
  }, [reload]);

  const fetchData = async () => {
    if (!program || !wallet.publicKey) return;
    try {
      const [lootbox] = getLootboxPda("lootbox");
      const lootboxData = await program.account.lootbox.fetchNullable(lootbox);
      console.log(lootboxData as Lootobx);

      const [player] = getPlayerPda(wallet.publicKey);
      const playerData = await program.account.player.fetchNullable(player);
      console.log(playerData as Player);

      if (lootboxData) {
        setFee(lootboxData.fee.toNumber() / LAMPORTS_PER_SOL);
        setFeeWallet(lootboxData.feeWallet.toString());
        setTicketMint(lootboxData.ticketMint);
        let { decimals } = await getMint(connection, lootboxData.ticketMint);
        decimals = Math.pow(10, decimals);
        setDecimals(decimals);
        setTicketPrice(lootboxData.ticketPrice.toNumber() / decimals);
        setRarities(lootboxData.rarities);
      } else {

      }

    } catch (error) {
      console.log(error);
    }
  }

  const handleCreateLootbox = async () => {
    if (!wallet.publicKey || !program) {
      return;
    }

    const txn = await createLootbox(
      program,
      wallet,
      name,
      new BN(fee * LAMPORTS_PER_SOL),
      new PublicKey(feeWallet),
      ticketMint,
      new BN(ticketPrice * decimals),
      rarities,
    );

    if (txn) {
      toast.success('Created lootbox successfully');
      setReload({});
    } else {
      toast.error('Failed to create lootbox');
    }
  }

  const handleUpdateLootbox = async () => {
    if (!wallet.publicKey || !program) {
      return;
    }

    const txn = await updateLootbox(
      program,
      wallet,
      name,
      new BN(fee * LAMPORTS_PER_SOL),
      new PublicKey(feeWallet),
      new BN(ticketPrice * decimals),
      rarities,
    );

    if (txn) {
      toast.success('Updated lootbox successfully');
      setReload({});
    } else {
      toast.error('Failed to update lootbox');
    }
  }

  const handleCreatePlayer = async () => {
    if (!wallet.publicKey || !program) {
      return;
    }

    const txn = await createPlayer(
      program,
      wallet,
    );

    if (txn) {
      toast.success('Created player account successfully');
      setReload({});
    } else {
      toast.error('Failed to create player account');
    }
  }
  return (
    <div className='flex flex-col'>
      <button onClick={handleCreateLootbox}>Create Lootbox</button>
      <button onClick={handleUpdateLootbox}>Update Lootbox</button>
      <button onClick={handleCreatePlayer}>Create Player</button>
      <div className='flex gap-1'>
        {
          nfts.map((nft) => (
            <div key={nft.mint.toString()} className="w-[150px] h-[150px] rounded-md">
              <img src={nft.image} alt="" className='rounded-md' />
              <p>{nft.name}</p>
              <p>{nft.floorPrice}sol</p>
            </div>
          ))
        }
      </div>
    </div>
  );
};