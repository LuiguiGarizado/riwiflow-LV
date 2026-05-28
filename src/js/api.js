const BASE_URL = "http://localhost:3000";

export const ApiService = {
  async login(email, password) {
    const response = await fetch(
      `${BASE_URL}/users?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`,
    );
    const users = await response.json();
    return users.length > 0 ? users[0] : null;
  },

  async getTasks() {
    const response = await fetch(`${BASE_URL}/tasks`);
    return await response.json();
  },

  async getUsers() {
    const response = await fetch(`${BASE_URL}/users`);
    return await response.json();
  },

  async updateTask(id, taskData) {
    const response = await fetch(`${BASE_URL}/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(taskData),
    });
    return response.ok;
  },

  async createTask(taskData) {
    const response = await fetch(`${BASE_URL}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(taskData),
    });
    return response.ok;
  },
};
