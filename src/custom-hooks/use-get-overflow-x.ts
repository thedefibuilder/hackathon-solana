import { useEffect, useState } from 'react';

import type { RefObject } from 'react';

export default function useGetOverflowX(reference: RefObject<HTMLElement>, content?: unknown) {
  const [isOverflowingX, setIsOverflowingX] = useState(false);

  useEffect(() => {
    const container = reference.current;

    if (container) {
      const isOverflowing = container.scrollWidth > container.clientWidth;
      setIsOverflowingX(isOverflowing);
    }
  }, [reference, content]);

  return {
    isOverflowingX
  };
}
