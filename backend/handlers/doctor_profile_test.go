package handlers

import (
	"backend/models"
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"regexp"
	"strings"
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

func TestGetDoctorProfile_NotFound(t *testing.T) {
	mockDB, mock, _ := sqlmock.New()
	handler := &DoctorProfileHandler{DB: mockDB}

	mock.ExpectQuery(`SELECT .* FROM doctor_profiles`).
		WithArgs(123).
		WillReturnError(sql.ErrNoRows)

	req, _ := http.NewRequest("GET", "/api/doctor/profile", nil)
	req.Header.Set("Authorization", generateDoctorToken())

	rr := httptest.NewRecorder()
	handler.GetDoctorProfile(rr, req)

	assert.Equal(t, http.StatusOK, rr.Code)
	var response models.DoctorProfile
	json.Unmarshal(rr.Body.Bytes(), &response)
	assert.Equal(t, "In-person", response.ConsultationType)
}

func TestGetDoctorProfile_DatabaseError(t *testing.T) {
	mockDB, mock, _ := sqlmock.New()
	handler := &DoctorProfileHandler{DB: mockDB}

	mock.ExpectQuery(`SELECT .* FROM doctor_profiles`).
		WithArgs(123).
		WillReturnError(fmt.Errorf("database connection failed"))

	req, _ := http.NewRequest("GET", "/api/doctor/profile", nil)
	req.Header.Set("Authorization", generateDoctorToken())

	rr := httptest.NewRecorder()
	handler.GetDoctorProfile(rr, req)

	assert.Equal(t, http.StatusInternalServerError, rr.Code)
	assert.Contains(t, rr.Body.String(), "Failed to fetch profile data")
}

func TestGetDoctorProfile_InvalidToken(t *testing.T) {
	mockDB, _, _ := sqlmock.New()
	handler := &DoctorProfileHandler{DB: mockDB}

	req, _ := http.NewRequest("GET", "/api/doctor/profile", nil)
	req.Header.Set("Authorization", "Bearer invalid_token")

	rr := httptest.NewRecorder()
	handler.GetDoctorProfile(rr, req)

	assert.Equal(t, http.StatusUnauthorized, rr.Code)
}

func TestUpdateDoctorProfile_InvalidToken(t *testing.T) {
	mockDB, _, _ := sqlmock.New()
	handler := &DoctorProfileHandler{DB: mockDB}

	req, _ := http.NewRequest("PUT", "/api/doctor/profile", strings.NewReader(`{}`))
	req.Header.Set("Authorization", "Bearer invalid_token")

	rr := httptest.NewRecorder()
	handler.UpdateDoctorProfile(rr, req)

	assert.Equal(t, http.StatusUnauthorized, rr.Code)
}

func TestUpdateDoctorProfile_InvalidRequestBody(t *testing.T) {
	mockDB, _, _ := sqlmock.New()
	handler := &DoctorProfileHandler{DB: mockDB}

	req, _ := http.NewRequest("PUT", "/api/doctor/profile", strings.NewReader(`invalid json`))
	req.Header.Set("Authorization", generateDoctorToken())

	rr := httptest.NewRecorder()
	handler.UpdateDoctorProfile(rr, req)

	assert.Equal(t, http.StatusBadRequest, rr.Code)
}

func TestUpdateDoctorProfile_DatabaseError(t *testing.T) {
	mockDB, mock, _ := sqlmock.New()
	handler := &DoctorProfileHandler{DB: mockDB}

	// Use regexp.QuoteMeta for exact query matching
	mock.ExpectExec(regexp.QuoteMeta(`
        INSERT INTO doctor_profiles (
            user_id, first_name, last_name, date_of_birth, gender, phone_number, 
            medical_license_number, issuing_medical_board, license_expiry_date, 
            specialization, years_of_experience, hospital_name, work_address, 
            consultation_type, availability
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
        ON CONFLICT (user_id) DO UPDATE SET
            first_name = EXCLUDED.first_name,
            last_name = EXCLUDED.last_name,
            date_of_birth = EXCLUDED.date_of_birth,
            gender = EXCLUDED.gender,
            phone_number = EXCLUDED.phone_number,
            medical_license_number = EXCLUDED.medical_license_number,
            issuing_medical_board = EXCLUDED.issuing_medical_board,
            license_expiry_date = EXCLUDED.license_expiry_date,
            specialization = EXCLUDED.specialization,
            years_of_experience = EXCLUDED.years_of_experience,
            hospital_name = EXCLUDED.hospital_name,
            work_address = EXCLUDED.work_address,
            consultation_type = EXCLUDED.consultation_type,
            availability = EXCLUDED.availability`)).
		WillReturnError(fmt.Errorf("database connection failed"))

	validProfile := `{
        "firstName": "John",
        "lastName": "Doe",
        "dateOfBirth": "1985-06-15",
        "gender": "Male",
        "phoneNumber": "1234567890",
        "medicalLicenseNumber": "LIC1234",
        "issuingMedicalBoard": "Medical Board",
        "licenseExpiryDate": "2030-01-01",
        "specialization": "Cardiology",
        "yearsOfExperience": 10,
        "hospitalName": "City Hospital",
        "workAddress": "123 Street, NY",
        "consultationType": "Both",
        "availability": "{}"
    }`

	req, _ := http.NewRequest("PUT", "/api/doctor/profile", strings.NewReader(validProfile))
	req.Header.Set("Authorization", generateDoctorToken())

	rr := httptest.NewRecorder()
	handler.UpdateDoctorProfile(rr, req)

	assert.Equal(t, http.StatusInternalServerError, rr.Code)
}

func TestUpdateDoctorProfile_MissingRequiredFields(t *testing.T) {
	mockDB, mock, _ := sqlmock.New()
	handler := &DoctorProfileHandler{DB: mockDB}

	mock.ExpectExec(`INSERT INTO doctor_profiles`).
		WillReturnError(fmt.Errorf("null value in column \"first_name\""))

	invalidProfile := `{
        "lastName": "Doe",
        "dateOfBirth": "1985-06-15",
        "gender": "Male",
        "phoneNumber": "1234567890",
        "medicalLicenseNumber": "LIC1234",
        "issuingMedicalBoard": "Medical Board",
        "licenseExpiryDate": "2030-01-01",
        "specialization": "Cardiology",
        "yearsOfExperience": 10,
        "hospitalName": "City Hospital",
        "workAddress": "123 Street, NY",
        "consultationType": "Online",
        "availability": "{}"
    }`

	req, _ := http.NewRequest("PUT", "/api/doctor/profile", strings.NewReader(invalidProfile))
	req.Header.Set("Authorization", generateDoctorToken())

	rr := httptest.NewRecorder()
	handler.UpdateDoctorProfile(rr, req)

	assert.Equal(t, http.StatusInternalServerError, rr.Code)
}

func TestUpdateDoctorProfile(t *testing.T) {
	db, mock, err := sqlmock.New()
	assert.NoError(t, err)
	defer db.Close()

	handler := &DoctorProfileHandler{DB: db}

	t.Run("InvalidToken", func(t *testing.T) {
		req := httptest.NewRequest("PUT", "/api/doctor/profile", strings.NewReader("{}"))
		req.Header.Set("Authorization", "Bearer invalid_token")
		rec := httptest.NewRecorder()

		handler.UpdateDoctorProfile(rec, req)

		assert.Equal(t, http.StatusUnauthorized, rec.Code)
		assert.Contains(t, rec.Body.String(), "Invalid token")
	})

	t.Run("InvalidRequestBody", func(t *testing.T) {
		token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{"user_id": 123})
		tokenString, _ := token.SignedString(jwtSecret)

		req := httptest.NewRequest("PUT", "/api/doctor/profile", strings.NewReader("{invalid_json}"))
		req.Header.Set("Authorization", "Bearer "+tokenString)
		rec := httptest.NewRecorder()

		handler.UpdateDoctorProfile(rec, req)

		assert.Equal(t, http.StatusBadRequest, rec.Code)
		assert.Contains(t, rec.Body.String(), "Invalid request body")
	})

	t.Run("DatabaseError", func(t *testing.T) {
		token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{"user_id": 123})
		tokenString, _ := token.SignedString(jwtSecret)

		mock.ExpectExec(regexp.QuoteMeta(`INSERT INTO doctor_profiles`)).
			WillReturnError(fmt.Errorf("database error"))

		req := httptest.NewRequest("PUT", "/api/doctor/profile",
			strings.NewReader(`{"firstName": "John"}`))
		req.Header.Set("Authorization", "Bearer "+tokenString)
		rec := httptest.NewRecorder()

		handler.UpdateDoctorProfile(rec, req)

		assert.Equal(t, http.StatusInternalServerError, rec.Code)
		assert.Contains(t, rec.Body.String(), "Failed to update profile")
	})
}
