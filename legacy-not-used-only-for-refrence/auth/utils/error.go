package utils

import (
	"SecureSync/auth/model"
	"net/http"
)

func ThrowNetworkError(w http.ResponseWriter, r *http.Request, errorMessage string) {
	var error_message model.ErrorJson = model.ErrorJson{}

	w.WriteHeader(http.StatusBadRequest)
	error_message.StatusCode = http.StatusBadRequest
	error_message.ErrorMessage = errorMessage
	data, _ := error_message.Json()

	w.Write(data)

}
