import { useState, useEffect } from 'react';
import { TileDataSource } from '../config/availableTiles';

interface TileData {
  count?: number;
  sparklineData?: number[] | Array<{ date: string; value: number }>;
}

interface UseTileDataReturn {
  data: TileData | null;
  loading: boolean;
  error: string | null;
}

// Mock data generators for each data source
const mockDataGenerators: Record<TileDataSource, () => TileData> = {
  totalCharts: () => ({ count: 152 }),
  activeUsers: () => ({ count: 48 }),
  dataPoints: () => ({ count: 12500 }),
  uptime: () => ({ count: 99.9 }),
  performanceScore: () => ({
    count: 68,
    sparklineData: [45, 52, 38, 65, 42, 58, 70, 61, 55, 48, 62, 68],
  }),
  revenue: () => ({
    count: 440,
    sparklineData: [280, 320, 295, 340, 315, 370, 385, 360, 395, 410, 425, 440],
  }),
  websiteTraffic: () => ({
    count: 5680,
    sparklineData: [
      { date: '2024-01-01', value: 4200 },
      { date: '2024-02-01', value: 4580 },
      { date: '2024-03-01', value: 4320 },
      { date: '2024-04-01', value: 4890 },
      { date: '2024-05-01', value: 5120 },
      { date: '2024-06-01', value: 5450 },
      { date: '2024-07-01', value: 5680 },
    ],
  }),
};

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const useTileData = (dataSource: TileDataSource | null): UseTileDataReturn => {
  const [data, setData] = useState<TileData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!dataSource) {
      setData(null);
      setLoading(false);
      setError(null);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Simulate API call with delay
        await delay(300 + Math.random() * 300);

        // Get mock data from generator
        const generator = mockDataGenerators[dataSource];
        if (generator) {
          const result = generator();
          setData(result);
        } else {
          throw new Error(`No data generator found for ${dataSource}`);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch tile data');
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dataSource]);

  return { data, loading, error };
};
