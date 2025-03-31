# Sprint 3 Report

## 1. Work Completed

### **Backend**
#### **Video Consultation System**
- Implemented integration with Jitsi Meet for video consultations.
- Added functionality to generate unique meet links for each appointment.
- Developed endpoints for booking appointments, including support for file uploads (e.g., medical reports).
- Created logic to automatically update appointment statuses (e.g., Scheduled → Completed).

#### **Doctor Notes System**
- Added functionality for doctors to add or update notes after an appointment ends.
- Developed endpoints to retrieve and update notes securely.
- Ensured proper authorization and ownership checks for note updates.

#### **Appointment Management**
- Created endpoints to fetch doctor availability and upcoming appointments.
- Added functionality to cancel appointments with a reason.

#### **Security Enhancements**
- Implemented JWT-based authentication for all endpoints.
- Added role-based access control (e.g., distinguishing between doctor and patient roles).
- Enhanced error handling and logging for secure and robust API behavior.

## 2. Backend Unit Tests

### **Appointment Booking Tests**
- Verified successful appointment booking with valid parameters.
- Tested file upload validation (size, type, quantity).
- Simulated time slot conflicts during booking.
- Checked authorization for patient roles.

### **Video Consultation Tests**
- Verified uniqueness of generated meet links.
- Tested appointment time validation logic.
- Simulated status transitions (e.g., Scheduled → Completed).

### **Doctor Notes System Tests**
- Tested note creation and updates by authorized doctors.
- Prevented unauthorized access to notes.
- Validated empty note prevention logic.

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
    * `doctorId`: The ID of the doctor (integer as string).
    * `problem`: A description of the patient's problem (string).
    * `appointmentTime`: A JSON string representing the desired appointment time (e.g., `{"date": "2025-04-01", "time": "14:30"}`).
    * `files`: One or more files to upload (optional).

- **Response:**
```json
{
    "message": "Appointment booked successfully",
    "meet_link": "https://meet.jit.si/unique-room-name"
}
```
- **Errors:**
    - `400`: Invalid form data or missing required fields.
    - `401`: Unauthorized access due to invalid/missing JWT token.
    - `500`: Internal server error during database or file operations.

---

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
    - `400`: Invalid request body or missing notes field.
    - `403`: Unauthorized access by non-doctor users or unauthorized doctors.
    - `404`: Appointment not found or inaccessible.
    - `500`: Internal server error during database operations.

---

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
    - `400`: Missing or invalid doctor ID in query parameters.
    - `500`: Internal server error while fetching availability data.

---

## 4. Additional Notes

### **Authentication Requirements**
All endpoints require a valid JWT token in the Authorization header. Tokens are role-specific (e.g., doctor, patient).

### **File Handling**
Files uploaded during appointment booking are validated for:
- Maximum size of 10MB per file.
- Supported formats include PDF, JPG, PNG, and TXT.

### **Rate Limiting**
API endpoints are rate-limited to prevent abuse:
- Maximum of 10 requests per minute per user.

### **Error Logging**
Detailed error logs are generated for all failed operations, including database errors and invalid inputs.

