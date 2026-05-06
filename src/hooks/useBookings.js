import { useState, useEffect, useCallback } from "react";

export function useBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBookings = useCallback(async (signal) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/bookings.json", { signal });

      if (!res.ok) {
        throw new Error(
          `Failed to load bookings (${res.status} ${res.statusText})`,
        );
      }

      const contentType = res.headers.get("content-type");

      if (!contentType?.includes("application/json")) {
        throw new Error("Invalid response: expected JSON");
      }

      const data = await res.json();

      if (!Array.isArray(data)) {
        throw new Error("Invalid bookings format: expected an array");
      }

      setBookings(data);
    } catch (err) {
      if (err.name === "AbortError") return;

      const message =
        err instanceof Error
          ? err.message
          : "Something went wrong while loading bookings";

      setError(message);
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchBookings(controller.signal);

    return () => controller.abort();
  }, [fetchBookings]);

  return {
    bookings,
    loading,
    error,
    retry: () => {
      const controller = new AbortController();
      fetchBookings(controller.signal);
    },
  };
}
