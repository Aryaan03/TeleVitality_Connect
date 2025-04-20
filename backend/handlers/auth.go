package handlers

import (
	"backend/models"
	"database/sql"
	"encoding/json"
	"fmt"
	"math/rand"
	"net/http"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/sendgrid/sendgrid-go"
	"github.com/sendgrid/sendgrid-go/helpers/mail"
	"golang.org/x/crypto/bcrypt"
)

type AuthHandler struct {
	DB          *sql.DB
	SendGridKey string
}

var jwtSecret = []byte("ThisIsASecretKey")

func (h *AuthHandler) Register(w http.ResponseWriter, r *http.Request) {
	var user models.User
	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		http.Error(w, `{"error": "Invalid request body"}`, http.StatusBadRequest)
		return
	}

	// Check if username already exists
	var usernameExists bool
	err := h.DB.QueryRow("SELECT EXISTS(SELECT 1 FROM users WHERE username=$1)", user.Username).Scan(&usernameExists)
	if err != nil {
		http.Error(w, `{"error": "Database error"}`, http.StatusInternalServerError)
		return
	}
	if usernameExists {
		w.WriteHeader(http.StatusConflict)
		json.NewEncoder(w).Encode(map[string]string{"error": "Username already exists"})
		return
	}

	// Check if email already exists
	var emailExists bool
	err = h.DB.QueryRow("SELECT EXISTS(SELECT 1 FROM users WHERE email=$1)", user.Email).Scan(&emailExists)
	if err != nil {
		http.Error(w, `{"error": "Database error"}`, http.StatusInternalServerError)
		return
	}
	if emailExists {
		w.WriteHeader(http.StatusConflict)
		json.NewEncoder(w).Encode(map[string]string{"error": "Email already exists"})
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		http.Error(w, `{"error": "Error hashing password"}`, http.StatusInternalServerError)
		return
	}

	_, err = h.DB.Exec("INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3)", user.Username, user.Email, string(hashedPassword))
	if err != nil {
		http.Error(w, `{"error": "Error creating user"}`, http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{"message": "User created successfully"})
}

func (h *AuthHandler) Login(w http.ResponseWriter, r *http.Request) {
	var credentials struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}

	if err := json.NewDecoder(r.Body).Decode(&credentials); err != nil {
		http.Error(w, `{"error": "Invalid request body"}`, http.StatusBadRequest)
		return
	}

	var user models.User
	err := h.DB.QueryRow("SELECT id, username, password_hash FROM users WHERE username=$1", credentials.Username).Scan(&user.ID, &user.Username, &user.PasswordHash)
	if err == sql.ErrNoRows {
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(map[string]string{"error": "Invalid username or password"})
		return
	}
	if err != nil {
		http.Error(w, `{"error": "Database error"}`, http.StatusInternalServerError)
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(credentials.Password)); err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(map[string]string{"error": "Invalid username or password"})
		return
	}

	// Create a JWT token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"username": user.Username,
		"user_id":  user.ID,
		"role":     "patient",
		"exp":      time.Now().Add(time.Hour * 24).Unix(),
	})

	tokenString, err := token.SignedString(jwtSecret)
	if err != nil {
		http.Error(w, `{"error": "Error generating token"}`, http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{
		"message": "Login successful",
		"token":   tokenString,
	})
}

func JWTAuthMiddleware(allowedRoles ...string) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			authHeader := r.Header.Get("Authorization")
			if authHeader == "" {
				w.WriteHeader(http.StatusUnauthorized)
				json.NewEncoder(w).Encode(map[string]string{"error": "Authorization header missing"})
				return
			}

			tokenString := strings.Split(authHeader, " ")[1]
			if tokenString == "" {
				w.WriteHeader(http.StatusUnauthorized)
				json.NewEncoder(w).Encode(map[string]string{"error": "Token missing"})
				return
			}
			// parse and validate token
			token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
				if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
					return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
				}
				return jwtSecret, nil
			})

			if err != nil || !token.Valid {
				w.WriteHeader(http.StatusUnauthorized)
				json.NewEncoder(w).Encode(map[string]string{"error": "Invalid token"})
				return
			}

			claims, ok := token.Claims.(jwt.MapClaims)
			if !ok || !token.Valid {
				w.WriteHeader(http.StatusUnauthorized)
				json.NewEncoder(w).Encode(map[string]string{"error": "Invalid token claims"})
				return
			}

			role, ok := claims["role"].(string)
			if !ok {
				w.WriteHeader(http.StatusUnauthorized)
				json.NewEncoder(w).Encode(map[string]string{"error": "Invalid token format"})
				return
			}

			// Check if the role is allowed
			allowed := false
			for _, allowedRole := range allowedRoles {
				if role == allowedRole {
					allowed = true
					break
				}
			}

			if !allowed {
				w.WriteHeader(http.StatusForbidden)
				json.NewEncoder(w).Encode(map[string]string{"error": "Forbidden"})
				return
			}

			next.ServeHTTP(w, r)
		})
	}
}

func (h *AuthHandler) ProtectedDashboard(w http.ResponseWriter, r *http.Request) {
	// Extract token from the Authorization header
	tokenString := strings.Split(r.Header.Get("Authorization"), " ")[1]

	// Parse and validate the token
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return jwtSecret, nil
	})

	if err != nil {
		http.Error(w, `{"error": "Invalid token"}`, http.StatusUnauthorized)
		return
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		// Get user data from claims
		username := claims["username"].(string)
		userID := claims["user_id"].(float64)

		userData := map[string]interface{}{
			"username": username,
			"user_id":  userID,
			"message":  "Welcome to the protected dashboard",
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(userData)
	} else {
		http.Error(w, `{"error": "Invalid token claims"}`, http.StatusUnauthorized)
	}
}

func (h *AuthHandler) DoctorLogin(w http.ResponseWriter, r *http.Request) {
	var credentials struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}

	if err := json.NewDecoder(r.Body).Decode(&credentials); err != nil {
		http.Error(w, `{"error": "Invalid request body"}`, http.StatusBadRequest)
		return
	}

	var doctor models.Doctor
	err := h.DB.QueryRow("SELECT id, username, password_hash FROM doctors WHERE username=$1", credentials.Username).Scan(&doctor.ID, &doctor.Username, &doctor.PasswordHash)
	if err == sql.ErrNoRows {
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(map[string]string{"error": "Invalid username or password"})
		return
	}
	if err != nil {
		http.Error(w, `{"error": "Database error"}`, http.StatusInternalServerError)
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(doctor.PasswordHash), []byte(credentials.Password)); err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(map[string]string{"error": "Invalid username or password"})
		return
	}

	// Create a JWT token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"username": doctor.Username,
		"user_id":  doctor.ID,
		"role":     "doctor",
		"exp":      time.Now().Add(time.Hour * 24).Unix(),
	})

	tokenString, err := token.SignedString(jwtSecret)
	if err != nil {
		http.Error(w, `{"error": "Error generating token"}`, http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{
		"message": "Login successful",
		"token":   tokenString,
	})
}

func (h *AuthHandler) DoctorRegister(w http.ResponseWriter, r *http.Request) {
	var doctor models.Doctor
	if err := json.NewDecoder(r.Body).Decode(&doctor); err != nil {
		http.Error(w, `{"error": "Invalid request body"}`, http.StatusBadRequest)
		return
	}

	// Check if username already exists
	var usernameExists bool
	err := h.DB.QueryRow("SELECT EXISTS(SELECT 1 FROM doctors WHERE username=$1)", doctor.Username).Scan(&usernameExists)
	if err != nil {
		http.Error(w, `{"error": "Database error"}`, http.StatusInternalServerError)
		return
	}
	if usernameExists {
		w.WriteHeader(http.StatusConflict)
		json.NewEncoder(w).Encode(map[string]string{"error": "Username already exists"})
		return
	}

	// Check if email already exists
	var emailExists bool
	err = h.DB.QueryRow("SELECT EXISTS(SELECT 1 FROM doctors WHERE email=$1)", doctor.Email).Scan(&emailExists)
	if err != nil {
		http.Error(w, `{"error": "Database error"}`, http.StatusInternalServerError)
		return
	}
	if emailExists {
		w.WriteHeader(http.StatusConflict)
		json.NewEncoder(w).Encode(map[string]string{"error": "Email already exists"})
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(doctor.Password), bcrypt.DefaultCost)
	if err != nil {
		http.Error(w, `{"error": "Error hashing password"}`, http.StatusInternalServerError)
		return
	}

	_, err = h.DB.Exec("INSERT INTO doctors (username, email, password_hash) VALUES ($1, $2, $3)", doctor.Username, doctor.Email, string(hashedPassword))
	if err != nil {
		http.Error(w, `{"error": "Error creating user"}`, http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{"message": "User created successfully"})
}

func (h *AuthHandler) SendResetCode(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Email string `json:"email"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, `{"error":"Invalid request"}`, http.StatusBadRequest)
		return
	}

	// Generate 6-digit code (fixed version)
	codeStr := fmt.Sprintf("%06d", rand.Intn(1000000))

	//Generated code expires in 10 minutes
	_, err := h.DB.Exec(
		`INSERT INTO password_reset_codes (email, code, expires_at)
		 VALUES ($1, $2, CURRENT_TIMESTAMP + INTERVAL '10 minutes')
		 ON CONFLICT (email) DO UPDATE
		 SET code = $2, expires_at = CURRENT_TIMESTAMP + INTERVAL '10 minutes'`,
		req.Email, codeStr,
	)

	if err != nil {
		http.Error(w, `{"error":"Database operation failed"}`, http.StatusInternalServerError)
		return
	}

	from := mail.NewEmail("TeleVitality", "potamsetvssruchi@ufl.edu")
	to := mail.NewEmail("", req.Email)
	message := mail.NewSingleEmail(
		from,
		"Password Reset Code",
		to,
		fmt.Sprintf("Your verification code is: %s", codeStr),
		"",
	)

	client := sendgrid.NewSendClient(h.SendGridKey)
	if _, err := client.Send(message); err != nil {
		http.Error(w, `{"error":"Failed sending email"}`, http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Code sent"})
}

func (h *AuthHandler) VerifyResetCode(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Email string `json:"email"`
		Code  string `json:"code"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, `{"error":"Invalid request"}`, http.StatusBadRequest)
		return
	}

	var storedCode string
	var expiresAt time.Time
	err := h.DB.QueryRow(
		`SELECT code, expires_at  
	     FROM password_reset_codes 
	     WHERE email = $1`,
		req.Email,
	).Scan(&storedCode, &expiresAt)

	if err != nil {
		if err == sql.ErrNoRows {
			http.Error(w, `{"error":"No code found for email"}`, http.StatusUnauthorized)
		} else {
			http.Error(w, `{"error":"Database error"}`, http.StatusInternalServerError)
		}
		return
	}

	if time.Now().UTC().After(expiresAt.UTC()) {
		http.Error(w, `{"error":"Expired code"}`, http.StatusUnauthorized)
		return
	}

	if storedCode != req.Code {
		http.Error(w, `{"error":"Invalid code"}`, http.StatusUnauthorized)
		return
	}

	// Generate time-limited reset token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"email": req.Email,
		"exp":   time.Now().Add(10 * time.Minute).Unix(),
		"scope": "password_reset",
	})

	tokenString, err := token.SignedString(jwtSecret)
	if err != nil {
		http.Error(w, `{"error":"Token generation failed"}`, http.StatusInternalServerError)
		return
	}

	// Clear used code
	_, err = h.DB.Exec(`DELETE FROM password_reset_codes WHERE email = $1`, req.Email)
	if err != nil {
		http.Error(w, `{"error":"Failed to clear reset code"}`, http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"reset_token": tokenString,
	})
}

func (h *AuthHandler) ResetPassword(w http.ResponseWriter, r *http.Request) {
	var req struct {
		ResetToken  string `json:"reset_token"`
		NewPassword string `json:"new_password"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, `{"error":"Invalid request"}`, http.StatusBadRequest)
		return
	}

	// Validate JWT token
	token, err := jwt.Parse(req.ResetToken, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return jwtSecret, nil
	})

	if err != nil || !token.Valid {
		http.Error(w, `{"error":"Invalid token"}`, http.StatusUnauthorized)
		return
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok || claims["scope"] != "password_reset" {
		http.Error(w, `{"error":"Invalid token claims"}`, http.StatusUnauthorized)
		return
	}

	email, ok := claims["email"].(string)
	if !ok || email == "" {
		http.Error(w, `{"error":"Invalid email in token"}`, http.StatusUnauthorized)
		return
	}

	// Update password
	hashedPass, err := bcrypt.GenerateFromPassword([]byte(req.NewPassword), bcrypt.DefaultCost)
	if err != nil {
		http.Error(w, `{"error":"Password hashing failed"}`, http.StatusInternalServerError)
		return
	}

	_, err = h.DB.Exec(
		`UPDATE users 
         SET password_hash = $1 
         WHERE email = $2`,
		hashedPass, email,
	)
	if err != nil {
		http.Error(w, `{"error":"Password update failed"}`, http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"message": "Password updated successfully",
	})
}
