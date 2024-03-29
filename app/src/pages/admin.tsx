import { useContext, useMemo, useState } from 'react';
import Head from 'next/head';
import Sidebar from '@/sections/admin/Sidebar';
import Main from '@/sections/admin/Main';
import useFetchAllLootboxes from '@/hooks/useFetchAllLootboxes';
import { useWallet } from '@solana/wallet-adapter-react';
import { getRole } from '@/utils';
import { ReloadContext } from '@/contexts/reload-context';

export default function Admin() {
  const { publicKey } = useWallet();
  const { reload } = useContext(ReloadContext);
  const { lootboxes } = useFetchAllLootboxes(reload);
  const [name, setName] = useState('');
  const boxes = useMemo(() => {
    const names = lootboxes.map(lootbox => lootbox.name);
    if (names.length) {
      setName(names[0]);
    }
    return names;
  }, [lootboxes]);

  const createNewBox = () => {
    setName('');
  }
  return (
    <>
      <Head>
        <title>Admin Page</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className='container'>
        {publicKey && getRole(publicKey) > 0 ?
          <div className={"flex admin-page py-16 px-5"}>
            <Sidebar boxes={boxes} currentBox={name} setCurrentBox={setName} createNewBox={createNewBox} />
            <Main name={name} />
          </div> :
          <div className='flex items-center justify-center w-full min-h-[80vh]'>
            <p>Connect authorized wallet</p>
          </div>
        }
      </div>
    </>
  );
};