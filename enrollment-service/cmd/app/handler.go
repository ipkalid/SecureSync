package app

//	enrollment_link := "https://enterprise.google.com/android/enroll?et=" + EnrollmentToken.Value
import (
	"fmt"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/ipkalid/go-common/json_helpers"
)

func (a App) LoadAllEnrollmentTokens(w http.ResponseWriter, r *http.Request) {

	Tokens, err := a.AMC.LoadAllEnrollmentTokens()

	if err != nil {
		json_helpers.ErrorJSON(w, fmt.Errorf("error loading data"), http.StatusBadRequest)
		return
	}

	payload := json_helpers.JsonResponse{
		Error:   false,
		Message: "success",
		Data:    Tokens,
	}

	json_helpers.WriteJSON(w, http.StatusAccepted, payload)

}

func (a App) NewEnrollmentToken(w http.ResponseWriter, r *http.Request) {
	var requestPayload struct {
		PolicyName             string `json:"policyName"`
		OneTimeOnly            bool   `json:"oneTimeOnly"`
		AllowPersonalUsageFlag bool   `json:"allowPersonalUsageFlag"`
	}
	err := json_helpers.ReadJSON(w, r, &requestPayload)
	if err != nil {
		json_helpers.ErrorJSON(w, fmt.Errorf("wrong format"), http.StatusBadRequest)
		return
	}

	enrollmentUrl, err := a.AMC.CreateEnrollmentToken(
		requestPayload.PolicyName,
		requestPayload.OneTimeOnly,
		requestPayload.AllowPersonalUsageFlag,
	)
	if err != nil {
		json_helpers.ErrorJSON(w, fmt.Errorf("error loading data"), http.StatusBadRequest)
		return
	}

	payload := json_helpers.JsonResponse{
		Error:   false,
		Message: "success",
		Data:    enrollmentUrl,
	}

	json_helpers.WriteJSON(w, http.StatusAccepted, payload)

}

func (a App) getEnrollmentToken(w http.ResponseWriter, r *http.Request) {
	enrollmentToken := chi.URLParam(r, "name")

	token, err := a.AMC.GetEnrollmentToken(enrollmentToken)
	if err != nil {
		json_helpers.ErrorJSON(w, fmt.Errorf("error loading data"), http.StatusBadRequest)
		return
	}

	payload := json_helpers.JsonResponse{
		Error:   false,
		Message: "success",
		Data:    token,
	}

	json_helpers.WriteJSON(w, http.StatusAccepted, payload)

}
func (a App) deleteEnrollmentToken(w http.ResponseWriter, r *http.Request) {
	enrollmentToken := chi.URLParam(r, "name")

	token, err := a.AMC.DeleteEnrollmentToken(enrollmentToken)
	if err != nil {
		json_helpers.ErrorJSON(w, fmt.Errorf("error loading data"), http.StatusBadRequest)
		return
	}

	payload := json_helpers.JsonResponse{
		Error:   false,
		Message: "success",
		Data:    token,
	}

	json_helpers.WriteJSON(w, http.StatusAccepted, payload)

}
