import { useState, useEffect, useCallback } from 'react';
import { AnimalService } from '../services/animalService';
import { useInView } from 'react-intersection-observer';

/**
 * useHistory manages the persistent list of animal analyses.
 * Adheres to SRP by isolating history-specific logic and infinite scroll.
 */
export const useHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastDoc, setLastDoc] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const { ref, inView } = useInView();

  const fetchHistory = useCallback(async (isLoadMore = false) => {
    if (loading || (!hasMore && isLoadMore)) return;
    
    setLoading(true);
    try {
      const result = await AnimalService.getHistory(isLoadMore ? lastDoc : null);
      
      setHistory(prev => isLoadMore ? [...prev, ...result.docs] : result.docs);
      setLastDoc(result.lastDoc);
      setHasMore(result.hasMore);
    } catch (error) {
      console.error("Error fetching history:", error);
    } finally {
      setLoading(false);
    }
  }, [lastDoc, hasMore, loading]);

  // Initial fetch and infinite scroll trigger
  useEffect(() => {
    if (history.length === 0) fetchHistory();
  }, []);

  useEffect(() => {
    if (inView && hasMore && !loading) {
      fetchHistory(true);
    }
  }, [inView, hasMore, loading, fetchHistory]);

  return {
    history,
    loading,
    hasMore,
    infiniteScrollRef: ref,
    refresh: () => fetchHistory(false)
  };
};
