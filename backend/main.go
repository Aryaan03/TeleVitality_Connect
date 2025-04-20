package main

import (
	"backend/config"
	"backend/handlers"
	"log"
	"net/http"
	"os"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	"github.com/rs/cors"
)

func main() {

	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	db := config.ConnectDB()
	defer db.Close()

	authHandler := &handlers.AuthHandler{DB: db, SendGridKey: os.Getenv("SENDGRID_API_KEY")}
	profileHandler := &handlers.ProfileHandler{DB: db}
	doctorProfileHandler := &handlers.DoctorProfileHandler{DB: db}
	appointmentHandler := &handlers.AppointmentHandler{DB: db}

	r := mux.NewRouter()

	// Public Routes
	r.HandleFunc("/api/register", authHandler.Register).Methods("POST")
	r.HandleFunc("/api/login", authHandler.Login).Methods("POST")
	r.HandleFunc("/api/send-code", authHandler.SendResetCode).Methods("POST")
	r.HandleFunc("/api/verify-code", authHandler.VerifyResetCode).Methods("POST")
	r.HandleFunc("/api/reset-password", authHandler.ResetPassword).Methods("POST")

	r.HandleFunc("/api/docregister", authHandler.DoctorRegister).Methods("POST")
	r.HandleFunc("/api/doclogin", authHandler.DoctorLogin).Methods("POST")

	// Protected Patient Routes
	protected := r.PathPrefix("/api/protected").Subrouter()
	protected.Handle("/dashboard", handlers.JWTAuthMiddleware("patient")(http.HandlerFunc(authHandler.ProtectedDashboard))).Methods("GET")
	protected.Handle("/profile", handlers.JWTAuthMiddleware("patient")(http.HandlerFunc(profileHandler.GetProfile))).Methods("GET")
	protected.Handle("/profile", handlers.JWTAuthMiddleware("patient")(http.HandlerFunc(profileHandler.UpdateProfile))).Methods("PUT")

	// Protected Doctor Routes
	protectedDoctor := r.PathPrefix("/api/doctor").Subrouter()
	protectedDoctor.Use(handlers.JWTAuthMiddleware("doctor")) // Apply Doctor Role Middleware
	protectedDoctor.Handle("/profile", http.HandlerFunc(doctorProfileHandler.GetDoctorProfile)).Methods("GET")
	protectedDoctor.Handle("/profile", http.HandlerFunc(doctorProfileHandler.UpdateDoctorProfile)).Methods("PUT")

	// New Doctor Appointment Routes
	protectedDoctor.Handle("/appointments", http.HandlerFunc(appointmentHandler.GetDoctorAppointments)).Methods("GET")
	protectedDoctor.Handle("/appointments/{id}", http.HandlerFunc(appointmentHandler.CancelAppointment)).Methods("DELETE")

	// Protected Appointment Routes (for both doctors and patients)
	r.Handle("/api/appointments/upcoming", handlers.JWTAuthMiddleware("doctor", "patient")(http.HandlerFunc(appointmentHandler.GetUpcomingAppointments))).Methods("GET")
	r.Handle("/api/appointments/history", handlers.JWTAuthMiddleware("patient")(http.HandlerFunc(appointmentHandler.GetAppointmentHistory))).Methods("GET")

	// Appointment Routes
	r.HandleFunc("/api/specialties", appointmentHandler.GetSpecialties).Methods("GET")
	r.HandleFunc("/api/doctors", appointmentHandler.GetDoctorsBySpecialty).Methods("GET")
	r.HandleFunc("/api/doctor/availability", appointmentHandler.GetDoctorAvailability).Methods("GET")
	r.HandleFunc("/api/appointmenttime", appointmentHandler.GetDoctorAppointmentTimes).Methods("GET")
	r.HandleFunc("/api/appointment/{id}/notes", appointmentHandler.UpdateAppointmentNotes).Methods("PUT")

	// Use r.Handle for routes with middleware
	r.Handle("/api/appointments", handlers.JWTAuthMiddleware("patient")(http.HandlerFunc(appointmentHandler.BookAppointment))).Methods("POST")

	// CORS configuration
	c := cors.New(cors.Options{
		AllowedOrigins: []string{"http://localhost:5173", "http://localhost:5174"},
		AllowedMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders: []string{
			"Content-Type",
			"Authorization",
			"X-Requested-With",
			"Accept",
			"Origin",
		},
		AllowCredentials: true,
		Debug:            true,
	})

	handler := c.Handler(r)

	log.Println("Server starting on port 8080...")
	log.Fatal(http.ListenAndServe(":8080", handler))
}
