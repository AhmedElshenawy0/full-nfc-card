// hooks/useSwipe.ts
import { useRef } from "react";

export const useSwipe = (
  onSwipeLeft: () => void,
  onSwipeRight: () => void,
  threshold = 50,
) => {
  const touchStartX = useRef<number | null>(null);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return null;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) >= threshold) {
      diff > 0 ? onSwipeLeft() : onSwipeRight();
    }
    touchStartX.current = null;
  };

  return { onTouchStart, onTouchEnd };
};
