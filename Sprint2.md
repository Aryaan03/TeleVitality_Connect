# Sprint 2 Report

## Work Completed in Sprint 2

### Backend Development

In this sprint, we focused on implementing and enhancing the backend API to support user and doctor functionalities. Below are the key improvements and additions:

- **User Profile Management:**
  - Implemented APIs for saving and updating user profiles.
  - Added an API to fetch user profile details.

- **Doctor Profile Management:**
  - Implemented APIs for saving and updating doctor profiles.
  - Added an API to fetch doctor profile details.

- **Doctor Authentication and Authorization:**
  - Developed APIs for doctor registration and login.
  - Implemented role-based access control using claims in the JWT token to distinguish between users and doctors.

- **Appointment Management:**
  - Implemented API to retrieve medical specialties.
  - Added API to fetch doctors based on selected specialty.
  - Created API to check doctor availability.
  - Developed an API for booking appointments.
  - Implemented an API to fetch appointment history.

## Backend API Documentation

### User Authentication
- **POST /api/auth/register** - Registers a new user.
- **POST /api/auth/login** - Authenticates a user and returns a JWT token.

### Doctor Authentication
- **POST /api/docregister** - Registers a new doctor.
- **POST /api/doclogin** - Authenticates a doctor and returns a JWT token.

### User Profile
- **GET /api/protected/profile** - Retrieves the logged-in user's profile.
- **POST /api/protected/profile** - Saves or updates the user's profile.

### Doctor Profile
- **GET /api/doctor/profile** - Retrieves the logged-in doctor's profile.
- **POST /api/doctor/profile** - Saves or updates the doctor's profile.

### Appointments
- **GET /api/specialties** - Retrieves available medical specialties.
- **GET /api/doctors/{specialty}** - Fetches doctors based on specialty.
- **GET /api/availability/{doctorId}** - Checks availability for a specific doctor.
- **POST /api/appointments** - Books an appointment.
- **GET /api/appointments/history** - Fetches appointment history for the user.

The backend API now provides a robust foundation for managing user authentication, profiles, and appointment scheduling with role-based access control.

