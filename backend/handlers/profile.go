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

func (h *ProfileHandler) UpdateProfile(w http.ResponseWriter, r *http.Request) {
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
		if err := json.NewDecoder(r.Body).Decode(&profile); err != nil {
			http.Error(w, `{"error": "Invalid request body"}`, http.StatusBadRequest)
			return
		}

		_, err := h.DB.Exec(`
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
			http.Error(w, `{"error": "Failed to update profile"}`, http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(map[string]string{"message": "Profile updated successfully"})
	} else {
		http.Error(w, `{"error": "Invalid token claims"}`, http.StatusUnauthorized)
	}
}
