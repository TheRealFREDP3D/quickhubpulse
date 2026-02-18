import { useEffect, useCallback } from "react";

interface UseKeyboardNavigationProps {
  itemCount: number;
  currentIndex: number;
  onIndexChange: (index: number) => void;
  onEnter: () => void;
  onEscape?: () => void;
  enabled?: boolean;
}

/**
 * Custom hook for keyboard navigation through a list of items
 * Supports arrow keys (up/down/left/right), Enter, and Escape
 */
export function useKeyboardNavigation({
  itemCount,
  currentIndex,
  onIndexChange,
  onEnter,
  onEscape,
  enabled = true,
}: UseKeyboardNavigationProps) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled || itemCount === 0) return;

      switch (event.key) {
        case "ArrowUp":
        case "ArrowLeft":
          event.preventDefault();
          onIndexChange(currentIndex === 0 ? itemCount - 1 : currentIndex - 1);
          break;

        case "ArrowDown":
        case "ArrowRight":
          event.preventDefault();
          onIndexChange(currentIndex === itemCount - 1 ? 0 : currentIndex + 1);
          break;

        case "Enter":
          event.preventDefault();
          onEnter();
          break;

        case "Escape":
          event.preventDefault();
          if (onEscape) {
            onEscape();
          }
          break;

        default:
          break;
      }
    },
    [itemCount, currentIndex, onIndexChange, onEnter, onEscape, enabled]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);
}
