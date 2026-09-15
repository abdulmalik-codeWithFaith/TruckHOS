import axios from "axios";
import type { TripPlanResponse, TripRequest, ApiError } from "../types/trip";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // route/geocoding calls can take a few seconds
});

/**
 * Calls POST /api/trips/plan/. On failure, throws an ApiError with a
 * user-friendly message extracted from the backend's response shape
 * ({ message, field? } or DRF's { message, errors }), falling back to a
 * generic message for anything unexpected (network failure, etc.).
 */
export async function planTrip(request: TripRequest): Promise<TripPlanResponse> {
  try {
    const response = await client.post<TripPlanResponse>("/api/trips/plan/", request);
    return response.data;
  } catch (err) {
    throw toApiError(err);
  }
}

function toApiError(err: unknown): ApiError {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as { message?: string; field?: string; errors?: Record<string, string[]> } | undefined;

    if (data?.message) {
      return { message: data.message, field: data.field };
    }

    if (data?.errors) {
      const firstField = Object.keys(data.errors)[0];
      const firstMessage = data.errors[firstField]?.[0];
      if (firstMessage) {
        return { message: firstMessage, field: firstField };
      }
    }

    if (err.code === "ECONNABORTED") {
      return { message: "The request took too long. Please try again." };
    }

    if (!err.response) {
      return { message: "Couldn't reach the server. Please check your connection and try again." };
    }
  }

  return { message: "Something went wrong while planning your trip. Please try again." };
}