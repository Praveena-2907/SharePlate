import apiClient from "./client";

export function getMyAnalytics() {
  return apiClient.get("/analytics/me").then((res) => res.data);
}
