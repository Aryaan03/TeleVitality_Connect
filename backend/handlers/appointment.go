package handlers

import (
	"backend/models"
	"database/sql"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"strings"

	"github.com/golang-jwt/jwt/v5"
)

type AppointmentHandler struct {
	DB *sql.DB
}

func (h *AppointmentHandler) GetSpecialties(w http.ResponseWriter, r *http.Request) {
	rows, err := h.DB.Query("SELECT id, name FROM specialties")
	if err != nil {
		http.Error(w, `{"error": "Failed to fetch specialties"}`, http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var specialties []models.Specialty
	for rows.Next() {
		var spec models.Specialty
		if err := rows.Scan(&spec.ID, &spec.Name); err != nil {
			http.Error(w, `{"error": "Failed to scan specialties"}`, http.StatusInternalServerError)
			return
		}
		specialties = append(specialties, spec)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(specialties)
}

func (h *AppointmentHandler) GetDoctorsBySpecialty(w http.ResponseWriter, r *http.Request) {
	specialtyID := strings.TrimSpace(r.URL.Query().Get("specialty"))
	if specialtyID == "" {
		http.Error(w, `{"error": "Specialty ID is required"}`, http.StatusBadRequest)
		return
	}

	// Query doctors by specialty ID instead of name
	rows, err := h.DB.Query(`
        SELECT user_id, first_name, last_name, specialization, years_of_experience
        FROM doctor_profiles
        WHERE specialization = (SELECT name FROM specialties WHERE id = $1)`, specialtyID)

	if err != nil {
		http.Error(w, fmt.Sprintf(`{"error": "Failed to fetch doctors: %s"}`, err.Error()), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var doctors []models.DoctorProfile
	for rows.Next() {
		var doc models.DoctorProfile
		if err := rows.Scan(&doc.UserID, &doc.FirstName, &doc.LastName, &doc.Specialization, &doc.YearsOfExperience); err != nil {
			http.Error(w, `{"error": "Failed to scan doctors"}`, http.StatusInternalServerError)
			return
		}
		doctors = append(doctors, doc)
	}

	fmt.Println("Doctors found:", len(doctors)) // Log the number of doctors found
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(doctors)
}

func (h *AppointmentHandler) GetDoctorAvailability(w http.ResponseWriter, r *http.Request) {
	doctorID := r.URL.Query().Get("doctor")
	if doctorID == "" {
		http.Error(w, `{"error": "Doctor ID is required"}`, http.StatusBadRequest)
		return
	}

	var availabilityJSON string
	err := h.DB.QueryRow("SELECT availability FROM doctor_profiles WHERE user_id = $1", doctorID).Scan(&availabilityJSON)
	if err != nil {
		http.Error(w, `{"error": "Failed to fetch availability"}`, http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write([]byte(availabilityJSON))
}

func (h *AppointmentHandler) BookAppointment(w http.ResponseWriter, r *http.Request) {
	// JWT validation and token parsing
	tokenString := strings.Split(r.Header.Get("Authorization"), " ")[1]
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return jwtSecret, nil
	})
	if err != nil {
		log.Println("Error parsing token:", err)
		http.Error(w, `{"error": "Invalid token"}`, http.StatusUnauthorized)
		return
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		patientID := claims["user_id"].(float64)
		log.Println("Patient ID:", patientID)

		// Decode the request body
		var requestData map[string]interface{}
		bodyBytes, err := io.ReadAll(r.Body)
		if err != nil {
			log.Println("Error reading request body:", err)
			http.Error(w, `{"error": "Failed to read request body"}`, http.StatusBadRequest)
			return
		}

		if err := json.Unmarshal(bodyBytes, &requestData); err != nil {
			log.Println("Error unmarshaling request:", err)
			http.Error(w, `{"error": "Invalid JSON in request body"}`, http.StatusBadRequest)
			return
		}

		// Extract fields
		doctorID, ok := requestData["doctorId"].(float64)
		if !ok {
			log.Println("Invalid or missing doctorId")
			http.Error(w, `{"error": "Invalid or missing doctorId"}`, http.StatusBadRequest)
			return
		}

		problemDesc, _ := requestData["problem"].(string)

		// Extract appointment time from the request
		appointmentTimeData, ok := requestData["appointmentTime"].(map[string]interface{})
		if !ok {
			log.Println("Invalid or missing appointmentTime")
			http.Error(w, `{"error": "Invalid appointment time format"}`, http.StatusBadRequest)
			return
		}

		// Convert the appointment time to JSON
		appointmentTimeJSON, err := json.Marshal(appointmentTimeData)
		if err != nil {
			log.Println("Error marshaling appointment time:", err)
			http.Error(w, `{"error": "Invalid appointment time format"}`, http.StatusBadRequest)
			return
		}

		log.Println("Appointment Time JSON:", string(appointmentTimeJSON))

		// Insert into the database
		_, err = h.DB.Exec(`
		INSERT INTO appointments (patient_id, doctor_id, appointment_time, problem_description)
		VALUES ($1, $2, $3, $4)`,
			int(patientID), int(doctorID), appointmentTimeJSON, problemDesc)

		if err != nil {
			log.Println("Error executing SQL query:", err)
			http.Error(w, `{"error": "Failed to book appointment"}`, http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(map[string]string{"message": "Appointment booked successfully"})
	} else {
		log.Println("Invalid token claims")
		http.Error(w, `{"error": "Invalid token claims"}`, http.StatusUnauthorized)
	}
}

func (h *AppointmentHandler) GetAppointmentHistory(w http.ResponseWriter, r *http.Request) {
	// JWT validation and token parsing
	tokenString := strings.Split(r.Header.Get("Authorization"), " ")[1]
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return jwtSecret, nil
	})
	if err != nil {
		log.Println("Error parsing token:", err)
		http.Error(w, `{"error": "Invalid token"}`, http.StatusUnauthorized)
		return
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		patientID := claims["user_id"].(float64)

		// Query the database for the patient's appointment history
		rows, err := h.DB.Query(`
            SELECT 
                a.id, 
                a.patient_id, 
                a.doctor_id, 
                a.appointment_time, 
                a.problem_description, 
                a.status, 
                d.first_name, 
                d.last_name
            FROM appointments a
            JOIN doctor_profiles d ON a.doctor_id = d.user_id
            WHERE a.patient_id = $1
            ORDER BY a.created_at DESC`, int(patientID))
		if err != nil {
			log.Println("Error querying appointment history:", err)
			http.Error(w, `{"error": "Failed to fetch appointment history"}`, http.StatusInternalServerError)
			return
		}
		defer rows.Close()

		var appointments []models.Appointment
		for rows.Next() {
			var app models.Appointment
			var doctorFirstName, doctorLastName string
			var appointmentTimeJSON []byte

			if err := rows.Scan(
				&app.ID,
				&app.PatientID,
				&app.DoctorID,
				&appointmentTimeJSON,
				&app.ProblemDescription,
				&app.Status,
				&doctorFirstName,
				&doctorLastName,
			); err != nil {
				log.Println("Error scanning appointment history:", err)
				http.Error(w, `{"error": "Failed to scan appointment history"}`, http.StatusInternalServerError)
				return
			}

			// Unmarshal the appointment time JSON
			if err := json.Unmarshal(appointmentTimeJSON, &app.AppointmentTime); err != nil {
				log.Println("Error unmarshaling appointment time:", err)
				http.Error(w, `{"error": "Failed to parse appointment time"}`, http.StatusInternalServerError)
				return
			}

			// Construct the doctor's name
			app.DoctorName = fmt.Sprintf("%s %s", doctorFirstName, doctorLastName)

			appointments = append(appointments, app)
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(appointments)
	} else {
		log.Println("Invalid token claims")
		http.Error(w, `{"error": "Invalid token claims"}`, http.StatusUnauthorized)
	}
}
