const API_URL = "/api/events";

// Browser fallback data. MSW intercepts these requests when the
// mockServiceWorker is available. If it is not, the same UI still works
// locally without a backend server.
let localEvents = [
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

async function parseResponse(response) {
  if (!response.ok) {
    let message = "Request failed.";
    try {
      const body = await response.json();
      message = body.message || message;
    } catch {
      // Ignore invalid/non-JSON error bodies.
    }
    throw new Error(message);
  }

  return response.json();
}

async function request(url, options) {
  try {
    const response = await fetch(url, options);
    return await parseResponse(response);
  } catch (error) {
    // If MSW/backend is unavailable, use the in-memory API below.
    return null;
  }
}

export async function getEvents() {
  const result = await request(API_URL);
  return result ?? [...localEvents];
}

export async function createEvent(eventData) {
  const result = await request(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(eventData),
  });

  if (result) return result;

  if (!eventData.title || !eventData.date || !eventData.time) {
    throw new Error("Title, date and time are required.");
  }

  const newEvent = { id: Date.now(), ...eventData };
  localEvents.push(newEvent);
  return newEvent;
}

export async function updateEventApi(id, updates) {
  const result = await request(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });

  if (result) return result;

  const numericId = Number(id);
  const index = localEvents.findIndex((event) => event.id === numericId);

  if (index === -1) throw new Error("Event not found.");

  localEvents[index] = { ...localEvents[index], ...updates, id: numericId };
  return localEvents[index];
}

export async function deleteEventApi(id) {
  const result = await request(`${API_URL}/${id}`, { method: "DELETE" });

  if (result) return result;

  const numericId = Number(id);
  const exists = localEvents.some((event) => event.id === numericId);

  if (!exists) throw new Error("Event not found.");

  localEvents = localEvents.filter((event) => event.id !== numericId);
  return { success: true };
}
