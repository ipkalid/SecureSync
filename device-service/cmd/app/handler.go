package app

import (
	"fmt"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/ipkalid/go-common/json_helpers"
)

// enrollment_link := "https://enterprise.google.com/android/enroll?et=" + EnrollmentToken.Value
func (a *App) getAllDevices(w http.ResponseWriter, r *http.Request) {

	devices, err := a.AMC.LoadAllDevices()
	if err != nil {
		json_helpers.ErrorJSON(w, fmt.Errorf("error loading data"), http.StatusBadRequest)
		return
	}
	payload := json_helpers.JsonResponse{
		Error:   false,
		Message: "success",
		Data:    devices,
	}
	json_helpers.WriteJSON(w, http.StatusAccepted, payload)
}

func (a *App) getDevice(w http.ResponseWriter, r *http.Request) {
	deviceId := chi.URLParam(r, "deviceId")

	device, err := a.AMC.GetDevice(deviceId)
	if err != nil {
		json_helpers.ErrorJSON(w, fmt.Errorf("error loading data"), http.StatusBadRequest)
		return
	}
	payload := json_helpers.JsonResponse{
		Error:   false,
		Message: "success",
		Data:    device,
	}
	json_helpers.WriteJSON(w, http.StatusAccepted, payload)
}

func (a *App) updateDevicePolicy(w http.ResponseWriter, r *http.Request) {

	var requestPayload struct {
		DeviceId   string `json:"deviceId"`
		PolicyName string `json:"policyName"`
	}
	err := json_helpers.ReadJSON(w, r, &requestPayload)

	if err != nil {
		json_helpers.ErrorJSON(w, fmt.Errorf("wrong format"), http.StatusBadRequest)
		return
	}

	err = a.AMC.UpdateDevicePolicy(requestPayload.DeviceId, requestPayload.PolicyName)
	if err != nil {
		json_helpers.ErrorJSON(w, fmt.Errorf("error loading data"), http.StatusBadRequest)
		return
	}
	payload := json_helpers.JsonResponse{
		Error:   false,
		Message: "success",
		Data:    nil,
	}
	json_helpers.WriteJSON(w, http.StatusAccepted, payload)
}

func (a *App) deleteDevice(w http.ResponseWriter, r *http.Request) {
	deviceId := chi.URLParam(r, "deviceId")

	err := a.AMC.DeleteDevice(deviceId)
	if err != nil {
		json_helpers.ErrorJSON(w, fmt.Errorf("error loading data"), http.StatusBadRequest)
		return
	}

	payload := json_helpers.JsonResponse{
		Error:   false,
		Message: "success",
		Data:    nil,
	}
	json_helpers.WriteJSON(w, http.StatusAccepted, payload)
}
