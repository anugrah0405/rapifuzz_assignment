import { useEffect, useRef } from 'react';

/**
 * Calls onIdle after `timeout` ms of no user activity (mouse, keyboard, touch).
 * Returns a reset function to manually reset the timer.
 */
export function useIdle(timeout: number, onIdle: () => void) {
  const timer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const reset = () => {
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(onIdle, timeout);
    };
    const events = ['mousemove', 'keydown', 'mousedown', 'touchstart'];
    events.forEach(e => window.addEventListener(e, reset));
    reset();
    return () => {
      if (timer.current) clearTimeout(timer.current);
      events.forEach(e => window.removeEventListener(e, reset));
    };
  }, [timeout, onIdle]);
}
