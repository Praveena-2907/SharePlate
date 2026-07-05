import { useEffect, useState } from "react";
import { getMyAnalytics } from "../api/analytics";

export function useAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = () => {
    setLoading(true);
    setError(null);
    getMyAnalytics()
      .then(setData)
      .catch((err) => setError(err?.response?.data?.detail || "Failed to load analytics"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetch();
  }, []);

  return { data, loading, error, refetch: fetch };
}
