package app

import (
	"auth-service/data"
	"database/sql"
	"log"
	"net/http"

	_ "github.com/lib/pq"
)

type App struct {
	Router http.Handler
	DB     *sql.DB
	Models data.Models
}

func NewApp() *App {
	db := connectToDB()
	err := setUpTables(db)
	if err != nil {
		panic(err)
	}
	app := &App{
		DB:     db,
		Models: data.New(db),
	}
	return app
}

func (a *App) Start() {
	defer a.DB.Close()
	server := &http.Server{Addr: ":3000", Handler: a.router()}

	log.Println("server is running on http://localhost:3000")

	err := server.ListenAndServe()
	if err != nil {
		log.Fatal(err)
	}

}
