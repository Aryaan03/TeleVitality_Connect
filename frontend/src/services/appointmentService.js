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

  async bookAppointment(formData) {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/appointments`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
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
  },

  async getDoctorAppointments() {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/doctor/appointments`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch doctor appointments');
      }
      return await response.json();
    } catch (error) {
      throw new Error(error.message);
    }
  },

  async cancelAppointment(appointmentId) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/doctor/appointments/${appointmentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to cancel appointment');
      }
      return await response.json();
    } catch (error) {
      throw new Error(error.message);
    }
  },

  async getDoctorAppointmentTimes(doctorId) {
    try {
      const response = await fetch(`${API_URL}/appointmenttime?doctor_id=${doctorId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch appointment times');
      }
      return await response.json();
    } catch (error) {
      throw new Error(error.message);
    }
  },

};