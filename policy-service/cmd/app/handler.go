package app

//	enrollment_link := "https://enterprise.google.com/android/enroll?et=" + EnrollmentToken.Value
import (
	"fmt"
	"net/http"
	"strings"

	"github.com/go-chi/chi/v5"
	"github.com/ipkalid/go-common/json_helpers"
	"google.golang.org/api/androidmanagement/v1"
)

func (a App) loadAllPolicy(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Called")
	policies, err := a.AMC.LoadPolicies()
	if err != nil {
		json_helpers.ErrorJSON(w, fmt.Errorf("error loading data"), http.StatusBadRequest)
		return
	}

	payload := json_helpers.JsonResponse{
		Error:   false,
		Message: "success",
		Data:    policies,
	}

	json_helpers.WriteJSON(w, http.StatusAccepted, payload)

}

func (a App) patchPolicy(w http.ResponseWriter, r *http.Request) {
	var requestPayload struct {
		Name   string                   `json:"name"`
		Policy androidmanagement.Policy `json:"policy"`
	}

	err := json_helpers.ReadJSON(w, r, &requestPayload)
	if err != nil {
		json_helpers.ErrorJSON(w, fmt.Errorf("wrong format"), http.StatusBadRequest)
		return
	}
	contains := false
	policies, err := a.AMC.LoadPolicies()
	if err != nil {
		json_helpers.ErrorJSON(w, fmt.Errorf(http.StatusText(http.StatusInternalServerError)), http.StatusInternalServerError)
		return
	}
	for _, policy := range policies {
		if strings.Contains(policy.Name, requestPayload.Name) {
			contains = true
		}
	}
	if !contains {
		json_helpers.ErrorJSON(w, fmt.Errorf("policy not found"), http.StatusBadRequest)
		return
	}

	res, err := a.AMC.AddNewPolicy(requestPayload.Name, requestPayload.Policy)
	if err != nil {
		json_helpers.ErrorJSON(w, err, http.StatusBadRequest)
		return
	}

	payload := json_helpers.JsonResponse{
		Error:   false,
		Message: "success",
		Data:    res,
	}

	json_helpers.WriteJSON(w, http.StatusAccepted, payload)

}

func (a App) postPolicy(w http.ResponseWriter, r *http.Request) {
	var requestPayload struct {
		Name   string                   `json:"name"`
		Policy androidmanagement.Policy `json:"policy"`
	}

	err := json_helpers.ReadJSON(w, r, &requestPayload)
	if err != nil {
		json_helpers.ErrorJSON(w, fmt.Errorf("wrong format"), http.StatusBadRequest)
		return
	}
	contains := false
	policies, err := a.AMC.LoadPolicies()
	if err != nil {
		json_helpers.ErrorJSON(w, fmt.Errorf(http.StatusText(http.StatusInternalServerError)), http.StatusInternalServerError)
		return
	}
	for _, policy := range policies {
		if strings.Contains(policy.Name, requestPayload.Name) {
			contains = true
		}
	}
	if contains {
		json_helpers.ErrorJSON(w, fmt.Errorf("policy already added try adding new name"), http.StatusBadRequest)
		return
	}

	res, err := a.AMC.AddNewPolicy(requestPayload.Name, requestPayload.Policy)
	if err != nil {
		json_helpers.ErrorJSON(w, err, http.StatusBadRequest)
		return
	}

	payload := json_helpers.JsonResponse{
		Error:   false,
		Message: "success",
		Data:    res,
	}

	json_helpers.WriteJSON(w, http.StatusAccepted, payload)

}
func (a App) getPolicy(w http.ResponseWriter, r *http.Request) {
	print("called")
	policyName := chi.URLParam(r, "name")

	if policyName == "" {
		json_helpers.ErrorJSON(w, fmt.Errorf("wrong format"), http.StatusBadRequest)
		return
	}

	policy, err := a.AMC.GetPolicy(policyName)
	if err != nil {
		json_helpers.ErrorJSON(w, err, http.StatusInternalServerError)
		return
	}

	payload := json_helpers.JsonResponse{
		Error:   false,
		Message: "success",
		Data:    policy,
	}

	json_helpers.WriteJSON(w, http.StatusAccepted, payload)

}
func (a App) deletePolicy(w http.ResponseWriter, r *http.Request) {
	policyName := chi.URLParam(r, "name")

	if policyName == "" {
		json_helpers.ErrorJSON(w, fmt.Errorf("wrong format"), http.StatusBadRequest)
		return
	}

	policy, err := a.AMC.DeletePolicy(policyName)
	if err != nil {
		json_helpers.ErrorJSON(w, err, http.StatusInternalServerError)
		return
	}

	payload := json_helpers.JsonResponse{
		Error:   false,
		Message: "success",
		Data:    policy,
	}

	json_helpers.WriteJSON(w, http.StatusAccepted, payload)

}

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
