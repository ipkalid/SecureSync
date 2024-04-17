package app

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"

	_ "github.com/lib/pq"
)

type App struct {
	router http.Handler
	db     *sql.DB
}

func NewApp() *App {
	app := &App{
		db: loadDataBase(),
	}
	app.loadRouter()
	return app
}

func (a *App) Start() {
	defer a.db.Close()
	server := &http.Server{Addr: ":3000", Handler: a.router}

	fmt.Println("server is running on http://localhost:3000")

	err := server.ListenAndServe()
	if err != nil {
		log.Fatal(err)
	}

}
