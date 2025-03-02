package models

type Specialty struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}

type Appointment struct {
	ID                 int                    `json:"id"`
	PatientID          int                    `json:"patient_id"`
	DoctorID           int                    `json:"doctor_id"`
	DoctorName         string                 `json:"doctor_name"`
	AppointmentTime    map[string]interface{} `json:"appointment_time"`
	ProblemDescription string                 `json:"problem_description"`
	Status             string                 `json:"status"`
}
