package main

import (
	"log"
	"os"
	"policy-service/cmd/app"
)

func main() {

	externalPort := os.Getenv("EX_PORT")
	log.Printf("server is running on http://localhost:%s\n", externalPort)

	app := app.NewApp()

	app.Start(":80")
}
