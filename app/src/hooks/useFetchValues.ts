import { useCallback, useEffect, useMemo, useState } from 'react';
import { Event } from '@/types';
import { PublicKey } from '@metaplex-foundation/js';
import useFetchNfts from './useFetchNfts';

const useFetchValues = ({ events }: { events: Array<Event> }) => {
  const [values, setValues] = useState<Array<number>>([]);
  const [reload] = useState({});
  const mints = useMemo(() => events.filter(event => event.mint && event.name).map(event => new PublicKey(event.mint || '')), [events]);
  const { nfts } = useFetchNfts(reload, mints);

  const fetchValues = useCallback(async () => {
    try {
      const values = Array(events.length).fill(0);
      const mints = nfts.map(nft => nft.mint.toString());
      let i = 0;
      for (const event of events) {
        if (event.mint) {
          let index = mints.indexOf(event.mint);
          values[i] = nfts[index].floorPrice;
        }
        if (event.symbol === "SOL") {
          values[i] = event.amount;
        }
        i++;
      }

      setValues(values);
    } catch (error) {
      
    }
  }, [events, nfts]);

  useEffect(() => {
    fetchValues();
  }, [fetchValues]);

  return { values }
};

export default useFetchValues;