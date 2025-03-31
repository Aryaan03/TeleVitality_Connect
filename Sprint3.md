# Sprint 3 Report

## 1. Work Completed

### **Backend**
#### **Video Consultation System**
- Integrated Jitsi Meet for video consultations.
- Implemented unique meet link generation for each appointment.
- Developed endpoints for booking appointments, supporting file uploads (e.g., medical reports).
- Automated appointment status updates (e.g., Scheduled → Completed).

#### **Doctor Notes System**
- Added functionality for doctors to add or update notes post-appointment.
- Developed secure endpoints for retrieving and updating notes.
- Implemented authorization checks to ensure only authorized doctors can modify notes.

#### **Appointment Management**
- Created endpoints to fetch doctor availability and upcoming appointments.
- Added functionality to cancel appointments with a reason.

#### **Security Enhancements**
- Implemented JWT-based authentication for all endpoints.
- Added role-based access control (e.g., distinguishing between doctor and patient roles).
- Enhanced error handling and logging for secure and robust API behavior.

---

## 2. Backend Unit Tests

### **Appointment Tests (`appointment_test.go`)**
- **`TestBookAppointment`**
  - Validates appointment booking with file attachments, Jitsi Meet link generation, and database insertion.
  - **Success case:** 200 OK with meet link.
  - **Failure cases:** Invalid time format, missing doctor ID, file size validation.

- **`TestCancelAppointment_Success`**
  - Ensures proper cancellation flow with:
    - Ownership verification (doctor-patient relationship).
    - Status update to "Cancelled".
    - Reason persistence in the database.

- **`TestGetDoctorAppointments`**
  - Tests retrieval of doctor's schedule:
    - Automatic status updates (Scheduled → Completed).
    - Patient profile joins.
    - File attachment handling.
    - Priority sorting by appointment time.

- **`TestGetAppointmentHistory`**
  - Validates patient history retrieval:
    - Multi-table joins (appointments + doctors + files).
    - Base64 file encoding.
    - JSON time parsing.
    - Status-based ordering.

### **Profile Tests (`profile_test.go`)**
- **`TestUpdateProfile_MissingRequiredFields`** - Validates mandatory profile fields (Phone, Address, Insurance Info).
- **`TestGetProfile_DatabaseScanError`** - Simulates connection failures during profile retrieval.

### **Doctor Profile Tests (`doctor_profile_test.go`)**
- **`TestGetDoctorProfile_NotFound`** - Handles cases where no doctor profile is found, ensuring proper response handling.
- **`TestGetDoctorProfile_DatabaseError`** - Simulates connection failures during profile retrieval.
- **`TestGetDoctorProfile_InvalidToken`** - Rejects unauthorized requests with malformed JWT tokens.
- **`TestUpdateDoctorProfile_InvalidToken`** - Validates token signature checking for profile updates.
- **`TestUpdateDoctorProfile_InvalidRequestBod`** - Blocks invalid JSON format in update requests.
- **`TestUpdateDoctorProfile_DatabaseError`** - Simulates failures when saving profile data to the database.
- **`TestUpdateDoctorProfile_MissingRequiredFields`** - Ensures that required fields must be provided when updating a profile.
- **`TestUpdateDoctorProfile`** 
- Includes sub-tests for:
- Invalid token handling
- Malformed request body rejection
- Database error simulation

### **Error Handling & Edge Cases**
- **`TestCancelAppointment_InvalidID`** - Rejects non-integer appointment IDs (400 Bad Request).
- **`TestGetAppointmentHistory_DatabaseError`** - Handles SQL connection failures.
- **`TestBookAppointment_DatabaseError`** - Simulates failed database inserts during booking.
- **`TestCancelAppointment_Unauthorized`** - Blocks unauthorized users from cancellations.
- **`TestGetDoctorAvailability_Error`** - Handles invalid doctor ID formats and DB failures.

### **Security Tests**
- **`TestGetAppointmentHistory_InvalidToken`** - Rejects requests with malformed JWT tokens.
- **`TestCancelAppointment_InvalidToken`** - Validates token signature checking.
- **`TestDoctorLogin_RoleVerification`** - Ensures role claims match doctor database records.

### **Validation Tests**
- **`TestUpdateAppointmentNotes_Empty`** - Blocks empty note submissions.
- **`TestBookAppointment_InvalidDate`** - Rejects dates in incorrect ISO format.
- **`TestGetDoctorsBySpecialty_InvalidID`** - Handles non-existent specialty IDs.

---

#### How to Run Tests

To run the unit tests, follow these steps:

1.  **Navigate to the Backend Directory:** Open your terminal and navigate to the `/backend` directory of the project.
    ```bash
    cd backend
    ```
2.  **Run the Tests:** Execute the following command to run all tests within the `handlers` package:
    ```bash
    go test -v ./handlers
    ```

    This command will execute all files ending with `_test.go` in the `handlers` package, providing detailed output of the test results. Make sure your database configurations are properly set up before running tests.

---

## 3. Updated Backend API Documentation

### **Endpoint: Book Appointment**
- **Method:** `POST`
- **URL:** `/api/appointments`
- **Headers:**
```json
{
    "Authorization": "Bearer jwt-token-string"
}
```
- **Request Body (Multipart Form Data):**
  - `doctorId`: Doctor's ID (integer as string).
  - `problem`: Patient's issue (string).
  - `appointmentTime`: JSON object (`{"date": "2025-04-01", "time": "14:30"}`).
  - `files`: File uploads (optional).

- **Response:**
```json
{
    "message": "Appointment booked successfully",
    "meet_link": "https://meet.jit.si/unique-room-name"
}
```
- **Errors:**
  - `400`: Invalid form data.
  - `401`: Unauthorized access.
  - `500`: Internal server error.

### **Endpoint: Update Appointment Notes**
- **Method:** `PUT`
- **URL:** `/api/appointments/{id}/notes`
- **Headers:**
```json
{
    "Authorization": "Bearer jwt-token-string"
}
```
- **Request Body:**
```json
{
    "notes": "Patient showed improvement in symptoms."
}
```
- **Response:**
```json
{
    "message": "Notes updated successfully"
}
```
- **Errors:**
  - `400`: Invalid request body.
  - `403`: Unauthorized access.
  - `404`: Appointment not found.
  - `500`: Internal server error.

### **Endpoint: Get Doctor Availability**
- **Method:** `GET`
- **URL:** `/api/availability?doctor={doctor_id}`
- **Headers:**
```json
{
    "Authorization": "Bearer jwt-token-string"
}
```
- **Response:**
```json
{
    "Monday": ["09:00-12:00", "13:00-17:00"],
    "Tuesday": ["09:00-12:00"],
    ...
}
```
- **Errors:**
  - `400`: Missing or invalid doctor ID.
  - `500`: Internal server error.

### **Additional Notes:**
1. **Authentication Requirements:**
   - All endpoints require a valid JWT token.
   - Tokens are role-specific (e.g., doctor, patient).

2. **File Handling:**
   - Max file size: 10MB.
   - Supported formats: PDF, JPG, PNG, TXT.

3. **Rate Limiting:**
   - Max 10 requests per minute per user.

4. **Error Logging:**
   - Detailed logs generated for failures, including database errors and invalid inputs.


## Frontend Development

### **Updated UI and Visual features in This Sprint**

#### **Doctor Pages**
- **Doctor Register Page**: 
- **Doctor Login Page**: 
- **Doctor Profile Page**:
  

#### **Patient Pages**
- **Appointments Page**: 
- **Profile Page**:


#### **Home Page**
- Improved visual design with better navigation and layout.
  
#### **General Enhancements**
- Enhanced navigation across various pages.
---

## **Testing**

### Cypress End-to-End Tests (Frontend)

**Pages Covered:**
1. Contact Page
2. Doctor Authentication (Login/Register)
3. Doctor Profile
4. Forgot Password
5. Patient Authentication (Login/Register)
6. Home Page

---

**Detailed Test Cases:**


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
    - `Login_Doctor.cy.js`
    - `Register_Patient.cy.js`

---

### **Unit Tests (Frontend)**

We've implemented comprehensive unit tests for critical authentication components using React Testing Library. These tests validate component rendering, user interactions, and form validation.

#### Tested Components:
1. **Login Page**
2. **Patient Registration Page**

---

### **How to Run Frontend Unit Tests**

1. **Install dependencies** (if not already installed):<br>
   ```bash
   npm install
   
2. **Run all tests**:<br>
   ```bash
   npm test


