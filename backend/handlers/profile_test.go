package handlers

import (
	"backend/models"
	"bytes"
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
	"time"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/golang-jwt/jwt/v5"
	"github.com/stretchr/testify/assert"
)

func generateTestToken(userID int) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": float64(userID),
		"role":    "patient",
		"exp":     time.Now().Add(time.Hour * 24).Unix(),
	})

	return token.SignedString(jwtSecret)
}

func TestGetProfile(t *testing.T) {
	db, mock, err := sqlmock.New()
	assert.NoError(t, err)
	defer db.Close()

	handler := ProfileHandler{DB: db}

	t.Run("Existing Profile", func(t *testing.T) {
		userID := 1
		tokenString, err := generateTestToken(userID)
		assert.NoError(t, err)

		mock.ExpectQuery("SELECT first_name, last_name, date_of_birth, gender, phone_number, address, problem_description, emergency_appointment, preferred_communication, preferred_doctor, insurance_provider, insurance_policy_number, consent_telemedicine FROM profiles WHERE user_id = \\$1").
			WithArgs(userID).
			WillReturnRows(sqlmock.NewRows([]string{
				"first_name", "last_name", "date_of_birth", "gender", "phone_number",
				"address", "problem_description", "emergency_appointment",
				"preferred_communication", "preferred_doctor",
				"insurance_provider", "insurance_policy_number", "consent_telemedicine",
			}).AddRow(
				"John", "Doe", "1990-01-01", "Male", "1234567890",
				"123 Main St", "Headache", "no",
				"email", "drSmith",
				"HealthCo", "H12345", true,
			))

		req := httptest.NewRequest("GET", "/api/protected/profile", nil)
		req.Header.Set("Authorization", "Bearer "+tokenString)
		rec := httptest.NewRecorder()

		handler.GetProfile(rec, req)

		assert.Equal(t, http.StatusOK, rec.Code)

		var profile models.Profile
		err = json.NewDecoder(rec.Body).Decode(&profile)
		assert.NoError(t, err)

		assert.Equal(t, "John", profile.FirstName)
		assert.Equal(t, "Doe", profile.LastName)
		assert.Equal(t, "1990-01-01", profile.DateOfBirth)
		assert.Equal(t, "Male", profile.Gender)
		assert.Equal(t, "1234567890", profile.PhoneNumber)
		assert.Equal(t, "123 Main St", profile.Address)
		assert.Equal(t, "Headache", profile.ProblemDescription)
		assert.Equal(t, "no", profile.EmergencyAppointment)
		assert.Equal(t, "email", profile.PreferredCommunication)
		assert.Equal(t, "drSmith", profile.PreferredDoctor)
		assert.Equal(t, "HealthCo", profile.InsuranceProvider)
		assert.Equal(t, "H12345", profile.InsurancePolicyNumber)
		assert.Equal(t, true, profile.ConsentTelemedicine)
	})

	t.Run("No Existing Profile", func(t *testing.T) {
		userID := 2
		tokenString, err := generateTestToken(userID)
		assert.NoError(t, err)

		mock.ExpectQuery("SELECT first_name, last_name, date_of_birth, gender, phone_number, address, problem_description, emergency_appointment, preferred_communication, preferred_doctor, insurance_provider, insurance_policy_number, consent_telemedicine FROM profiles WHERE user_id = \\$1").
			WithArgs(userID).
			WillReturnError(sql.ErrNoRows)

		req := httptest.NewRequest("GET", "/api/protected/profile", nil)
		req.Header.Set("Authorization", "Bearer "+tokenString)
		rec := httptest.NewRecorder()

		handler.GetProfile(rec, req)

		assert.Equal(t, http.StatusOK, rec.Code)

		var profile models.Profile
		err = json.NewDecoder(rec.Body).Decode(&profile)
		assert.NoError(t, err)

		assert.Equal(t, userID, profile.UserID)
		assert.Equal(t, "email", profile.PreferredCommunication)
		assert.Equal(t, "drSmith", profile.PreferredDoctor)
		assert.Equal(t, "no", profile.EmergencyAppointment)
	})

	t.Run("Invalid Token", func(t *testing.T) {
		invalidToken := "invalid.token.string"

		req := httptest.NewRequest("GET", "/api/protected/profile", nil)
		req.Header.Set("Authorization", "Bearer "+invalidToken)
		rec := httptest.NewRecorder()

		handler.GetProfile(rec, req)

		assert.Equal(t, http.StatusUnauthorized, rec.Code)
		assert.Contains(t, rec.Body.String(), "Invalid token")
	})

	t.Run("Database Error", func(t *testing.T) {
		userID := 3
		tokenString, err := generateTestToken(userID)
		assert.NoError(t, err)

		mock.ExpectQuery("SELECT first_name, last_name, date_of_birth, gender, phone_number, address, problem_description, emergency_appointment, preferred_communication, preferred_doctor, insurance_provider, insurance_policy_number, consent_telemedicine FROM profiles WHERE user_id = \\$1").
			WithArgs(userID).
			WillReturnError(sql.ErrConnDone)

		req := httptest.NewRequest("GET", "/api/protected/profile", nil)
		req.Header.Set("Authorization", "Bearer "+tokenString)
		rec := httptest.NewRecorder()

		handler.GetProfile(rec, req)

		assert.Equal(t, http.StatusInternalServerError, rec.Code)
		assert.Contains(t, rec.Body.String(), "Failed to fetch profile data")
	})
}

func TestUpdateProfile(t *testing.T) {
	db, mock, err := sqlmock.New()
	assert.NoError(t, err)
	defer db.Close()

	handler := ProfileHandler{DB: db}

	t.Run("Successful Update", func(t *testing.T) {
		userID := 1
		tokenString, err := generateTestToken(userID)
		assert.NoError(t, err)

		profileData := models.Profile{
			FirstName:              "Jane",
			LastName:               "Doe",
			DateOfBirth:            "1995-05-15",
			Gender:                 "Female",
			PhoneNumber:            "9876543210",
			Address:                "456 Oak St",
			ProblemDescription:     "Back pain",
			EmergencyAppointment:   "no",
			PreferredCommunication: "phone",
			PreferredDoctor:        "drJohnson",
			InsuranceProvider:      "MediSure",
			InsurancePolicyNumber:  "M67890",
			ConsentTelemedicine:    true,
		}

		mock.ExpectExec("INSERT INTO profiles").
			WithArgs(
				float64(userID), profileData.FirstName, profileData.LastName, profileData.DateOfBirth,
				profileData.Gender, profileData.PhoneNumber, profileData.Address,
				profileData.ProblemDescription, profileData.EmergencyAppointment,
				profileData.PreferredCommunication, profileData.PreferredDoctor,
				profileData.InsuranceProvider, profileData.InsurancePolicyNumber,
				profileData.ConsentTelemedicine,
			).
			WillReturnResult(sqlmock.NewResult(1, 1))

		body, err := json.Marshal(profileData)
		assert.NoError(t, err)

		req := httptest.NewRequest("PUT", "/api/protected/profile", bytes.NewBuffer(body))
		req.Header.Set("Content-Type", "application/json")
		req.Header.Set("Authorization", "Bearer "+tokenString)
		rec := httptest.NewRecorder()

		handler.UpdateProfile(rec, req)

		assert.Equal(t, http.StatusOK, rec.Code)
		assert.Contains(t, rec.Body.String(), "Profile updated successfully")
	})

	t.Run("Invalid Request Body", func(t *testing.T) {
		userID := 1
		tokenString, err := generateTestToken(userID)
		assert.NoError(t, err)

		invalidJSON := `{"firstName": "Jane", "lastName": INVALID_JSON}`

		req := httptest.NewRequest("PUT", "/api/protected/profile", bytes.NewBuffer([]byte(invalidJSON)))
		req.Header.Set("Content-Type", "application/json")
		req.Header.Set("Authorization", "Bearer "+tokenString)
		rec := httptest.NewRecorder()

		handler.UpdateProfile(rec, req)

		assert.Equal(t, http.StatusBadRequest, rec.Code)
		assert.Contains(t, rec.Body.String(), "Invalid request body")
	})

	t.Run("Database Error During Update", func(t *testing.T) {
		userID := 1
		tokenString, err := generateTestToken(userID)
		assert.NoError(t, err)

		profileData := models.Profile{
			FirstName: "Jane",
			LastName:  "Doe",
		}

		mock.ExpectExec("INSERT INTO profiles").
			WithArgs(
				sqlmock.AnyArg(), sqlmock.AnyArg(), sqlmock.AnyArg(), sqlmock.AnyArg(),
				sqlmock.AnyArg(), sqlmock.AnyArg(), sqlmock.AnyArg(),
				sqlmock.AnyArg(), sqlmock.AnyArg(),
				sqlmock.AnyArg(), sqlmock.AnyArg(),
				sqlmock.AnyArg(), sqlmock.AnyArg(),
				sqlmock.AnyArg(),
			).
			WillReturnError(sql.ErrConnDone)

		body, err := json.Marshal(profileData)
		assert.NoError(t, err)

		req := httptest.NewRequest("PUT", "/api/protected/profile", bytes.NewBuffer(body))
		req.Header.Set("Content-Type", "application/json")
		req.Header.Set("Authorization", "Bearer "+tokenString)
		rec := httptest.NewRecorder()

		handler.UpdateProfile(rec, req)

		assert.Equal(t, http.StatusInternalServerError, rec.Code)
		assert.Contains(t, rec.Body.String(), "Failed to update profile")
	})

	t.Run("Invalid Token", func(t *testing.T) {
		invalidToken := "invalid.token.string"

		profileData := models.Profile{
			FirstName: "Jane",
			LastName:  "Doe",
		}

		body, err := json.Marshal(profileData)
		assert.NoError(t, err)

		req := httptest.NewRequest("PUT", "/api/protected/profile", bytes.NewBuffer(body))
		req.Header.Set("Content-Type", "application/json")
		req.Header.Set("Authorization", "Bearer "+invalidToken)
		rec := httptest.NewRecorder()

		handler.UpdateProfile(rec, req)

		assert.Equal(t, http.StatusUnauthorized, rec.Code)
		assert.Contains(t, rec.Body.String(), "Invalid token")
	})
}

// func TestGetProfile_DatabaseScanError(t *testing.T) {
// 	mockDB, mock, _ := sqlmock.New()
// 	handler := &ProfileHandler{DB: mockDB}

// 	userID := 1
// 	tokenString, _ := generateTestToken(userID)

// 	// Set up mock rows with correct number of columns but wrong types
// 	columns := []string{
// 		"first_name", "last_name", "date_of_birth", "gender", "phone_number",
// 		"address", "problem_description", "emergency_appointment",
// 		"preferred_communication", "preferred_doctor",
// 		"insurance_provider", "insurance_policy_number", "consent_telemedicine",
// 	}

// 	// The error will happen during Scan because we're returning a row with
// 	// integer for phone_number when it expects a string
// 	rows := sqlmock.NewRows(columns).
// 		AddRow("John", "Doe", "1990-01-01", "Male", 1234567890, // phone_number as int
// 			"123 Main St", "Headache", "no",
// 			"email", "drSmith",
// 			"HealthCo", "H12345", true)

// 	mock.ExpectQuery("SELECT first_name, last_name, date_of_birth, gender, phone_number, address, problem_description, emergency_appointment, preferred_communication, preferred_doctor, insurance_provider, insurance_policy_number, consent_telemedicine FROM profiles WHERE user_id = \\$1").
// 		WithArgs(userID).
// 		WillReturnRows(rows)

// 	req := httptest.NewRequest("GET", "/api/protected/profile", nil)
// 	req.Header.Set("Authorization", "Bearer "+tokenString)
// 	rec := httptest.NewRecorder()

// 	handler.GetProfile(rec, req)
// 	assert.Equal(t, http.StatusInternalServerError, rec.Code)
// 	assert.Contains(t, rec.Body.String(), "Failed to fetch profile data")
// }

func TestUpdateProfile_MissingRequiredFields(t *testing.T) {
	mockDB, mock, _ := sqlmock.New()
	handler := &ProfileHandler{DB: mockDB}

	userID := 1
	tokenString, _ := generateTestToken(userID)

	// Create a profile with missing required fields
	incompleteProfile := `{
        "lastName": "Doe",
        "phoneNumber": "1234567890"
    }`

	// Mock database to return error on missing required fields
	mock.ExpectExec("INSERT INTO profiles").
		WithArgs(
			float64(userID), "", "Doe", "", "",
			"1234567890", "", "", "",
			"", "", "", "", false,
		).
		WillReturnError(fmt.Errorf("null value in column \"first_name\""))

	req := httptest.NewRequest("PUT", "/api/protected/profile", strings.NewReader(incompleteProfile))
	req.Header.Set("Authorization", "Bearer "+tokenString)
	req.Header.Set("Content-Type", "application/json")
	rec := httptest.NewRecorder()

	handler.UpdateProfile(rec, req)
	assert.Equal(t, http.StatusBadRequest, rec.Code)
	assert.Contains(t, rec.Body.String(), "Missing required fields")
}

func TestUpdateProfile_InvalidDataTypes(t *testing.T) {
	mockDB, _, _ := sqlmock.New()
	handler := &ProfileHandler{DB: mockDB}

	userID := 1
	tokenString, _ := generateTestToken(userID)

	// This JSON has invalid data types (firstName is a number, not a string)
	invalidProfile := `{
        "firstName": 123,
        "consentTelemedicine": "not-a-boolean"
    }`

	req := httptest.NewRequest("PUT", "/api/protected/profile", strings.NewReader(invalidProfile))
	req.Header.Set("Authorization", "Bearer "+tokenString)
	req.Header.Set("Content-Type", "application/json")
	rec := httptest.NewRecorder()

	handler.UpdateProfile(rec, req)
	assert.Equal(t, http.StatusBadRequest, rec.Code)
	assert.Contains(t, rec.Body.String(), "Invalid data types")
}

func TestUpdateProfile_ZeroRowsAffected(t *testing.T) {
	mockDB, mock, _ := sqlmock.New()
	handler := &ProfileHandler{DB: mockDB}

	userID := 1
	tokenString, _ := generateTestToken(userID)

	validProfile := `{
        "firstName": "John",
        "lastName": "Doe",
        "phoneNumber": "1234567890"
    }`

	// Mock database to return 0 rows affected
	mock.ExpectExec("INSERT INTO profiles").
		WithArgs(
			float64(userID), "John", "Doe", "", "",
			"1234567890", "", "", "",
			"", "", "", "", false,
		).
		WillReturnResult(sqlmock.NewResult(0, 0))

	req := httptest.NewRequest("PUT", "/api/protected/profile", strings.NewReader(validProfile))
	req.Header.Set("Authorization", "Bearer "+tokenString)
	req.Header.Set("Content-Type", "application/json")
	rec := httptest.NewRecorder()

	handler.UpdateProfile(rec, req)
	assert.Equal(t, http.StatusBadRequest, rec.Code)
	assert.Contains(t, rec.Body.String(), "No profile was updated or created")
}
