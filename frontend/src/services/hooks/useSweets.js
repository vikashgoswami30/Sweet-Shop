import { useState, useEffect, useCallback } from 'react';
import { sweetsAPI } from '../api.js';

export const useSweets = () => {
  const [sweets, setSweets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSweets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await sweetsAPI.getAll();
      setSweets(response.data);
    } catch (err) {
      setError(err.message || 'Failed to fetch sweets');
    } finally {
      setLoading(false);
    }
  }, []);

  const searchSweets = useCallback(async (query) => {
    try {
      setLoading(true);
      setError(null);
      const response = await sweetsAPI.search({ name: query });
      setSweets(response.data);
    } catch (err) {
      setError(err.message || 'Search failed');
    } finally {
      setLoading(false);
    }
  }, []);

  const purchaseSweet = useCallback(async (id, quantity) => {
    try {
      setLoading(true);
      await sweetsAPI.purchase(id, quantity);
      await fetchSweets(); // Refresh list
      return { success: true };
    } catch (err) {
      setError(err.message || 'Purchase failed');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [fetchSweets]);

  const restockSweet = useCallback(async (id, quantity) => {
    try {
      setLoading(true);
      await sweetsAPI.restock(id, quantity);
      await fetchSweets(); // Refresh list
      return { success: true };
    } catch (err) {
      setError(err.message || 'Restock failed');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [fetchSweets]);

  const deleteSweet = useCallback(async (id) => {
    try {
      setLoading(true);
      await sweetsAPI.delete(id);
      await fetchSweets(); // Refresh list
      return { success: true };
    } catch (err) {
      setError(err.message || 'Delete failed');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [fetchSweets]);

  useEffect(() => {
    fetchSweets();
  }, [fetchSweets]);

  return {
    sweets,
    loading,
    error,
    fetchSweets,
    searchSweets,
    purchaseSweet,
    restockSweet,
    deleteSweet,
  };
};
