import { renderHook } from '@testing-library/react-hooks';
import { useCallback } from 'react';
import useValueRef from './useValueRef';

test('should get initial value', () => {
  // WHEN: Calling useValueRef() with 123.
  const { result } = renderHook(
    ({ input }) => {
      const ref = useValueRef(input);

      return ref.current;
    },
    { initialProps: { input: 123 } }
  );

  // THEN: It should return 123.
  expect(result.current).toBe(123);
});

test('should get subsequent value', () => {
  // WHEN: Calling useValueRef() with 123.
  const { rerender, result } = renderHook(
    ({ input }) => {
      const ref = useValueRef(input);

      return ref.current;
    },
    { initialProps: { input: 123 } }
  );

  // THEN: It should return 123.
  expect(result.current).toBe(123);

  // WHEN: Re-render with 234.
  rerender({ input: 234 });

  // THEN: It should return 234.
  expect(result.current).toBe(234);
});

test('using ref in callback should return the most recent value', () => {
  // WHEN: Calling useValueRef() with 123.
  const { rerender, result } = renderHook(
    ({ input }) => {
      const ref = useValueRef(input);

      return useCallback(jest.fn(() => ref.current), [ref]);
    },
    { initialProps: { input: 123 } }
  );

  // THEN: Calling callback() should return 123.
  expect(result.current()).toBe(123);

  // GIVEN: Remember the callback function.
  const initialCallback = result.current;

  // WHEN: Re-render with 234.
  rerender({ input: 234 });

  // THEN: Calling callback() should return 234.
  expect(result.current()).toBe(234);

  // THEN: The callback function returned should be same as the initial function.
  expect(result.current).toBe(initialCallback);

  // THEN: Expect the callback function to be called twice.
  expect(initialCallback).toHaveBeenCalledTimes(2);
});
