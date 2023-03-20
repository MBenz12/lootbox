import useFetchNfts from '@/hooks/useFetchNfts';
import { IDL, Lootbox as LootboxIDL } from '@/idl/lootbox';
import { createLootbox, createPlayer, fund, updateLootbox } from '@/lootbox-program-libs/methods';
import { Rarity } from '@/lootbox-program-libs/types';
import { programId } from '@/lootbox-program-libs/utils';
import { AnchorProvider, BN, Program } from '@project-serum/anchor';
import { getMint, NATIVE_MINT } from '@solana/spl-token';
import { useAnchorWallet, useConnection, useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { WalletConnectButton, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { TOKENS } from '@/config';
import useFetchLootbox from '@/hooks/useFetchLootbox';

export default function Admin() {
  const [program, setProgram] = useState<Program<LootboxIDL>>();
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
  const [selectedNfts, setSelectedNfts] = useState<Array<number>>([]);
  const [splToken, setSplToken] = useState(TOKENS[0]);
  const { lootbox } = useFetchLootbox(program, name, reload);
  
  const { nfts: lootboxNfts } = useFetchNfts(reload, lootbox);

  const fetchData = useCallback(async () => {
    try {
      if (lootbox) {
        setFee(lootbox.fee.toNumber() / LAMPORTS_PER_SOL);
        setFeeWallet(lootbox.feeWallet.toString());
        setTicketMint(lootbox.ticketMint);
        let { decimals } = await getMint(connection, lootbox.ticketMint);
        decimals = Math.pow(10, decimals);
        setDecimals(decimals);
        setTicketPrice(lootbox.ticketPrice.toNumber() / decimals);
        setRarities(lootbox.rarities);
      } else {

      }

    } catch (error) {
      console.log(error);
    }
  }, [lootbox, connection]);

  useEffect(() => {
    fetchData();
  }, [reload, fetchData]);

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

  const handleFundNfts = async () => {
    if (!wallet.publicKey || !program) {
      return;
    }

    const mints = selectedNfts.map(index => nfts[index].mint);
    const amounts = Array(selectedNfts.length).fill(new BN(1));
    const txn = await fund(
      program, 
      name,
      wallet,
      mints,
      amounts,
    );
    console.log(txn)
    if (txn) {
      toast.success('Funded Nfts successfully');
      setReload({});
    } else {
      toast.error('Failed to fund Nfts');
    }
  }

  const handleFundSpl = async () => {
    if (!wallet.publicKey || !program) {
      return;
    }

    let { decimals } = await getMint(connection, splToken.mint);
    decimals = Math.pow(10, decimals);
    const amount = 1;
    const txn = await fund(
      program, 
      name,
      wallet,
      [splToken.mint],
      [new BN(amount * decimals)],
    );
    console.log(txn)
    if (txn) {
      toast.success(`Funded ${amount} ${splToken.symbol}  successfully`);
      setReload({});
    } else {
      toast.error('Failed to fund token');
    }
  }

  const handleDrainNfts = async () => {

  }
  return (
    <div className='flex flex-col'>
      <div className='flex justify-center'>
        {!wallet.publicKey ? <WalletConnectButton /> : <WalletMultiButton /> }
      </div>
      <button onClick={handleCreateLootbox}>Create Lootbox</button>
      <button onClick={handleUpdateLootbox}>Update Lootbox</button>
      <button onClick={handleCreatePlayer}>Create Player</button>
      <button onClick={handleFundNfts}>Fund NFTs</button>
      <button onClick={handleFundSpl}>Fund Spl</button>

      <div className='grid grid-cols-6 gap-5'>
        {
          nfts.map((nft, index) => (
            <div 
              key={nft.mint.toString()} 
              className="flex flex-col justify-between" 
              onClick={() => {
                if (selectedNfts.includes(index)) {
                  setSelectedNfts(selectedNfts.filter((val) => val !== index));
                } else {
                  setSelectedNfts([...selectedNfts, index]);
                }
              }}
            >
              <div className='relative'>
                {selectedNfts.includes(index) && <div className='absolute top-2 right-2 rounded-full w-2 h-2 bg-[#9945FF] z-10'></div>}
                <LazyLoadImage 
                  src={nft.image}
                  className='rounded-md w-full'
                  effect='blur'
                />
              </div>
              {/* <img src={nft.image} alt="" className='rounded-md w-full' /> */}
              {/* <p>{nft.name}</p> */}
              <p>{nft.floorPrice.toLocaleString('en-us', { maximumFractionDigits: 2 })}sol</p>
            </div>
          ))
        }
      </div>

      <div className='grid grid-cols-6 gap-5'>
      {
          lootboxNfts.map((nft, index) => (
            <div 
              key={nft.mint.toString()} 
              className="flex flex-col justify-between" 
              onClick={() => {
                // if (selectedNfts.includes(index)) {
                //   setSelectedNfts(selectedNfts.filter((val) => val !== index));
                // } else {
                //   setSelectedNfts([...selectedNfts, index]);
                // }
              }}
            >
              <div className='relative'>
                {/* {<div className='absolute top-2 right-2 rounded-full w-2 h-2 bg-[#9945FF] z-10'></div>} */}
                <LazyLoadImage 
                  src={nft.image}
                  className='rounded-md w-full'
                  effect='blur'
                />
              </div>
              {/* <img src={nft.image} alt="" className='rounded-md w-full' /> */}
              {/* <p>{nft.name}</p> */}
              <p>{nft.floorPrice.toLocaleString('en-us', { maximumFractionDigits: 2 })}sol</p>
            </div>
          ))
        }
      </div>
    </div>
  );
};