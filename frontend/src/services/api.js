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

        const data = await response.json();
        
        // If profile not found, return default empty profile instead of throwing error
        if (response.status === 404) {
          return {
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

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch profile data");
        }

        return data;
      } catch (error) {
        console.error('Error fetching profile:', error);
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
