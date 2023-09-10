/** @jest-environment jsdom */

const { renderHook } = require('@testing-library/react');
const { default: useMemoMap } = require('use-memo-map/useMemoMap');

test('simple scenario', () => {
  // GIVEN: A "multiply by 10" mapper.
  const mapper = x => x * 10;

  // WHEN: Calling with input of [1, 2, 3].
  const { result } = renderHook(({ input }) => useMemoMap(mapper)(input), {
    initialProps: { input: [1, 2, 3] }
  });

  // THEN: It should return [10, 20, 30].
  expect(result.current).toEqual([10, 20, 30]);
});
