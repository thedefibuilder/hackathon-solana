import { useEffect, useState } from 'react';

import type { RefObject } from 'react';

export default function useGetOverflowY(reference: RefObject<HTMLElement>, content?: unknown) {
  const [isOverflowingY, setIsOverflowingY] = useState(false);

  useEffect(() => {
    const container = reference.current;

    if (container) {
      console.log('CIao', container);
      const isOverflowing = container.scrollHeight > container.clientHeight;
      setIsOverflowingY(isOverflowing);
    }
  }, [reference, content]);

  return {
    isOverflowingY
  };
}
