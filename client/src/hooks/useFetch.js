import { useState, useEffect, useCallback, useRef } from 'react';
import { apiClient } from '../services';
import { getErrorMessage } from '../utils/errors';

/**
 * Custom hook for data fetching with automatic request cancellation
 *
 * @param {string} url - API endpoint URL
 * @param {object} options - Fetch options
 * @param {boolean} options.immediate - Whether to fetch immediately (default: true)
 * @param {string} options.method - HTTP method (default: 'get')
 * @param {object} options.params - Query parameters
 * @param {any} options.initialData - Initial data value
 * @returns {object} { data, loading, error, refetch, setData }
 */
const useFetch = (url, options = {}) => {
  const {
    immediate = true,
    method = 'get',
    params = null,
    initialData = null
  } = options;

  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  // Ref to track component mount state
  const isMountedRef = useRef(true);
  // Ref to store AbortController
  const abortControllerRef = useRef(null);

  const fetchData = useCallback(async (fetchParams = null) => {
    // Cancel any pending request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new AbortController for this request
    abortControllerRef.current = new AbortController();

    setLoading(true);
    setError(null);

    try {
      const config = {
        signal: abortControllerRef.current.signal
      };

      // Add params if provided
      if (fetchParams || params) {
        config.params = fetchParams || params;
      }

      const response = await apiClient[method](url, config);

      // Only update state if component is still mounted
      if (isMountedRef.current) {
        setData(response.data);
        setError(null);
      }

      return { success: true, data: response.data };
    } catch (err) {
      // Ignore abort errors
      if (err.name === 'CanceledError' || err.name === 'AbortError') {
        return { success: false, aborted: true };
      }

      const errorMessage = getErrorMessage(err);

      // Only update state if component is still mounted
      if (isMountedRef.current) {
        setError(errorMessage);
        setData(initialData);
      }

      return { success: false, error: errorMessage };
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [url, method, params, initialData]);

  // Cleanup on unmount
  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
      // Cancel pending request on unmount
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Fetch on mount if immediate
  useEffect(() => {
    if (immediate && url) {
      fetchData();
    }
  }, [immediate, url, fetchData]);

  // Refetch function that can accept new params
  const refetch = useCallback((newParams = null) => {
    return fetchData(newParams);
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch,
    setData
  };
};

export default useFetch;
