package handlers

import (
	"backend/models"
	"database/sql"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"math/rand"
	"net/http"
	"path/filepath"
	"strconv"
	"strings"

	"github.com/golang-jwt/jwt/v5"
	"github.com/gorilla/mux"
	"github.com/sendgrid/sendgrid-go"
	"github.com/sendgrid/sendgrid-go/helpers/mail"
)

type AppointmentHandler struct {
	DB          *sql.DB
	SendGridKey string
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

		// Generate a unique meet link
		meetLink := generateMeetLink()

		// Insert into the database
		var appointmentID int
		err = h.DB.QueryRow(`
            INSERT INTO appointments (patient_id, doctor_id, appointment_time, problem_description, status, meet_link)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id`,
			int(patientID), doctorID, appointmentTimeJSON, problemDesc, "Scheduled", meetLink).Scan(&appointmentID)
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

		var (
			patientEmail, patientFirstName  string
			doctorFirstName, doctorLastName string
		)

		err = h.DB.QueryRow(`
		SELECT u.email, p.first_name, d.first_name, d.last_name 
		FROM users u
		JOIN profiles p ON u.id = p.user_id
		JOIN doctor_profiles d ON d.user_id = $1
		WHERE u.id = $2`,
			doctorID, int(patientID)).Scan(&patientEmail, &patientFirstName, &doctorFirstName, &doctorLastName)
		if err != nil {
			log.Println("Error fetching user details:", err)
			// Continue without failing the booking
		} else {
			// Format appointment time
			date, _ := appointmentTime["date"].(string)
			timeStr, _ := appointmentTime["time"].(string)

			// Create email content
			from := mail.NewEmail("TeleVitality", "potamsetvssruchi@ufl.edu")
			to := mail.NewEmail(patientFirstName, patientEmail)
			subject := "Appointment Confirmation"

			plainContent := fmt.Sprintf(
				`Hi %s,
		
			Your appointment with Dr. %s %s is confirmed for:
			Date: %s
			Time: %s
		
			Virtual Meeting Link: %s
		
			Please arrive 5 minutes early. For rescheduling, contact our support team.
		
			Thank you,
			TeleVitality Team`,
				patientFirstName, doctorFirstName, doctorLastName, date, timeStr, meetLink)
			message := mail.NewSingleEmail(from, subject, to, plainContent, "")
			client := sendgrid.NewSendClient(h.SendGridKey)

			// Send email in background
			go func() {
				if _, err := client.Send(message); err != nil {
					log.Printf("Failed to send confirmation email: %v", err)
				}
			}()
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(map[string]string{"message": "Appointment booked successfully"})
	} else {
		log.Println("Invalid token claims")
		http.Error(w, `{"error": "Invalid token claims"}`, http.StatusUnauthorized)
	}
}

// Helper function to generate a unique meet link
func generateMeetLink() string {
	// Generate a random room name (e.g., "happy-cat-123")
	adjectives := []string{"happy", "sunny", "quick", "lucky", "funny", "brave"}
	nouns := []string{"cat", "dog", "fox", "lion", "tiger", "panda"}

	randomAdj := adjectives[rand.Intn(len(adjectives))]
	randomNoun := nouns[rand.Intn(len(nouns))]
	randomNum := rand.Intn(1000)

	roomName := fmt.Sprintf("%s-%s-%d", randomAdj, randomNoun, randomNum)
	return fmt.Sprintf("https://meet.jit.si/%s", roomName)
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

		// First, update past appointments to completed status
		updatePastAppointmentsQuery := `
			UPDATE appointments 
			SET status = 'Completed' 
			WHERE patient_id = $1 
			AND status = 'Scheduled' 
			AND (appointment_time->>'date')::date < CURRENT_DATE
			OR ((appointment_time->>'date')::date = CURRENT_DATE AND (appointment_time->>'time')::time < CURRENT_TIME)
		`
		_, err := h.DB.Exec(updatePastAppointmentsQuery, int(patientID))
		if err != nil {
			log.Printf("Error updating past appointments: %v", err)
		}

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
                af.file_data,
                a.meet_link,
                a.cancellation_reason
            FROM appointments a
            JOIN doctor_profiles d ON a.doctor_id = d.user_id
            LEFT JOIN appointment_files af ON a.id = af.appointment_id
            WHERE a.patient_id = $1
            ORDER BY 
                CASE 
                    WHEN a.status = 'Scheduled' THEN 1
                    WHEN a.status = 'Completed' THEN 2
                    WHEN a.status = 'Cancelled' THEN 3
                    ELSE 4
                END,
                (a.appointment_time->>'date')::date ASC,
                (a.appointment_time->>'time')::time ASC`, int(patientID))
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
			var meetLink sql.NullString
			var cancellationReason sql.NullString

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
				&meetLink,
				&cancellationReason,
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

			// Set the MeetLink from the NullString
			app.MeetLink = meetLink.String

			// Set the CancellationReason from the NullString
			app.CancellationReason = cancellationReason.String

			// Add file data if available
			if fileName != nil && fileData != nil {
				// Determine file type from extension
				fileType := "application/octet-stream"
				ext := strings.ToLower(filepath.Ext(string(fileName)))
				switch ext {
				case ".pdf":
					fileType = "application/pdf"
				case ".jpg", ".jpeg":
					fileType = "image/jpeg"
				case ".png":
					fileType = "image/png"
				case ".txt":
					fileType = "text/plain"
				}

				// Encode file data to base64
				base64Data := base64.StdEncoding.EncodeToString(fileData)

				app.Files = append(app.Files, models.AppointmentFile{
					FileName:   string(fileName),
					FileData:   fileData,
					FileType:   fileType,
					Base64Data: base64Data,
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

		// First, update past appointments to completed status
		updatePastAppointmentsQuery := `
			UPDATE appointments 
			SET status = 'Completed' 
			WHERE doctor_id = $1 
			AND status = 'Scheduled' 
			AND (appointment_time->>'date')::date < CURRENT_DATE
			OR ((appointment_time->>'date')::date = CURRENT_DATE AND (appointment_time->>'time')::time < CURRENT_TIME)
		`
		_, err := h.DB.Exec(updatePastAppointmentsQuery, int(doctorID))
		if err != nil {
			log.Printf("Error updating past appointments: %v", err)
		}

		// Query appointments for this doctor
		rows, err := h.DB.Query(`
			SELECT 
				a.id, 
				a.patient_id, 
				a.doctor_id, 
				a.appointment_time, 
				a.problem_description, 
				a.status,
				a.notes,
				a.meet_link,
				p.first_name,
				p.last_name,
				af.file_name,
				af.file_data,
				d.first_name as doctor_first_name,
				d.last_name as doctor_last_name
			FROM appointments a
			JOIN profiles p ON a.patient_id = p.user_id
			JOIN doctor_profiles d ON a.doctor_id = d.user_id
			LEFT JOIN appointment_files af ON a.id = af.appointment_id
			WHERE a.doctor_id = $1
			ORDER BY 
				CASE 
					WHEN a.status = 'Scheduled' THEN 1
					WHEN a.status = 'Completed' THEN 2
					WHEN a.status = 'Cancelled' THEN 3
					ELSE 4
				END,
				(appointment_time->>'date')::date ASC,
				(appointment_time->>'time')::time ASC
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
				notes                             sql.NullString
				meetLink                          sql.NullString
				patientFirstName, patientLastName string
				doctorFirstName, doctorLastName   string
				appointmentTimeJSON               []byte
				fileName, fileData                []byte
			)

			if err := rows.Scan(
				&id,
				&patientID,
				&docID,
				&appointmentTimeJSON,
				&problemDesc,
				&status,
				&notes,
				&meetLink,
				&patientFirstName,
				&patientLastName,
				&fileName,
				&fileData,
				&doctorFirstName,
				&doctorLastName,
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

			// Build the patient's and doctor's full names
			patientName := fmt.Sprintf("%s %s", patientFirstName, patientLastName)
			doctorName := fmt.Sprintf("%s %s", doctorFirstName, doctorLastName)

			// Log appointment details for debugging
			log.Printf("Appointment ID: %d, Status: %s, Date: %v, Patient: %s",
				id, status, appointmentTime["date"], patientName)

			// Create appointment object
			appointment := map[string]interface{}{
				"id":                  id,
				"patient_id":          patientID,
				"doctor_id":           docID,
				"patient_name":        patientName,
				"doctor_name":         doctorName,
				"appointment_time":    appointmentTime,
				"problem_description": problemDesc,
				"status":              status,
				"notes":               notes.String,
				"meet_link":           meetLink.String,
				"files":               []map[string]interface{}{},
			}

			// Add file data if available
			if fileName != nil && fileData != nil {
				// Determine file type from extension
				fileType := "application/octet-stream"
				ext := strings.ToLower(filepath.Ext(string(fileName)))
				switch ext {
				case ".pdf":
					fileType = "application/pdf"
				case ".jpg", ".jpeg":
					fileType = "image/jpeg"
				case ".png":
					fileType = "image/png"
				case ".txt":
					fileType = "text/plain"
				}

				// Encode file data to base64
				base64Data := base64.StdEncoding.EncodeToString(fileData)

				file := map[string]interface{}{
					"file_name":   string(fileName),
					"file_type":   fileType,
					"base64_data": base64Data,
				}
				appointment["files"] = append(appointment["files"].([]map[string]interface{}), file)
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
	// Get appointment ID from URL parameters
	vars := mux.Vars(r)
	appointmentIDStr := vars["id"]
	appointmentID, err := strconv.Atoi(appointmentIDStr)
	if err != nil {
		log.Println("Error parsing appointment ID:", err)
		http.Error(w, `{"error": "Invalid appointment ID"}`, http.StatusBadRequest)
		return
	}

	// Parse request body for cancellation reason
	var requestBody struct {
		CancellationReason string `json:"cancellation_reason"`
	}

	if err := json.NewDecoder(r.Body).Decode(&requestBody); err != nil {
		log.Println("Error decoding request body:", err)
		http.Error(w, `{"error": "Invalid request body"}`, http.StatusBadRequest)
		return
	}

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

		// Update the appointment status to "Cancelled" and store the cancellation reason
		_, err = h.DB.Exec("UPDATE appointments SET status = 'Cancelled', cancellation_reason = $1 WHERE id = $2", requestBody.CancellationReason, appointmentID)
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

func (h *AppointmentHandler) GetDoctorAppointmentTimes(w http.ResponseWriter, r *http.Request) {
	doctorIDStr := r.URL.Query().Get("doctor_id")
	if doctorIDStr == "" {
		http.Error(w, `{"error": "Doctor ID is required"}`, http.StatusBadRequest)
		return
	}

	doctorID, err := strconv.Atoi(doctorIDStr)
	if err != nil {
		http.Error(w, `{"error": "Invalid Doctor ID"}`, http.StatusBadRequest)
		return
	}

	rows, err := h.DB.Query(`
        SELECT appointment_time
        FROM appointments
        WHERE doctor_id = $1
        ORDER BY appointment_time
    `, doctorID)
	if err != nil {
		log.Println("Error querying appointment times:", err)
		http.Error(w, `{"error": "Failed to fetch appointment times"}`, http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var appointmentTimes []string
	for rows.Next() {
		var appointmentTimeJSON []byte
		if err := rows.Scan(&appointmentTimeJSON); err != nil {
			log.Println("Error scanning appointment time:", err)
			http.Error(w, `{"error": "Failed to process appointment times"}`, http.StatusInternalServerError)
			return
		}
		appointmentTimes = append(appointmentTimes, string(appointmentTimeJSON))
	}

	if err := rows.Err(); err != nil {
		log.Println("Error iterating appointment times:", err)
		http.Error(w, `{"error": "Failed to process appointment times"}`, http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string][]string{"appointment_times": appointmentTimes})
}

func (h *AppointmentHandler) UpdateAppointmentNotes(w http.ResponseWriter, r *http.Request) {
	// Extract appointment ID from URL
	vars := mux.Vars(r)
	appointmentID := vars["id"]

	// Parse the request body to get the new notes
	var requestBody struct {
		Notes string `json:"notes"`
	}
	if err := json.NewDecoder(r.Body).Decode(&requestBody); err != nil {
		http.Error(w, `{"error": "Invalid request body"}`, http.StatusBadRequest)
		return
	}

	// Update the notes in the database
	_, err := h.DB.Exec(`
        UPDATE appointments
        SET notes = $1
        WHERE id = $2
    `, requestBody.Notes, appointmentID)

	if err != nil {
		log.Println("Error updating appointment notes:", err)
		http.Error(w, `{"error": "Failed to update notes"}`, http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"message": "Notes updated successfully"})
}

func (h *AppointmentHandler) GetUpcomingAppointments(w http.ResponseWriter, r *http.Request) {
	// Extract user ID from JWT token
	authHeader := r.Header.Get("Authorization")
	log.Printf("Received Authorization header: %s", authHeader)

	if authHeader == "" {
		log.Println("No Authorization header found")
		http.Error(w, `{"error": "No authorization token provided"}`, http.StatusUnauthorized)
		return
	}

	tokenString := strings.Split(authHeader, " ")[1]
	log.Printf("Extracted token: %s...", tokenString[:10])

	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return jwtSecret, nil
	})
	if err != nil {
		log.Printf("Error parsing token: %v", err)
		http.Error(w, `{"error": "Invalid token"}`, http.StatusUnauthorized)
		return
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		userID := claims["user_id"].(float64)
		role := claims["role"].(string)
		log.Printf("User ID: %v, Role: %s", userID, role)

		var query string
		var args []interface{}

		if role == "doctor" {
			query = `
				SELECT COUNT(*)
				FROM appointments
				WHERE doctor_id = $1
				AND status = 'Scheduled'
				AND (appointment_time->>'date')::date >= CURRENT_DATE
				AND (appointment_time->>'date')::date <= CURRENT_DATE + INTERVAL '7 days'
			`
			args = []interface{}{int(userID)}
		} else {
			query = `
				SELECT COUNT(*)
				FROM appointments
				WHERE patient_id = $1
				AND status = 'Scheduled'
				AND (appointment_time->>'date')::date >= CURRENT_DATE
				AND (appointment_time->>'date')::date <= CURRENT_DATE + INTERVAL '7 days'
			`
			args = []interface{}{int(userID)}
		}

		log.Printf("Executing query: %s with args: %v", query, args)

		var count int
		err := h.DB.QueryRow(query, args...).Scan(&count)
		if err != nil {
			log.Printf("Error querying upcoming appointments: %v", err)
			http.Error(w, `{"error": "Failed to fetch upcoming appointments"}`, http.StatusInternalServerError)
			return
		}

		log.Printf("Found %d upcoming appointments", count)
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]int{"count": count})
	} else {
		log.Println("Invalid token claims")
		http.Error(w, `{"error": "Invalid token claims"}`, http.StatusUnauthorized)
	}
}
