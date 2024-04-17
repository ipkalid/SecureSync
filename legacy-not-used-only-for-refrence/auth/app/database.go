package app

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/lib/pq"
)

const (
	host     = "localhost"
	port     = "5432"
	user     = "postgres"
	password = "mysecretpassword"
	dbname   = "securesync"
	sslmode  = "disable"
)

type DataBaseConfig struct {
	Host     string
	Port     string
	User     string
	Password string
	DBName   string
	SSLMode  string
}

func (dbc DataBaseConfig) String() string {
	return fmt.Sprintf("host=%s port=%s user=%s "+
		"password=%s dbname=%s sslmode=%s",
		dbc.Host, dbc.Port, dbc.User, dbc.Password, dbc.DBName, dbc.SSLMode)

}
func loadDataBase() *sql.DB {
	dpConfig := DataBaseConfig{Host: host, Port: port, User: user, Password: password, DBName: dbname, SSLMode: sslmode}

	db, err := sql.Open("postgres", dpConfig.String())
	if err != nil {
		log.Fatal(err)
	}

	err = db.Ping()
	if err != nil {
		log.Fatal(err.Error())

	}
	setUpTables(db)
	fmt.Println("Successfully connected to the DATABASE")
	return db
}

func setUpTables(db *sql.DB) {
	_, err := db.Exec(`
		CREATE TABLE IF NOT EXISTS Users (
			id SERIAL PRIMARY KEY,
			username VARCHAR(255) UNIQUE NOT NULL,
			email VARCHAR(255) UNIQUE NOT NULL,
			password_hash VARCHAR(255) NOT NULL,
			created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
		);

		CREATE TABLE IF NOT EXISTS Roles (
			id SERIAL PRIMARY KEY,
			name VARCHAR(255) UNIQUE NOT NULL
		);

		CREATE TABLE IF NOT EXISTS User_Roles (
			user_id INTEGER REFERENCES Users(id),
			role_id INTEGER REFERENCES Roles(id),
			PRIMARY KEY (user_id, role_id)
		);

		CREATE TABLE IF NOT EXISTS Refresh_Tokens (
			id SERIAL PRIMARY KEY,
			user_id INTEGER REFERENCES Users(id),
			token VARCHAR(255) NOT NULL
		);
	`)

	if err != nil {
		log.Fatal(err.Error())
	}
}
