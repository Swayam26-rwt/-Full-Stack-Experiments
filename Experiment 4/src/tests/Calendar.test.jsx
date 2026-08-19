import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import Calendar from "../components/Calendar/Calendar";

describe("Calendar", () => {
  const events = [
    {
      id: 1,
      title: "React Lecture",
      date: "2026-08-13",
      time: "10:00",
    },
    {
      id: 2,
      title: "Project Meeting",
      date: "2026-08-15",
      time: "14:00",
    },
  ];

  test("renders supplied events", () => {
    render(
      <Calendar
        events={events}
        loading={false}
        onUpdateEvent={() => {}}
        onDeleteEvent={() => {}}
        onDateSelect={() => {}}
      />
    );

    expect(screen.getByText("React Lecture")).toBeInTheDocument();
    expect(screen.getByText("Project Meeting")).toBeInTheDocument();
  });

  test("renders navigation controls", () => {
    render(
      <Calendar
        events={[]}
        loading={false}
        onUpdateEvent={() => {}}
        onDeleteEvent={() => {}}
        onDateSelect={() => {}}
      />
    );

    expect(screen.getByRole("button", { name: "Previous month" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Next month" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Today" })).toBeInTheDocument();
  });

  test("double-clicking a day triggers date selection", () => {
    const onDateSelect = vi.fn();

    render(
      <Calendar
        events={[]}
        loading={false}
        onUpdateEvent={() => {}}
        onDeleteEvent={() => {}}
        onDateSelect={onDateSelect}
      />
    );

    fireEvent.doubleClick(screen.getAllByTestId(/^day-/)[10]);

    expect(onDateSelect).toHaveBeenCalledTimes(1);
  });

  test("shows loading state", () => {
    render(
      <Calendar
        events={[]}
        loading={true}
        onUpdateEvent={() => {}}
        onDeleteEvent={() => {}}
        onDateSelect={() => {}}
      />
    );

    expect(screen.getByRole("status")).toHaveTextContent(
      "Loading calendar events..."
    );
  });
});
