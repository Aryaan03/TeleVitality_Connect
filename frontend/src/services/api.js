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

  async doclogin(credentials) {
    try {
      const response = await fetch(`${API_URL}/doclogin`, {  
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

  async docregister(userData) {
    try {
      const response = await fetch(`${API_URL}/docregister`, {
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
        if(response.status === 404) {
          throw new Error("User not found");
        }
        throw new Error("Password reset failed");
      }
      return await response.json();
    } catch (error) {
      throw new Error(error.message);
    }
  },

  async getProfile() {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('User not authenticated');

      const response = await fetch(`${API_URL}/protected/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      // Handle 404 by returning empty profile with ID field
      if (response.status === 404) {
        return {
          id: '',
          firstName: '',
          lastName: '',
          email: '',
          dateOfBirth: '',
          gender: '',
          phoneNumber: '',
          address: '',
          problemDescription: '',
          emergencyAppointment: 'no',
          previousPatientId: '',
          preferredCommunication: 'email',
          preferredDoctor: 'drSmith',
          insuranceProvider: '',
          insurancePolicyNumber: '',
          consentTelemedicine: false,
        };
      }

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch profile data");
      }

      return data;
    } catch (error) {
      console.error('Profile fetch error:', error);
      throw new Error(error.message);
    }
  },

  async updateProfile(values) {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('User not authenticated');

      const response = await fetch(`${API_URL}/protected/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to update profile");
      }

      return data;
    } catch (error) {
      console.error('Profile update error:', error);
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
  },
  async getDoctorProfile() {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('User not authenticated');

      const response = await fetch(`${API_URL}/doctor/profile`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch profile data');
      }

      return data;
    } catch (error) {
      console.error('Profile fetch error:', error);
      throw new Error(error.message);
    }
  },

  async updateDoctorProfile(values) {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('User not authenticated');

      const response = await fetch(`${API_URL}/doctor/profile`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }

      return data;
    } catch (error) {
      console.error('Profile update error:', error);
      throw new Error(error.message);
    }
  },
  async forgotPassword({ email }) {
    const response = await fetch(`${API_URL}/send-code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    if (!response.ok) throw new Error(await response.text());
    return response.json();
  },

  async verifyResetCode({ email, code }) {
    const response = await fetch(`${API_URL}/verify-code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code }),
    });
    if (!response.ok) throw new Error(await response.text());
    return response.json();
  },

  async resetPassword({ reset_token, new_password }) {
    const response = await fetch(`${API_URL}/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reset_token, new_password }),
    });
    if (!response.ok) throw new Error(await response.text());
    return response.json();
  },

  async resetPasswordDoc({ reset_token, new_password }) {
    const response = await fetch(`${API_URL}/doc-reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reset_token, new_password }),
    });
    if (!response.ok) throw new Error(await response.text());
    return response.json();
  }
};