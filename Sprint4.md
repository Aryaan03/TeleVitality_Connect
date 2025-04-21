# Sprint4.md

## 1. Work Completed

### **Backend**

- **Password Reset & Email Verification**
  - Integrated Twilio SendGrid for secure password reset via email verification codes.
  - Implemented endpoints for sending, verifying, and consuming password reset codes, with JWT-based reset tokens for enhanced security.
  - Added code expiry and single-use logic to prevent replay attacks.

- **Appointment and Profile Enhancements**
  - Ensured all appointment endpoints return an empty array instead of `null`, fixing blank page issues in the frontend.

- **Timezone and Security Fixes**
  - Standardized all timestamps to UTC for reliable expiry and scheduling.
  - Enhanced input validation and error responses across all endpoints.

- **Email Notification on Appointment Booking**
  - Implemented in BookAppointment backend route.
  - Uses SendGrid API to email the patient details of their confirmed appointment.
  - Triggered automatically after a successful booking.
---

### **Frontend**

- **Forgot Password Flow**
  - Complete UI for “Forgot Password” with stepwise email, code verification, and password reset.
  - Integrated with new backend endpoints for send code, verify code, and password reset.
  - Improved error and success feedback for all steps, including parsing backend error messages for user-friendly alerts.

- **Testing & Quality**
  - Added/updated Cypress end-to-end tests for password reset, appointment management, and doctor profile flows.
  - Expanded React Testing Library unit tests for new and updated components.
  - Refactored test structure for maintainability and coverage.

- **General UI/UX**
  - **Consistent Styling** – Uniform shadows, borders, and rounded corners.
  - **Interactive Hover States** – Buttons/cards with smooth animations.
  - **Icon Integration** – Relevant icons for better visual cues.
  - **Focus Indicators** – Glow/highlight for active form fields.
  - **Gradient Accents** – Buttons/headers with subtle gradients.
  - **Responsive Typography** – Font sizes that adapt to screen size.
  - **Micro-Interactions** – Small animations (e.g., hover, focus).
  - **Clear Visual Hierarchy** – Bold headings with divider accents.
  - **Accessible Contrast** – Readable text and color choices.
  - Improved loading states, error alerts, and empty state messaging.
  - Enhanced accessibility and responsive design across all main pages.

---

## 2. Backend Unit Tests

### **Appointment Tests (`appointment_test.go`)**
- **`TestUpdateAppointmentNotes`**
  - Validates the endpoint for updating doctor notes after an appointment.
  - **Success Case:**
    - Updates appointment notes for the given ID.
    - Confirms update via HTTP 200 and expected response body.
    - Verifies mock expectations, including correct query execution and parameter matching.
  - **Edge Cases:**
    - Invalid appointment ID in URL.
    - Empty or malformed request body.
    - Missing notes field.

- **TestBookAppointment_InvalidToken**
  - Ensures proper handling of authentication failures:
    - Rejects malformed/missing JWT tokens
    - Validates token signature and expiration

- **TestBookAppointment_NonMultipartForm**
  - Tests error handling for invalid form submissions:
    - Detects non-multipart form data
    - Validates Content-Type header requirements

- **TestBookAppointment_InvalidDoctorID**
  - Verifies input validation:
    - Rejects non-numeric doctor IDs
    - Handles missing doctor ID field

- **TestBookAppointment_InvalidAppointmentTime**
  - Tests JSON parsing robustness:
    - Catches malformed JSON in time field
    - Validates required time format

### **Auth Tests (`auth_test.go`)**
- **`TestSendResetCode`**
  - Tests the password reset code sending logic:
  - **Success:**
    - Mocks DB insert into `password_reset_codes`.
    - Returns success response if the insert succeeds.
  - **DatabaseError:**
    - Simulates DB failure and expects HTTP 500 with error message.
  - **InvalidRequest:**
    - Ensures malformed JSON is rejected with HTTP 400.

- **`TestVerifyResetCode`** 
  - Covers email-based reset code verification:
  - **Success:**
    - Validates code and expiry time.
    - Deletes code post-verification.
    - Returns a reset token upon success.
  - **ExpiredCode:**
    - Rejects expired reset codes with HTTP 401.
  - **InvalidCode:**
    - Handles mismatched code inputs (even if email is valid).
  - **NoCodeFound:**
    - Returns appropriate error if no code is associated with the email.

- **`TestResetPassword`** 
  - Tests the flow for resetting the user's password using a valid token:
  - **Success:**
    - Updates hashed password in the database.
    - Confirms with HTTP 200 and success message.
  - **InvalidToken:**
    - Handles malformed or expired reset tokens, rejecting with HTTP 401.
  - **MalformedBody / MissingFields:**
    - Ensures that bad request bodies or missing fields are rejected.

- **TestResetPasswordDoctor**
  - **Success case:** 
    - Specific test for doctor password updates.
  - **Failure cases:** 
    - Mirrors patient password reset failures.

---

## 3. Frontend Unit & Cypress Tests

## **FrontEnd E2E Testing**

### Overview
In Sprint 4, Unit tests and Cypress E2E testing was used as the primary testing framework to ensure the quality and functionality of various features in the application. Cypress's ability to perform end-to-end, integration, and unit testing directly in the browser made it an ideal choice for validating user workflows and application behavior.

### Why Cypress?
Cypress was chosen for its unique features and benefits:

- **Real-Time Reloads:** Automatically reruns tests upon saving, speeding up development.
- **Automatic Waiting:** Eliminates the need for explicit waits by waiting for DOM elements, animations, and AJAX calls to complete.
- **Ease of Debugging:** Provides detailed logs and snapshots for debugging failed tests.
- **Cross-Browser Testing:** Supports testing across multiple browsers like Chrome, Firefox, and Edge.
- **All-in-One Framework:** Combines test writing, execution, and debugging in a single tool.

### Unit Tests Added 

- `DoctorProfilePage.test.jsx`: Tested all form fields and API interactions
- `ProfilePage.test.jsx`: Smoke tested rendering and error handling
- `HomePage.test.jsx`: Validated hero section, navigation links, and footer


### **Cypress E2E Tests**

- `navigation.cy.js`: Navigation links like Home, Features, Pricing
- `loginRedirect.cy.js`: Redirect unauthenticated users from `/profile` to `/login`
- `patientRegisterModal.cy.js`: Open patient register modal from home page
- `forgotPassword.cy.js`: Flow for sending verification code
- `Patient_Login.cy.js`: Tested login and forgot password modal interaction
- `homePage.cy.js`: Validated hero section, pricing, features, testimonials

---

## 4. Updated Backend API Documentation

### **POST /api/appointments/book – Book Appointment & Send Confirmation Email**
- Books an appointment by accepting a JSON payload with doctorId, appointmentTime, and other optional fields.
- After a successful booking, a confirmation email is automatically sent to the patient via SendGrid.
The email includes:
  - Patient’s first name
  - Doctor’s full name
  - Appointment date and time
  - Virtual meeting link

### **Password Reset Endpoints**
- **POST `/api/auth/send-reset-code`**
  - **Body:** `{ "email": "user@example.com" }`
  - **Response:** `{ "message": "Code sent" }`
  - **Errors:** 400 (invalid), 500 (server)

- **POST `/api/auth/verify-reset-code`**
  - **Body:** `{ "email": "user@example.com", "code": "123456" }`
  - **Response:** `{ "reset_token": "jwt-reset-token" }`
  - **Errors:** 401 (invalid/expired), 500

- **POST `/api/auth/reset-password`**
  - **Body:** `{ "reset_token": "jwt-reset-token", "new_password": "..." }`
  - **Response:** `{ "message": "Password updated successfully" }`
  - **Errors:** 401 (invalid token), 500

- **POST `/api/auth/doc-reset-password`**
  - **Body:** `{ "reset_token": "jwt-reset-token", "new_password": "..." }`
  - **Response:** `{ "message": "Password updated successfully" }`
  - **Errors:** 401 (invalid token), 500

### **General**
- All endpoints require a JWT token in the Authorization header.
- Error responses are standardized as `{ "error": "..." }`.
- All times are in UTC.
