// handlers/profile.go
package handlers

import (
	"backend/models"
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"

	"github.com/golang-jwt/jwt/v5"
)

type ProfileHandler struct {
	DB *sql.DB
}

func (h *ProfileHandler) GetProfile(w http.ResponseWriter, r *http.Request) {
	tokenString := strings.Split(r.Header.Get("Authorization"), " ")[1]
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
		userID := claims["user_id"].(float64)

		var profile models.Profile
		err := h.DB.QueryRow(`
            SELECT first_name, last_name, date_of_birth, gender, phone_number, address, 
            problem_description, emergency_appointment, preferred_communication, 
            preferred_doctor, insurance_provider, insurance_policy_number, consent_telemedicine
            FROM profiles WHERE user_id = $1`, int(userID)).Scan(
			&profile.FirstName, &profile.LastName, &profile.DateOfBirth, &profile.Gender,
			&profile.PhoneNumber, &profile.Address, &profile.ProblemDescription, &profile.EmergencyAppointment,
			&profile.PreferredCommunication, &profile.PreferredDoctor,
			&profile.InsuranceProvider, &profile.InsurancePolicyNumber, &profile.ConsentTelemedicine,
		)

		// If no profile exists, return an empty profile with 200 status
		if err == sql.ErrNoRows {
			profile = models.Profile{
				UserID:                 int(userID),
				PreferredCommunication: "email", // Set defaults
				PreferredDoctor:        "drSmith",
				EmergencyAppointment:   "no",
			}
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(profile)
			return
		}

		if err != nil {
			http.Error(w, `{"error": "Failed to fetch profile data"}`, http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(profile)
	} else {
		http.Error(w, `{"error": "Invalid token claims"}`, http.StatusUnauthorized)
	}
}

// In handlers/profile.go, UpdateProfile function:
func (h *ProfileHandler) UpdateProfile(w http.ResponseWriter, r *http.Request) {
	// Log the received request
	fmt.Println("UpdateProfile called")

	tokenString := strings.Split(r.Header.Get("Authorization"), " ")[1]
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return jwtSecret, nil
	})

	if err != nil {
		fmt.Println("JWT Parse error:", err)
		http.Error(w, `{"error": "Invalid token"}`, http.StatusUnauthorized)
		return
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		userID := claims["user_id"].(float64)
		fmt.Println("User ID from token:", userID)

		var profile models.Profile
		if err := json.NewDecoder(r.Body).Decode(&profile); err != nil {
			fmt.Println("JSON decode error:", err)
			// More specific error message based on error type
			var errorMsg string
			if strings.Contains(err.Error(), "cannot unmarshal") {
				errorMsg = "Invalid data types in request body"
			} else {
				errorMsg = "Invalid request body"
			}
			http.Error(w, fmt.Sprintf(`{"error": "%s"}`, errorMsg), http.StatusBadRequest)
			return
		}

		// Log the profile data being saved
		fmt.Printf("Profile to save: %+v\n", profile)

		result, err := h.DB.Exec(`
            INSERT INTO profiles (user_id, first_name, last_name, date_of_birth, gender, phone_number, 
            address, problem_description, emergency_appointment, 
            preferred_communication, preferred_doctor, insurance_provider, insurance_policy_number, 
            consent_telemedicine)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
            ON CONFLICT (user_id) DO UPDATE SET
                first_name = EXCLUDED.first_name,
                last_name = EXCLUDED.last_name,
                date_of_birth = EXCLUDED.date_of_birth,
                gender = EXCLUDED.gender,
                phone_number = EXCLUDED.phone_number,
                address = EXCLUDED.address,
                problem_description = EXCLUDED.problem_description,
                emergency_appointment = EXCLUDED.emergency_appointment,
                preferred_communication = EXCLUDED.preferred_communication,
                preferred_doctor = EXCLUDED.preferred_doctor,
                insurance_provider = EXCLUDED.insurance_provider,
                insurance_policy_number = EXCLUDED.insurance_policy_number,
                consent_telemedicine = EXCLUDED.consent_telemedicine`,
			userID, profile.FirstName, profile.LastName, profile.DateOfBirth, profile.Gender,
			profile.PhoneNumber, profile.Address, profile.ProblemDescription, profile.EmergencyAppointment,
			profile.PreferredCommunication, profile.PreferredDoctor,
			profile.InsuranceProvider, profile.InsurancePolicyNumber, profile.ConsentTelemedicine,
		)

		if err != nil {
			fmt.Println("Database error:", err)
			// Check for constraint violation
			var statusCode int
			var errorMsg string
			if strings.Contains(err.Error(), "null value") {
				statusCode = http.StatusBadRequest
				errorMsg = "Missing required fields"
			} else {
				statusCode = http.StatusInternalServerError
				errorMsg = "Failed to update profile"
			}
			http.Error(w, fmt.Sprintf(`{"error": "%s"}`, errorMsg), statusCode)
			return
		}

		rowsAffected, err := result.RowsAffected()
		if err != nil {
			fmt.Println("Error getting rows affected:", err)
			http.Error(w, `{"error": "Failed to update profile"}`, http.StatusInternalServerError)
			return
		}

		fmt.Println("Rows affected:", rowsAffected)

		if rowsAffected == 0 {
			http.Error(w, `{"error": "No profile was updated or created"}`, http.StatusBadRequest)
			return
		}

		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(map[string]string{"message": "Profile updated successfully"})
	} else {
		fmt.Println("Invalid token claims")
		http.Error(w, `{"error": "Invalid token claims"}`, http.StatusUnauthorized)
	}
}
