import { Box } from '@/types';
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';

const useFetchBoxes = (reload: {}): { boxes: Array<Box>, loading: boolean } => {
  const [boxes, setBoxes] = useState<Array<Box>>([]);
  const [loading, setLoading] = useState(false);

  const fetchBoxes = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/api/getBoxes');
      setBoxes(data);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchBoxes();
  }, [reload, fetchBoxes]);

  return { boxes, loading };
};

export default useFetchBoxes;