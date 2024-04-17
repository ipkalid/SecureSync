package main

import (
	"fmt"
	"log"
	"net/http"
	"net/smtp"
	"os"
	"regexp"

	"github.com/go-chi/chi/v5"
	"github.com/ipkalid/go-common/json_helpers"
)

func main() {
	r := chi.NewRouter()

	r.Post("/mail/sendEmail", sendMailHandler)

	externalPort := os.Getenv("EX_PORT")
	log.Printf("server is running on http://localhost:%s\n", externalPort)

	err := http.ListenAndServe(":80", r)
	if err != nil {
		panic(err)
	}
}

func sendMailHandler(w http.ResponseWriter, r *http.Request) {
	var requestPayload struct {
		Email   string `json:"email"`
		Subject string `json:"subject"`
		Body    string `json:"body"`
	}
	err := json_helpers.ReadJSON(w, r, &requestPayload)
	if err != nil {
		json_helpers.ErrorJSON(w, fmt.Errorf("not valid body"), http.StatusBadRequest)
		return
	}
	regex := `^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$`
	match, _ := regexp.MatchString(regex, requestPayload.Email)
	if !match {
		json_helpers.ErrorJSON(w, fmt.Errorf("not valid email"), http.StatusBadRequest)
		return
	}

	err = sendEmil(requestPayload.Email, requestPayload.Subject, requestPayload.Body)

	if err != nil {
		json_helpers.ErrorJSON(w, err, http.StatusBadRequest)
		return
	}
	payload := json_helpers.JsonResponse{
		Error:   false,
		Message: "email sent successfully",
	}

	json_helpers.WriteJSON(w, http.StatusAccepted, payload)

}
func sendEmil(toEmail string, subject string, body string) error {
	from := os.Getenv("EMAIL_DOMAIN")
	pass := os.Getenv("EMAIL_PASSWORD")
	to := toEmail

	msg := "From: " + from + "\n" +
		"To: " + to + "\n" +
		"Subject: " + subject + "\n\n" +
		body

	err := smtp.SendMail("smtp.gmail.com:587",
		smtp.PlainAuth("", from, pass, "smtp.gmail.com"),
		from, []string{to}, []byte(msg))

	if err != nil {

		return fmt.Errorf("error sending email")
	}
	log.Println("Successfully sended to " + to)
	return nil
}
