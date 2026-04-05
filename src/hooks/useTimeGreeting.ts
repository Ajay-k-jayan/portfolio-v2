import { useMemo } from 'react';

export function useTimeGreeting() {
  return useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning! 👋';
    if (h < 17) return 'Good afternoon! 👋';
    return 'Good evening! 👋';
  }, []);
}
