package main

import (
	"log"
	"net/http"
	"os"

	"github.com/go-chi/chi/v5"
	"github.com/ipkalid/go-common/json_helpers"
)

func main() {
	r := chi.NewRouter()
	r.Get("/appsPackages/{filter}", getApps)
	r.Get("/deviceSettingsOptions", deviceSettingsOptions)

	externalPort := os.Getenv("EX_PORT")
	log.Printf("server is running on http://localhost:%s\n", externalPort)

	err := http.ListenAndServe(":80", r)
	if err != nil {
		panic(err)
	}
}

func deviceSettingsOptions(w http.ResponseWriter, _ *http.Request) {
	deviceSettingsOptions := []string{
		"screenCaptureDisabled",
		"cameraDisabled",
		"keyguardDisabledFeatures",
		"defaultPermissionPolicy",
		"addUserDisabled",
		"adjustVolumeDisabled",
		"factoryResetDisabled",
		"installAppsDisabled",
		"mountPhysicalMediaDisabled",
		"modifyAccountsDisabled",
		"safeBootDisabled",
		"uninstallAppsDisabled",
		"statusBarDisabled",
		"keyguardDisabled",
		"vpnConfigDisabled",
		"wifiConfigDisabled",
		"usbFileTransferDisabled",
		"smsDisabled",
		"dataRoamingDisabled",
		"locationMode",
	}

	payload := json_helpers.JsonResponse{
		Error:   false,
		Message: "success",
		Data:    deviceSettingsOptions,
	}
	json_helpers.WriteJSON(w, http.StatusOK, payload)

}

func getApps(w http.ResponseWriter, r *http.Request) {
	type AppPackageType struct {
		Name    string `json:"name"`
		Package string `json:"package"`
	}
	var appPackageMap map[string]string
	filter := chi.URLParam(r, "filter")

	if filter == "tasks" {
		appPackageMap = map[string]string{
			"Trello": "com.trello",
			"Asana":  "com.asana.app",
			"Jira":   "com.atlassian.android.jira.core",
		}
	} else if filter == "communications" {
		appPackageMap = map[string]string{
			"Slack":             "com.slack",
			"Microsoft Teams":   "com.microsoft.teams",
			"Zoom":              "us.zoom.videomeetings",
			"Microsoft Outlook": "com.microsoft.office.outlook",
			"LinkedIn":          "com.linkedin.android",
		}
	} else if filter == "files" {
		appPackageMap = map[string]string{
			"Google Drive":         "com.google.android.apps.docs",
			"Adobe Acrobat Reader": "com.adobe.reader",
			"Dropbox":              "com.dropbox.android",
		}
	} else {
		appPackageMap = map[string]string{
			"YouTube":              "com.google.android.youtube",
			"Slack":                "com.slack",
			"Microsoft Teams":      "com.microsoft.teams",
			"Zoom":                 "us.zoom.videomeetings",
			"Google Drive":         "com.google.android.apps.docs",
			"Salesforce":           "com.salesforce.chatter",
			"Trello":               "com.trello",
			"Asana":                "com.asana.app",
			"Adobe Acrobat Reader": "com.adobe.reader",
			"Microsoft Outlook":    "com.microsoft.office.outlook",
			"Dropbox":              "com.dropbox.android",
			"Evernote":             "com.evernote",
			"LinkedIn":             "com.linkedin.android",
			"QuickBooks":           "com.intuit.quickbooks",
			"Shopify":              "com.shopify.mobile",
			"Google Analytics":     "com.google.android.apps.giant",
			"Microsoft OneDrive":   "com.microsoft.skydrive",
			"Tableau Mobile":       "com.tableausoftware.app",
			"Jira":                 "com.atlassian.android.jira.core",
			"HubSpot":              "com.hubspot.android",
		}
	}

	var apps []AppPackageType
	for name, pkg := range appPackageMap {
		apps = append(apps, AppPackageType{Name: name, Package: pkg})
	}

	payload := json_helpers.JsonResponse{
		Error:   false,
		Message: "success",
		Data:    apps,
	}
	json_helpers.WriteJSON(w, http.StatusOK, payload)

}
