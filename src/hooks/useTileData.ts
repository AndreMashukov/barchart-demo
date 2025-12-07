import { useState, useEffect } from "react";
import { TileDataSource } from "../config/availableTiles";

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
      { date: "2024-01-01", value: 4200 },
      { date: "2024-02-01", value: 4580 },
      { date: "2024-03-01", value: 4320 },
      { date: "2024-04-01", value: 4890 },
      { date: "2024-05-01", value: 5120 },
      { date: "2024-06-01", value: 5450 },
      { date: "2024-07-01", value: 5680 },
    ],
  }),
  serverLoad: () => ({ count: 72 }),
  memoryUsage: () => ({ count: 84 }),
  diskSpace: () => ({ count: 67 }),
  networkLatency: () => ({ count: 24 }),
  errorRate: () => ({ count: 0.3 }),
  pageViews: () => ({ count: 15640 }),
  bounceRate: () => ({ count: 32.5 }),
  conversionRate: () => ({ count: 4.8 }),
  customerSatisfaction: () => ({ count: 87 }),
  salesGrowth: () => ({
    count: 23,
    sparklineData: [12, 15, 18, 16, 20, 22, 19, 24, 21, 25, 22, 23],
  }),
  marketShare: () => ({
    count: 34,
    sparklineData: [28, 30, 29, 32, 31, 33, 35, 34, 36, 35, 33, 34],
  }),
  productivity: () => ({
    count: 89,
    sparklineData: [75, 78, 82, 80, 85, 87, 84, 90, 88, 92, 89, 89],
  }),
  supportTickets: () => ({ count: 23 }),
  apiCalls: () => ({
    count: 12450,
    sparklineData: [9800, 10200, 9950, 10800, 11200, 11600, 12000, 11800, 12200, 12350, 12400, 12450],
  }),
  downloads: () => ({ count: 8750 }),
  subscriptions: () => ({ count: 2340 }),
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
        setError(err instanceof Error ? err.message : "Failed to fetch tile data");
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dataSource]);

  return { data, loading, error };
};
