package models

type User struct {
	ID           int    `json:"id"`
	Username     string `json:"username"`
	Email        string `json:"email"`
	Password     string `json:"password,omitempty"`
	PasswordHash string `json:"-"`
}

type Profile struct {
	UserID                 int    `json:"userId"`
	FirstName              string `json:"firstName"`
	LastName               string `json:"lastName"`
	DateOfBirth            string `json:"dateOfBirth"`
	Gender                 string `json:"gender"`
	PhoneNumber            string `json:"phoneNumber"`
	Address                string `json:"address"`
	ProblemDescription     string `json:"problemDescription"`
	EmergencyAppointment   string `json:"emergencyAppointment"`
	PreviousPatientId      string `json:"previousPatientId"`
	PreferredCommunication string `json:"preferredCommunication"`
	PreferredDoctor        string `json:"preferredDoctor"`
	InsuranceProvider      string `json:"insuranceProvider"`
	InsurancePolicyNumber  string `json:"insurancePolicyNumber"`
	ConsentTelemedicine    bool   `json:"consentTelemedicine"`
}

type Appointment struct {
	ID       int      `json:"id"`
	UserID   int      `json:"userId"`
	DoctorID string   `json:"doctorId"`
	Slot     string   `json:"slot"`
	Problem  string   `json:"problem"`
	Status   string   `json:"status"`
	Files    []string `json:"files"`
}
