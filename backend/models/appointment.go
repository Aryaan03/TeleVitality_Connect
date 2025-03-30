package models

import (
	"time"
)

type TimeSlot struct {
	Date string `json:"date"`
	Time string `json:"time"`
}

type File struct {
	FileName   string `json:"file_name"`
	FileData   []byte `json:"file_data"`
	FileType   string `json:"file_type"`
	Base64Data string `json:"base64_data"`
}

type Specialty struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}

type Appointment struct {
	ID                 int64             `json:"id"`
	PatientID          int64             `json:"patient_id"`
	DoctorID           int64             `json:"doctor_id"`
	AppointmentTime    TimeSlot          `json:"appointment_time"`
	ProblemDescription string            `json:"problem_description"`
	Status             string            `json:"status"`
	DoctorName         string            `json:"doctor_name"`
	Files              []AppointmentFile `json:"files"`
	Notes              string            `json:"notes"`
	MeetLink           string            `json:"meet_link"`
	CreatedAt          time.Time         `json:"created_at"`
	UpdatedAt          time.Time         `json:"updated_at"`
	PatientName        string            `json:"patient_name"`
	CancellationReason string            `json:"cancellation_reason"`
}

type AppointmentFile struct {
	FileName   string `json:"file_name"`
	FileData   []byte `json:"file_data"`
	FileType   string `json:"file_type"`
	Base64Data string `json:"base64_data"`
}
