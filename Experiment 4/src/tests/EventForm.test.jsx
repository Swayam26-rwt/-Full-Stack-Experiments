import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import EventForm from "../components/EventForm/EventForm";

describe("EventForm", () => {
  test("renders all main form fields", () => {
    render(<EventForm onSubmit={() => {}} onClose={() => {}} />);

    expect(screen.getByPlaceholderText("Enter event title")).toBeInTheDocument();
    expect(screen.getByLabelText("Date")).toBeInTheDocument();
    expect(screen.getByLabelText("Time")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Optional description")).toBeInTheDocument();
  });

  test("submits event data", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);

    render(<EventForm onSubmit={onSubmit} onClose={() => {}} />);

    fireEvent.change(screen.getByPlaceholderText("Enter event title"), {
      target: { value: "New Meeting" },
    });

    fireEvent.change(screen.getByPlaceholderText("Optional description"), {
      target: { value: "Discuss project progress" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Create Event" }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "New Meeting",
          description: "Discuss project progress",
        })
      );
    });
  });

  test("close button calls onClose", () => {
    const onClose = vi.fn();

    render(<EventForm onSubmit={() => {}} onClose={onClose} />);

    fireEvent.click(screen.getByRole("button", { name: "Close" }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
