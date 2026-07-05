import apiClient from "./client";

export function listNotifications() {
  return apiClient.get("/notifications").then((res) => res.data);
}

export function markNotificationRead(id) {
  return apiClient.patch(`/notifications/${id}/read`).then((res) => res.data);
}
