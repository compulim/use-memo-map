import React from 'react';

const { useEffect, useRef } = React;

export default function usePrevious<T>(value: T, initialValue?: T): T | undefined {
  const ref = useRef<T | undefined>(initialValue);

  useEffect(() => {
    ref.current = value;
  });

  return ref.current;
}
