package handlers

import (
	"database/sql"
)

type AppointmentHandler struct {
	DB *sql.DB
}

// // Mock data for specialties
// var mockSpecialties = []models.Specialty{
// 	{ID: "cardiology", Name: "Cardiology"},
// 	{ID: "dermatology", Name: "Dermatology"},
// 	{ID: "pediatrics", Name: "Pediatrics"},
// }

// // Mock data for doctors
// var mockDoctors = map[string][]models.Doctor{
// 	"cardiology": {
// 		{ID: "doc1", Name: "Dr. Heart", Experience: "10 years", Qualifications: "MD, Cardiology", SpecialtyID: "cardiology"},
// 		{ID: "doc2", Name: "Dr. Aorta", Experience: "8 years", Qualifications: "MD, FACC", SpecialtyID: "cardiology"},
// 	},
// 	"dermatology": {
// 		{ID: "doc3", Name: "Dr. Skin", Experience: "12 years", Qualifications: "MD, Dermatology", SpecialtyID: "dermatology"},
// 		{ID: "doc4", Name: "Dr. Derm", Experience: "6 years", Qualifications: "MD, Cosmetic Dermatology", SpecialtyID: "dermatology"},
// 	},
// 	"pediatrics": {
// 		{ID: "doc5", Name: "Dr. Kid", Experience: "15 years", Qualifications: "MD, Pediatrics", SpecialtyID: "pediatrics"},
// 		{ID: "doc6", Name: "Dr. Child", Experience: "7 years", Qualifications: "MD, Child Nutrition", SpecialtyID: "pediatrics"},
// 	},
// }

// // Mock data for slots
// var mockSlots = map[string][]string{
// 	"doc1": {"2025-03-01T10:00", "2025-03-01T11:00"},
// 	"doc2": {"2025-03-02T09:30", "2025-03-02T13:00"},
// 	"doc3": {"2025-03-03T08:00", "2025-03-03T10:30"},
// 	"doc4": {"2025-03-04T14:00", "2025-03-04T15:30"},
// 	"doc5": {"2025-03-05T09:00", "2025-03-05T11:00"},
// 	"doc6": {"2025-03-06T10:00", "2025-03-06T12:00"},
// }

// // Mock data for appointment history
// var mockAppointments = []models.Appointment{
// 	{
// 		ID:       1,
// 		UserID:   1,
// 		DoctorID: "doc1",
// 		Slot:     "2024-03-15T10:00",
// 		Problem:  "Chest pain consultation",
// 		Status:   "Completed",
// 	},
// }

// // GetSpecialties returns the list of medical specialties
// func (h *AppointmentHandler) GetSpecialties(w http.ResponseWriter, r *http.Request) {
// 	json.NewEncoder(w).Encode(mockSpecialties)
// }

// // GetDoctorsBySpecialty returns the list of doctors for a given specialty
// func (h *AppointmentHandler) GetDoctorsBySpecialty(w http.ResponseWriter, r *http.Request) {
// 	vars := mux.Vars(r)
// 	specialtyID := vars["specialtyId"]
// 	doctors := mockDoctors[specialtyID]
// 	json.NewEncoder(w).Encode(doctors)
// }

// // GetSlotsByDoctor returns the available time slots for a given doctor
// func (h *AppointmentHandler) GetSlotsByDoctor(w http.ResponseWriter, r *http.Request) {
// 	vars := mux.Vars(r)
// 	doctorID := vars["doctorId"]
// 	slots := mockSlots[doctorID]
// 	json.NewEncoder(w).Encode(slots)
// }

// // BookAppointment handles the booking of an appointment
// func (h *AppointmentHandler) BookAppointment(w http.ResponseWriter, r *http.Request) {
// 	var appointment models.Appointment
// 	if err := json.NewDecoder(r.Body).Decode(&appointment); err != nil {
// 		http.Error(w, err.Error(), http.StatusBadRequest)
// 		return
// 	}

// 	// Insert the appointment into the database
// 	query := `
//         INSERT INTO appointments (user_id, doctor_id, slot, problem, status, files)
//         VALUES ($1, $2, $3, $4, $5, $6)
//         RETURNING id
//     `
// 	var appointmentID int
// 	err := h.DB.QueryRow(
// 		query,
// 		appointment.UserID,
// 		appointment.DoctorID,
// 		appointment.Slot,
// 		appointment.Problem,
// 		appointment.Status,
// 		pq.Array(appointment.Files),
// 	).Scan(&appointmentID)
// 	if err != nil {
// 		http.Error(w, err.Error(), http.StatusInternalServerError)
// 		return
// 	}

// 	// Return the created appointment with its ID
// 	appointment.ID = appointmentID
// 	json.NewEncoder(w).Encode(appointment)
// }

// // GetAppointmentHistory returns the appointment history for a user
// func (h *AppointmentHandler) GetAppointmentHistory(w http.ResponseWriter, r *http.Request) {
// 	userID := r.URL.Query().Get("userId")
// 	if userID == "" {
// 		http.Error(w, "userId is required", http.StatusBadRequest)
// 		return
// 	}

// 	// Mock logic: Filter appointments by userID
// 	var userAppointments []models.Appointment
// 	for _, appointment := range mockAppointments {
// 		if appointment.UserID == 1 { // Replace with actual userID parsing
// 			userAppointments = append(userAppointments, appointment)
// 		}
// 	}

// 	json.NewEncoder(w).Encode(userAppointments)
// }
