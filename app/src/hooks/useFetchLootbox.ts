import { Lootbox as LootboxIDL } from '@/idl/lootbox';
import { Lootbox } from '@/lootbox-program-libs/types';
import { getLootboxPda } from '@/lootbox-program-libs/utils';
import { Program } from '@project-serum/anchor';
import { useCallback, useEffect, useState } from 'react';

const useFetchLootbox = (program: Program<LootboxIDL> | undefined, name: string, reload: {}): { lootbox: Lootbox | undefined, loading: boolean } => {
  const [lootbox, setLootbox] = useState<Lootbox>();
  const [loading, setLoading] = useState(false);

  const fetchLootbox = useCallback(async (program: Program<LootboxIDL> | undefined, name: string) => {
    if (!program) return;

    setLoading(true);
    try {
      const [lootbox] = getLootboxPda(name);
      const lootboxData = await program.account.lootbox.fetchNullable(lootbox);
      if (lootboxData) {
        setLootbox(lootboxData as Lootbox);
      } else {
        setLootbox(undefined);
      }
    } catch (error) {
      setLootbox(undefined);
      console.log(error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchLootbox(program, name);
  }, [reload, program, name, fetchLootbox]);

  return { lootbox, loading };
};

export default useFetchLootbox;