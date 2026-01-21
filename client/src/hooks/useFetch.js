import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const useFetch = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { immediate = true, ...fetchOptions } = options;

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get(url, fetchOptions);
      setData(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    if (immediate) {
      fetchData();
    }
  }, [fetchData, immediate]);

  const refetch = () => fetchData();

  return { data, loading, error, refetch };
};

export default useFetch;
