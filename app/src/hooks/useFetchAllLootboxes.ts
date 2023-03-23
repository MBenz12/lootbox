import { Lootbox as LootboxIDL } from '@/idl/lootbox';
import { Lootbox } from '@/lootbox-program-libs/types';
import { Program } from '@project-serum/anchor';
import { useCallback, useEffect, useState } from 'react';

const useFetchAllLootboxes = (program: Program<LootboxIDL> | undefined, reload: {}): { lootboxes: Array<Lootbox>, loading: boolean } => {
  const [lootboxes, setLootboxes] = useState<Array<Lootbox>>([]);
  const [loading, setLoading] = useState(false);

  const fetchLootboxes = useCallback(async (program: Program<LootboxIDL> | undefined) => {
    if (!program) return;

    setLoading(true);
    try {
      const allLootboxes = await program.account.lootbox.all();
      setLootboxes(allLootboxes.map(lootbox => lootbox.account as Lootbox));
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchLootboxes(program);
  }, [reload, program, fetchLootboxes]);

  return { lootboxes, loading };
};

export default useFetchAllLootboxes;