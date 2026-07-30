const attempts = new Map();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 5;

export function consumeRateLimit(identifier, now = Date.now()) {
  const key = identifier || "unknown";
  const current = attempts.get(key);

  if (!current || current.expiresAt <= now) {
    attempts.set(key, { count: 1, expiresAt: now + WINDOW_MS });
    return { allowed: true, remaining: MAX_ATTEMPTS - 1 };
  }

  if (current.count >= MAX_ATTEMPTS) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.ceil((current.expiresAt - now) / 1000),
    };
  }

  current.count += 1;
  return { allowed: true, remaining: MAX_ATTEMPTS - current.count };
}

export function clearRateLimitsForTests() {
  attempts.clear();
}
