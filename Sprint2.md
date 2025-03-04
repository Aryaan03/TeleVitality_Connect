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
  - Developed an API for booking appointments, including support for file uploads.
  - Implemented an API to fetch appointment history for patients.
  - Implemented an API to fetch appointments for doctors.
  - Developed an API to allow doctors to cancel appointments.
  - Implemented an API to fetch appointment history for patients.

# Backend API Documentation

#### User Authentication

*   **POST /api/register** - Registers a new user.
*   **POST /api/login** - Authenticates a user and returns a JWT token.
*   **POST /api/reset-password** - Resets user password.

#### Doctor Authentication

*   **POST /api/docregister** - Registers a new doctor.
*   **POST /api/doclogin** - Authenticates a doctor and returns a JWT token.

#### User Profile

*   **GET /api/protected/dashboard** - Retrieves content for the user dashboard (protected route).
*   **GET /api/protected/profile** - Retrieves the logged-in user's profile.
*   **PUT /api/protected/profile** - Saves or updates the user's profile.

#### Doctor Profile

*   **GET /api/doctor/profile** - Retrieves the logged-in doctor's profile.
*   **PUT /api/doctor/profile** - Saves or updates the doctor's profile.

#### Appointments

*   **GET /api/specialties** - Retrieves available medical specialties.
*   **GET /api/doctors?specialty={specialty_id}** - Fetches doctors based on specialty (specify specialty ID as a query parameter).
*   **GET /api/doctor/availability?doctor={doctor_id}** - Checks availability for a specific doctor (specify doctor ID as a query parameter).
*   **POST /api/appointments** - Books an appointment (requires patient JWT).
*   **GET /api/appointments/history** - Fetches appointment history for the patient (requires patient JWT).
*   **GET /api/doctor/appointments** - Fetches appointments for the logged-in doctor (requires doctor JWT).
*   **DELETE /api/doctor/appointments/{id}** - Cancels a specific appointment (requires doctor JWT and appointment ID).



# Detailed API Documentation

## Authentication Endpoints

### 1. User Registration

**Endpoint:** `/register` **Method:** `POST` **Description:** Registers a new user.

#### Request Body:

```json
{
  "username": "exampleUser",
  "email": "user@example.com",
  "password": "securepassword"
}
```

#### Response:

**Success (201 Created):**

```json
{
  "message": "User created successfully"
}
```

**Error (409 Conflict - Username or Email already exists):**

```json
{
  "error": "Username already exists"
}
```

---

### 2. User Login

**Endpoint:** `/login` **Method:** `POST` **Description:** Authenticates a user and returns a JWT token.

#### Request Body:

```json
{
  "username": "exampleUser",
  "password": "securepassword"
}
```

#### Response:

**Success (200 OK):**

```json
{
  "message": "Login successful",
  "token": "jwt-token-string"
}
```

**Error (401 Unauthorized - Invalid credentials):**

```json
{
  "error": "Invalid username or password"
}
```

---

### 3. Protected Dashboard

**Endpoint:** `/dashboard` **Method:** `GET` **Description:** Retrieves user-specific information from a protected route.

#### Headers:

```json
{
  "Authorization": "Bearer jwt-token-string"
}
```

#### Response:

**Success (200 OK):**

```json
{
  "username": "exampleUser",
  "user_id": 1,
  "message": "Welcome to the protected dashboard"
}
```

**Error (401 Unauthorized - Invalid or Missing Token):**

```json
{
  "error": "Invalid token"
}
```

---

### 4. Doctor Registration

**Endpoint:** `/doctor/register` **Method:** `POST` **Description:** Registers a new doctor.

#### Request Body:

```json
{
  "username": "DrExample",
  "email": "doctor@example.com",
  "password": "securepassword"
}
```

#### Response:

**Success (201 Created):**

```json
{
  "message": "Doctor registered successfully"
}
```

**Error (409 Conflict - Username or Email already exists):**

```json
{
  "error": "Username already exists"
}
```

---

### 5. Doctor Login

**Endpoint:** `/doctor/login` **Method:** `POST` **Description:** Authenticates a doctor and returns a JWT token.

#### Request Body:

```json
{
  "username": "DrExample",
  "password": "securepassword"
}
```

#### Response:

**Success (200 OK):**

```json
{
  "message": "Login successful",
  "token": "jwt-token-string"
}
```

**Error (401 Unauthorized - Invalid credentials):**

```json
{
  "error": "Invalid username or password"
}
```

## Profile Endpoints

### 1. Get User Profile

* **Endpoint:** `/profile`
* **Method:** `GET`
* **Description:** Retrieves the user's profile information.

#### Headers:

```json
{
"Authorization": "Bearer jwt-token-string"
}
```


#### Response:

**Success (200 OK):**

```json
{
"UserID": 123,
"FirstName": "John",
"LastName": "Doe",
"DateOfBirth": "1990-01-01",
"Gender": "Male",
"PhoneNumber": "123-456-7890",
"Address": "123 Main St",
"ProblemDescription": "Example problem",
"EmergencyAppointment": "yes",
"PreferredCommunication": "email",
"PreferredDoctor": "drSmith",
"InsuranceProvider": "Example Insurance",
"InsurancePolicyNumber": "Policy123",
"ConsentTelemedicine": true
}
```

**Success (200 OK - No Profile Exists):** Returns a default profile.

```json
{
"UserID": 123,
"FirstName": "",
"LastName": "",
"DateOfBirth": "",
"Gender": "",
"PhoneNumber": "",
"Address": "",
"ProblemDescription": "",
"EmergencyAppointment": "no",
"PreferredCommunication": "email",
"PreferredDoctor": "drSmith",
"InsuranceProvider": "",
"InsurancePolicyNumber": "",
"ConsentTelemedicine": false
}
```

**Error (401 Unauthorized - Invalid or Missing Token):**

```json
{
"error": "Invalid token"
}
```

**Error (500 Internal Server Error):**

```json
{
"error": "Failed to fetch profile data"
}
```


---

### 2. Update User Profile

* **Endpoint:** `/profile`
* **Method:** `POST`  (Using POST for updating since it's sending data)
* **Description:** Updates the user's profile information. If a profile doesn't exist for the user, it creates one.

#### Headers:

```json
{
"Authorization": "Bearer jwt-token-string"
}
```


#### Request Body:

```json
{
"FirstName": "John",
"LastName": "Doe",
"DateOfBirth": "1990-01-01",
"Gender": "Male",
"PhoneNumber": "123-456-7890",
"Address": "123 Main St",
"ProblemDescription": "Updated problem description",
"EmergencyAppointment": "yes",
"PreferredCommunication": "phone",
"PreferredDoctor": "drJones",
"InsuranceProvider": "Updated Insurance",
"InsurancePolicyNumber": "UpdatedPolicy123",
"ConsentTelemedicine": true
}
```


#### Response:

**Success (200 OK):**

```json
{
"message": "Profile updated successfully"
}
```

**Error (400 Bad Request - Invalid request body):**

```json
{
"error": "Invalid request body"
}
```

**Error (401 Unauthorized - Invalid or Missing Token):**

```json
{
"error": "Invalid token"
}
```

**Error (500 Internal Server Error):**

```json
{
"error": "Failed to update profile"
}
```


---

## API Documentation - Doctor Profile Endpoints

### Base URL

Assuming your base URL is `http://yourdomain.com/api`, these endpoints would be relative to that.

### 1. Get Doctor Profile

* **Endpoint:** `/doctor/profile`
* **Method:** `GET`
* **Description:** Retrieves the doctor's profile information.

#### Headers:

```json
{
"Authorization": "Bearer jwt-token-string"
}
```


#### Response:

**Success (200 OK):**

```json
{
"UserID": 456,
"FirstName": "Jane",
"LastName": "Smith",
"DateOfBirth": "1985-05-05",
"Gender": "Female",
"PhoneNumber": "456-789-0123",
"MedicalLicenseNumber": "MD12345",
"IssuingMedicalBoard": "California Medical Board",
"LicenseExpiryDate": "2025-12-31",
"Specialization": "Cardiology",
"YearsOfExperience": 10,
"HospitalName": "General Hospital",
"WorkAddress": "456 Oak St",
"ConsultationType": "In-person",
"Availability": {
"Monday": ["09:00-12:00", "13:00-17:00"],
"Tuesday": ["09:00-12:00"],
"Wednesday": [],
"Thursday": ["13:00-17:00"],
"Friday": ["09:00-12:00", "13:00-17:00"],
"Saturday": [],
"Sunday": []
}
}
```

**Success (200 OK - No Profile Exists):** Returns a default profile.

```json
{
"UserID": 456,
"FirstName": "",
"LastName": "",
"DateOfBirth": "",
"Gender": "",
"PhoneNumber": "",
"MedicalLicenseNumber": "",
"IssuingMedicalBoard": "",
"LicenseExpiryDate": "",
"Specialization": "",
"YearsOfExperience": 0,
"HospitalName": "",
"WorkAddress": "",
"ConsultationType": "In-person",
"Availability": null
}
```

**Error (401 Unauthorized - Invalid or Missing Token):**

```json
{
"error": "Invalid token"
}
```

**Error (500 Internal Server Error):**

```json
{
"error": "Failed to fetch profile data"
}
```


---

### 2. Update Doctor Profile

* **Endpoint:** `/doctor/profile`
* **Method:** `POST`  (Using POST for updating since it's sending data)
* **Description:** Updates the doctor's profile information. If a profile doesn't exist for the doctor, it creates one.

#### Headers:

```json
{
"Authorization": "Bearer jwt-token-string"
}
```


#### Request Body:

```json
{
"FirstName": "Jane",
"LastName": "Smith",
"DateOfBirth": "1985-05-05",
"Gender": "Female",
"PhoneNumber": "456-789-0123",
"MedicalLicenseNumber": "MD12345",
"IssuingMedicalBoard": "California Medical Board",
"LicenseExpiryDate": "2025-12-31",
"Specialization": "Cardiology",
"YearsOfExperience": 10,
"HospitalName": "General Hospital",
"WorkAddress": "456 Oak St",
"ConsultationType": "In-person",
"Availability": {
"Monday": ["09:00-12:00", "13:00-17:00"],
"Tuesday": ["09:00-12:00"],
"Wednesday": [],
"Thursday": ["13:00-17:00"],
"Friday": ["09:00-12:00", "13:00-17:00"],
"Saturday": [],
"Sunday": []
}
}
```


#### Response:

**Success (200 OK):**

```json
{
"message": "Profile updated successfully"
}
```

**Error (400 Bad Request - Invalid request body):**

```json
{
"error": "Invalid request body"
}
```

**Error (401 Unauthorized - Invalid or Missing Token):**

```json
{
"error": "Invalid token"
}
```

**Error (500 Internal Server Error):**

```json
{
"error": "Failed to update profile"
}
```

## Appointment Endpoints

### 1. Get Specialties

*   **Endpoint:** `/specialties`
*   **Method:** `GET`
*   **Description:** Retrieves a list of available medical specialties.

    #### Response:

    **Success (200 OK):**

    ```json
    [
    {
    "ID": 1,
    "Name": "Cardiology"
    },
    {
    "ID": 2,
    "Name": "Dermatology"
    }
    ]
    ```

    **Error (500 Internal Server Error):**

    ```json
    {
    "error": "Failed to fetch specialties"
    }
    ```

    **Error (500 Internal Server Error):**

    ```json
    {
    "error": "Failed to scan specialties"
    }
    ```

---

### 2. Get Doctors by Specialty

*   **Endpoint:** `/doctors?specialty={specialty_id}`
*   **Method:** `GET`
*   **Description:** Retrieves a list of doctors for a given specialty ID.  Replace `{specialty_id}` with the ID of the specialty.

    #### Query Parameters:

    *   `specialty`:  The ID of the medical specialty.

    #### Response:

    **Success (200 OK):**

    ```json
    [
    {
    "UserID": 123,
    "FirstName": "Jane",
    "LastName": "Smith",
    "Specialization": "Cardiology",
    "YearsOfExperience": 10
    },
    {
    "UserID": 456,
    "FirstName": "John",
    "LastName": "Doe",
    "Specialization": "Cardiology",
    "YearsOfExperience": 15
    }
    ]
    ```

    **Error (400 Bad Request):**

    ```json
    {
    "error": "Specialty ID is required"
    }
    ```

    **Error (500 Internal Server Error):**

    ```json
    {
    "error": "Failed to fetch doctors: [database error message]"
    }
    ```

    **Error (500 Internal Server Error):**

    ```json
    {
    "error": "Failed to scan doctors"
    }
    ```

---

### 3. Get Doctor Availability

*   **Endpoint:** `/availability?doctor={doctor_id}`
*   **Method:** `GET`
*   **Description:** Retrieves the availability schedule for a specific doctor.  Replace `{doctor_id}` with the ID of the doctor.

    #### Query Parameters:

    *   `doctor`: The ID of the doctor.

    #### Response:

    **Success (200 OK):**

    ```json
    {
    "Monday": ["09:00-12:00", "13:00-17:00"],
    "Tuesday": ["09:00-12:00"],
    "Wednesday": [],
    "Thursday": ["13:00-17:00"],
    "Friday": ["09:00-12:00", "13:00-17:00"],
    "Saturday": [],
    "Sunday": []
    }
    ```

    **Error (400 Bad Request):**

    ```json
    {
    "error": "Doctor ID is required"
    }
    ```

    **Error (500 Internal Server Error):**

    ```json
    {
    "error": "Failed to fetch availability"
    }
    ```

---

### 4. Book Appointment

*   **Endpoint:** `/appointments`
*   **Method:** `POST`
*   **Description:** Books a new appointment for a patient with a specific doctor, including file uploads.

    #### Headers:

    ```json
    {
    "Authorization": "Bearer jwt-token-string"
    }
    ```

    #### Request Body (Multipart Form Data):

    *   `doctorId`:  The ID of the doctor (integer as string).
    *   `problem`:  A description of the patient's problem (string).
    *   `appointmentTime`: A JSON string representing the desired appointment time (e.g., `{"day": "Monday", "time": "10:00"}`).
    *   `files`:  One or more files to upload (optional).

    #### Response:

    **Success (200 OK):**

    ```json
    {
    "message": "Appointment booked successfully"
    }
    ```

    **Error (400 Bad Request):**

    ```json
    {
    "error": "Failed to parse form data"
    }
    ```

    **Error (400 Bad Request):**

    ```json
    {
    "error": "Invalid or missing doctorId"
    }
    ```

    **Error (400 Bad Request):**

    ```json
    {
    "error": "Invalid appointment time format"
    }
    ```

    **Error (401 Unauthorized - Invalid or Missing Token):**

    ```json
    {
    "error": "Invalid token"
    }
    ```

    **Error (401 Unauthorized - Invalid token claims):**

    ```json
    {
    "error": "Invalid token claims"
    }
    ```

    **Error (500 Internal Server Error):**

    ```json
    {
    "error": "Failed to book appointment"
    }
    ```

---

### 5. Get Appointment History

*   **Endpoint:** `/appointments/history`
*   **Method:** `GET`
*   **Description:** Retrieves the appointment history for a specific patient.

    #### Headers:

    ```json
    {
    "Authorization": "Bearer jwt-token-string"
    }
    ```

    #### Response:

    **Success (200 OK):**

    ```json
    [
    {
    "ID": 1,
    "PatientID": 123,
    "DoctorID": 456,
    "DoctorName": "Jane Smith",
    "AppointmentTime": {
    "day": "Monday",
    "time": "10:00"
    },
    "ProblemDescription": "Example problem",
    "Status": "Scheduled",
        "Files": [
            {
                "FileName": "test.pdf",
                "FileData": "..."
            }
        ]
    },
    {
    "ID": 2,
    "PatientID": 123,
    "DoctorID": 789,
    "DoctorName": "Robert Jones",
    "AppointmentTime": {
    "day": "Tuesday",
    "time": "14:00"
    },
    "ProblemDescription": "Another problem",
    "Status": "Completed",
        "Files": null
    }
    ]
    ```

    **Error (401 Unauthorized - Invalid or Missing Token):**

    ```json
    {
    "error": "Invalid token"
    }
    ```

    **Error (401 Unauthorized - Invalid token claims):**

    ```json
    {
    "error": "Invalid token claims"
    }
    ```

    **Error (500 Internal Server Error):**

    ```json
    {
    "error": "Failed to fetch appointment history"
    }
    ```

    **Error (500 Internal Server Error):**

    ```json
    {
    "error": "Failed to parse appointment time"
    }
    ```

---

### 6. Get Doctor Appointments

*   **Endpoint:** `/doctor/appointments`
*   **Method:** `GET`
*   **Description:** Retrieves a list of appointments for a specific doctor.

    #### Headers:

    ```json
    {
    "Authorization": "Bearer jwt-token-string"
    }
    ```

    #### Response:

    **Success (200 OK):**

    ```json
    [
    {
    "id": 1,
    "patient_id": 123,
    "doctor_id": 456,
    "patient_name": "John Doe",
    "appointment_time": {
    "day": "Monday",
    "time": "10:00"
    },
    "problem_description": "Example problem",
    "status": "Scheduled"
    },
    {
    "id": 2,
    "patient_id": 789,
    "doctor_id": 456,
    "patient_name": "Alice Smith",
    "appointment_time": {
    "day": "Tuesday",
    "time": "14:00"
    },
    "problem_description": "Another problem",
    "status": "Completed"
    }
    ]
    ```

    **Error (401 Unauthorized - Invalid or Missing Token):**

    ```json
    {
    "error": "Invalid token"
    }
    ```

    **Error (401 Unauthorized - Invalid token claims):**

    ```json
    {
    "error": "Invalid token claims"
    }
    ```

    **Error (500 Internal Server Error):**

    ```json
    {
    "error": "Failed to fetch appointments"
    }
    ```

---

### 7. Cancel Appointment

*   **Endpoint:** `/doctor/appointments/{id}`
*   **Method:** `DELETE`
*   **Description:** Cancels a specific appointment. Replace `{id}` with the ID of the appointment to cancel.

    #### Headers:

    ```json
    {
    "Authorization": "Bearer jwt-token-string"
    }
    ```

    #### Path Parameters:

    *   `id`: The ID of the appointment to cancel.

    #### Response:

    **Success (200 OK):**

    ```json
    {
    "message": "Appointment cancelled successfully"
    }
    ```

    **Error (401 Unauthorized - Invalid or Missing Token):**

    ```json
    {
    "error": "Invalid token"
    }
    ```

    **Error (401 Unauthorized - Invalid token claims):**

    ```json
    {
    "error": "Invalid token claims"
    }
    ```

    **Error (404 Not Found):**

    ```json
    {
    "error": "Appointment not found or not authorized"
    }
    ```

    **Error (500 Internal Server Error):**

    ```json
    {
    "error": "Failed to cancel appointment"
    }
    ```

---

## Authentication Middleware

**Description:** Protects routes based on user roles.

- If an endpoint requires authentication, the request must include the `Authorization` header with a valid JWT token.
- Allowed roles can be specified per endpoint.



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

