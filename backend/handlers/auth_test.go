package handlers

import (
	"backend/models"
	"bytes"
	"database/sql"
	"encoding/json"
	"errors"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/golang-jwt/jwt/v5"
	"github.com/stretchr/testify/assert"
	"golang.org/x/crypto/bcrypt"
)

func TestRegister(t *testing.T) {
	db, mock, err := sqlmock.New()
	assert.NoError(t, err)
	defer db.Close()

	handler := AuthHandler{DB: db}

	mock.ExpectQuery("SELECT EXISTS\\(SELECT 1 FROM users WHERE username=\\$1\\)").
		WithArgs("testuser").
		WillReturnRows(sqlmock.NewRows([]string{"exists"}).AddRow(false))

	mock.ExpectQuery("SELECT EXISTS\\(SELECT 1 FROM users WHERE email=\\$1\\)").
		WithArgs("test@example.com").
		WillReturnRows(sqlmock.NewRows([]string{"exists"}).AddRow(false))

	mock.ExpectExec("INSERT INTO users \\(username, email, password_hash\\) VALUES").
		WithArgs("testuser", "test@example.com", sqlmock.AnyArg()).
		WillReturnResult(sqlmock.NewResult(1, 1))

	reqBody := models.User{
		Username: "testuser",
		Email:    "test@example.com",
		Password: "password123",
	}
	body, _ := json.Marshal(reqBody)

	req := httptest.NewRequest("POST", "/api/register", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	rec := httptest.NewRecorder()

	handler.Register(rec, req)

	assert.Equal(t, http.StatusCreated, rec.Code)
	expectedResponse := `{"message":"User created successfully"}`
	assert.JSONEq(t, expectedResponse, rec.Body.String())

	if err := mock.ExpectationsWereMet(); err != nil {
		t.Errorf("there were unfulfilled expectations: %s", err)
	}
}

func TestLogin(t *testing.T) {
	db, mock, err := sqlmock.New()
	assert.NoError(t, err)
	defer db.Close()

	handler := AuthHandler{DB: db}

	// Mock user data
	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte("password123"), bcrypt.DefaultCost)
	mock.ExpectQuery("SELECT id, username, password_hash FROM users WHERE username=\\$1").
		WithArgs("testuser").
		WillReturnRows(sqlmock.NewRows([]string{"id", "username", "password_hash"}).
			AddRow(1, "testuser", string(hashedPassword)))

	reqBody := `{"username":"testuser", "password":"password123"}`
	req := httptest.NewRequest("POST", "/api/login", bytes.NewBuffer([]byte(reqBody)))
	req.Header.Set("Content-Type", "application/json")
	rec := httptest.NewRecorder()

	handler.Login(rec, req)

	assert.Equal(t, http.StatusOK, rec.Code)
}

func TestDoctorRegister(t *testing.T) {
	db, mock, err := sqlmock.New()
	assert.NoError(t, err)
	defer db.Close()

	handler := AuthHandler{DB: db}

	mock.ExpectQuery("SELECT EXISTS\\(SELECT 1 FROM doctors WHERE username=\\$1\\)").
		WithArgs("testdoctor").
		WillReturnRows(sqlmock.NewRows([]string{"exists"}).AddRow(false))

	mock.ExpectQuery("SELECT EXISTS\\(SELECT 1 FROM doctors WHERE email=\\$1\\)").
		WithArgs("doctor@example.com").
		WillReturnRows(sqlmock.NewRows([]string{"exists"}).AddRow(false))

	mock.ExpectExec("INSERT INTO doctors \\(username, email, password_hash\\) VALUES").
		WithArgs("testdoctor", "doctor@example.com", sqlmock.AnyArg()).
		WillReturnResult(sqlmock.NewResult(1, 1))

	reqBody := models.Doctor{
		Username: "testdoctor",
		Email:    "doctor@example.com",
		Password: "password123",
	}
	body, _ := json.Marshal(reqBody)

	req := httptest.NewRequest("POST", "/api/docregister", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	rec := httptest.NewRecorder()

	handler.DoctorRegister(rec, req)

	assert.Equal(t, http.StatusCreated, rec.Code)
	expectedResponse := `{"message":"User created successfully"}`
	assert.JSONEq(t, expectedResponse, rec.Body.String())

	if err := mock.ExpectationsWereMet(); err != nil {
		t.Errorf("there were unfulfilled expectations: %s", err)
	}
}

func TestDoctorLogin(t *testing.T) {
	db, mock, err := sqlmock.New()
	assert.NoError(t, err)
	defer db.Close()

	handler := AuthHandler{DB: db}

	// Mock user data
	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte("password456"), bcrypt.DefaultCost)
	mock.ExpectQuery("SELECT id, username, password_hash FROM doctors WHERE username=\\$1").
		WithArgs("doctor2").
		WillReturnRows(sqlmock.NewRows([]string{"id", "username", "password_hash"}).
			AddRow(1, "doctor2", string(hashedPassword)))

	reqBody := `{"username":"doctor2", "password":"password456"}`
	req := httptest.NewRequest("POST", "/api/doclogin", bytes.NewBuffer([]byte(reqBody)))
	req.Header.Set("Content-Type", "application/json")
	rec := httptest.NewRecorder()

	handler.DoctorLogin(rec, req)

	assert.Equal(t, http.StatusOK, rec.Code)
}

func TestRegister_UsernameExists(t *testing.T) {
	db, mock, _ := sqlmock.New()
	handler := AuthHandler{DB: db}

	mock.ExpectQuery("SELECT EXISTS\\(SELECT 1 FROM users WHERE username=\\$1\\)").
		WithArgs("existinguser").
		WillReturnRows(sqlmock.NewRows([]string{"exists"}).AddRow(true))

	reqBody := models.User{Username: "existinguser", Email: "test@example.com", Password: "password123"}
	body, _ := json.Marshal(reqBody)

	req := httptest.NewRequest("POST", "/api/register", bytes.NewBuffer(body))
	rec := httptest.NewRecorder()

	handler.Register(rec, req)
	assert.Equal(t, http.StatusConflict, rec.Code)
	assert.Contains(t, rec.Body.String(), "Username already exists")
}

func TestRegister_EmailExists(t *testing.T) {
	db, mock, _ := sqlmock.New()
	handler := AuthHandler{DB: db}

	mock.ExpectQuery("SELECT EXISTS\\(SELECT 1 FROM users WHERE username=\\$1\\)").
		WillReturnRows(sqlmock.NewRows([]string{"exists"}).AddRow(false))
	mock.ExpectQuery("SELECT EXISTS\\(SELECT 1 FROM users WHERE email=\\$1\\)").
		WithArgs("existing@example.com").
		WillReturnRows(sqlmock.NewRows([]string{"exists"}).AddRow(true))

	reqBody := models.User{Username: "newuser", Email: "existing@example.com", Password: "password123"}
	body, _ := json.Marshal(reqBody)

	req := httptest.NewRequest("POST", "/api/register", bytes.NewBuffer(body))
	rec := httptest.NewRecorder()

	handler.Register(rec, req)
	assert.Equal(t, http.StatusConflict, rec.Code)
	assert.Contains(t, rec.Body.String(), "Email already exists")
}

func TestLogin_InvalidPassword(t *testing.T) {
	db, mock, _ := sqlmock.New()
	handler := AuthHandler{DB: db}

	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte("correctpass"), bcrypt.DefaultCost)
	mock.ExpectQuery("SELECT id, username, password_hash FROM users WHERE username=\\$1").
		WithArgs("testuser").
		WillReturnRows(sqlmock.NewRows([]string{"id", "username", "password_hash"}).
			AddRow(1, "testuser", string(hashedPassword)))

	reqBody := `{"username":"testuser", "password":"wrongpass"}`
	req := httptest.NewRequest("POST", "/api/login", bytes.NewBuffer([]byte(reqBody)))
	rec := httptest.NewRecorder()

	handler.Login(rec, req)
	assert.Equal(t, http.StatusUnauthorized, rec.Code)
	assert.Contains(t, rec.Body.String(), "Invalid username or password")
}

func TestLogin_UserNotFound(t *testing.T) {
	db, mock, _ := sqlmock.New()
	handler := AuthHandler{DB: db}

	mock.ExpectQuery("SELECT id, username, password_hash FROM users WHERE username=\\$1").
		WithArgs("nonexistent").
		WillReturnError(sql.ErrNoRows)

	reqBody := `{"username":"nonexistent", "password":"pass"}`
	req := httptest.NewRequest("POST", "/api/login", bytes.NewBuffer([]byte(reqBody)))
	rec := httptest.NewRecorder()

	handler.Login(rec, req)
	assert.Equal(t, http.StatusUnauthorized, rec.Code)
	assert.Contains(t, rec.Body.String(), "Invalid username or password")
}

func TestProtectedDashboard_ValidToken(t *testing.T) {
	db, _, _ := sqlmock.New()
	handler := AuthHandler{DB: db}

	// Generate valid token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"username": "testuser",
		"user_id":  1,
		"exp":      time.Now().Add(time.Hour).Unix(),
	})
	tokenString, _ := token.SignedString(jwtSecret)

	req := httptest.NewRequest("GET", "/api/dashboard", nil)
	req.Header.Set("Authorization", "Bearer "+tokenString)
	rec := httptest.NewRecorder()

	handler.ProtectedDashboard(rec, req)
	assert.Equal(t, http.StatusOK, rec.Code)
	assert.Contains(t, rec.Body.String(), "Welcome to the protected dashboard")
}

func TestProtectedDashboard_InvalidToken(t *testing.T) {
	db, _, _ := sqlmock.New()
	handler := AuthHandler{DB: db}

	req := httptest.NewRequest("GET", "/api/dashboard", nil)
	req.Header.Set("Authorization", "Bearer invalidtoken")
	rec := httptest.NewRecorder()

	handler.ProtectedDashboard(rec, req)
	assert.Equal(t, http.StatusUnauthorized, rec.Code)
}

func TestDoctorLogin_RoleVerification(t *testing.T) {
	db, mock, _ := sqlmock.New()
	handler := AuthHandler{DB: db}

	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte("password456"), bcrypt.DefaultCost)
	mock.ExpectQuery("SELECT id, username, password_hash FROM doctors WHERE username=\\$1").
		WillReturnRows(sqlmock.NewRows([]string{"id", "username", "password_hash"}).
			AddRow(1, "testdoctor", string(hashedPassword)))

	reqBody := `{"username":"testdoctor", "password":"password456"}`
	req := httptest.NewRequest("POST", "/api/doclogin", bytes.NewBuffer([]byte(reqBody)))
	rec := httptest.NewRecorder()

	handler.DoctorLogin(rec, req)

	var response map[string]string
	json.Unmarshal(rec.Body.Bytes(), &response)
	assert.NotEmpty(t, response["token"])
}

func TestSendResetCode(t *testing.T) {
	db, mock, err := sqlmock.New()
	assert.NoError(t, err)
	defer db.Close()

	handler := AuthHandler{
		DB:          db,
		SendGridKey: "mock-sendgrid-key",
	}

	t.Run("Success", func(t *testing.T) {

		mock.ExpectExec("INSERT INTO password_reset_codes").
			WithArgs("test@example.com", sqlmock.AnyArg()).
			WillReturnResult(sqlmock.NewResult(1, 1))

		// Create request
		reqBody := `{"email":"test@example.com"}`
		req := httptest.NewRequest("POST", "/api/reset-code", bytes.NewBuffer([]byte(reqBody)))
		req.Header.Set("Content-Type", "application/json")
		rec := httptest.NewRecorder()

		// Test will pass as long as DB operation succeeds (we can't easily mock SendGrid)
		handler.SendResetCode(rec, req)

		assert.Equal(t, http.StatusOK, rec.Code)
		assert.Contains(t, rec.Body.String(), "Code sent")

		if err := mock.ExpectationsWereMet(); err != nil {
			t.Errorf("unfulfilled expectations: %s", err)
		}
	})

	t.Run("DatabaseError", func(t *testing.T) {
		// Mock database error
		mock.ExpectExec("INSERT INTO password_reset_codes").
			WithArgs("test@example.com", sqlmock.AnyArg()).
			WillReturnError(errors.New("database error"))

		// Create request
		reqBody := `{"email":"test@example.com"}`
		req := httptest.NewRequest("POST", "/api/reset-code", bytes.NewBuffer([]byte(reqBody)))
		req.Header.Set("Content-Type", "application/json")
		rec := httptest.NewRecorder()

		handler.SendResetCode(rec, req)

		assert.Equal(t, http.StatusInternalServerError, rec.Code)
		assert.Contains(t, rec.Body.String(), "Database operation failed")

		if err := mock.ExpectationsWereMet(); err != nil {
			t.Errorf("unfulfilled expectations: %s", err)
		}
	})

	t.Run("InvalidRequest", func(t *testing.T) {
		reqBody := `{invalid json}`
		req := httptest.NewRequest("POST", "/api/reset-code", bytes.NewBuffer([]byte(reqBody)))
		req.Header.Set("Content-Type", "application/json")
		rec := httptest.NewRecorder()

		handler.SendResetCode(rec, req)

		assert.Equal(t, http.StatusBadRequest, rec.Code)
		assert.Contains(t, rec.Body.String(), "Invalid request")
	})
}

func TestVerifyResetCode(t *testing.T) {
	db, mock, err := sqlmock.New()
	assert.NoError(t, err)
	defer db.Close()

	handler := AuthHandler{DB: db}

	t.Run("Success", func(t *testing.T) {
		// Future expiration time (10 minutes from now)
		expiresAt := time.Now().Add(10 * time.Minute)

		// Mock database interaction
		mock.ExpectQuery("SELECT code, expires_at FROM password_reset_codes WHERE email = \\$1").
			WithArgs("test@example.com").
			WillReturnRows(sqlmock.NewRows([]string{"code", "expires_at"}).
				AddRow("123456", expiresAt))

		// Mock the deletion of used code
		mock.ExpectExec("DELETE FROM password_reset_codes WHERE email = \\$1").
			WithArgs("test@example.com").
			WillReturnResult(sqlmock.NewResult(1, 1))

		// Create request
		reqBody := `{"email":"test@example.com", "code":"123456"}`
		req := httptest.NewRequest("POST", "/api/verify-reset-code", bytes.NewBuffer([]byte(reqBody)))
		req.Header.Set("Content-Type", "application/json")
		rec := httptest.NewRecorder()

		handler.VerifyResetCode(rec, req)

		// Check response
		assert.Equal(t, http.StatusOK, rec.Code)

		// Parse response to verify it contains reset_token
		var response map[string]string
		json.Unmarshal(rec.Body.Bytes(), &response)
		assert.NotEmpty(t, response["reset_token"])

		if err := mock.ExpectationsWereMet(); err != nil {
			t.Errorf("unfulfilled expectations: %s", err)
		}
	})

	t.Run("ExpiredCode", func(t *testing.T) {
		// Past expiration time (10 minutes ago)
		expiresAt := time.Now().Add(-10 * time.Minute)

		// Mock database interaction
		mock.ExpectQuery("SELECT code, expires_at FROM password_reset_codes WHERE email = \\$1").
			WithArgs("test@example.com").
			WillReturnRows(sqlmock.NewRows([]string{"code", "expires_at"}).
				AddRow("123456", expiresAt))

		// Create request
		reqBody := `{"email":"test@example.com", "code":"123456"}`
		req := httptest.NewRequest("POST", "/api/verify-reset-code", bytes.NewBuffer([]byte(reqBody)))
		req.Header.Set("Content-Type", "application/json")
		rec := httptest.NewRecorder()

		handler.VerifyResetCode(rec, req)

		assert.Equal(t, http.StatusUnauthorized, rec.Code)
		assert.Contains(t, rec.Body.String(), "Expired code")

		if err := mock.ExpectationsWereMet(); err != nil {
			t.Errorf("unfulfilled expectations: %s", err)
		}
	})

	t.Run("InvalidCode", func(t *testing.T) {
		// Future expiration time
		expiresAt := time.Now().Add(10 * time.Minute)

		// Mock database interaction
		mock.ExpectQuery("SELECT code, expires_at FROM password_reset_codes WHERE email = \\$1").
			WithArgs("test@example.com").
			WillReturnRows(sqlmock.NewRows([]string{"code", "expires_at"}).
				AddRow("123456", expiresAt))

		// Create request with incorrect code
		reqBody := `{"email":"test@example.com", "code":"654321"}`
		req := httptest.NewRequest("POST", "/api/verify-reset-code", bytes.NewBuffer([]byte(reqBody)))
		req.Header.Set("Content-Type", "application/json")
		rec := httptest.NewRecorder()

		handler.VerifyResetCode(rec, req)

		assert.Equal(t, http.StatusUnauthorized, rec.Code)
		assert.Contains(t, rec.Body.String(), "Invalid code")

		if err := mock.ExpectationsWereMet(); err != nil {
			t.Errorf("unfulfilled expectations: %s", err)
		}
	})

	t.Run("NoCodeFound", func(t *testing.T) {
		// Mock database interaction
		mock.ExpectQuery("SELECT code, expires_at FROM password_reset_codes WHERE email = \\$1").
			WithArgs("nonexistent@example.com").
			WillReturnError(sql.ErrNoRows)

		// Create request
		reqBody := `{"email":"nonexistent@example.com", "code":"123456"}`
		req := httptest.NewRequest("POST", "/api/verify-reset-code", bytes.NewBuffer([]byte(reqBody)))
		req.Header.Set("Content-Type", "application/json")
		rec := httptest.NewRecorder()

		handler.VerifyResetCode(rec, req)

		assert.Equal(t, http.StatusUnauthorized, rec.Code)
		assert.Contains(t, rec.Body.String(), "No code found for email")

		if err := mock.ExpectationsWereMet(); err != nil {
			t.Errorf("unfulfilled expectations: %s", err)
		}
	})
}

func TestResetPassword(t *testing.T) {
	db, mock, err := sqlmock.New()
	assert.NoError(t, err)
	defer db.Close()

	handler := AuthHandler{DB: db}

	// Create a valid reset token for testing
	validToken := createValidResetToken("test@example.com")

	// Test case: Successful password reset
	t.Run("Success", func(t *testing.T) {
		// Mock database update
		mock.ExpectExec("UPDATE users SET password_hash = \\$1 WHERE email = \\$2").
			WithArgs(sqlmock.AnyArg(), "test@example.com").
			WillReturnResult(sqlmock.NewResult(0, 1))

		// Create request
		reqBody := map[string]string{
			"reset_token":  validToken,
			"new_password": "newpassword123",
		}
		body, _ := json.Marshal(reqBody)
		req := httptest.NewRequest("POST", "/api/reset-password", bytes.NewBuffer(body))
		req.Header.Set("Content-Type", "application/json")
		rec := httptest.NewRecorder()

		handler.ResetPassword(rec, req)

		assert.Equal(t, http.StatusOK, rec.Code)
		assert.Contains(t, rec.Body.String(), "Password updated successfully")

		if err := mock.ExpectationsWereMet(); err != nil {
			t.Errorf("unfulfilled expectations: %s", err)
		}
	})

	// Test case: Invalid token
	t.Run("InvalidToken", func(t *testing.T) {
		reqBody := map[string]string{
			"reset_token":  "invalid.token.string",
			"new_password": "newpassword123",
		}
		body, _ := json.Marshal(reqBody)
		req := httptest.NewRequest("POST", "/api/reset-password", bytes.NewBuffer(body))
		req.Header.Set("Content-Type", "application/json")
		rec := httptest.NewRecorder()

		handler.ResetPassword(rec, req)

		assert.Equal(t, http.StatusUnauthorized, rec.Code)
		assert.Contains(t, rec.Body.String(), "Invalid token")
	})

	// Test case: Token with wrong scope
	t.Run("WrongTokenScope", func(t *testing.T) {
		// Create token with wrong scope
		wrongScopeToken := createTokenWithCustomClaims(jwt.MapClaims{
			"email": "test@example.com",
			"exp":   time.Now().Add(10 * time.Minute).Unix(),
			"scope": "wrong_scope",
		})

		reqBody := map[string]string{
			"reset_token":  wrongScopeToken,
			"new_password": "newpassword123",
		}
		body, _ := json.Marshal(reqBody)
		req := httptest.NewRequest("POST", "/api/reset-password", bytes.NewBuffer(body))
		req.Header.Set("Content-Type", "application/json")
		rec := httptest.NewRecorder()

		handler.ResetPassword(rec, req)

		assert.Equal(t, http.StatusUnauthorized, rec.Code)
		assert.Contains(t, rec.Body.String(), "Invalid token claims")
	})

	// Test case: Database error
	t.Run("DatabaseError", func(t *testing.T) {
		// Mock database error
		mock.ExpectExec("UPDATE users SET password_hash = \\$1 WHERE email = \\$2").
			WithArgs(sqlmock.AnyArg(), "test@example.com").
			WillReturnError(errors.New("database error"))

		reqBody := map[string]string{
			"reset_token":  validToken,
			"new_password": "newpassword123",
		}
		body, _ := json.Marshal(reqBody)
		req := httptest.NewRequest("POST", "/api/reset-password", bytes.NewBuffer(body))
		req.Header.Set("Content-Type", "application/json")
		rec := httptest.NewRecorder()

		handler.ResetPassword(rec, req)

		assert.Equal(t, http.StatusInternalServerError, rec.Code)
		assert.Contains(t, rec.Body.String(), "Password update failed")

		if err := mock.ExpectationsWereMet(); err != nil {
			t.Errorf("unfulfilled expectations: %s", err)
		}
	})
}

func TestResetPasswordDoctor(t *testing.T) {
	db, mock, err := sqlmock.New()
	assert.NoError(t, err)
	defer db.Close()

	handler := AuthHandler{DB: db}

	// Create a valid reset token for testing
	validToken := createValidResetToken("doctor@example.com")

	// Test case: Successful doctor password reset
	t.Run("Success", func(t *testing.T) {
		// Mock database update for doctors table
		mock.ExpectExec("UPDATE doctors SET password_hash = \\$1 WHERE email = \\$2").
			WithArgs(sqlmock.AnyArg(), "doctor@example.com").
			WillReturnResult(sqlmock.NewResult(0, 1))

		// Create request
		reqBody := map[string]string{
			"reset_token":  validToken,
			"new_password": "newpassword456",
		}
		body, _ := json.Marshal(reqBody)
		req := httptest.NewRequest("POST", "/api/reset-password-doctor", bytes.NewBuffer(body))
		req.Header.Set("Content-Type", "application/json")
		rec := httptest.NewRecorder()

		handler.ResetPasswordDoctor(rec, req)

		assert.Equal(t, http.StatusOK, rec.Code)
		assert.Contains(t, rec.Body.String(), "Password updated successfully")

		if err := mock.ExpectationsWereMet(); err != nil {
			t.Errorf("unfulfilled expectations: %s", err)
		}
	})

	// Test case: Invalid token
	t.Run("InvalidToken", func(t *testing.T) {
		reqBody := map[string]string{
			"reset_token":  "invalid.token.string",
			"new_password": "newpassword456",
		}
		body, _ := json.Marshal(reqBody)
		req := httptest.NewRequest("POST", "/api/reset-password-doctor", bytes.NewBuffer(body))
		req.Header.Set("Content-Type", "application/json")
		rec := httptest.NewRecorder()

		handler.ResetPasswordDoctor(rec, req)

		assert.Equal(t, http.StatusUnauthorized, rec.Code)
		assert.Contains(t, rec.Body.String(), "Invalid token")
	})

	// Test case: Database error
	t.Run("DatabaseError", func(t *testing.T) {
		// Mock database error
		mock.ExpectExec("UPDATE doctors SET password_hash = \\$1 WHERE email = \\$2").
			WithArgs(sqlmock.AnyArg(), "doctor@example.com").
			WillReturnError(errors.New("database error"))

		reqBody := map[string]string{
			"reset_token":  validToken,
			"new_password": "newpassword456",
		}
		body, _ := json.Marshal(reqBody)
		req := httptest.NewRequest("POST", "/api/reset-password-doctor", bytes.NewBuffer(body))
		req.Header.Set("Content-Type", "application/json")
		rec := httptest.NewRecorder()

		handler.ResetPasswordDoctor(rec, req)

		assert.Equal(t, http.StatusInternalServerError, rec.Code)
		assert.Contains(t, rec.Body.String(), "Password update failed")

		if err := mock.ExpectationsWereMet(); err != nil {
			t.Errorf("unfulfilled expectations: %s", err)
		}
	})
}

// Helper function to create a valid reset token for testing
func createValidResetToken(email string) string {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"email": email,
		"exp":   time.Now().Add(10 * time.Minute).Unix(),
		"scope": "password_reset",
	})

	tokenString, _ := token.SignedString(jwtSecret)
	return tokenString
}

// Helper function to create a token with custom claims
func createTokenWithCustomClaims(claims jwt.MapClaims) string {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, _ := token.SignedString(jwtSecret)
	return tokenString
}
