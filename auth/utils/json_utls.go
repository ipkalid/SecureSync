package utils

import (
	"SecureSync/auth/model"
	"encoding/json"
	"fmt"
	"net/http"
)

func Decode(w http.ResponseWriter, r *http.Request, body any) error {
	var error_message model.ErrorJson = model.ErrorJson{}
	err := json.NewDecoder(r.Body).Decode(&body)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		error_message.StatusCode = http.StatusBadRequest
		error_message.ErrorMessage = fmt.Sprintf("error: error data format %v \n", err)
		data, err := error_message.Json()

		if err != nil {
			return err
		}

		w.Write(data)

		return err
	}
	return nil
}
