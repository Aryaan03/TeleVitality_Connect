package handlers

import (
	"backend/models"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/golang-jwt/jwt/v5"
	"github.com/stretchr/testify/assert"
)

// Generate a valid JWT token with doctor role
func generateDoctorToken() string {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": 123, // Mock User ID
		"role":    "doctor",
	})

	tokenString, _ := token.SignedString(jwtSecret)
	return "Bearer " + tokenString
}

func TestGetDoctorProfile(t *testing.T) {
	mockDB, mock, err := sqlmock.New()
	assert.NoError(t, err)
	defer mockDB.Close()

	handler := &DoctorProfileHandler{DB: mockDB}

	// Mock DB response
	rows := sqlmock.NewRows([]string{"first_name", "last_name", "date_of_birth", "gender", "phone_number", "medical_license_number", "issuing_medical_board", "license_expiry_date", "specialization", "years_of_experience", "hospital_name", "work_address", "consultation_type", "availability"}).
		AddRow("John", "Doe", "1985-06-15", "Male", "1234567890", "LIC1234", "Medical Board", "2030-01-01", "Cardiology", 10, "City Hospital", "123 Street, NY", "Online", "{}")

	mock.ExpectQuery(`SELECT .* FROM doctor_profiles WHERE user_id = \$1`).WithArgs(123).WillReturnRows(rows)

	req, _ := http.NewRequest("GET", "/api/doctor/profile", nil)
	req.Header.Set("Authorization", generateDoctorToken())

	rr := httptest.NewRecorder()
	handler.GetDoctorProfile(rr, req)

	assert.Equal(t, http.StatusOK, rr.Code)
	var profile models.DoctorProfile
	err = json.Unmarshal(rr.Body.Bytes(), &profile)
	assert.NoError(t, err)
	assert.Equal(t, "John", profile.FirstName)
	assert.Equal(t, "Doe", profile.LastName)
}
