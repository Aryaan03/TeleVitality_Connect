package handlers

import (
	"backend/models"
	"bytes"
	"database/sql"
	"encoding/json"
	"mime/multipart"
	"net/http"
	"net/http/httptest"
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
	err = writer.WriteField("doctorId", "789")
	assert.NoError(t, err)
	err = writer.WriteField("problem", "Headache")
	assert.NoError(t, err)
	err = writer.WriteField("appointmentTime", `{"date": "2024-03-10", "time": "10:00"}`)
	assert.NoError(t, err)

	// Add a mock file
	fileContent := []byte("This is a test file content.")
	fileWriter, err := writer.CreateFormFile("files", "test.txt")
	assert.NoError(t, err)
	_, err = fileWriter.Write(fileContent)
	assert.NoError(t, err)

	err = writer.Close()
	assert.NoError(t, err)

	req, err := http.NewRequest("POST", "/api/book", body)
	assert.NoError(t, err)
	req.Header.Set("Content-Type", writer.FormDataContentType())
	req.Header.Set("Authorization", "Bearer "+tokenString)

	rec := httptest.NewRecorder()

	// Expect database interactions
	mock.ExpectQuery(`
            INSERT INTO appointments \(patient_id, doctor_id, appointment_time, problem_description\)
            VALUES \(\$1, \$2, \$3, \$4\)
            RETURNING id`).WithArgs(userID, 789, `{"date": "2024-03-10", "time": "10:00"}`, "Headache").WillReturnRows(sqlmock.NewRows([]string{"id"}).AddRow(1))

	mock.ExpectExec(`INSERT INTO appointment_files \(appointment_id, file_name, file_data\) VALUES \(\$1, \$2, \$3\)`).
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

	// Mock DB response
	rows := sqlmock.NewRows([]string{"id", "patient_id", "doctor_id", "appointment_time", "problem_description", "status", "first_name", "last_name", "file_name", "file_data"}).
		AddRow(1, 123, 456, `{"date": "2024-03-05", "time": "14:00"}`, "Cough", "Scheduled", "Jane", "Doe", "report.pdf", []byte("test data")).
		AddRow(2, 123, 789, `{"date": "2024-03-06", "time": "16:00"}`, "Fever", "Completed", "John", "Smith", nil, nil)

	mock.ExpectQuery(`
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
                af.file_data
            FROM appointments a
            JOIN doctor_profiles d ON a.doctor_id = d.user_id
            LEFT JOIN appointment_files af ON a.id = af.appointment_id
            WHERE a.patient_id = \$1
            ORDER BY a.created_at DESC`).WithArgs(userID).WillReturnRows(rows)

	handler.GetAppointmentHistory(rec, req)

	assert.Equal(t, http.StatusOK, rec.Code)

	var appointments []models.Appointment
	err = json.Unmarshal(rec.Body.Bytes(), &appointments)
	assert.NoError(t, err)

	assert.Equal(t, 2, len(appointments))
	assert.Equal(t, "Cough", appointments[0].ProblemDescription)
	assert.Equal(t, "Jane Doe", appointments[0].DoctorName)

	if err := mock.ExpectationsWereMet(); err != nil {
		t.Errorf("there were unfulfilled expectations: %s", err)
	}
}

func TestGetDoctorAppointments(t *testing.T) {
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

	// Mock DB response
	rows := sqlmock.NewRows([]string{"id", "patient_id", "doctor_id", "appointment_time", "problem_description", "status", "first_name", "last_name"}).
		AddRow(1, 123, 456, `{"date": "2024-03-05", "time": "14:00"}`, "Cough", "Scheduled", "Jane", "Doe").
		AddRow(2, 789, 456, `{"date": "2024-03-06", "time": "16:00"}`, "Fever", "Completed", "John", "Smith")

	mock.ExpectQuery(`
			SELECT 
				a.id, 
				a.patient_id, 
				a.doctor_id, 
				a.appointment_time, 
				a.problem_description, 
				a.status,
				p.first_name,
				p.last_name
			FROM appointments a
			JOIN profiles p ON a.patient_id = p.user_id
			WHERE a.doctor_id = \$1
			ORDER BY a.created_at DESC`).WithArgs(doctorID).WillReturnRows(rows)

	handler.GetDoctorAppointments(rec, req)

	assert.Equal(t, http.StatusOK, rec.Code)

	var appointments []map[string]interface{}
	err = json.Unmarshal(rec.Body.Bytes(), &appointments)
	assert.NoError(t, err)

	assert.Equal(t, 2, len(appointments))
	assert.Equal(t, "Cough", appointments[0]["problem_description"])
	assert.Equal(t, "Jane Doe", appointments[0]["patient_name"])

	if err := mock.ExpectationsWereMet(); err != nil {
		t.Errorf("there were unfulfilled expectations: %s", err)
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

	// Create a request with the appointment ID in the URL
	req := httptest.NewRequest("DELETE", "/api/appointments/1", nil)
	req = mux.SetURLVars(req, map[string]string{"id": "1"}) // Set URL variable using mux
	req.Header.Set("Authorization", "Bearer "+tokenString)
	rec := httptest.NewRecorder()

	// Expect database interaction
	mock.ExpectQuery("SELECT COUNT\\(\\*\\) FROM appointments WHERE id = \\$1 AND doctor_id = \\$2").
		WithArgs("1", doctorID).
		WillReturnRows(sqlmock.NewRows([]string{"count"}).AddRow(1)) // Appointment exists and belongs to the doctor

	mock.ExpectExec("UPDATE appointments SET status = 'Cancelled' WHERE id = \\$1").
		WithArgs("1").
		WillReturnResult(sqlmock.NewResult(0, 1)) // One row affected

	handler.CancelAppointment(rec, req)

	assert.Equal(t, http.StatusOK, rec.Code)
	assert.Contains(t, rec.Body.String(), "Appointment cancelled successfully")

	if err := mock.ExpectationsWereMet(); err != nil {
		t.Errorf("there were unfulfilled expectations: %s", err)
	}
}

func TestBookAppointment_InvalidToken(t *testing.T) {
	db, mock, err := sqlmock.New()
	assert.NoError(t, err)
	defer db.Close()

	handler := AppointmentHandler{DB: db}

	// Create a multipart form data
	body := &bytes.Buffer{}
	writer := multipart.NewWriter(body)

	err = writer.WriteField("doctorId", "789")
	assert.NoError(t, err)
	err = writer.WriteField("problem", "Headache")
	assert.NoError(t, err)
	err = writer.WriteField("appointmentTime", `{"date": "2024-03-10", "time": "10:00"}`)
	assert.NoError(t, err)
	err = writer.Close()
	assert.NoError(t, err)

	req, err := http.NewRequest("POST", "/api/book", body)
	assert.NoError(t, err)
	req.Header.Set("Content-Type", writer.FormDataContentType())
	req.Header.Set("Authorization", "Bearer invalid_token") // Simulate an invalid token

	rec := httptest.NewRecorder()
	handler.BookAppointment(rec, req)

	assert.Equal(t, http.StatusUnauthorized, rec.Code)
	assert.Contains(t, rec.Body.String(), "Invalid token")

	if err := mock.ExpectationsWereMet(); err != nil {
		t.Errorf("there were unfulfilled expectations: %s", err)
	}
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
	db, mock, err := sqlmock.New()
	assert.NoError(t, err)
	defer db.Close()

	handler := AppointmentHandler{DB: db}

	req := httptest.NewRequest("DELETE", "/api/appointments/1", nil)
	req = mux.SetURLVars(req, map[string]string{"id": "1"}) // Set URL variable using mux
	req.Header.Set("Authorization", "Bearer invalid_token") // Simulate an invalid token
	rec := httptest.NewRecorder()

	handler.CancelAppointment(rec, req)

	assert.Equal(t, http.StatusUnauthorized, rec.Code)
	assert.Contains(t, rec.Body.String(), "Invalid token")

	if err := mock.ExpectationsWereMet(); err != nil {
		t.Errorf("there were unfulfilled expectations: %s", err)
	}
}

func TestCancelAppointment_Unauthorized(t *testing.T) {
	db, mock, err := sqlmock.New()
	assert.NoError(t, err)
	defer db.Close()

	handler := AppointmentHandler{DB: db}

	// Mock JWT token for doctor with ID 456
	doctorID := 456
	tokenString, err := generateTestToken(doctorID)
	assert.NoError(t, err)

	// Create a request with the appointment ID in the URL
	req := httptest.NewRequest("DELETE", "/api/appointments/1", nil)
	req = mux.SetURLVars(req, map[string]string{"id": "1"}) // Set URL variable using mux
	req.Header.Set("Authorization", "Bearer "+tokenString)
	rec := httptest.NewRecorder()

	// Expect database interaction - but this time the appointment doesn't belong to the doctor
	mock.ExpectQuery("SELECT COUNT\\(\\*\\) FROM appointments WHERE id = \\$1 AND doctor_id = \\$2").
		WithArgs("1", doctorID).
		WillReturnRows(sqlmock.NewRows([]string{"count"}).AddRow(0)) // Appointment does not belong to the doctor

	handler.CancelAppointment(rec, req)

	assert.Equal(t, http.StatusNotFound, rec.Code)
	assert.Contains(t, rec.Body.String(), "Appointment not found or not authorized")

	if err := mock.ExpectationsWereMet(); err != nil {
		t.Errorf("there were unfulfilled expectations: %s", err)
	}
}

func TestCancelAppointment_DatabaseError(t *testing.T) {
	db, mock, err := sqlmock.New()
	assert.NoError(t, err)
	defer db.Close()

	handler := AppointmentHandler{DB: db}

	// Mock JWT token for doctor with ID 456
	doctorID := 456
	tokenString, err := generateTestToken(doctorID)
	assert.NoError(t, err)

	// Create a request with the appointment ID in the URL
	req := httptest.NewRequest("DELETE", "/api/appointments/1", nil)
	req = mux.SetURLVars(req, map[string]string{"id": "1"}) // Set URL variable using mux
	req.Header.Set("Authorization", "Bearer "+tokenString)
	rec := httptest.NewRecorder()

	// Expect database interaction - but this time the COUNT query fails
	mock.ExpectQuery("SELECT COUNT\\(\\*\\) FROM appointments WHERE id = \\$1 AND doctor_id = \\$2").
		WithArgs("1", doctorID).
		WillReturnError(sql.ErrConnDone) // Simulate database connection error

	handler.CancelAppointment(rec, req)

	assert.Equal(t, http.StatusInternalServerError, rec.Code)
	assert.Contains(t, rec.Body.String(), "Failed to verify appointment")

	if err := mock.ExpectationsWereMet(); err != nil {
		t.Errorf("there were unfulfilled expectations: %s", err)
	}
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

	err = writer.WriteField("doctorId", "789")
	assert.NoError(t, err)
	err = writer.WriteField("problem", "Headache")
	assert.NoError(t, err)
	err = writer.WriteField("appointmentTime", `{"date": "2024-03-10", "time": "10:00"}`)
	assert.NoError(t, err)
	err = writer.Close()
	assert.NoError(t, err)

	req, err := http.NewRequest("POST", "/api/book", body)
	assert.NoError(t, err)
	req.Header.Set("Content-Type", writer.FormDataContentType())
	req.Header.Set("Authorization", "Bearer "+tokenString)

	rec := httptest.NewRecorder()

	mock.ExpectQuery(`
            INSERT INTO appointments \(patient_id, doctor_id, appointment_time, problem_description\)
            VALUES \(\$1, \$2, \$3, \$4\)
            RETURNING id`).
		WithArgs(userID, 789, `{"date": "2024-03-10", "time": "10:00"}`, "Headache").
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

	mock.ExpectQuery(`
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
                af.file_data
            FROM appointments a
            JOIN doctor_profiles d ON a.doctor_id = d.user_id
            LEFT JOIN appointment_files af ON a.id = af.appointment_id
            WHERE a.patient_id = \$1
            ORDER BY a.created_at DESC`).
		WithArgs(userID).
		WillReturnError(sql.ErrConnDone)

	handler.GetAppointmentHistory(rec, req)

	assert.Equal(t, http.StatusInternalServerError, rec.Code)
	assert.Contains(t, rec.Body.String(), "Failed to fetch appointment history")

	if err := mock.ExpectationsWereMet(); err != nil {
		t.Errorf("there were unfulfilled expectations: %s", err)
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

	mock.ExpectQuery(`
			SELECT 
				a.id, 
				a.patient_id, 
				a.doctor_id, 
				a.appointment_time, 
				a.problem_description, 
				a.status,
				p.first_name,
				p.last_name
			FROM appointments a
			JOIN profiles p ON a.patient_id = p.user_id
			WHERE a.doctor_id = \$1
			ORDER BY a.created_at DESC`).
		WithArgs(doctorID).
		WillReturnError(sql.ErrConnDone)

	handler.GetDoctorAppointments(rec, req)

	assert.Equal(t, http.StatusInternalServerError, rec.Code)
	assert.Contains(t, rec.Body.String(), "Failed to fetch appointments")

	if err := mock.ExpectationsWereMet(); err != nil {
		t.Errorf("there were unfulfilled expectations: %s", err)
	}
}
