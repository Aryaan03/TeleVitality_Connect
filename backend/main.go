// main.go
package main

import (
	"backend/config"
	"backend/handlers"
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

func main() {
	db := config.ConnectDB()
	defer db.Close()

	authHandler := &handlers.AuthHandler{DB: db}
	profileHandler := &handlers.ProfileHandler{DB: db}
	doctorProfileHandler := &handlers.DoctorProfileHandler{DB: db} // Initialize DoctorProfileHandler

	r := mux.NewRouter()

	// Public Routes
	r.HandleFunc("/api/register", authHandler.Register).Methods("POST")
	r.HandleFunc("/api/login", authHandler.Login).Methods("POST")
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
