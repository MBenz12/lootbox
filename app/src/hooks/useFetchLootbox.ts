import { Lootbox } from '@/lootbox-program-libs/types';
import { getLootboxPda } from '@/lootbox-program-libs/utils';
import { useCallback, useEffect, useState } from 'react';
import useProgram from './useProgram';

const useFetchLootbox = (name: string, reload: {}): { lootbox: Lootbox | undefined, loading: boolean } => {
  const [generate] = useState(true);
  const program = useProgram(generate);
  const [lootbox, setLootbox] = useState<Lootbox>();
  const [loading, setLoading] = useState(false);

  const fetchLootbox = useCallback(async (name: string) => {
    if (!program || !name) return;

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
  }, [program]);

  useEffect(() => {
    fetchLootbox(name);
  }, [reload, program, name, fetchLootbox]);

  return { lootbox, loading };
};

export default useFetchLootbox;