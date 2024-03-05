package handler

import (
	"SecureSync/auth/utils"
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"regexp"
	"strings"
	"time"
)

var emailRegex = regexp.MustCompile(`^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$`)
var usernameRegex = regexp.MustCompile(`^[a-zA-Z0-9_]{1,15}$`)

type Response struct {
	Message string `json:"message"`
}

type Auth struct {
	db *sql.DB
}

func NewAuth(db *sql.DB) *Auth {
	auth := &Auth{
		db: db,
	}

	return auth
}

func (a Auth) Register(w http.ResponseWriter, r *http.Request) {

	var body struct {
		Username string `json:"username"`
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	err := json.NewDecoder(r.Body).Decode(&body)
	if err != nil {
		utils.ThrowNetworkError(w, r, "error: invalid data")
		return
	}

	if !emailRegex.MatchString(body.Email) {
		utils.ThrowNetworkError(w, r, "not valid email address")
		return
	}

	isValid := usernameRegex.MatchString(body.Username)
	if !isValid {
		utils.ThrowNetworkError(w, r, "invalid name")
		return
	}

	hashedPassword, err := utils.HashPassword(body.Password)
	if err != nil {
		utils.ThrowNetworkError(w, r, "unknown error")
		return
	}

	sqlStatement := `
	INSERT INTO users (username, email,	password_hash,created_at,updated_at)
		VALUES ($1, $2, $3, $4, $5)
		RETURNING id`

	var id int
	err = a.db.QueryRow(sqlStatement, body.Username, body.Email, hashedPassword, time.Now(), time.Now()).Scan(&id)
	if err != nil {
		utils.ThrowNetworkError(w, r, fmt.Sprintf("error: %v \n", err))
		return
	}
	fmt.Println(id)
	sqlStatement = `
	INSERT INTO public.user_roles (user_id, role_id)
		VALUES ($1, 2);
	`
	_, err = a.db.Exec(sqlStatement, id)
	if err != nil {
		utils.ThrowNetworkError(w, r, fmt.Sprintf("error: %v \n", err))
		return
	}

	response := Response{Message: "user registered"}
	jsonResponse, _ := json.Marshal(response)

	w.Write(jsonResponse)
}
func (a Auth) Login(w http.ResponseWriter, r *http.Request) {
	var body struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}

	err := json.NewDecoder(r.Body).Decode(&body)
	if err != nil {
		utils.ThrowNetworkError(w, r, "error: invalid data")
		return
	}

	if err != nil {
		utils.ThrowNetworkError(w, r, "unknown error")
		return
	}
	sqlStatement := `
	SELECT users.id,users.password_hash, roles.name
	FROM Users
	JOIN User_Roles ON Users.id = User_Roles.user_id
	JOIN Roles ON User_Roles.role_id = Roles.id  where users.username = $1;
	`
	var id string
	var hashedPassword string
	var ruleName string
	err = a.db.QueryRow(sqlStatement, body.Username).Scan(&id, &hashedPassword, &ruleName)
	if err != nil {
		utils.ThrowNetworkError(w, r, "invalid username or password")
		return
	}
	if !utils.CheckPasswordHash(body.Password, hashedPassword) {
		utils.ThrowNetworkError(w, r, "invalid username or password")
		return
	}

	token, err := utils.CreateJWTToken(body.Username, ruleName)
	if err != nil {
		utils.ThrowNetworkError(w, r, err.Error())
		return
	}

	sqlStatement = `
	INSERT INTO public.refresh_tokens (user_id, token)
		VALUES ($1, $2);
	`
	_, err = a.db.Exec(sqlStatement, id, token)
	if err != nil {
		utils.ThrowNetworkError(w, r, err.Error())
		return
	}

	response := struct {
		Message string `json:"message"`
		Token   string `json:"token"`
	}{
		"sussed", token,
	}
	jsonResponse, _ := json.Marshal(response)

	w.Write(jsonResponse)
}
func (a Auth) Logout(w http.ResponseWriter, r *http.Request) {
	authHeader := r.Header.Get("Authorization")
	splitted := strings.Split(authHeader, "Bearer ")
	if len(splitted) != 2 {
		utils.ThrowNetworkError(w, r, "not valid token")
		return
	}
	tokenString := splitted[1]

	token, _, err := utils.VerifyToken(tokenString)
	if err != nil {
		utils.ThrowNetworkError(w, r, err.Error())
		return
	}

	sqlStatement := `
	DELETE
	FROM public.refresh_tokens
	WHERE token = $1;
	`

	_, err = a.db.Exec(sqlStatement, token)
	if err != nil {
		utils.ThrowNetworkError(w, r, err.Error())
		return
	}

	response := struct {
		Message string `json:"message"`
	}{
		"user logged out successfully ",
	}
	jsonResponse, _ := json.Marshal(response)

	w.Write(jsonResponse)

}
func (a Auth) RefreshToken(w http.ResponseWriter, r *http.Request) {

	username, rule, oldTokenString, err := a.ValidateToken(w, r)
	if err != nil {
		utils.ThrowNetworkError(w, r, "Invalid token")
		return
	}

	newToken, err := utils.CreateJWTToken(username, rule)
	if err != nil {
		utils.ThrowNetworkError(w, r, err.Error())
		return
	}

	sqlStatement := `
	UPDATE public.refresh_tokens
	SET token = $1
	WHERE token = $2;
	`
	_, err = a.db.Exec(sqlStatement, newToken, oldTokenString)
	if err != nil {
		utils.ThrowNetworkError(w, r, err.Error())
		return
	}

	response := struct {
		Message string `json:"message"`
		Token   string `json:"token"`
	}{
		"sussed", newToken,
	}
	jsonResponse, _ := json.Marshal(response)

	w.Write(jsonResponse)

}

func (a Auth) ResetPassword(w http.ResponseWriter, r *http.Request) {
	username, _, _, err := a.ValidateToken(w, r)

	if err != nil {
		utils.ThrowNetworkError(w, r, "unknown error")
		return
	}

	var body struct {
		OldPassword string `json:"old_password"`
		NewPassword string `json:"new_password"`
	}

	err = json.NewDecoder(r.Body).Decode(&body)
	if err != nil {
		utils.ThrowNetworkError(w, r, "error: invalid data")
		return
	}

	sqlStatement := `
	SELECT users.id, users.password_hash
	FROM Users
	where users.username = $1;
	`
	var id string
	var hashedPassword string

	err = a.db.QueryRow(sqlStatement, username).Scan(&id, &hashedPassword)
	if err != nil {
		utils.ThrowNetworkError(w, r, "old password not correct")
		return
	}
	if !utils.CheckPasswordHash(body.OldPassword, hashedPassword) {
		utils.ThrowNetworkError(w, r, "old password not correct")
		return
	}

	newHashedPassword, err := utils.HashPassword(body.NewPassword)
	if err != nil {
		utils.ThrowNetworkError(w, r, "unknown error")
		return
	}
	sqlStatement = `
	UPDATE public.users
	SET password_hash = $2,
		updated_at = $3
	where users.username = $1;
	`
	_, err = a.db.Exec(sqlStatement, username, newHashedPassword, time.Now())
	if err != nil {
		utils.ThrowNetworkError(w, r, "error updating password")
		return
	}

	response := struct {
		Message string `json:"message"`
	}{
		"password updated successfully",
	}
	jsonResponse, _ := json.Marshal(response)

	w.Write(jsonResponse)

}

// ValidateToken validates the token provided in the request and returns the user ID, username, token, and any error encountered.
// The first string represents the user ID.
// The second string represents the username.
// The third string value represents the token.
// The last return value is an error, if any.
func (a Auth) ValidateToken(w http.ResponseWriter, r *http.Request) (string, string, string, error) {
	authHeader := r.Header.Get("Authorization")
	splitted := strings.Split(authHeader, "Bearer ")
	if len(splitted) != 2 {
		return "", "", "", fmt.Errorf("invalid  token")
	}
	tokenString := splitted[1]

	token, tokenClaims, err := utils.VerifyToken(tokenString)
	if err != nil {
		return "", "", "", err
	}
	sqlStatement := `
	SELECT
	FROM public.refresh_tokens
	WHERE token = $1;
	`
	err = a.db.QueryRow(sqlStatement, token).Scan()
	if err != nil {

		return "", "", "", err
	}
	return tokenClaims.Username, tokenClaims.Rule, tokenString, nil
}
