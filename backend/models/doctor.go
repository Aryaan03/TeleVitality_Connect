package models

type Doctor struct {
	ID           int    `json:"id"`
	Username     string `json:"username"`
	Email        string `json:"email"`
	Password     string `json:"password,omitempty"`
	PasswordHash string `json:"-"`
}
