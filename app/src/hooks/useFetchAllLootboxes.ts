import { Lootbox } from '@/lootbox-program-libs/types';
import { useCallback, useEffect, useState } from 'react';
import useProgram from './useProgram';

const useFetchAllLootboxes = (reload: {}): { lootboxes: Array<Lootbox>, loading: boolean } => {
  const program = useProgram();
  const [lootboxes, setLootboxes] = useState<Array<Lootbox>>([]);
  const [loading, setLoading] = useState(false);

  const fetchLootboxes = useCallback(async () => {
    if (!program) return;

    setLoading(true);
    try {
      const allLootboxes = await program.account.lootbox.all();
      setLootboxes(allLootboxes.map(lootbox => lootbox.account as Lootbox));
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }, [program]);

  useEffect(() => {
    fetchLootboxes();
  }, [reload, program, fetchLootboxes]);

  return { lootboxes, loading };
};

export default useFetchAllLootboxes;