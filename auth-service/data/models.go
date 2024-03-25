package data

import (
	"database/sql"
	"time"
)

var db *sql.DB

type Models struct {
	User         User
	Role         Role
	UserRole     UserRole
	RefreshToken RefreshToken
}

func New(dbPool *sql.DB) Models {
	db = dbPool

	return Models{
		User:         User{},
		Role:         Role{},
		UserRole:     UserRole{},
		RefreshToken: RefreshToken{},
	}
}

type User struct {
	ID        int       `json:"id"`
	Email     string    `json:"email"`
	FirstName string    `json:"first_name,omitempty"`
	LastName  string    `json:"last_name,omitempty"`
	Password  string    `json:"-"`
	Active    int       `json:"active,omitempty"`
	CreatedAt time.Time `json:"created_at,omitempty"`
	UpdatedAt time.Time `json:"updated_at,omitempty"`
}

type Role struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}

type UserRole struct {
	UserID int `json:"user_id"`
	RoleID int `json:"role_id"`
}

type RefreshToken struct {
	ID     int    `json:"id"`
	UserID int    `json:"user_id"`
	Token  string `json:"token"`
}
