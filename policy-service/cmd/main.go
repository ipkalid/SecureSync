package main

import (
	"log"
	"policy-service/cmd/app"
)

func main() {

	// println(androidmanagement)
	log.Println("Starting mdm service")
	app := app.NewApp()

	app.Start(":3002")
}
