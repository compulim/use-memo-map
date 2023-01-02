/** @jest-environment jsdom */

import { renderHook } from '@testing-library/react-hooks';
import { useMemoMap } from 'use-memo-map';

test('simple scenario', () => {
  // WHEN: Maps [1, 2, 3].
  const { result } = renderHook(({ input }) => useMemoMap(x => x * 10)(input), {
    initialProps: { input: [1, 2, 3] }
  });

  // THEN: It should return [10, 20, 30].
  expect(result.current).toEqual([10, 20, 30]);
});
