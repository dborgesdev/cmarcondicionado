import { useEffect, useState } from "react";
export function useResource<T>(
  loader: () => Promise<T>,
  key: string,
  refreshMs = 0,
) {
  const [state, setState] = useState<{
    data?: T;
    error?: string;
    loading: boolean;
  }>({ loading: true });
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    let pending = false;
    setState({ loading: true });
    function load() {
      if (pending) return;
      pending = true;
      loader()
        .then((data) => {
          if (active) setState({ data, loading: false });
        })
        .catch((e) => {
          if (active)
            setState({
              error: e instanceof Error ? e.message : "Falha de conexão.",
              loading: false,
            });
        })
        .finally(() => {
          pending = false;
        });
    }
    function revalidate() {
      if (document.visibilityState === "visible") load();
    }
    load();
    const timer = refreshMs
      ? window.setInterval(revalidate, refreshMs)
      : undefined;
    if (refreshMs) {
      window.addEventListener("focus", revalidate);
      window.addEventListener("online", revalidate);
      document.addEventListener("visibilitychange", revalidate);
    }
    return () => {
      active = false;
      window.clearInterval(timer);
      window.removeEventListener("focus", revalidate);
      window.removeEventListener("online", revalidate);
      document.removeEventListener("visibilitychange", revalidate);
    }; // Loader identity is represented by the explicit cache key.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, attempt, refreshMs]);
  return { ...state, retry: () => setAttempt((n) => n + 1) };
}
