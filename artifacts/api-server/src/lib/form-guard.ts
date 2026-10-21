import type { Request } from "express";

/**
 * Small, dependency-free helpers shared by the public form endpoints:
 * an in-memory fixed-window rate limiter, honeypot detection, and
 * friendly field-level validation errors.
 */

export interface RateLimiter {
  /** Records a hit for `key`. Returns null if allowed, or seconds to wait. */
  hit(key: string): number | null;
}

const MAX_TRACKED_KEYS = 10_000;

export function createRateLimiter(options: { max: number; windowMs: number }): RateLimiter {
  const hits = new Map<string, { count: number; expires: number }>();
  return {
    hit(key: string): number | null {
      const now = Date.now();
      for (const [k, v] of hits) {
        if (v.expires <= now) hits.delete(k);
      }
      const entry = hits.get(key);
      if (entry && entry.count >= options.max) {
        return Math.max(1, Math.ceil((entry.expires - now) / 1000));
      }
      // Fail closed if the table is flooded with distinct keys.
      if (!entry && hits.size >= MAX_TRACKED_KEYS) {
        return Math.ceil(options.windowMs / 1000);
      }
      hits.set(key, {
        count: (entry?.count ?? 0) + 1,
        expires: entry?.expires ?? now + options.windowMs,
      });
      return null;
    },
  };
}

export function clientIp(req: Request): string {
  return req.ip || req.socket.remoteAddress || "unknown";
}

/** True when the hidden `website` field was filled in (bots only). */
export function isHoneypotHit(body: unknown): boolean {
  if (!body || typeof body !== "object") return false;
  const value = (body as Record<string, unknown>).website;
  if (value === undefined || value === null) return false;
  return String(value).trim().length > 0;
}

export type FieldErrors = Record<string, string>;

/** Maps Zod issues to one friendly message per field. */
export function toFieldErrors(
  error: { issues: ReadonlyArray<{ path: ReadonlyArray<PropertyKey> }> },
  messages: Record<string, string>): FieldErrors {
  const fieldErrors: FieldErrors = {};
  for (const issue of error.issues) {
    const field = String(issue.path[0] ?? "");
    if (!field || field === "website" || fieldErrors[field]) continue;
    fieldErrors[field] = messages[field] ?? "Please check this field.";
  }
  return fieldErrors;
}

export function isPlainObject(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}
