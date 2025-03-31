package handlers

import (
	"backend/models"
	"bytes"
	"database/sql"
	"encoding/json"
	"mime/multipart"
	"net/http"
	"net/http/httptest"
	"regexp"
	"strconv"
	"strings"
	"testing"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/gorilla/mux"
	"github.com/stretchr/testify/assert"
)

func TestGetSpecialties(t *testing.T) {
	db, mock, err := sqlmock.New()
	assert.NoError(t, err)
	defer db.Close()

	handler := AppointmentHandler{DB: db}

	mock.ExpectQuery("SELECT id, name FROM specialties").
		WillReturnRows(sqlmock.NewRows([]string{"id", "name"}).
			AddRow(1, "Cardiology").
			AddRow(2, "Dermatology"))

	req := httptest.NewRequest("GET", "/api/specialties", nil)
	rec := httptest.NewRecorder()

	handler.GetSpecialties(rec, req)

	assert.Equal(t, http.StatusOK, rec.Code)

	var specialties []models.Specialty
	err = json.Unmarshal(rec.Body.Bytes(), &specialties)
	assert.NoError(t, err)

	assert.Equal(t, 2, len(specialties))
	assert.Equal(t, "Cardiology", specialties[0].Name)
	assert.Equal(t, "Dermatology", specialties[1].Name)

	if err := mock.ExpectationsWereMet(); err != nil {
		t.Errorf("there were unfulfilled expectations: %s", err)
	}
}

func TestGetDoctorsBySpecialty(t *testing.T) {
	db, mock, err := sqlmock.New()
	assert.NoError(t, err)
	defer db.Close()

	handler := AppointmentHandler{DB: db}

	mock.ExpectQuery("SELECT user_id, first_name, last_name, specialization, years_of_experience FROM doctor_profiles WHERE specialization = \\(SELECT name FROM specialties WHERE id = \\$1\\)").
		WithArgs("1"). // Assuming specialty ID "1" for Cardiology
		WillReturnRows(sqlmock.NewRows([]string{"user_id", "first_name", "last_name", "specialization", "years_of_experience"}).
			AddRow(101, "Alice", "Smith", "Cardiology", 5).
			AddRow(102, "Bob", "Johnson", "Cardiology", 8))

	req := httptest.NewRequest("GET", "/api/doctors?specialty=1", nil)
	rec := httptest.NewRecorder()

	handler.GetDoctorsBySpecialty(rec, req)

	assert.Equal(t, http.StatusOK, rec.Code)

	var doctors []models.DoctorProfile
	err = json.Unmarshal(rec.Body.Bytes(), &doctors)
	assert.NoError(t, err)

	assert.Equal(t, 2, len(doctors))
	assert.Equal(t, "Alice", doctors[0].FirstName)
	assert.Equal(t, "Smith", doctors[0].LastName)
	assert.Equal(t, "Cardiology", doctors[0].Specialization)

	if err := mock.ExpectationsWereMet(); err != nil {
		t.Errorf("there were unfulfilled expectations: %s", err)
	}
}

func TestGetDoctorAvailability(t *testing.T) {
	db, mock, err := sqlmock.New()
	assert.NoError(t, err)
	defer db.Close()

	handler := AppointmentHandler{DB: db}

	availabilityJSON := `{"monday": ["9:00-17:00"], "tuesday": ["9:00-12:00", "14:00-17:00"]}`

	mock.ExpectQuery("SELECT availability FROM doctor_profiles WHERE user_id = \\$1").
		WithArgs("123").
		WillReturnRows(sqlmock.NewRows([]string{"availability"}).
			AddRow(availabilityJSON))

	req := httptest.NewRequest("GET", "/api/doctor/availability?doctor=123", nil)
	rec := httptest.NewRecorder()

	handler.GetDoctorAvailability(rec, req)

	assert.Equal(t, http.StatusOK, rec.Code)
	assert.JSONEq(t, availabilityJSON, rec.Body.String())

	if err := mock.ExpectationsWereMet(); err != nil {
		t.Errorf("there were unfulfilled expectations: %s", err)
	}
}

func TestBookAppointment(t *testing.T) {
	db, mock, err := sqlmock.New()
	assert.NoError(t, err)
	defer db.Close()

	handler := AppointmentHandler{DB: db}

	// Mock JWT token
	userID := 456 // Patient ID
	tokenString, err := generateTestToken(userID)
	assert.NoError(t, err)

	// Create a multipart form data
	body := &bytes.Buffer{}
	writer := multipart.NewWriter(body)

	// Add fields
	writer.WriteField("doctorId", "789")
	writer.WriteField("problem", "Headache")
	writer.WriteField("appointmentTime", `{"date": "2024-03-10", "time": "10:00"}`)

	// Add a mock file
	fileContent := []byte("This is a test file content.")
	fileWriter, _ := writer.CreateFormFile("files", "test.txt")
	fileWriter.Write(fileContent)
	writer.Close()

	req := httptest.NewRequest("POST", "/api/book", body)
	req.Header.Set("Content-Type", writer.FormDataContentType())
	req.Header.Set("Authorization", "Bearer "+tokenString)
	rec := httptest.NewRecorder()

	// Mock database expectations with corrected query
	mock.ExpectQuery(regexp.QuoteMeta(`
        INSERT INTO appointments (patient_id, doctor_id, appointment_time, problem_description, status, meet_link)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id`)).
		WithArgs(
			userID,
			789,
			`{"date": "2024-03-10", "time": "10:00"}`,
			"Headache",
			"Scheduled",
			sqlmock.AnyArg(), // For generated meet_link
		).
		WillReturnRows(sqlmock.NewRows([]string{"id"}).AddRow(1))

	mock.ExpectExec(regexp.QuoteMeta(
		`INSERT INTO appointment_files (appointment_id, file_name, file_data) VALUES ($1, $2, $3)`)).
		WithArgs(1, "test.txt", fileContent).
		WillReturnResult(sqlmock.NewResult(1, 1))

	handler.BookAppointment(rec, req)

	assert.Equal(t, http.StatusOK, rec.Code)
	assert.Contains(t, rec.Body.String(), "Appointment booked successfully")

	if err := mock.ExpectationsWereMet(); err != nil {
		t.Errorf("there were unfulfilled expectations: %s", err)
	}
}

func TestGetAppointmentHistory(t *testing.T) {
	// Initialize mock DB
	db, mock, err := sqlmock.New()
	assert.NoError(t, err)
	defer db.Close()

	handler := &AppointmentHandler{DB: db}
	patientID := 1
	tokenString, err := generateTestToken(patientID)
	assert.NoError(t, err)

	req := httptest.NewRequest("GET", "/api/doctor/appointments", nil)
	req.Header.Set("Authorization", "Bearer "+tokenString)
	w := httptest.NewRecorder()

	// 1. Mock the UPDATE query
	mock.ExpectExec("UPDATE appointments").
		WithArgs(1).
		WillReturnResult(sqlmock.NewResult(0, 0))

	// 2. Mock the SELECT query with all 12 columns
	mock.ExpectQuery("SELECT (.+) FROM appointments").
		WithArgs(1).
		WillReturnRows(sqlmock.NewRows([]string{
			"id",
			"patient_id",
			"doctor_id",
			"appointment_time",
			"problem_description",
			"status",
			"first_name",
			"last_name",
			"file_name",
			"file_data",
			"meet_link",
			"cancellation_reason",
		}).AddRow(
			1, // id
			1, // patient_id
			2, // doctor_id
			`{"date": "2025-04-01", "time": "10:00"}`, // appointment_time
			"Fever",     // problem_description
			"Scheduled", // status
			"John",      // first_name
			"Doe",       // last_name
			nil,         // file_name
			nil,         // file_data
			nil,         // meet_link
			nil,         // cancellation_reason
		))

	handler.GetAppointmentHistory(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
}

func TestGetDoctorAppointments(t *testing.T) {
	db, mock, err := sqlmock.New()
	assert.NoError(t, err)
	defer db.Close()

	handler := &AppointmentHandler{DB: db}

	doctorID := 2
	tokenString, err := generateTestToken(doctorID)
	assert.NoError(t, err)

	req := httptest.NewRequest("GET", "/api/doctor/appointments", nil)
	req.Header.Set("Authorization", "Bearer "+tokenString)
	w := httptest.NewRecorder()

	// 1. Mock the UPDATE query
	mock.ExpectExec(`UPDATE appointments`).
		WithArgs(2).
		WillReturnResult(sqlmock.NewResult(0, 0))

	// 2. Mock the SELECT query with all 14 columns
	mock.ExpectQuery(`SELECT (.+) FROM appointments`).
		WithArgs(2).
		WillReturnRows(sqlmock.NewRows([]string{
			"id",
			"patient_id",
			"doctor_id",
			"appointment_time",
			"problem_description",
			"status",
			"notes",
			"meet_link",
			"first_name",
			"last_name",
			"file_name",
			"file_data",
			"doctor_first_name",
			"doctor_last_name",
		}).AddRow(
			1, // id
			1, // patient_id
			2, // doctor_id
			`{"date": "2025-04-01", "time": "10:00"}`, // appointment_time
			"Cough",          // problem_description
			"Scheduled",      // status
			sql.NullString{}, // notes (NULL)
			sql.NullString{}, // meet_link (NULL)
			"Jane",           // first_name
			"Smith",          // last_name
			nil,              // file_name (NULL)
			nil,              // file_data (NULL)
			"John",           // doctor_first_name
			"Doe",            // doctor_last_name
		))

	handler.GetDoctorAppointments(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.Contains(t, w.Body.String(), "Jane Smith")

	if err := mock.ExpectationsWereMet(); err != nil {
		t.Errorf("Unmet expectations: %s", err)
	}
}

func TestCancelAppointment_Success(t *testing.T) {
	db, mock, err := sqlmock.New()
	assert.NoError(t, err)
	defer db.Close()

	handler := &AppointmentHandler{DB: db}

	doctorID := 2
	tokenString, err := generateTestToken(doctorID)
	assert.NoError(t, err)

	// Create request with cancellation reason
	body := `{"cancellation_reason": "Patient unavailable"}`
	req := httptest.NewRequest("PUT", "/appointments/cancel/1", bytes.NewBuffer([]byte(body))) // Changed to PUT
	req.Header.Set("Authorization", "Bearer "+tokenString)                                     // Doctor ID 2
	w := httptest.NewRecorder()

	// Mock SQL executions in correct order
	// 1. Mock the ownership verification query
	mock.ExpectQuery(regexp.QuoteMeta( // Use regexp.QuoteMeta for exact matching
		"SELECT COUNT(*) FROM appointments WHERE id = $1 AND doctor_id = $2")).
		WithArgs(1, 2).
		WillReturnRows(sqlmock.NewRows([]string{"count"}).AddRow(1))

	// 2. Mock the update query
	mock.ExpectExec(regexp.QuoteMeta( // Use regexp.QuoteMeta here too
		"UPDATE appointments SET status = 'Cancelled', cancellation_reason = $1 WHERE id = $2")).
		WithArgs("Patient unavailable", 1).
		WillReturnResult(sqlmock.NewResult(1, 1))

	// Set up URL params
	req = mux.SetURLVars(req, map[string]string{"id": "1"})

	handler.CancelAppointment(w, req)

	assert.Equal(t, http.StatusOK, w.Code)

	// Verify all expectations were met
	if err := mock.ExpectationsWereMet(); err != nil {
		t.Errorf("Unmet expectations: %s", err)
	}
}

func TestCancelAppointment(t *testing.T) {
	db, mock, err := sqlmock.New()
	assert.NoError(t, err)
	defer db.Close()

	handler := AppointmentHandler{DB: db}

	// Mock JWT token for doctor with ID 456
	doctorID := 456
	tokenString, err := generateTestToken(doctorID)
	assert.NoError(t, err)

	// Create request body with cancellation reason
	requestBody := bytes.NewBufferString(`{"cancellation_reason": "Patient unavailable"}`)

	// Create request with body and URL params
	req := httptest.NewRequest("DELETE", "/api/appointments/1", requestBody)
	req = mux.SetURLVars(req, map[string]string{"id": "1"})
	req.Header.Set("Authorization", "Bearer "+tokenString)
	req.Header.Set("Content-Type", "application/json")
	rec := httptest.NewRecorder()

	// Mock database expectations
	mock.ExpectQuery("SELECT COUNT\\(\\*\\) FROM appointments WHERE id = \\$1 AND doctor_id = \\$2").
		WithArgs(1, doctorID). // Use integer values
		WillReturnRows(sqlmock.NewRows([]string{"count"}).AddRow(1))

	mock.ExpectExec("UPDATE appointments SET status = 'Cancelled', cancellation_reason = \\$1 WHERE id = \\$2").
		WithArgs("Patient unavailable", 1). // Add cancellation reason parameter
		WillReturnResult(sqlmock.NewResult(0, 1))

	handler.CancelAppointment(rec, req)

	assert.Equal(t, http.StatusOK, rec.Code)
	assert.Contains(t, rec.Body.String(), "Appointment cancelled successfully")

	if err := mock.ExpectationsWereMet(); err != nil {
		t.Errorf("Unmet expectations: %s", err)
	}
}

func TestCancelAppointment_InvalidID(t *testing.T) {
	handler := &AppointmentHandler{DB: nil}

	doctorID := 2
	tokenString, err := generateTestToken(doctorID)
	assert.NoError(t, err)

	req := httptest.NewRequest("POST", "/appointments/cancel/abc", nil)
	req.Header.Set("Authorization", "Bearer "+tokenString)
	w := httptest.NewRecorder()

	req = mux.SetURLVars(req, map[string]string{"id": "abc"})

	handler.CancelAppointment(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code)
}

func TestGetAppointmentHistory_InvalidToken(t *testing.T) {
	db, mock, err := sqlmock.New()
	assert.NoError(t, err)
	defer db.Close()

	handler := AppointmentHandler{DB: db}

	req := httptest.NewRequest("GET", "/api/appointments", nil)
	req.Header.Set("Authorization", "Bearer invalid_token") // Simulate an invalid token
	rec := httptest.NewRecorder()

	handler.GetAppointmentHistory(rec, req)

	assert.Equal(t, http.StatusUnauthorized, rec.Code)
	assert.Contains(t, rec.Body.String(), "Invalid token")

	if err := mock.ExpectationsWereMet(); err != nil {
		t.Errorf("there were unfulfilled expectations: %s", err)
	}
}

func TestGetDoctorAppointments_InvalidToken(t *testing.T) {
	db, mock, err := sqlmock.New()
	assert.NoError(t, err)
	defer db.Close()

	handler := AppointmentHandler{DB: db}

	req := httptest.NewRequest("GET", "/api/doctor/appointments", nil)
	req.Header.Set("Authorization", "Bearer invalid_token") // Simulate an invalid token
	rec := httptest.NewRecorder()

	handler.GetDoctorAppointments(rec, req)

	assert.Equal(t, http.StatusUnauthorized, rec.Code)
	assert.Contains(t, rec.Body.String(), "Invalid token")

	if err := mock.ExpectationsWereMet(); err != nil {
		t.Errorf("there were unfulfilled expectations: %s", err)
	}
}

func TestCancelAppointment_InvalidToken(t *testing.T) {
	db, _, err := sqlmock.New()
	assert.NoError(t, err)
	defer db.Close()

	handler := AppointmentHandler{DB: db}

	// Add valid JSON body
	body := strings.NewReader(`{"cancellation_reason": "test"}`)
	req := httptest.NewRequest("DELETE", "/api/appointments/1", body)
	req = mux.SetURLVars(req, map[string]string{"id": "1"})
	req.Header.Set("Authorization", "Bearer invalid_token")
	req.Header.Set("Content-Type", "application/json") // Add content type
	rec := httptest.NewRecorder()

	handler.CancelAppointment(rec, req)

	assert.Equal(t, http.StatusUnauthorized, rec.Code)
	assert.Contains(t, rec.Body.String(), "Invalid token")
}

func TestCancelAppointment_Unauthorized(t *testing.T) {
	db, mock, err := sqlmock.New()
	assert.NoError(t, err)
	defer db.Close()

	handler := AppointmentHandler{DB: db}

	// Add valid JSON body
	body := strings.NewReader(`{"cancellation_reason": "test"}`)
	req := httptest.NewRequest("DELETE", "/api/appointments/1", body)
	req = mux.SetURLVars(req, map[string]string{"id": "1"})
	req.Header.Set("Content-Type", "application/json")

	tokenString, _ := generateTestToken(456)
	req.Header.Set("Authorization", "Bearer "+tokenString)

	rec := httptest.NewRecorder()

	mock.ExpectQuery(regexp.QuoteMeta(
		"SELECT COUNT(*) FROM appointments WHERE id = $1 AND doctor_id = $2")).
		WithArgs(1, 456). // Use integers instead of strings
		WillReturnRows(sqlmock.NewRows([]string{"count"}).AddRow(0))

	handler.CancelAppointment(rec, req)

	assert.Equal(t, http.StatusNotFound, rec.Code)
	assert.Contains(t, rec.Body.String(), "Appointment not found")
}

func TestCancelAppointment_DatabaseError(t *testing.T) {
	db, mock, err := sqlmock.New()
	assert.NoError(t, err)
	defer db.Close()

	handler := AppointmentHandler{DB: db}

	// Add valid JSON body
	body := strings.NewReader(`{"cancellation_reason": "test"}`)
	req := httptest.NewRequest("DELETE", "/api/appointments/1", body)
	req = mux.SetURLVars(req, map[string]string{"id": "1"})
	req.Header.Set("Content-Type", "application/json")

	tokenString, _ := generateTestToken(456)
	req.Header.Set("Authorization", "Bearer "+tokenString)

	rec := httptest.NewRecorder()

	mock.ExpectQuery(regexp.QuoteMeta(
		"SELECT COUNT(*) FROM appointments WHERE id = $1 AND doctor_id = $2")).
		WithArgs(1, 456).
		WillReturnError(sql.ErrConnDone)

	handler.CancelAppointment(rec, req)

	assert.Equal(t, http.StatusInternalServerError, rec.Code)
	assert.Contains(t, rec.Body.String(), "Failed to verify appointment")
}

func TestGetDoctorAvailability_Error(t *testing.T) {
	db, mock, err := sqlmock.New()
	assert.NoError(t, err)
	defer db.Close()

	handler := AppointmentHandler{DB: db}

	// Mock doctor id
	doctorID := "123"

	// Mocked error
	mock.ExpectQuery("SELECT availability FROM doctor_profiles WHERE user_id = \\$1").
		WithArgs(doctorID).
		WillReturnError(sql.ErrConnDone)

	req := httptest.NewRequest("GET", "/api/doctor/availability?doctor=123", nil)
	rec := httptest.NewRecorder()

	handler.GetDoctorAvailability(rec, req)

	assert.Equal(t, http.StatusInternalServerError, rec.Code)
	assert.Contains(t, rec.Body.String(), "Failed to fetch availability")

	if err := mock.ExpectationsWereMet(); err != nil {
		t.Errorf("there were unfulfilled expectations: %s", err)
	}
}

func TestGetDoctorsBySpecialty_Error(t *testing.T) {
	db, mock, err := sqlmock.New()
	assert.NoError(t, err)
	defer db.Close()

	handler := AppointmentHandler{DB: db}

	// Mocked query for testing
	mock.ExpectQuery("SELECT user_id, first_name, last_name, specialization, years_of_experience FROM doctor_profiles WHERE specialization = \\(SELECT name FROM specialties WHERE id = \\$1\\)").
		WithArgs("1").
		WillReturnError(sql.ErrConnDone)

	// Mock request and response
	req := httptest.NewRequest("GET", "/api/doctors?specialty=1", nil)
	rec := httptest.NewRecorder()

	// Handler method called
	handler.GetDoctorsBySpecialty(rec, req)

	// Check status code
	assert.Equal(t, http.StatusInternalServerError, rec.Code)
	assert.Contains(t, rec.Body.String(), "Failed to fetch doctors")

	// Check if all expectations were met
	if err := mock.ExpectationsWereMet(); err != nil {
		t.Errorf("there were unfulfilled expectations: %s", err)
	}
}

func TestGetSpecialties_Error(t *testing.T) {
	db, mock, err := sqlmock.New()
	assert.NoError(t, err)
	defer db.Close()

	handler := AppointmentHandler{DB: db}

	// Define the mocked query and the error it should return
	mock.ExpectQuery("SELECT id, name FROM specialties").
		WillReturnError(sql.ErrConnDone)

	// Create a request and a recorder
	req := httptest.NewRequest("GET", "/api/specialties", nil)
	rec := httptest.NewRecorder()

	// Call the handler function
	handler.GetSpecialties(rec, req)

	// Assert that the response code is the one you expect when an error occurs
	assert.Equal(t, http.StatusInternalServerError, rec.Code)
	assert.Contains(t, rec.Body.String(), "Failed to fetch specialties")

	// Ensure all expectations were met
	if err := mock.ExpectationsWereMet(); err != nil {
		t.Errorf("there were unfulfilled expectations: %s", err)
	}
}

func TestBookAppointment_InvalidInput(t *testing.T) {
	db, mock, err := sqlmock.New()
	assert.NoError(t, err)
	defer db.Close()

	handler := AppointmentHandler{DB: db}

	// Mock JWT token
	userID := 456 // Patient ID
	tokenString, err := generateTestToken(userID)
	assert.NoError(t, err)

	// Create a multipart form data
	body := &bytes.Buffer{}
	writer := multipart.NewWriter(body)

	// Omit required fields
	err = writer.WriteField("problem", "Headache")
	assert.NoError(t, err)

	err = writer.Close()
	assert.NoError(t, err)

	req, err := http.NewRequest("POST", "/api/book", body)
	assert.NoError(t, err)
	req.Header.Set("Content-Type", writer.FormDataContentType())
	req.Header.Set("Authorization", "Bearer "+tokenString)

	rec := httptest.NewRecorder()

	handler.BookAppointment(rec, req)

	assert.Equal(t, http.StatusBadRequest, rec.Code) // Bad Request
	assert.Contains(t, rec.Body.String(), "Invalid or missing doctorId")

	if err := mock.ExpectationsWereMet(); err != nil {
		t.Errorf("there were unfulfilled expectations: %s", err)
	}
}

func TestBookAppointment_DatabaseError(t *testing.T) {
	db, mock, err := sqlmock.New()
	assert.NoError(t, err)
	defer db.Close()

	handler := AppointmentHandler{DB: db}

	// Mock JWT token
	userID := 456 // Patient ID
	tokenString, err := generateTestToken(userID)
	assert.NoError(t, err)

	// Create a multipart form data
	body := &bytes.Buffer{}
	writer := multipart.NewWriter(body)

	// Add form fields
	writer.WriteField("doctorId", "789")
	writer.WriteField("problem", "Headache")
	writer.WriteField("appointmentTime", `{"date": "2024-03-10", "time": "10:00"}`)
	writer.Close()

	req := httptest.NewRequest("POST", "/api/book", body)
	req.Header.Set("Content-Type", writer.FormDataContentType())
	req.Header.Set("Authorization", "Bearer "+tokenString)
	rec := httptest.NewRecorder()

	// Mock the correct SQL query with all parameters
	mock.ExpectQuery(regexp.QuoteMeta(`
        INSERT INTO appointments (patient_id, doctor_id, appointment_time, problem_description, status, meet_link)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id`)).
		WithArgs(
			userID,
			789,
			`{"date": "2024-03-10", "time": "10:00"}`,
			"Headache",
			"Scheduled",
			sqlmock.AnyArg(), // For generated meet_link
		).
		WillReturnError(sql.ErrConnDone)

	handler.BookAppointment(rec, req)

	assert.Equal(t, http.StatusInternalServerError, rec.Code)
	assert.Contains(t, rec.Body.String(), "Failed to book appointment")

	if err := mock.ExpectationsWereMet(); err != nil {
		t.Errorf("there were unfulfilled expectations: %s", err)
	}
}

func TestGetAppointmentHistory_DatabaseError(t *testing.T) {
	db, mock, err := sqlmock.New()
	assert.NoError(t, err)
	defer db.Close()

	handler := AppointmentHandler{DB: db}

	// Mock JWT token
	userID := 123
	tokenString, err := generateTestToken(userID)
	assert.NoError(t, err)

	req := httptest.NewRequest("GET", "/api/appointments", nil)
	req.Header.Set("Authorization", "Bearer "+tokenString)
	rec := httptest.NewRecorder()

	// 1. Mock the UPDATE query with correct JSON operator syntax
	mock.ExpectExec(regexp.QuoteMeta(`
        UPDATE appointments 
        SET status = 'Completed' 
        WHERE patient_id = $1 
        AND status = 'Scheduled' 
        AND (appointment_time->>'date')::date < CURRENT_DATE
        OR ((appointment_time->>'date')::date = CURRENT_DATE AND (appointment_time->>'time')::time < CURRENT_TIME)
    `)).
		WithArgs(userID).
		WillReturnResult(sqlmock.NewResult(0, 0))

	// 2. Mock the SELECT query with correct JSON operator syntax
	mock.ExpectQuery(regexp.QuoteMeta(`
        SELECT 
            a.id, 
            a.patient_id, 
            a.doctor_id, 
            a.appointment_time, 
            a.problem_description, 
            a.status, 
            d.first_name, 
            d.last_name,
            af.file_name,
            af.file_data,
            a.meet_link,
            a.cancellation_reason
        FROM appointments a
        JOIN doctor_profiles d ON a.doctor_id = d.user_id
        LEFT JOIN appointment_files af ON a.id = af.appointment_id
        WHERE a.patient_id = $1
        ORDER BY 
            CASE 
                WHEN a.status = 'Scheduled' THEN 1
                WHEN a.status = 'Completed' THEN 2
                WHEN a.status = 'Cancelled' THEN 3
                ELSE 4
            END,
            (a.appointment_time->>'date')::date ASC,
            (a.appointment_time->>'time')::time ASC`)).
		WithArgs(userID).
		WillReturnError(sql.ErrConnDone)

	handler.GetAppointmentHistory(rec, req)

	assert.Equal(t, http.StatusInternalServerError, rec.Code)
	assert.Contains(t, rec.Body.String(), "Failed to fetch appointment history")

	if err := mock.ExpectationsWereMet(); err != nil {
		t.Errorf("Unmet expectations: %s", err)
	}
}

func TestGetDoctorAppointments_DatabaseError(t *testing.T) {
	db, mock, err := sqlmock.New()
	assert.NoError(t, err)
	defer db.Close()

	handler := AppointmentHandler{DB: db}

	// Mock JWT token for doctor with ID 456
	doctorID := 456
	tokenString, err := generateTestToken(doctorID)
	assert.NoError(t, err)

	req := httptest.NewRequest("GET", "/api/doctor/appointments", nil)
	req.Header.Set("Authorization", "Bearer "+tokenString)
	rec := httptest.NewRecorder()

	// 1. Mock the UPDATE query with correct JSON operator syntax
	mock.ExpectExec(regexp.QuoteMeta(`
        UPDATE appointments 
        SET status = 'Completed' 
        WHERE doctor_id = $1 
        AND status = 'Scheduled' 
        AND (appointment_time->>'date')::date < CURRENT_DATE
        OR ((appointment_time->>'date')::date = CURRENT_DATE AND (appointment_time->>'time')::time < CURRENT_TIME)
    `)).
		WithArgs(doctorID).
		WillReturnResult(sqlmock.NewResult(0, 0))

	// 2. Mock the SELECT query with correct structure including doctor profile join
	mock.ExpectQuery(regexp.QuoteMeta(`
        SELECT 
            a.id, 
            a.patient_id, 
            a.doctor_id, 
            a.appointment_time, 
            a.problem_description, 
            a.status,
            a.notes,
            a.meet_link,
            p.first_name,
            p.last_name,
            af.file_name,
            af.file_data,
            d.first_name as doctor_first_name,
            d.last_name as doctor_last_name
        FROM appointments a
        JOIN profiles p ON a.patient_id = p.user_id
        JOIN doctor_profiles d ON a.doctor_id = d.user_id
        LEFT JOIN appointment_files af ON a.id = af.appointment_id
        WHERE a.doctor_id = $1
        ORDER BY 
            CASE 
                WHEN a.status = 'Scheduled' THEN 1
                WHEN a.status = 'Completed' THEN 2
                WHEN a.status = 'Cancelled' THEN 3
                ELSE 4
            END,
            (appointment_time->>'date')::date ASC,
            (appointment_time->>'time')::time ASC`)).
		WithArgs(doctorID).
		WillReturnError(sql.ErrConnDone)

	handler.GetDoctorAppointments(rec, req)

	assert.Equal(t, http.StatusInternalServerError, rec.Code)
	assert.Contains(t, rec.Body.String(), "Failed to fetch appointments")

	if err := mock.ExpectationsWereMet(); err != nil {
		t.Errorf("there were unfulfilled expectations: %s", err)
	}
}

func TestGetDoctorAppointmentTimes(t *testing.T) {
	db, mock, err := sqlmock.New()
	assert.NoError(t, err)
	defer db.Close()

	handler := AppointmentHandler{DB: db}

	t.Run("ValidRequest", func(t *testing.T) {
		req := httptest.NewRequest("GET", "/appointments/times?doctor_id=123", nil)
		rec := httptest.NewRecorder()

		rows := sqlmock.NewRows([]string{"appointment_time"}).
			AddRow(`{"date": "2025-04-01", "time": "10:00"}`).
			AddRow(`{"date": "2025-04-02", "time": "14:30"}`)

		mock.ExpectQuery(regexp.QuoteMeta(
			`SELECT appointment_time FROM appointments WHERE doctor_id = $1 ORDER BY appointment_time`)).
			WithArgs(123).
			WillReturnRows(rows)

		handler.GetDoctorAppointmentTimes(rec, req)

		assert.Equal(t, http.StatusOK, rec.Code)
		assert.Contains(t, rec.Body.String(), "2025-04-01")
		assert.Contains(t, rec.Body.String(), "2025-04-02")
	})

	t.Run("MissingDoctorID", func(t *testing.T) {
		req := httptest.NewRequest("GET", "/appointments/times", nil)
		rec := httptest.NewRecorder()

		handler.GetDoctorAppointmentTimes(rec, req)

		assert.Equal(t, http.StatusBadRequest, rec.Code)
		assert.Contains(t, rec.Body.String(), "Doctor ID is required")
	})

	t.Run("InvalidDoctorID", func(t *testing.T) {
		req := httptest.NewRequest("GET", "/appointments/times?doctor_id=invalid", nil)
		rec := httptest.NewRecorder()

		handler.GetDoctorAppointmentTimes(rec, req)

		assert.Equal(t, http.StatusBadRequest, rec.Code)
		assert.Contains(t, rec.Body.String(), "Invalid Doctor ID")
	})

	t.Run("DatabaseError", func(t *testing.T) {
		req := httptest.NewRequest("GET", "/appointments/times?doctor_id=123", nil)
		rec := httptest.NewRecorder()

		mock.ExpectQuery(regexp.QuoteMeta(
			`SELECT appointment_time FROM appointments WHERE doctor_id = $1 ORDER BY appointment_time`)).
			WithArgs(123).
			WillReturnError(sql.ErrConnDone)

		handler.GetDoctorAppointmentTimes(rec, req)

		assert.Equal(t, http.StatusInternalServerError, rec.Code)
		assert.Contains(t, rec.Body.String(), "Failed to fetch appointment times")
	})
}

func TestGenerateMeetLink(t *testing.T) {
	// Test that the generated link follows the correct format
	link := generateMeetLink()

	// Check if the link starts with the correct base URL
	assert.True(t, strings.HasPrefix(link, "https://meet.jit.si/"), "Link should start with https://meet.jit.si/")

	// Extract the room name (part after the base URL)
	roomName := strings.TrimPrefix(link, "https://meet.jit.si/")

	// Split the room name into parts
	parts := strings.Split(roomName, "-")
	assert.Equal(t, 3, len(parts), "Room name should have 3 parts: adjective-noun-number")

	// Check if the number part is actually a number
	number, err := strconv.Atoi(parts[2])
	assert.NoError(t, err, "Last part should be a number")
	assert.True(t, number >= 0 && number < 1000, "Number should be between 0 and 999")

	// Test uniqueness by generating multiple links
	links := make(map[string]bool)
	for i := 0; i < 100; i++ {
		newLink := generateMeetLink()
		assert.False(t, links[newLink], "Generated link should be unique")
		links[newLink] = true
	}

	// Test that the generated links contain valid adjectives and nouns
	validAdjectives := map[string]bool{
		"happy": true, "sunny": true, "quick": true,
		"lucky": true, "funny": true, "brave": true,
	}

	validNouns := map[string]bool{
		"cat": true, "dog": true, "fox": true,
		"lion": true, "tiger": true, "panda": true,
	}

	// Check a few random links for valid adjectives and nouns
	for i := 0; i < 10; i++ {
		link := generateMeetLink()
		roomName := strings.TrimPrefix(link, "https://meet.jit.si/")
		parts := strings.Split(roomName, "-")

		assert.True(t, validAdjectives[parts[0]], "First part should be a valid adjective")
		assert.True(t, validNouns[parts[1]], "Second part should be a valid noun")
	}
}
