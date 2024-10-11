import { useCallback, useEffect, useRef } from 'react';
import { useRefFrom } from 'use-ref-from';

import usePrevious from './private/usePrevious.ts';

type UseMemoMapOptions<T> = {
  itemEquality?: (this: readonly T[], x: T, y: T) => boolean;
};

/**
 * Creates a memoized mapping function.
 *
 * Unlike `React.useMemo`, the mapping function can be called multiple times in a single render loop.
 * All calls to the mapping function will be memoized.
 *
 * The memoized arguments and return values will survive next render.
 *
 * When the mapping function change, all memoized values will be invalidated.
 */
export default function useMemoMap<T = unknown, R = unknown>(
  mapper: (this: readonly T[], item: T, index: -1, array: readonly T[]) => R,
  { itemEquality = Object.is }: UseMemoMapOptions<T> = {}
): (array: readonly T[]) => readonly R[] {
  const itemEqualityRef = useRefFrom(itemEquality);
  const lastCallsRef = useRef<readonly [T, R][]>([]);
  const mapperRef = useRefFrom(mapper);
  const thisCalls: [T, R][] = [];

  if (usePrevious(mapper) !== mapper) {
    lastCallsRef.current = [];
  }

  useEffect(() => {
    lastCallsRef.current = Object.freeze(thisCalls);
  });

  const thisCallsRef = useRefFrom(thisCalls);

  return useCallback<(array: readonly T[]) => readonly R[]>(
    (array: readonly T[]) => {
      const { current: itemEquality } = itemEqualityRef;
      const { current: mapper } = mapperRef;
      const { current: thisCalls } = thisCallsRef;

      return <readonly R[]>Object.freeze(
        array.map<R>(item => {
          const thisCall = thisCalls.find(entry => itemEquality.call(array, item, entry[0]));

          // If this call has memoized in the current render loop, use the memoized return value.
          if (thisCall) {
            return thisCall[1];
          }

          const lastCall = lastCallsRef.current.find(entry => itemEquality.call(array, item, entry[0]));
          const result = lastCall ? lastCall[1] : mapper.call(array, item, -1, array);

          thisCalls.push([item, result]);

          return result;
        })
      );
    },
    [itemEqualityRef, lastCallsRef, mapperRef, thisCallsRef]
  );
}
