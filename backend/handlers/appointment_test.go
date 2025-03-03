package handlers

import (
	"backend/models"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/golang-jwt/jwt/v5"
	"github.com/gorilla/mux"
	"github.com/stretchr/testify/assert"
)

// Helper function to generate a valid JWT token for testing
func generateToken(userID int, role string) string {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": float64(userID), // JWT requires float64 for numeric claims
		"role":    role,
		"exp":     time.Now().Add(time.Hour * 24).Unix(), // Token expires in 24 hours
	})

	tokenString, err := token.SignedString(jwtSecret)
	if err != nil {
		panic(err) // Handle error appropriately in real code
	}
	return "Bearer " + tokenString
}

// TestGetSpecialties tests the GetSpecialties function
func TestGetSpecialties(t *testing.T) {
	mockDB, mock, err := sqlmock.New()
	assert.NoError(t, err)
	defer mockDB.Close()

	handler := &AppointmentHandler{DB: mockDB}

	// Mock DB response
	rows := sqlmock.NewRows([]string{"id", "name"}).
		AddRow(1, "Cardiology").
		AddRow(2, "Dermatology")

	mock.ExpectQuery("SELECT id, name FROM specialties").WillReturnRows(rows)

	req, _ := http.NewRequest("GET", "/api/specialties", nil)
	rr := httptest.NewRecorder()

	handler.GetSpecialties(rr, req)

	assert.Equal(t, http.StatusOK, rr.Code)

	var specialties []models.Specialty
	err = json.Unmarshal(rr.Body.Bytes(), &specialties)
	assert.NoError(t, err)

	assert.Equal(t, 2, len(specialties))
	assert.Equal(t, "Cardiology", specialties[0].Name)
	assert.Equal(t, "Dermatology", specialties[1].Name)

	if err := mock.ExpectationsWereMet(); err != nil {
		t.Errorf("there were unfulfilled expectations: %s", err)
	}
}

// TestGetDoctorsBySpecialty tests the GetDoctorsBySpecialty function
func TestGetDoctorsBySpecialty(t *testing.T) {
	mockDB, mock, err := sqlmock.New()
	assert.NoError(t, err)
	defer mockDB.Close()

	handler := &AppointmentHandler{DB: mockDB}

	// Mock DB response
	rows := sqlmock.NewRows([]string{"user_id", "first_name", "last_name", "specialization", "years_of_experience"}).
		AddRow(101, "Alice", "Smith", "Cardiology", 5).
		AddRow(102, "Bob", "Johnson", "Cardiology", 8)

	mock.ExpectQuery(`SELECT user_id, first_name, last_name, specialization, years_of_experience FROM doctor_profiles WHERE specialization = \(SELECT name FROM specialties WHERE id = \$1\)`).
		WithArgs("1"). // Assuming specialty ID "1" for Cardiology
		WillReturnRows(rows)

	req, _ := http.NewRequest("GET", "/api/doctors?specialty=1", nil) // Use specialty ID in the query
	rr := httptest.NewRecorder()

	handler.GetDoctorsBySpecialty(rr, req)

	assert.Equal(t, http.StatusOK, rr.Code)

	var doctors []models.DoctorProfile
	err = json.Unmarshal(rr.Body.Bytes(), &doctors)
	assert.NoError(t, err)

	assert.Equal(t, 2, len(doctors))
	assert.Equal(t, "Alice", doctors[0].FirstName)
	assert.Equal(t, "Smith", doctors[0].LastName)
	assert.Equal(t, "Cardiology", doctors[0].Specialization)

	if err := mock.ExpectationsWereMet(); err != nil {
		t.Errorf("there were unfulfilled expectations: %s", err)
	}
}

// TestGetDoctorAvailability tests the GetDoctorAvailability function
func TestGetDoctorAvailability(t *testing.T) {
	mockDB, mock, err := sqlmock.New()
	assert.NoError(t, err)
	defer mockDB.Close()

	handler := &AppointmentHandler{DB: mockDB}

	// Mock DB response
	availabilityJSON := `{"monday": ["9:00-17:00"], "tuesday": ["9:00-12:00", "14:00-17:00"]}`
	mock.ExpectQuery("SELECT availability FROM doctor_profiles WHERE user_id = \\$1").
		WithArgs("123").
		WillReturnRows(sqlmock.NewRows([]string{"availability"}).AddRow(availabilityJSON))

	req, _ := http.NewRequest("GET", "/api/doctor/availability?doctor=123", nil)
	rr := httptest.NewRecorder()

	handler.GetDoctorAvailability(rr, req)

	assert.Equal(t, http.StatusOK, rr.Code)
	assert.JSONEq(t, availabilityJSON, rr.Body.String())

	if err := mock.ExpectationsWereMet(); err != nil {
		t.Errorf("there were unfulfilled expectations: %s", err)
	}
}

// TestGetAppointmentHistory tests the GetAppointmentHistory function
func TestGetAppointmentHistory(t *testing.T) {
	mockDB, mock, err := sqlmock.New()
	assert.NoError(t, err)
	defer mockDB.Close()

	handler := &AppointmentHandler{DB: mockDB}

	// Mock JWT token
	tokenString := generateToken(123, "patient")

	req, _ := http.NewRequest("GET", "/api/appointments", nil)
	req.Header.Set("Authorization", tokenString)
	rr := httptest.NewRecorder()

	// Mock DB response
	rows := sqlmock.NewRows([]string{"id", "patient_id", "doctor_id", "appointment_time", "problem_description", "status", "first_name", "last_name"}).
		AddRow(1, 123, 456, `{"date": "2024-03-05", "time": "14:00"}`, "Cough", "Scheduled", "Jane", "Doe").
		AddRow(2, 123, 789, `{"date": "2024-03-06", "time": "16:00"}`, "Fever", "Completed", "John", "Smith")

	mock.ExpectQuery(`
            SELECT 
                a.id, 
                a.patient_id, 
                a.doctor_id, 
                a.appointment_time, 
                a.problem_description, 
                a.status, 
                d.first_name, 
                d.last_name
            FROM appointments a
            JOIN doctor_profiles d ON a.doctor_id = d.user_id
            WHERE a.patient_id = \$1
            ORDER BY a.created_at DESC`).WithArgs(123).WillReturnRows(rows)

	handler.GetAppointmentHistory(rr, req)

	assert.Equal(t, http.StatusOK, rr.Code)

	var appointments []models.Appointment
	err = json.Unmarshal(rr.Body.Bytes(), &appointments)
	assert.NoError(t, err)

	assert.Equal(t, 2, len(appointments))
	assert.Equal(t, "Cough", appointments[0].ProblemDescription)
	assert.Equal(t, "Jane Doe", appointments[0].DoctorName)

	if err := mock.ExpectationsWereMet(); err != nil {
		t.Errorf("there were unfulfilled expectations: %s", err)
	}
}

// TestGetDoctorAppointments tests the GetDoctorAppointments function
func TestGetDoctorAppointments(t *testing.T) {
	mockDB, mock, err := sqlmock.New()
	assert.NoError(t, err)
	defer mockDB.Close()

	handler := &AppointmentHandler{DB: mockDB}

	// Mock JWT token for doctor with ID 456
	tokenString := generateToken(456, "doctor")

	req, _ := http.NewRequest("GET", "/api/doctor/appointments", nil)
	req.Header.Set("Authorization", tokenString)
	rr := httptest.NewRecorder()

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
			ORDER BY a.created_at DESC`).WithArgs(456).WillReturnRows(rows)

	handler.GetDoctorAppointments(rr, req)

	assert.Equal(t, http.StatusOK, rr.Code)

	var appointments []map[string]interface{}
	err = json.Unmarshal(rr.Body.Bytes(), &appointments)
	assert.NoError(t, err)

	assert.Equal(t, 2, len(appointments))
	assert.Equal(t, "Cough", appointments[0]["problem_description"])
	assert.Equal(t, "Jane Doe", appointments[0]["patient_name"])

	if err := mock.ExpectationsWereMet(); err != nil {
		t.Errorf("there were unfulfilled expectations: %s", err)
	}
}

// TestCancelAppointment tests the CancelAppointment function
func TestCancelAppointment(t *testing.T) {
	mockDB, mock, err := sqlmock.New()
	assert.NoError(t, err)
	defer mockDB.Close()

	handler := &AppointmentHandler{DB: mockDB}

	// Mock JWT token for doctor with ID 456
	tokenString := generateToken(456, "doctor")

	// Create a request with the appointment ID in the URL
	req := httptest.NewRequest("DELETE", "/api/appointments/1", nil)
	req = mux.SetURLVars(req, map[string]string{"id": "1"}) // Set URL variable using mux
	req.Header.Set("Authorization", tokenString)
	rr := httptest.NewRecorder()

	// Expect database interaction
	mock.ExpectQuery("SELECT COUNT\\(\\*\\) FROM appointments WHERE id = \\$1 AND doctor_id = \\$2").
		WithArgs("1", 456).
		WillReturnRows(sqlmock.NewRows([]string{"count"}).AddRow(1)) // Appointment exists and belongs to the doctor

	mock.ExpectExec("UPDATE appointments SET status = 'Cancelled' WHERE id = \\$1").
		WithArgs("1").
		WillReturnResult(sqlmock.NewResult(0, 1)) // One row affected

	handler.CancelAppointment(rr, req)

	assert.Equal(t, http.StatusOK, rr.Code)

	var response map[string]string
	err = json.Unmarshal(rr.Body.Bytes(), &response)
	assert.NoError(t, err)
	assert.Equal(t, "Appointment cancelled successfully", response["message"])

	if err := mock.ExpectationsWereMet(); err != nil {
		t.Errorf("there were unfulfilled expectations: %s", err)
	}
}
