import { apiClient } from "./client";

export const conferencesApi = {
  async getAll() {
    const response = await apiClient.get("/conferences");
    return response.data ?? [];
  },

  async getById(id) {
    const response = await apiClient.get(`/conference/${id}`);
    return response.data ?? null;
  },

  async create(conference) {
    const response = await apiClient.post("/conference", conference);
    return response.data;
  },

  async update(id, conference) {
    const response = await apiClient.patch(
      `/conference/${encodeURIComponent(id)}`,
      conference,
    );
    return response.data;
  },

  async remove(id) {
    const response = await apiClient.delete(
      `/conference/${encodeURIComponent(id)}`,
    );
    return response.data;
  },
};
