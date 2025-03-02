const API_URL = 'http://localhost:8080/api';

export const appointmentService = {
  async getSpecialties() {
    try {
      const response = await fetch(`${API_URL}/specialties`);
      if (!response.ok) {
        throw new Error('Failed to fetch specialties');
      }
      return await response.json();
    } catch (error) {
      throw new Error(error.message);
    }
  },

  async getDoctorsBySpecialty(specialtyId) {
    try {
      const response = await fetch(`${API_URL}/doctors?specialty=${specialtyId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch doctors');
      }
      return await response.json();
    } catch (error) {
      throw new Error(error.message);
    }
  },

  async getDoctorAvailability(doctorId) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/doctor/availability?doctor=${doctorId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch availability');
      }
      return await response.json();
    } catch (error) {
      throw new Error(error.message);
    }
  },

  async bookAppointment(appointmentData) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/appointments`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(appointmentData)
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to book appointment');
      }
      return await response.json();
    } catch (error) {
      throw new Error(error.message);
    }
  },
  async getAppointmentHistory() {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/appointments/history`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch appointment history');
      }
      return await response.json();
    } catch (error) {
      throw new Error(error.message);
    }
  }
};