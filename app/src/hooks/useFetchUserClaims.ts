import { Claim } from '@/types';
import { useWallet } from '@solana/wallet-adapter-react';
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';

const useFetchUserClaims = (reload: {}): { claims: Array<Claim>, loading: boolean } => {
  const [claims, setClaims] = useState<Array<Claim>>([]);
  const [loading, setLoading] = useState(false);
  const { publicKey } = useWallet();

  const fetchClaims = useCallback(async () => {
    if (!publicKey) return;
    setLoading(true);
    try {
      const { data: claims } = await axios.post('/api/getUserClaims', { user: publicKey.toString() });
      setClaims(claims);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }, [publicKey]);

  useEffect(() => {
    fetchClaims();
  }, [reload, fetchClaims]);

  return { claims, loading };
};

export default useFetchUserClaims;