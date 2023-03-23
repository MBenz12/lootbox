import { useMemo, useState } from 'react';
import Head from 'next/head';
import Sidebar from '@/sections/admin/Sidebar';
import Main from '@/sections/admin/Main';
import useFetchAllLootboxes from '@/hooks/useFetchAllLootboxes';

export default function Admin() {
  const [reload, setReload] = useState({});
  const { lootboxes } = useFetchAllLootboxes(reload);
  const [name, setName] = useState('Lootbox 1');
  const boxes = useMemo(() => { 
    const names = lootboxes.map(lootbox => lootbox.name);
    setName(names[0]);
    return names;
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
        <Main name={name} setName={setName} setReload={setReload} reload={reload} />
      </div>
    </>
  );
};