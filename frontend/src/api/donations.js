import apiClient from "./client";

export function listDonations() {
  return apiClient.get("/donations").then((res) => res.data);
}

export function createDonation(payload) {
  return apiClient.post("/donations", payload).then((res) => res.data);
}

export function updateDonation(id, payload) {
  return apiClient.patch(`/donations/${id}`, payload).then((res) => res.data);
}

export function deleteDonation(id) {
  return apiClient.delete(`/donations/${id}`).then((res) => res.data);
}

export function claimDonation(id) {
  return apiClient.post(`/donations/${id}/claim`).then((res) => res.data);
}

export function assignVolunteer(donationId, volunteerId) {
  return apiClient
    .post("/assign-volunteer", { donation_id: donationId, volunteer_id: volunteerId })
    .then((res) => res.data);
}

export function markPickup(id) {
  return apiClient.patch(`/donations/${id}/pickup`).then((res) => res.data);
}

export function markTransit(id) {
  return apiClient.patch(`/donations/${id}/transit`).then((res) => res.data);
}

export function markDelivered(id) {
  return apiClient.patch(`/donations/${id}/deliver`).then((res) => res.data);
}
