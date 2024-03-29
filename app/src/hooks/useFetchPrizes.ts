import { OffChainPrize } from '@/types';
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';

const useFetchPrizes = (reload: {}): { prizes: Array<OffChainPrize>, loading: boolean } => {
  const [prizes, setPrizes] = useState<Array<OffChainPrize>>([]);
  const [loading, setLoading] = useState(false);

  const fetchPrizes = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/api/getPrizes');
      const prizes = await Promise.all(data.map((async (prize: { itemIndex: number, url: string, isDeleted: boolean }) => {
        const { data: metadata } = await axios.get(prize.url);
        const list = metadata.image.split('/');
        return {
          itemIndex: prize.itemIndex,
          isDeleted: prize.isDeleted,
          name: metadata.name,
          image: `https://${list[2]}.ipfs.nftstorage.link/${list[3]}`,
        };
      })));
      setPrizes(prizes);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchPrizes();
  }, [reload, fetchPrizes]);

  return { prizes, loading };
};

export default useFetchPrizes;