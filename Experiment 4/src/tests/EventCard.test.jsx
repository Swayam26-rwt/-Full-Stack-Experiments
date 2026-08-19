import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import EventCard from "../components/Calendar/EventCard";

describe("EventCard", () => {
  const event = {
    id: 1,
    title: "React Lecture",
    date: "2026-08-13",
    time: "10:00",
  };

  test("renders event title and time", () => {
    render(<EventCard event={event} onDelete={() => {}} />);

    expect(screen.getByText("React Lecture")).toBeInTheDocument();
    expect(screen.getByText("10:00")).toBeInTheDocument();
  });

  test("delete button calls callback with event id", () => {
    const onDelete = vi.fn();

    render(<EventCard event={event} onDelete={onDelete} />);

    fireEvent.click(
      screen.getByRole("button", { name: /delete react lecture/i })
    );

    expect(onDelete).toHaveBeenCalledWith(1);
  });

  test("event is draggable", () => {
    render(<EventCard event={event} onDelete={() => {}} />);

    expect(screen.getByTestId("event-1")).toHaveAttribute("draggable", "true");
  });

  test("drag start stores event id", () => {
    render(<EventCard event={event} onDelete={() => {}} />);

    const setData = vi.fn();
    const dataTransfer = {
      setData,
      effectAllowed: "",
    };

    fireEvent.dragStart(screen.getByTestId("event-1"), { dataTransfer });

    expect(setData).toHaveBeenCalledWith("eventId", "1");
  });
});
