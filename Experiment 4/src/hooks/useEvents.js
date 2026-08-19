import { useCallback, useEffect, useState } from "react";
import {
  getEvents,
  createEvent,
  updateEventApi,
  deleteEventApi,
} from "../services/eventService";

export function useEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function loadEvents() {
      try {
        setLoading(true);
        const data = await getEvents();

        if (mounted) {
          setEvents(data);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setError(err.message || "Failed to load events.");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadEvents();

    return () => {
      mounted = false;
    };
  }, []);

  const addEvent = useCallback(async (eventData) => {
    try {
      const newEvent = await createEvent(eventData);
      setEvents((prev) => [...prev, newEvent]);
      setError(null);
      return newEvent;
    } catch (err) {
      setError(err.message || "Failed to create event.");
      throw err;
    }
  }, []);

  const updateEvent = useCallback(async (id, updates) => {
    try {
      const updatedEvent = await updateEventApi(id, updates);

      setEvents((prev) =>
        prev.map((event) =>
          String(event.id) === String(id) ? updatedEvent : event
        )
      );

      setError(null);
      return updatedEvent;
    } catch (err) {
      setError(err.message || "Failed to update event.");
      throw err;
    }
  }, []);

  const deleteEvent = useCallback(async (id) => {
    try {
      await deleteEventApi(id);
      setEvents((prev) =>
        prev.filter((event) => String(event.id) !== String(id))
      );
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to delete event.");
      throw err;
    }
  }, []);

  return {
    events,
    loading,
    error,
    addEvent,
    updateEvent,
    deleteEvent,
  };
}
