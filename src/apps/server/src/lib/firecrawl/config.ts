export const CACHE_TIME_LIMITS_MS = {
  ONE_DAY: 1000 * 60 * 60 * 24,
  ONE_WEEK: 1000 * 60 * 60 * 24 * 7,
  ONE_MONTH: 1000 * 60 * 60 * 24 * 7 * 4.25,
  ONE_QUARTER: 1000 * 60 * 60 * 24 * 7 * 4.25 * 3,
  HALF_YEAR: 1000 * 60 * 60 * 24 * 365.25 / 2,
  ONE_YEAR: 1000 * 60 * 60 * 24 * 365.25,
} as const;
