import { Claim } from '@/types';
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';

const useFetchClaims = (reload: {}): { claims: Array<Claim>, loading: boolean } => {
  const [claims, setClaims] = useState<Array<Claim>>([]);
  const [loading, setLoading] = useState(false);

  const fetchClaims = useCallback(async () => {
    setLoading(true);
    try {
      const { data: claims } = await axios.get('/api/getClaims');
      setClaims(claims);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchClaims();
  }, [reload, fetchClaims]);

  return { claims, loading };
};

export default useFetchClaims;