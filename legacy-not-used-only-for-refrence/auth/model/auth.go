package model

import (
	"encoding/json"
	"fmt"
)

type ErrorJson struct {
	StatusCode   int    `json:"status_code"`
	ErrorMessage string `json:"error_message"`
}

func (e *ErrorJson) Json() ([]byte, error) {
	data, err := json.Marshal(e)

	if err != nil {
		return nil, fmt.Errorf("failed to encode order: %w", err)
	}
	return data, nil
}

type User struct {
	ID       int    `json:"id"`
	Username string `json:"username"`
	Password string `json:"password"`
	Auth     Auth   `json:"auth"`
}

type Auth struct {
	ID     int    `json:"id"`
	UserID int    `json:"user_id"`
	Token  string `json:"token"`
}
