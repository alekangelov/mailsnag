/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useState } from "react";

type Options<T> = {
  onSuccess?: (data: T) => void;
  onError?: (error: any) => void;
};

const defaultObject = {};

export function useMutation<T, A extends any[]>(
  fn: (...args: A) => Promise<T>,
  options: Options<T> = defaultObject
): [
  (...args: A) => Promise<T>,
  { data: T | null; error: any | null; loading: boolean }
] {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const mutate = useCallback(
    async (...args: A): Promise<T> => {
      setLoading(true);
      setData(null);
      setError(null);
      try {
        const d = await fn(...args);
        if (!d) {
          throw new Error("No data");
        }
        setData(d);
        options.onSuccess?.(d);
        return d;
      } catch (error) {
        setError(error);
        options.onError?.(error);
      } finally {
        setLoading(false);
      }
      return null as any;
    },
    [fn, options]
  );

  return [mutate, { data, error, loading }];
}

export function useQuery<T, A extends any[], E>(
  fn: (...args: A) => Promise<T>,
  args: A,
  options: Options<T> = defaultObject
): { data: T | null; error: E | null; loading: boolean } {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<E | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    setData(null);
    setError(null);
    fn(...args)
      .then((d) => {
        if (!d) {
          throw new Error("No data");
        }
        setData(d);
        options.onSuccess?.(d);
      })
      .catch((error) => {
        setError(error);
        options.onError?.(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [fn, args, options]);

  return { data, error, loading };
}
