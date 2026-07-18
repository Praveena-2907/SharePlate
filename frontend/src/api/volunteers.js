import apiClient from "./client";

export function listAvailableVolunteers() {
  return apiClient.get("/volunteers/available").then((res) => res.data);
}

export function getMyVolunteerAvailability() {
  return apiClient.get("/volunteers/me").then((res) => res.data);
}

export function updateMyVolunteerAvailability(isAvailable) {
  return apiClient
    .patch("/volunteers/me/availability", { is_available: isAvailable })
    .then((res) => res.data);
}