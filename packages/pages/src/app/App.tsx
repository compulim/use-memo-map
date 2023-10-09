import { useCallback } from 'react';
import { useMemoMap } from 'use-memo-map';

const App = () => {
  const multiplyBy10 = useCallback<(value: number) => number>(value => {
    // Calls to this function will be memoized based on its first argument.
    // You can do expensive calls here.
    return value * 10;
  }, []);

  // useMemoMap() will return a function that take an array.
  const map = useMemoMap(multiplyBy10);

  const output = map([1, 2, 3]); // Returns [10, 20, 30].

  return (
    <ul>
      {output.map(value => (
        <li key={value}>{value}</li>
      ))}
    </ul>
  );
};

export default App;
