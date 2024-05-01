package app

import (
	"errors"
	"fmt"
	"net/http"
	"reporting-service/data"
	"strings"

	"github.com/ipkalid/go-common/json_helpers"
)

func (a App) Register(w http.ResponseWriter, r *http.Request) {
	var requestPayload struct {
		Email     string `json:"email"`
		Password  string `json:"password"`
		FirstName string `json:"first_name"`
		LastName  string `json:"last_name"`
	}
	err := json_helpers.ReadJSON(w, r, &requestPayload)
	if err != nil {
		json_helpers.ErrorJSON(w, err, http.StatusBadRequest)
		return
	}
	fmt.Println(requestPayload)
	user := data.User{
		Email:     strings.ToLower(requestPayload.Email),
		FirstName: requestPayload.FirstName,
		LastName:  requestPayload.LastName,
		Password:  requestPayload.Password,
	}

	userId, err := a.Models.User.Insert(user)

	if err != nil {
		json_helpers.ErrorJSON(w, errors.New("error creating new user"), http.StatusBadRequest)
		return
	}

	err = a.Models.Role.CreateRoleForUser(userId, 1)

	if err != nil {
		json_helpers.ErrorJSON(w, errors.New("error creating new user"), http.StatusBadRequest)
		return
	}

	payload := json_helpers.JsonResponse{
		Error:   false,
		Message: "user created successfully",
	}

	json_helpers.WriteJSON(w, http.StatusAccepted, payload)
}
func (a App) Login(w http.ResponseWriter, r *http.Request) {
	var requestPayload struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	err := json_helpers.ReadJSON(w, r, &requestPayload)
	if err != nil {
		json_helpers.ErrorJSON(w, err, http.StatusBadRequest)
		return
	}

	// validate the user against the database
	user, err := a.Models.User.GetByEmail(strings.ToLower(requestPayload.Email))
	fmt.Println(err)
	if err != nil {
		json_helpers.ErrorJSON(w, errors.New("invalid credentials"), http.StatusBadRequest)
		return
	}

	err = user.PasswordMatches(requestPayload.Password)
	if err != nil {
		json_helpers.ErrorJSON(w, errors.New("invalid credentials"), http.StatusBadRequest)
		return
	}

	role, err := a.Models.Role.GetRoleById(user.ID)
	if err != nil {
		json_helpers.ErrorJSON(w, errors.New("error with the current user contact support"), http.StatusBadRequest)
		return
	}

	token, err := a.Models.RefreshToken.CreateTokenRecord(*user, *role)

	if err != nil {
		json_helpers.ErrorJSON(w, err, http.StatusBadRequest)
		return
	}
	response := struct {
		Token string `json:"token"`
	}{
		Token: token,
	}

	payload := json_helpers.JsonResponse{
		Error:   false,
		Message: "logged in user successfully",
		Data:    response,
	}

	json_helpers.WriteJSON(w, http.StatusAccepted, payload)

}

func (a App) Logout(w http.ResponseWriter, r *http.Request) {

	token, err := json_helpers.GetBearerTokenFromHeader(r)
	if err != nil {
		json_helpers.ErrorJSON(w, err, http.StatusBadRequest)
		return
	}
	id, err := a.Models.RefreshToken.VerifyTokenByTokenId(token)
	if err != nil {
		json_helpers.ErrorJSON(w, err, http.StatusBadRequest)
		return
	}

	err = a.Models.RefreshToken.DeleteByID(id)
	if err != nil {
		json_helpers.ErrorJSON(w, err, http.StatusBadRequest)
		return
	}

	payload := json_helpers.JsonResponse{
		Error:   false,
		Message: "user logged out successfully",
	}

	json_helpers.WriteJSON(w, http.StatusAccepted, payload)

}

func (a App) ResetPassword(w http.ResponseWriter, r *http.Request) {

	token, err := json_helpers.GetBearerTokenFromHeader(r)
	if err != nil {
		json_helpers.ErrorJSON(w, err, http.StatusBadRequest)
		return
	}
	_, err = a.Models.RefreshToken.VerifyTokenByTokenId(token)
	if err != nil {
		json_helpers.ErrorJSON(w, err, http.StatusBadRequest)
		return
	}

	var requestPayload struct {
		OldPassword string `json:"old_password"`
		NewPassword string `json:"new_password"`
	}

	err = json_helpers.ReadJSON(w, r, &requestPayload)
	if err != nil {
		json_helpers.ErrorJSON(w, err, http.StatusBadRequest)
		return
	}
	if len(requestPayload.OldPassword) <= 0 || len(requestPayload.NewPassword) <= 0 {

		json_helpers.ErrorJSON(w, fmt.Errorf("invalid input"))
		return

	}
	user, err := a.Models.RefreshToken.UserByTokenId(token)
	if err != nil {
		json_helpers.ErrorJSON(w, err)
		return
	}

	err = user.PasswordMatches(requestPayload.OldPassword)
	if err != nil {
		json_helpers.ErrorJSON(w, err)
		return
	}

	err = user.ResetPassword(requestPayload.NewPassword)
	if err != nil {
		json_helpers.ErrorJSON(w, err)
		return
	}
	payload := json_helpers.JsonResponse{
		Error:   false,
		Message: "password updated successfully",
	}

	json_helpers.WriteJSON(w, http.StatusCreated, payload)

}
