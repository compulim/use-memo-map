import { useMemoMap } from 'use-memo-map';

const result: readonly string[] = useMemoMap<number, string>(x => x + '')([1, 2, 3]);

console.log(result);
