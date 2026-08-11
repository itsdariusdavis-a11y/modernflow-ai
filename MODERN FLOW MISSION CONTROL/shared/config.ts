/**
 * The numbers the whole scoreboard is judged against. Change them here and
 * every screen follows.
 */

/** Hard goal: cash collected by the end of the sprint. */
export const GOAL_AMOUNT = 3000;

/** Sprint window, inclusive, in America/Los_Angeles. 21 days. */
export const GOAL_START = '2026-08-11';
export const GOAL_END = '2026-08-31';
export const GOAL_DAYS = 21;

/** Daily floor for outbound touches, per person. */
export const TOUCH_MINIMUM = 25;

/** The hour by which a standup is expected, local time. */
export const STANDUP_DUE_HOUR = 9;

/** Full cycle value of one site (deposit + balance). Drives unit economics. */
export const FULL_CYCLE_VALUE = 500;

/** Below this effective hourly rate the delivery model is not worth running. */
export const HOURLY_FLOOR = 60;

/** A deal with no touch in this many days is stale enough to flag. */
export const STALE_TOUCH_DAYS = 5;

/**
 * Weekly gate numbers for the review screen. Derived from the sprint:
 * $3,000 over 3 weeks, 25 touches/person/day across 2 people over 7 days.
 */
export const WEEKLY_GATES = {
  cash_collected: 1000,
  touches: TOUCH_MINIMUM * 2 * 7, // 350
  conversations: 35,
  closes: 2,
} as const;
