import { RefObject, useMemo, useRef } from 'react';

export default function useValueRef<T>(value: T): RefObject<T> & { current: T } {
  const ref = useRef<T>();
  const readOnlyRef = useMemo(
    () =>
      Object.create(
        {},
        {
          current: {
            get: () => ref.current
          }
        }
      ),
    []
  );

  ref.current = value;

  return readOnlyRef;
}
