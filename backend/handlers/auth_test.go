package handlers

import (
	"backend/models"
	"bytes"
	"database/sql"
	"encoding/json"
	"fmt"
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

func TestResetPassword_UserNotFound(t *testing.T) {
	db, mock, _ := sqlmock.New()
	handler := AuthHandler{DB: db}

	mock.ExpectQuery("SELECT EXISTS\\(SELECT 1 FROM users WHERE email=\\$1\\)").
		WithArgs("nonexistent@example.com").
		WillReturnRows(sqlmock.NewRows([]string{"exists"}).AddRow(false))

	reqBody := `{"email":"nonexistent@example.com", "newPassword":"newpass123"}`
	req := httptest.NewRequest("POST", "/api/reset-password", bytes.NewBuffer([]byte(reqBody)))
	rec := httptest.NewRecorder()

	handler.ResetPassword(rec, req)
	assert.Equal(t, http.StatusNotFound, rec.Code)
}

func TestResetPassword_DatabaseError(t *testing.T) {
	db, mock, _ := sqlmock.New()
	handler := AuthHandler{DB: db}

	mock.ExpectQuery("SELECT EXISTS\\(SELECT 1 FROM users WHERE email=\\$1\\)").
		WillReturnError(fmt.Errorf("database error"))

	reqBody := `{"email":"test@example.com", "newPassword":"newpass123"}`
	req := httptest.NewRequest("POST", "/api/reset-password", bytes.NewBuffer([]byte(reqBody)))
	rec := httptest.NewRecorder()

	handler.ResetPassword(rec, req)
	assert.Equal(t, http.StatusInternalServerError, rec.Code)
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
