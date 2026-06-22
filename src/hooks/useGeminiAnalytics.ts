import { useState, useEffect } from 'react';

let cachedData: any = null;
let lastFetchTime = 0;

export function useGeminiAnalytics() {
  const [data, setData] = useState<any>(cachedData);
  const [loading, setLoading] = useState(!cachedData);

  useEffect(() => {
    const fetchAnalytics = async () => {
      // Cache for 2 minutes to prevent spamming the Gemini API on navigation
      if (cachedData && Date.now() - lastFetchTime < 120000) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9000/api/v1';
        const res = await fetch(`${API_URL}/gemini/analytics`);
        const result = await res.json();
        if (result && result['Risk Evolution']) {
          cachedData = result;
          lastFetchTime = Date.now();
          setData(result);
        }
      } catch (e) {
        console.error('Failed to fetch Gemini analytics:', e);
        // Fallback mock data if backend fails, avoiding infinite loading spinner
        const mockFallback = {
          "Risk Evolution": [ {"day": "1", "val": 10}, {"day": "2", "val": 15}, {"day": "3", "val": 12}, {"day": "4", "val": 18}, {"day": "5", "val": 25}, {"day": "6", "val": 20}, {"day": "7", "val": 15} ],
          "Device Health": [ {"day": "1", "val": 95}, {"day": "2", "val": 94}, {"day": "3", "val": 96}, {"day": "4", "val": 92}, {"day": "5", "val": 88}, {"day": "6", "val": 90}, {"day": "7", "val": 95} ],
          "Failure Forecast": [ {"name": "Cooling", "val": 40}, {"name": "Thermal", "val": 35}, {"name": "Storage", "val": 10}, {"name": "Power", "val": 10}, {"name": "Network", "val": 5} ],
          "Cost Savings": [ {"month": "J", "val": 10}, {"month": "F", "val": 15}, {"month": "M", "val": 20}, {"month": "A", "val": 12}, {"month": "M", "val": 18} ],
          "Power Utilization": [ {"name": "Opt", "val": 80, "fill": "#10b981"}, {"name": "Waste", "val": 20, "fill": "#ef4444"} ],
          "Network Stability": [ {"time": "0h", "val": 99.5}, {"time": "6h", "val": 99.1}, {"time": "12h", "val": 98.9}, {"time": "18h", "val": 99.4} ],
          "Maintenance Efficiency": [ {"name": "Routine", "val": 50}, {"name": "Reactive", "val": 20}, {"name": "AI Prev", "val": 30} ]
        };
        cachedData = mockFallback;
        setData(mockFallback);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  return { data, loading };
}
