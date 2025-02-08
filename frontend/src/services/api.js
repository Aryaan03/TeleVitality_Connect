const API_URL = 'http://localhost:8080/api';

export const authService = {
  
  async login(credentials) {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
  
      const data = await response.json(); // Always parse the response as JSON
      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }
  
      return data;
    } catch (error) {
      throw new Error(error.message);
    }
  },
  
  async register(userData) {
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
  
      const data = await response.json(); // Always parse the response as JSON
      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }
  
      return data;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  async resetPassword(resetData) {
    try {
      const response = await fetch(`${API_URL}/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(resetData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Password reset failed");
      }

      return await response.json();
    } catch (error) {
      throw new Error(error.message);
    }
  }
};
