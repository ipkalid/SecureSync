package app

import (
	"context"
	"log"
	"net/http"
	"os"

	_ "github.com/lib/pq"
	"go.mongodb.org/mongo-driver/mongo"
)

type App struct {
	Router http.Handler
	DB     *mongo.Client
	// Models data.Models
}

func NewApp() *App {
	db := connectToDB()

	app := &App{
		DB: db,
		// Models: data.New(db),
	}
	return app
}

func (a *App) Start() {
	defer a.DB.Disconnect(context.TODO())
	server := &http.Server{Addr: ":80", Handler: a.router()}

	externalPort := os.Getenv("EX_PORT")
	log.Printf("server is running on http://localhost:%s\n", externalPort)

	err := server.ListenAndServe()
	if err != nil {
		log.Fatal(err)
	}

}
