package app

import (
	"log"
	"net/http"
)

type App struct {
	Router http.Handler
	AMC    *AndroidManagementClient
}

func NewApp() *App {

	AndroidManagementClient, err := NewAndroidManagementClient()

	if err != nil {
		panic(err)
	}
	app := &App{
		AMC: AndroidManagementClient,
	}
	return app
}

func (a *App) Start(addr ...string) {
	address := ":3000" // default value
	if len(addr) > 0 {
		address = addr[0]
	}
	server := &http.Server{Addr: address, Handler: a.router()}

	log.Printf("server is running on http://localhost%s\n", address)

	err := server.ListenAndServe()
	if err != nil {
		log.Fatal(err)
	}

}
