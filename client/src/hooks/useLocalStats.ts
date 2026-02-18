import { useState, useCallback } from "react";
import axios from "axios";
import type { Repository } from "./useGitHubAPI";

interface HistoricalStats {
  timestamp: string;
  stats: Repository[];
}

interface UseLocalStatsReturn {
  saveStats: (repositories: Repository[]) => Promise<void>;
  loadStats: () => Promise<HistoricalStats[]>;
  loadLatestStats: () => Promise<HistoricalStats | null>;
  loading: boolean;
  error: string | null;
}

export function useLocalStats(): UseLocalStatsReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveStats = useCallback(async (repositories: Repository[]) => {
    try {
      setLoading(true);
      setError(null);
      await axios.post("/api/stats", repositories);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to save stats";
      setError(message);
      console.error("Error saving stats:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadStats = useCallback(async (): Promise<HistoricalStats[]> => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get<HistoricalStats[]>("/api/stats");
      return response.data;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load stats";
      setError(message);
      console.error("Error loading stats:", err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const loadLatestStats =
    useCallback(async (): Promise<HistoricalStats | null> => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get<HistoricalStats | null>(
          "/api/stats/latest"
        );
        return response.data;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to load latest stats";
        setError(message);
        console.error("Error loading latest stats:", err);
        return null;
      } finally {
        setLoading(false);
      }
    }, []);

  return { saveStats, loadStats, loadLatestStats, loading, error };
}
