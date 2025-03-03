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

### Frontend Development

## **Features Implemented in This Sprint**

### **Doctor Pages**
- **Doctor Register Page**: Doctors can register with their details.
- **Doctor Login Page**: Secure login functionality for doctors.
- **Doctor Profile Page**:
  - Added fields for specialties and availability schedules.
  - Viewing and editing profiles are now separated for better usability.
  - Doctors can update their availability slots.
  - Enhanced profile display with a visually improved layout.

### **Patient Pages**
- **Appointments Page**:
  - Patients can view their appointment history.
  - Updated appointment slots functionality for scheduling.
- **Profile Page**:
  - Enhanced profile display with sections for personal, medical, and insurance details.
  - Viewing and editing profiles are now separated.

### **Home Page**
- Improved visual design with better navigation and layout.

### **General Enhancements**
- Added specialty and availability schedules to doctor profiles.
- Enhanced navigation across various pages.

### **Testing**
- Cypress (for end-to-end testing)

---

## **Cypress Test Cases**

### Pages Covered:
1. Doctor Profile Page
2. Home Page
3. Contact Page
4. Forgot Password Page

Test cases include:
- Verifying page rendering.
- Validating required fields in forms.
- Mocking API responses for success and failure scenarios.
- Checking navigation and redirection.

---

## **How to Run Cypress Tests**

1. Start the development server:
    
    npm run dev
    

2. Open Cypress Test Runner:
    
    npx cypress open
    

3. Select "E2E Testing" and choose a browser.

4. Run test files such as:
    - `doctorProfile.cy.js`
    - `homePage.cy.js`
    - `contact.cy.js`
    - `forgotPassword.cy.js`

---

## **Key Highlights of This Sprint**

1. Added pages for doctor registration, login, profile management, and availability scheduling.
2. Enhanced patient appointment functionality with history tracking and slot updates.
3. Improved visual design of the Home Page and navigation across the platform.
4. Added basic Cypress test cases for key pages like Doctor Profile, Home Page, Contact Page, and Forgot Password.

---

## **Future Enhancements**

1. Add more comprehensive Cypress tests for other pages like Dashboard and Appointment Management.

