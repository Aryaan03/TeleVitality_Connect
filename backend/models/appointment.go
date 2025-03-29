package models

type Specialty struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}

type Appointment struct {
	ID                 int               `json:"id"`
	PatientID          int               `json:"patient_id"`
	DoctorID           int               `json:"doctor_id"`
	AppointmentTime    map[string]string `json:"appointment_time"`
	ProblemDescription string            `json:"problem_description"`
	Status             string            `json:"status"`
	DoctorName         string            `json:"doctor_name"`
	Files              []AppointmentFile `json:"files"`
	Notes              string            `json:"notes"`
}

type AppointmentFile struct {
	FileName string `json:"file_name"`
	FileData []byte `json:"file_data"`
}
