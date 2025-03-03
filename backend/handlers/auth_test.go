package handlers

import (
	"backend/models"
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/DATA-DOG/go-sqlmock"
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
