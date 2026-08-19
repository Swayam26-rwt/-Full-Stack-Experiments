import { describe, expect, test } from "vitest";
import { formatDate, getMonthDays, isSameDate } from "../utils/calendarUtils";

describe("calendarUtils", () => {
  test("formatDate returns YYYY-MM-DD", () => {
    expect(formatDate(new Date(2026, 7, 13))).toBe("2026-08-13");
  });

  test("getMonthDays always returns 42 cells", () => {
    expect(getMonthDays(2026, 7)).toHaveLength(42);
  });

  test("isSameDate compares calendar dates", () => {
    expect(
      isSameDate(new Date(2026, 7, 13), new Date(2026, 7, 13))
    ).toBe(true);

    expect(
      isSameDate(new Date(2026, 7, 13), new Date(2026, 7, 14))
    ).toBe(false);
  });
});
