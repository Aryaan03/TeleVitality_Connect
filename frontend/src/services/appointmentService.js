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

  async cancelAppointment(appointmentId, cancellationReason) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/doctor/appointments/${appointmentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          cancellation_reason: cancellationReason
        })
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

  async updateAppointmentNotes(appointmentId, notes) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/appointment/${appointmentId}/notes`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ notes }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update notes');
      }
  
      return await response.json();
    } catch (error) {
      throw new Error(error.message);
    }
  },

  async getUpcomingAppointmentsCount() {
    try {
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('role');
      console.log('Token present:', !!token);
      console.log('Token value:', token ? token.substring(0, 10) + '...' : 'none');
      console.log('User role:', role);
      
      if (!token) {
        console.error('No token found in localStorage');
        throw new Error('No authentication token found');
      }

      // Use the correct endpoint based on role
      const endpoint = role === "doctor" ? "/doctor/appointments" : "/appointments/history";
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        throw new Error('Failed to fetch appointments');
      }
      
      const appointments = await response.json();
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const nextWeek = new Date(today);
      nextWeek.setDate(today.getDate() + 7);
      
      const upcomingCount = appointments.filter(app => {
        const appDate = new Date(app.appointment_time.date);
        return appDate >= today && 
               appDate <= nextWeek && 
               app.status === 'Scheduled';
      }).length;
      
      console.log('Upcoming appointments count:', upcomingCount);
      return upcomingCount;
    } catch (error) {
      console.error('Error in getUpcomingAppointmentsCount:', error);
      throw new Error(error.message);
    }
  }
};