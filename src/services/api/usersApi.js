import { apiClient } from "./client";

export const usersApi = {
  async login(id, password) {
    const response = await apiClient.post("/login", { id, password });
    return response.data;
  },

  async signup(id, password) {
    const response = await apiClient.post("/signup", { id, password });
    return response.data;
  },

  async isAdmin() {
    const response = await apiClient.get("/isadmin");
    return Boolean(response.data?.isAdmin);
  },

  async getAll() {
    const response = await apiClient.get("/users");
    return response.data ?? [];
  },

  async promoteToAdmin(id) {
    const response = await apiClient.patch(
      `/usertype/${encodeURIComponent(id)}`,
      {
        newType: "admin",
      },
    );
    return response.data;
  },

  async deleteUser(id) {
    const response = await apiClient.delete(`/user/${encodeURIComponent(id)}`);
    return response.data;
  },
};
