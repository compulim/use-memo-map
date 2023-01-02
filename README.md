# `use-memo-map`

Memoizes calls to array map function similar to `React.useMemo`. Memoized results will survive next render.

## Background

tl;dr, `React.useMemo()` cache a single call. `useMemoMap()` cache multiple calls.

If you have a variable-length array and would like to cache `Array.map` like `useMemo`, you can use `useMemoMap` to cache all calls.

## How to use

```js
import { useMemoMap } from 'use-memo-map';

const MyComponent = () => {
  const multiplyBy10 = useCallback(value => {
    // Calls to this function will be memoized based on its first argument.
    // You can do expensive calls here.
    return value * 10;
  }, []);

  // useMemoMap() will return a function that take an array.
  const map = useMemoMap(multiplyBy10);

  const output = map([1, 2, 3]); // Returns [10, 20, 30].

  return ...;
};

export default MyComponent;
```

## API

```ts
type UseMemoMapOptions<T> = {
  itemEquality?: (this: readonly T[], x: T, y: T) => boolean;
};

function useMemoMap<T = unknown, R = unknown>(
  mapper: (this: readonly T[], item: T, index: -1, array: readonly T[]) => R,
  { itemEquality = Object.is }: UseMemoMapOptions<T> = {}
): (array: readonly T[]) => readonly R[] {}
```

For example, converting a `number` array into a `string` array.

```ts
function useMemoMap(
  mapper: (item: number, index: -1, array: readonly number[]) => string
): (array: readonly number[]) => readonly string[];
```

## Behaviors

### Invalidate all results when mapper function change

If the first argument (a.k.a. the mapper function) changed, it will invalidate all results. This is by design.

You should always use `useCallback` or `useMemo` to cache the mapper function.

```js
const MyComponent = () => {
  // ❌ In the next line, multiplyBy10() is a new instance on every render of <MyComponent>.
  const multiplyBy10 = value => value * 10;
  // ✔️ You should cache multiplyBy10() by React.useCallback().
  const multiplyBy10 = useCallback(value => value * 10, []);

  const map = useMemoMap(multiplyBy10);

  // Calls to map() will not survive across render calls if multiplyBy10() changed.
  const output = map([1, 2, 3]);

  // ...
};
```

### Single cache pool for multiple calls

In a single render loop, if you call the returned function (a.k.a. the `map` function) multiple times, all calls will be sharing the same "cache pool".

```js
const MyComponent = () => {
  // ...

  const output1 = map([1, 2, 3]); // Return [10, 20, 30].
  const output2 = map([1, 2, 3]); // Return [10, 20, 30] without calling `multiplyBy10`.

  // ...
};
```

Note: the "cache pool" will be saved during `useEffect()` callback. This is similar to `usePrevious()` hook.

### Index is always `-1`

Unlike `Array.map()` which pass the `index` value as second argument, `useMemoMap()` will always pass `-1`. This is by design.

Calls to mapper function could be cached and will not be called again if only `index` has changed. To protect wrong use of `index` value, we pass `-1` instead.

If you understand this risk, call `this.indexOf(item)` to get the `index` value.

### Returns read-only result

React loves immutability. By default, the array we returned is frozen (a.k.a. read-only).

If you prefer mutable array, call `[...result]` to clone the array.

### Custom equality function

We use `Object.is` for equality check. You can provide a different equality check via `options.itemEquality`.

## Contributions

Like us? [Star](https://github.com/compulim/use-memo-map/stargazers) us.

Want to make it better? [File](https://github.com/compulim/use-memo-map/issues) us an issue.

Don't like something you see? [Submit](https://github.com/compulim/use-memo-map/pulls) a pull request.
