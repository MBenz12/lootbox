import useFetchNfts from '@/hooks/useFetchNfts';
import { IDL, Lootbox as LootboxIDL } from '@/idl/lootbox';
import { addItems, createLootbox, createPlayer, drain, fund, updateLootbox } from '@/lootbox-program-libs/methods';
import { OffChainItem, Rarity } from '@/lootbox-program-libs/types';
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
import { TOKEN } from '@/types';
import Head from 'next/head';
import Sidebar from '@/sections/admin/Sidebar';
import Main from '@/sections/admin/Main';
import useFetchAllLootboxes from '@/hooks/useFetchAllLootboxes';

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

  const [reload, setReload] = useState({});
  const { lootboxes } = useFetchAllLootboxes(program, reload);
  const [boxes, setBoxes] = useState<Array<string>>([]);
  const [name, setName] = useState('Lootbox 1');

  useEffect(() => {
    const boxes = lootboxes.map(lootbox => lootbox.name);
    setBoxes(boxes);
    boxes.length && setName(boxes[0]);
  }, [lootboxes]);

  const createNewBox = () => {
    const boxName = `Lootbox ${boxes.length + 1}`;
    setName(boxName);
  }
  return (
    <>
      <Head>
        <title>Admin Page</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={"flex admin-page py-16 px-5"}>
        <Sidebar boxes={boxes} currentBox={name} setCurrentBox={setName} createNewBox={createNewBox} />
        <Main name={name} setName={setName} />
      </div>
    </>
  );
};