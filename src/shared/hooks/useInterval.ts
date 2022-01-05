import { useRef, useEffect, DependencyList } from "react";

export const useInterval = (callback: () => void, intervalMs: number | null, deps: DependencyList = []) => {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (intervalMs === null) {
      return;
    }

    const id = setInterval(() => savedCallback.current(), intervalMs);

    return () => clearInterval(id);
  }, [intervalMs, ...deps]);
};
