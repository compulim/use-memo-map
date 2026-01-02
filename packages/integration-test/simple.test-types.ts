import { useMemoMap } from 'use-memo-map';

// Calling hooks at root because we are in typing tests.
// eslint-disable-next-line react-hooks/rules-of-hooks
const result: readonly string[] = useMemoMap<number, string>(x => x + '')([1, 2, 3]);

console.log(result);
