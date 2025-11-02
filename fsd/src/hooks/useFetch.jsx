import { useState, useEffect } from "react";

export default function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(url)
      .then(res => res.json())
      .then(res => setData(res))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [url]);
  return { data, loading, error };
}
