// server/utils/rateLimit.ts
const lastAttempt = new Map<string, number>();
const COOLDOWN_MS = 3000; // 3 sekunder mellan försök per dörr

export function isRateLimited(doorId: string): boolean {
  const now = Date.now();
  const last = lastAttempt.get(doorId) ?? 0;

  if (now - last < COOLDOWN_MS) {
    return true;
  }

  lastAttempt.set(doorId, now);
  return false;
}
