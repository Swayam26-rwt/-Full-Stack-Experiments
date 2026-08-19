import { renderHook, waitFor, act } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { useEvents } from "../hooks/useEvents";

describe("useEvents", () => {
  test("loads events from mock API", async () => {
    const { result } = renderHook(() => useEvents());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.events.length).toBeGreaterThan(0);
    expect(result.current.error).toBeNull();
  });

  test("adds a new event", async () => {
    const { result } = renderHook(() => useEvents());

    await waitFor(() => expect(result.current.loading).toBe(false));

    const before = result.current.events.length;

    await act(async () => {
      await result.current.addEvent({
        title: "Test Event",
        date: "2026-08-21",
        time: "12:00",
        description: "Testing create flow",
      });
    });

    expect(result.current.events).toHaveLength(before + 1);
    expect(result.current.events.at(-1).title).toBe("Test Event");
  });

  test("updates an event date", async () => {
    const { result } = renderHook(() => useEvents());

    await waitFor(() => expect(result.current.loading).toBe(false));

    const id = result.current.events[0].id;

    await act(async () => {
      await result.current.updateEvent(id, { date: "2026-08-30" });
    });

    const updated = result.current.events.find((event) => event.id === id);
    expect(updated.date).toBe("2026-08-30");
  });

  test("deletes an event", async () => {
    const { result } = renderHook(() => useEvents());

    await waitFor(() => expect(result.current.loading).toBe(false));

    const id = result.current.events[0].id;

    await act(async () => {
      await result.current.deleteEvent(id);
    });

    expect(result.current.events.some((event) => event.id === id)).toBe(false);
  });
});
