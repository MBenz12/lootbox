import { Event } from '@/types';
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';

const useFetchEvents = (reload: {}): { events: Array<Event>, loading: boolean } => {
  const [events, setEvents] = useState<Array<Event>>([]);
  const [loading, setLoading] = useState(false);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const { data: events } = await axios.get('/api/getPlayEvents');
      setEvents(events);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [reload, fetchEvents]);

  return { events, loading };
};

export default useFetchEvents;