/** @jest-environment jsdom */

import { renderHook } from '@testing-library/react-hooks';
import useMemoMap from './useMemoMap';

test('simple scenario', () => {
  // GIVEN: A mapper of x *= 10.
  const mapper = jest.fn(x => x * 10);

  // WHEN: Maps [1, 2, 3].
  const { rerender, result } = renderHook(({ input }) => useMemoMap(mapper)(input), {
    initialProps: { input: [1, 2, 3] }
  });

  // THEN: It should return [10, 20, 30].
  expect(result.current).toEqual([10, 20, 30]);

  // THEN: It should called the mapper 3 times in total.
  expect(mapper).toHaveBeenCalledTimes(3);
  expect(mapper).toHaveBeenNthCalledWith(1, 1, -1, [1, 2, 3]);
  expect(mapper).toHaveBeenNthCalledWith(2, 2, -1, [1, 2, 3]);
  expect(mapper).toHaveBeenNthCalledWith(3, 3, -1, [1, 2, 3]);
  expect(mapper).toHaveNthReturnedWith(1, 10);
  expect(mapper).toHaveNthReturnedWith(2, 20);
  expect(mapper).toHaveNthReturnedWith(3, 30);

  // WHEN: Maps [1, 2, 3, 4].
  rerender({ input: [1, 2, 3, 4] });

  // THEN: It should return [10, 20, 30].
  expect(result.current).toEqual([10, 20, 30, 40]);

  // THEN: It should called the mapper 4 times in total.
  expect(mapper).toHaveBeenCalledTimes(4);
  expect(mapper).toHaveBeenNthCalledWith(4, 4, -1, [1, 2, 3, 4]);
  expect(mapper).toHaveNthReturnedWith(4, 40);
});

test('should not remember across more than 2 renders', () => {
  // GIVEN: A mapper of x *= 10.
  const mapper = jest.fn(x => x * 10);

  // WHEN: Maps with [1, 2].
  const { rerender, result } = renderHook(({ input }) => useMemoMap(mapper)(input), {
    initialProps: { input: [1, 2] }
  });

  // THEN: It should return [10, 20].
  expect(result.current).toEqual([10, 20]);

  // THEN: It should call the mapper 2 times in total.
  expect(mapper).toHaveBeenCalledTimes(2);
  expect(mapper).toHaveBeenNthCalledWith(1, 1, -1, [1, 2]);
  expect(mapper).toHaveBeenNthCalledWith(2, 2, -1, [1, 2]);
  expect(mapper).toHaveNthReturnedWith(1, 10);
  expect(mapper).toHaveNthReturnedWith(2, 20);

  // WHEN: Maps [2, 3].
  rerender({ input: [2, 3] });

  // THEN: It should return [20, 30].
  expect(result.current).toEqual([20, 30]);

  // THEN: It should call the mapper 3 times in total.
  expect(mapper).toHaveBeenCalledTimes(3);
  expect(mapper).toHaveBeenNthCalledWith(3, 3, -1, [2, 3]);
  expect(mapper).toHaveNthReturnedWith(3, 30);

  // WHEN: Maps [1, 2] again.
  rerender({ input: [1, 2] });

  // THEN: It should return [10, 20].
  expect(result.current).toEqual([10, 20]);

  // THEN: It should call the mapper 4 times in total.
  expect(mapper).toHaveBeenCalledTimes(4);
  expect(mapper).toHaveBeenNthCalledWith(4, 1, -1, [1, 2]);
  expect(mapper).toHaveNthReturnedWith(4, 10);
});

test('should forget after mapper changed', () => {
  // GIVEN: 2 mappers: x *= 10 and x *= 11.
  const mapper1 = jest.fn(x => x * 10);
  const mapper2 = jest.fn(x => x * 11);

  // WHEN: Maps [1, 2, 3] with x *= 10.
  const { rerender, result } = renderHook(({ input, mapper }) => useMemoMap(mapper)(input), {
    initialProps: {
      input: [1, 2, 3],
      mapper: mapper1
    }
  });

  // THEN: It should return [10, 20, 30].
  expect(result.current).toEqual([10, 20, 30]);

  // THEN: It should have called the mappers 3 times and 0 times respectively.
  expect(mapper1).toHaveBeenCalledTimes(3);
  expect(mapper2).toHaveBeenCalledTimes(0);

  // WHEN: Maps [1, 2, 3] with x *= 11.
  rerender({ input: [1, 2, 3], mapper: mapper2 });

  // THEN: It should return [11, 22, 33].
  expect(result.current).toEqual([11, 22, 33]);

  // THEN: It should have called the mappers 3 times and 3 times respectively.
  expect(mapper1).toHaveBeenCalledTimes(3);
  expect(mapper2).toHaveBeenCalledTimes(3);
});

test('should memo the callback', () => {
  // GIVEN: Maps for the first time.
  const { rerender, result } = renderHook(() => useMemoMap(x => x));

  // WHEN: Maps for the second time.
  rerender();

  // THEN: It should return a callback function.
  expect(typeof result.all[0]).toBe('function');

  // THEN: It should return the same callback function twice.
  expect(result.all[0]).toBe(result.all[1]);
});

test('should use custom equality function', () => {
  const mapper = jest.fn(x => x * 10);

  // WHEN: Creates a map with a customequality function of odd vs. even.
  const { result } = renderHook(() =>
    useMemoMap(mapper, {
      itemEquality: (x, y) => x % 2 === y % 2
    })([1, 2, 3])
  );

  // THEN: It should return [10, 20, 10].
  expect(result.current).toEqual([10, 20, 10]);

  // THEN: It should have called the mapper 2 times.
  expect(mapper).toHaveBeenCalledTimes(2);
  expect(mapper).toHaveBeenNthCalledWith(1, 1, -1, [1, 2, 3]);
  expect(mapper).toHaveNthReturnedWith(1, 10);
  expect(mapper).toHaveBeenNthCalledWith(2, 2, -1, [1, 2, 3]);
  expect(mapper).toHaveNthReturnedWith(2, 20);
});

test('call mapper 2 times should memoize all of them in a single pool', () => {
  const mapper = jest.fn(x => x * 10);

  // WHEN: Maps [1, 2] and [2, 3].
  const { rerender, result } = renderHook(() => {
    const map = useMemoMap(mapper);

    return [map([1, 2]), map([2, 3])];
  });

  // THEN: It should return [[10, 20], [20, 30]].
  expect(result.current).toEqual([
    [10, 20],
    [20, 30]
  ]);

  // THEN: It should have called the mapper 3 times.
  expect(mapper).toHaveBeenCalledTimes(3);
  expect(mapper).toHaveBeenNthCalledWith(1, 1, -1, [1, 2]);
  expect(mapper).toHaveNthReturnedWith(1, 10);
  expect(mapper).toHaveBeenNthCalledWith(2, 2, -1, [1, 2]);
  expect(mapper).toHaveNthReturnedWith(2, 20);
  expect(mapper).toHaveBeenNthCalledWith(3, 3, -1, [2, 3]);
  expect(mapper).toHaveNthReturnedWith(3, 30);

  // WHEN: Maps again.
  rerender();

  // THEN: It should return [[10, 20], [20, 30]].
  expect(result.current).toEqual([
    [10, 20],
    [20, 30]
  ]);

  // THEN: It should have called the mapper 3 times.
  expect(mapper).toHaveBeenCalledTimes(3);
});

test('should call mapper with thisArg', () => {
  const input = [1, 2, 3];

  // GIVEN: A mapper of x *= 10 with arguments check.
  const mapper = jest.fn(function (x, index, array) {
    expect(this).toBe(input);
    expect(index).toBe(-1);
    expect(array).toBe(input);

    return x * 10;
  });

  // WHEN: Maps [1, 2, 3].
  const { result } = renderHook(() => useMemoMap(mapper)(input));

  // THEN: It should return [10, 20, 30].
  expect(result.current).toEqual([10, 20, 30]);

  // THEN: It should called the mapper 3 times in total.
  expect(mapper).toHaveBeenCalledTimes(3);
});

test('should not cache with changing mapper function', () => {
  // GIVEN: A "multiply by 10" mapper.
  const multiplyBy10 = jest.fn(x => x * 10);

  // WHEN: Maps [1, 2, 3] with a new function.
  const { rerender, result } = renderHook(() => useMemoMap(x => multiplyBy10(x))([1, 2, 3]));

  // THEN: It should return [10, 20, 30].
  expect(result.current).toEqual([10, 20, 30]);

  // THEN: It should called the mapper 3 times in total.
  expect(multiplyBy10).toHaveBeenCalledTimes(3);

  // WHEN: Re-render.
  rerender();

  // THEN: It should return [10, 20, 30].
  expect(result.current).toEqual([10, 20, 30]);

  // THEN: It should called the mapper 6 times in total.
  expect(multiplyBy10).toHaveBeenCalledTimes(6);
});
