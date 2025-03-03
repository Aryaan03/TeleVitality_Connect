package handlers

import (
	"backend/models"
	"database/sql"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"strconv"
	"strings"

	"github.com/golang-jwt/jwt/v5"
	"github.com/gorilla/mux"
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

		// Parse the multipart form
		err := r.ParseMultipartForm(10 << 20) // 10 MB
		if err != nil {
			log.Println("Error parsing multipart form:", err)
			http.Error(w, `{"error": "Failed to parse form data"}`, http.StatusBadRequest)
			return
		}

		// Extract fields from the form
		doctorIDStr := r.FormValue("doctorId")
		doctorID, err := strconv.Atoi(doctorIDStr)
		if err != nil {
			log.Println("Invalid or missing doctorId:", err)
			http.Error(w, `{"error": "Invalid or missing doctorId"}`, http.StatusBadRequest)
			return
		}

		problemDesc := r.FormValue("problem")
		appointmentTimeJSON := r.FormValue("appointmentTime")

		var appointmentTime map[string]interface{}
		if err := json.Unmarshal([]byte(appointmentTimeJSON), &appointmentTime); err != nil {
			log.Println("Error unmarshaling appointment time:", err)
			http.Error(w, `{"error": "Invalid appointment time format"}`, http.StatusBadRequest)
			return
		}

		// Insert into the database
		var appointmentID int
		err = h.DB.QueryRow(`
            INSERT INTO appointments (patient_id, doctor_id, appointment_time, problem_description)
            VALUES ($1, $2, $3, $4)
            RETURNING id`,
			int(patientID), doctorID, appointmentTimeJSON, problemDesc).Scan(&appointmentID)
		if err != nil {
			log.Println("Error executing SQL query:", err)
			http.Error(w, `{"error": "Failed to book appointment"}`, http.StatusInternalServerError)
			return
		}

		// Handle file uploads
		files := r.MultipartForm.File["files"]
		for _, fileHeader := range files {
			file, err := fileHeader.Open()
			if err != nil {
				log.Println("Error opening file:", err)
				continue
			}
			defer file.Close()

			// Read the file content
			fileBytes, err := io.ReadAll(file)
			if err != nil {
				log.Println("Error reading file:", err)
				continue
			}

			// Store the file in the database or filesystem
			_, err = h.DB.Exec(`
                INSERT INTO appointment_files (appointment_id, file_name, file_data)
                VALUES ($1, $2, $3)`,
				appointmentID, fileHeader.Filename, fileBytes)
			if err != nil {
				log.Println("Error storing file:", err)
				continue
			}
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
                d.last_name,
                af.file_name,
                af.file_data
            FROM appointments a
            JOIN doctor_profiles d ON a.doctor_id = d.user_id
            LEFT JOIN appointment_files af ON a.id = af.appointment_id
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
			var fileName, fileData []byte

			if err := rows.Scan(
				&app.ID,
				&app.PatientID,
				&app.DoctorID,
				&appointmentTimeJSON,
				&app.ProblemDescription,
				&app.Status,
				&doctorFirstName,
				&doctorLastName,
				&fileName,
				&fileData,
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

			// Add file data if available
			if fileName != nil && fileData != nil {
				app.Files = append(app.Files, models.AppointmentFile{
					FileName: string(fileName),
					FileData: fileData,
				})
			}

			appointments = append(appointments, app)
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(appointments)
	} else {
		log.Println("Invalid token claims")
		http.Error(w, `{"error": "Invalid token claims"}`, http.StatusUnauthorized)
	}
}

func (h *AppointmentHandler) GetDoctorAppointments(w http.ResponseWriter, r *http.Request) {
	// Extract doctor ID from JWT token
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
		doctorID := claims["user_id"].(float64)

		// Query appointments for this doctor
		rows, err := h.DB.Query(`
			SELECT 
				a.id, 
				a.patient_id, 
				a.doctor_id, 
				a.appointment_time, 
				a.problem_description, 
				a.status,
				p.first_name,
				p.last_name
			FROM appointments a
			JOIN profiles p ON a.patient_id = p.user_id
			WHERE a.doctor_id = $1
			ORDER BY a.created_at DESC
		`, int(doctorID))
		if err != nil {
			log.Println("Error querying doctor appointments:", err)
			http.Error(w, `{"error": "Failed to fetch appointments"}`, http.StatusInternalServerError)
			return
		}
		defer rows.Close()

		var appointments []map[string]interface{}
		for rows.Next() {
			var (
				id, patientID, docID              int
				problemDesc, status               string
				patientFirstName, patientLastName string
				appointmentTimeJSON               []byte
			)

			if err := rows.Scan(
				&id,
				&patientID,
				&docID,
				&appointmentTimeJSON,
				&problemDesc,
				&status,
				&patientFirstName,
				&patientLastName,
			); err != nil {
				log.Println("Error scanning appointment:", err)
				http.Error(w, `{"error": "Failed to scan appointments"}`, http.StatusInternalServerError)
				return
			}

			// Parse appointment time JSON
			var appointmentTime map[string]interface{}
			if err := json.Unmarshal(appointmentTimeJSON, &appointmentTime); err != nil {
				log.Println("Error unmarshaling appointment time:", err)
				appointmentTime = map[string]interface{}{}
			}

			// Build the patient's full name
			patientName := fmt.Sprintf("%s %s", patientFirstName, patientLastName)

			// Create appointment object
			appointment := map[string]interface{}{
				"id":                  id,
				"patient_id":          patientID,
				"doctor_id":           docID,
				"patient_name":        patientName,
				"appointment_time":    appointmentTime,
				"problem_description": problemDesc,
				"status":              status,
			}

			appointments = append(appointments, appointment)
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(appointments)
	} else {
		log.Println("Invalid token claims")
		http.Error(w, `{"error": "Invalid token claims"}`, http.StatusUnauthorized)
	}
}

// CancelAppointment cancels a specific appointment
func (h *AppointmentHandler) CancelAppointment(w http.ResponseWriter, r *http.Request) {
	// Extract appointment ID from URL
	vars := mux.Vars(r)
	appointmentID := vars["id"]

	// Extract doctor ID from JWT token
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
		doctorID := claims["user_id"].(float64)

		// Verify the appointment belongs to this doctor before cancelling
		var count int
		err := h.DB.QueryRow("SELECT COUNT(*) FROM appointments WHERE id = $1 AND doctor_id = $2", appointmentID, int(doctorID)).Scan(&count)
		if err != nil {
			log.Println("Error verifying appointment ownership:", err)
			http.Error(w, `{"error": "Failed to verify appointment"}`, http.StatusInternalServerError)
			return
		}

		if count == 0 {
			http.Error(w, `{"error": "Appointment not found or not authorized"}`, http.StatusNotFound)
			return
		}

		// Update the appointment status to "Cancelled"
		_, err = h.DB.Exec("UPDATE appointments SET status = 'Cancelled' WHERE id = $1", appointmentID)
		if err != nil {
			log.Println("Error cancelling appointment:", err)
			http.Error(w, `{"error": "Failed to cancel appointment"}`, http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{"message": "Appointment cancelled successfully"})
	} else {
		log.Println("Invalid token claims")
		http.Error(w, `{"error": "Invalid token claims"}`, http.StatusUnauthorized)
	}
}
