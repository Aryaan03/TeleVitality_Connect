# Sprint 2 Report

## Backend Development

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

## Backend API Documentation

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



## Detailed API Documentation

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

---

## **Unit Tests**

This sprint included comprehensive unit tests to ensure the reliability and correctness of our backend API. Below is a summary of the tests performed:

#### Authentication Tests (`auth_test.go`):

*   **TestRegister:** Verifies the user registration process, including checking for existing usernames/emails and inserting new user data into the database.
*   **TestLogin:** Validates the user login process, including retrieving user data from the database and comparing password hashes.
*   **TestDoctorRegister:** Validates the doctor registration process, similar to the user registration test.
*   **TestDoctorLogin:** Validates the doctor login process, similar to the user login test.

#### Profile Tests (`profile_test.go`):

*   **TestGetProfile:** Tests the retrieval of a user profile, covering cases where the profile exists, doesn't exist (returns a default profile), an invalid token is provided, or a database error occurs.
*   **TestUpdateProfile:** Tests the updating of a user profile, covering successful updates, invalid request bodies, database errors during updates, and invalid tokens.

#### Doctor Profile Tests (`doctor_profile_test.go`):

*   **TestGetDoctorProfile:** Tests the retrieval of a doctor profile, ensuring that the data is correctly fetched and parsed.

#### Appointment Tests (`appointments_test.go`):

*   **TestGetSpecialties:** Tests the retrieval of medical specialties from the database.
*   **TestGetDoctorsBySpecialty:** Tests fetching doctors based on a specific specialty.
*   **TestGetDoctorAvailability:** Tests the retrieval of a doctor's availability schedule.
*   **TestBookAppointment:** Tests the process of booking an appointment, including handling file uploads.  This includes validating the token and mocking DB interactions to ensure proper data persistence.
*   **TestGetAppointmentHistory:** Tests the retrieval of a patient's appointment history.
*   **TestGetDoctorAppointments:** Tests the retrieval of a doctor's appointment list.
*   **TestCancelAppointment:** Tests the cancellation of an appointment by a doctor.
*   **TestBookAppointment_InvalidToken:** Tests the `BookAppointment` endpoint with an invalid token.
*   **TestGetAppointmentHistory_InvalidToken:** Tests the `GetAppointmentHistory` endpoint with an invalid token.
*   **TestGetDoctorAppointments_InvalidToken:** Tests the `GetDoctorAppointments` endpoint with an invalid token.
*   **TestCancelAppointment_InvalidToken:** Tests the `CancelAppointment` endpoint with an invalid token.
*   **TestCancelAppointment_Unauthorized:** Tests the scenario where a doctor attempts to cancel an appointment that does not belong to them.
*   **TestCancelAppointment_DatabaseError:** Tests the scenario where a database error occurs during the cancellation process.
*   **TestGetDoctorAvailability_Error:** Tests the scenario where fetching doctor availability fails due to a database error.
*   **TestGetDoctorsBySpecialty_Error:** Tests the scenario where fetching doctors by specialty fails due to a database error.
*   **TestGetSpecialties_Error:** Tests the scenario where fetching specialties fails due to a database error.
*   **TestBookAppointment_InvalidInput:** Tests the scenario where invalid input data is provided during appointment booking.
*   **TestBookAppointment_DatabaseError:** Tests the scenario where a database error occurs during the appointment booking process.
*   **TestGetAppointmentHistory_DatabaseError:** Tests the scenario where a database error occurs while fetching appointment history.
*   **TestGetDoctorAppointments_DatabaseError:** Tests the scenario where a database error occurs while fetching doctor appointments.

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

## Frontend Development

### **Features Implemented in This Sprint**

#### **Doctor Pages**
- **Doctor Register Page**: Doctors can register with their details.
- **Doctor Login Page**: Secure login functionality for doctors.
- **Doctor Profile Page**:
  - Added fields for specialties and availability schedules.
  - Viewing and editing profiles are now separated for better usability.
  - Doctors can update their availability slots.
  - Enhanced profile display with a visually improved layout.

#### **Patient Pages**
- **Appointments Page**:
  - Patients can view their appointment history.
  - Updated appointment slots functionality for scheduling.
- **Profile Page**:
  - Enhanced profile display with sections for personal, medical, and insurance details.
  - Viewing and editing profiles are now separated.

#### **Home Page**
- Improved visual design with better navigation and layout.
  
#### **General Enhancements**
- Added specialty and availability schedules to doctor profiles.
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

##### **Contact Page** (`contact.cy.js`)
- ✅ Verifies page loads successfully
- ✅ Checks contact form rendering with all fields
- ✅ Validates contact information section (address, phone, email)
- ✅ Tests form submission validation

##### **Doctor Authentication**
- **Login** (`doctorLogin.cy.js`):
  - ✅ Renders login form correctly
  - ✅ Shows validation errors for empty fields
  - ✅ Displays error for invalid credentials
  - ✅ Successfully logs in with valid credentials
  - ✅ Shows forgot password alert

- **Registration** (`doctorRegister.cy.js`):
  - ✅ Renders registration form with all fields
  - ✅ Validates password matching and complexity
  - ✅ Shows terms & conditions validation
  - ✅ Handles registration failures
  - ✅ Successfully registers with valid credentials

##### **Doctor Profile** (`doctorProfile.cy.js`)
- ✅ Loads profile page successfully
- ✅ Displays contact information section
- ✅ Tests profile editing functionality
- ✅ Validates availability schedule updates

##### **Forgot Password** (`forgotPassword.cy.js`)
- ✅ Loads password reset page
- ✅ Renders email and password fields
- ✅ Validates required fields
- ✅ Checks password mismatch validation

##### **Patient Authentication**
- **Login** (`patientLogin.cy.js`):
  - ✅ Renders login form correctly
  - ✅ Shows validation errors for empty fields
  - ✅ Displays error for invalid credentials
  - ✅ Successfully logs in with valid credentials
  - ✅ Closes modal when clicking outside

- **Registration** (`patientRegister.cy.js`):
  - ✅ Renders registration form with all fields
  - ✅ Validates password matching and complexity
  - ✅ Shows terms & conditions validation
  - ✅ Handles registration failures
  - ✅ Successfully registers with valid credentials

##### **Home Page** (`homepage.cy.js`)
- ✅ Verifies page loads successfully
- ✅ Checks visibility of welcome message
- ✅ Tests navigation links functionality

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

#### Login Page Tests (`LoginPage.test.js`):
- ✅ **Renders login form elements**
  - Verifies presence of "Patient Login" heading
  - Checks for Login button existence
- ✅ **Form validation handling**
  - Displays "Required" errors for empty username/password
- ✅ **Forgot Password functionality**
  - Triggers alert when clicking forgot password
  - Verifies alert message content

#### Registration Page Tests (`PatientRegisterPage.test.js`):
- ✅ **Renders registration form elements**
  - Confirms "Patient Registration" heading exists
  - Verifies Register button presence
- ✅ **Form validation checks**
  - Shows "Required" errors for empty fields
  - Displays password mismatch error
  - Validates terms & conditions checkbox
- ✅ **Input format validation**
  - Checks email format validation
  - Verifies minimum password length requirement

---

### **How to Run Frontend Unit Tests**

1. **Install dependencies** (if not already installed):<br>
   ```bash
   npm install
   
2. **Run all tests**:<br>
   ```bash
   npm test

---

## **Key Highlights of This Sprint**

1. Added pages for doctor registration, login, profile management, and availability scheduling.
2. Enhanced patient appointment functionality with history tracking and slot updates.
3. Improved visual design of the Home Page and navigation across the platform.
4. Added basic Cypress test cases for key pages like Doctor Profile, Home Page, Contact Page, and Forgot Password.

---

## **Future Enhancements**

1. Add more comprehensive Cypress tests for other pages like Dashboard and Appointment Management.

