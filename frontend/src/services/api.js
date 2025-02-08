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
      
      const data = await response.json();
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

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      return data;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  async resetPassword(email, newPassword) {
    try {
      const response = await fetch(`${API_URL}/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, newPassword }),
      });

      
      if (!response.ok) {
        if(response.status == 404){
          throw new Error("User not found")
        }
        else{
          throw new Error("Password reset failed");
        }
      }
      else{
        const data = await response.json();
        return data;
      }

    } catch (error) {
      throw new Error(error.message);
    }
  },

  async getProtectedData(token) {
    try {
      const response = await fetch(`${API_URL}/protected/dashboard`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch protected data");
      }

      return data;
    } catch (error) {
      throw new Error(error.message);
    }
  }
};
