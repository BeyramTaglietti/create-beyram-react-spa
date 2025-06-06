import { useEffect, useState } from "react";

export const useDebounce = <T>(
  initialValue: T,
  delay: number
): [T, (arg0: T) => void, T] => {
  const [value, setValue] = useState(initialValue);
  const [debouncedValue, setDebouncedValue] = useState(initialValue);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return [value, setValue, debouncedValue];
};
