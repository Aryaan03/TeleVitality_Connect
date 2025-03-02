package models

type Doctor struct {
	ID           int    `json:"id"`
	Username     string `json:"username"`
	Email        string `json:"email"`
	Password     string `json:"password,omitempty"`
	PasswordHash string `json:"-"`
}

type DoctorProfile struct {
	UserID               int    `json:"userId"`
	FirstName            string `json:"firstName"`
	LastName             string `json:"lastName"`
	DateOfBirth          string `json:"dateOfBirth"`
	Gender               string `json:"gender"`
	PhoneNumber          string `json:"phoneNumber"`
	MedicalLicenseNumber string `json:"medicalLicenseNumber"`
	IssuingMedicalBoard  string `json:"issuingMedicalBoard"`
	LicenseExpiryDate    string `json:"licenseExpiryDate"`
	Specialization       string `json:"specialization"`
	YearsOfExperience    int    `json:"yearsOfExperience"`
	HospitalName         string `json:"hospitalName"`
	WorkAddress          string `json:"workAddress"`
	ConsultationType     string `json:"consultationType"`
	Availability         string `json:"availability"` // JSON string for availability
}
