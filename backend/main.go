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

	r := mux.NewRouter()

	// Public Routes
	r.HandleFunc("/api/register", authHandler.Register).Methods("POST")
	r.HandleFunc("/api/login", authHandler.Login).Methods("POST")
	r.HandleFunc("/api/reset-password", authHandler.ResetPassword).Methods("POST")

	// Protected Routes (Require JWT Authentication)
	protected := r.PathPrefix("/api/protected").Subrouter()
	protected.Use(handlers.JWTAuthMiddleware) // Apply middleware to all routes under /api/protected
	protected.HandleFunc("/dashboard", authHandler.ProtectedDashboard).Methods("GET")

	// CORS configuration
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5173"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE"},
		AllowedHeaders:   []string{"Content-Type", "Authorization"},
		AllowCredentials: true,
	})

	handler := c.Handler(r)

	log.Println("Server starting on port 8080...")
	log.Fatal(http.ListenAndServe(":8080", handler))
}
