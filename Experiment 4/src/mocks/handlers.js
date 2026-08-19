import { http, HttpResponse } from "msw";

let events = [
  {
    id: 1,
    title: "React Lecture",
    date: "2026-08-13",
    time: "10:00",
    description: "React performance lecture",
  },
  {
    id: 2,
    title: "Project Meeting",
    date: "2026-08-15",
    time: "14:00",
    description: "Project discussion",
  },
  {
    id: 3,
    title: "Assignment Submission",
    date: "2026-08-18",
    time: "17:00",
    description: "Submit Experiment 4",
  },
  {
    id: 4,
    title: "Testing Lab",
    date: "2026-08-20",
    time: "11:30",
    description: "Vitest and React Testing Library",
  },
];

export const handlers = [
  http.get("/api/events", () => {
    return HttpResponse.json(events);
  }),

  http.post("/api/events", async ({ request }) => {
    const data = await request.json();

    if (!data.title || !data.date || !data.time) {
      return HttpResponse.json(
        { message: "Title, date and time are required." },
        { status: 400 }
      );
    }

    const newEvent = {
      id: Date.now(),
      ...data,
    };

    events.push(newEvent);

    return HttpResponse.json(newEvent, { status: 201 });
  }),

  http.put("/api/events/:id", async ({ params, request }) => {
    const id = Number(params.id);
    const updates = await request.json();

    const index = events.findIndex((event) => event.id === id);

    if (index === -1) {
      return HttpResponse.json(
        { message: "Event not found." },
        { status: 404 }
      );
    }

    events[index] = {
      ...events[index],
      ...updates,
      id,
    };

    return HttpResponse.json(events[index]);
  }),

  http.delete("/api/events/:id", ({ params }) => {
    const id = Number(params.id);
    const exists = events.some((event) => event.id === id);

    if (!exists) {
      return HttpResponse.json(
        { message: "Event not found." },
        { status: 404 }
      );
    }

    events = events.filter((event) => event.id !== id);

    return HttpResponse.json({ success: true });
  }),
];
