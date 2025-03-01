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

type DoctorProfileHandler struct {
	DB *sql.DB
}

func (h *DoctorProfileHandler) GetDoctorProfile(w http.ResponseWriter, r *http.Request) {
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

		var profile models.DoctorProfile
		err := h.DB.QueryRow(`
            SELECT first_name, last_name, date_of_birth, gender, phone_number, 
            medical_license_number, issuing_medical_board, license_expiry_date, 
            specialization, years_of_experience, hospital_name, work_address, 
            consultation_type, availability
            FROM doctor_profiles WHERE user_id = $1`, int(userID)).Scan(
			&profile.FirstName, &profile.LastName, &profile.DateOfBirth, &profile.Gender,
			&profile.PhoneNumber, &profile.MedicalLicenseNumber, &profile.IssuingMedicalBoard,
			&profile.LicenseExpiryDate, &profile.Specialization, &profile.YearsOfExperience,
			&profile.HospitalName, &profile.WorkAddress, &profile.ConsultationType, &profile.Availability,
		)

		// If no profile exists, return an empty profile with 200 status
		if err == sql.ErrNoRows {
			profile = models.DoctorProfile{
				UserID:           int(userID),
				ConsultationType: "In-person", // Set defaults
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

func (h *DoctorProfileHandler) UpdateDoctorProfile(w http.ResponseWriter, r *http.Request) {
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

		var profile models.DoctorProfile
		if err := json.NewDecoder(r.Body).Decode(&profile); err != nil {
			http.Error(w, `{"error": "Invalid request body"}`, http.StatusBadRequest)
			return
		}

		// Convert availability to JSON string
		availabilityJSON, err := json.Marshal(profile.Availability)
		if err != nil {
			http.Error(w, `{"error": "Failed to process availability"}`, http.StatusInternalServerError)
			return
		}

		_, err = h.DB.Exec(`
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
                availability = EXCLUDED.availability`,
			userID, profile.FirstName, profile.LastName, profile.DateOfBirth, profile.Gender,
			profile.PhoneNumber, profile.MedicalLicenseNumber, profile.IssuingMedicalBoard,
			profile.LicenseExpiryDate, profile.Specialization, profile.YearsOfExperience,
			profile.HospitalName, profile.WorkAddress, profile.ConsultationType, availabilityJSON,
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
