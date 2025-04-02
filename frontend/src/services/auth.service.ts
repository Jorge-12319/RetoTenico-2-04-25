import axios from "axios";

const API_URL = "http://localhost:8080/api/auth/";

class AuthService {
  async login(username: string, password: string) {
    try {
      const response = await axios.post(`${API_URL}signin`, {
        username,
        password,
      });

      if (response.data.accessToken) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }

      return response.data;
    } catch (error: any) {
      console.error("Error during login:", error);
      throw error; // Lanzar el error para manejarlo en la parte del cliente
    }
  }

  logout() {
    localStorage.removeItem("user");
  }

  async register(username: string, email: string, password: string) {
    try {
      const response = await axios.post(`${API_URL}signup`, {
        username,
        email,
        password,
      });

      return response.data;
    } catch (error: any) {
      console.error("Error during registration:", error);
      throw error; // Lanzar el error para manejarlo en la parte del cliente
    }
  }

  getCurrentUser() {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  }
}

export default new AuthService();
