import { useEffect, useState } from "react";
export function useResource<T>(loader: () => Promise<T>, key: string) {
  const [state, setState] = useState<{
    data?: T;
    error?: string;
    loading: boolean;
  }>({ loading: true });
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    setState({ loading: true });
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
      });
    return () => {
      active = false;
    }; // Loader identity is represented by the explicit cache key.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, attempt]);
  return { ...state, retry: () => setAttempt((n) => n + 1) };
}
