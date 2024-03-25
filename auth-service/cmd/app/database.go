package app

import (
	"database/sql"
	"fmt"
	"log"
	"time"

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

var counts int64

func (dbc DataBaseConfig) String() string {
	return fmt.Sprintf("host=%s port=%s user=%s "+
		"password=%s dbname=%s sslmode=%s",
		dbc.Host, dbc.Port, dbc.User, dbc.Password, dbc.DBName, dbc.SSLMode)

}

func setUpTables(db *sql.DB) error {
	_, err := db.Exec(`
		CREATE TABLE IF NOT EXISTS Users (
			id SERIAL PRIMARY KEY,
			email VARCHAR(255) UNIQUE NOT NULL,
			firstName VARCHAR(255) UNIQUE NOT NULL,
			lastName VARCHAR(255) UNIQUE NOT NULL,
			password VARCHAR(255) NOT NULL,
			active    INTEGER DEFAULT 0,
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

		

		INSERT INTO public.roles (id, name)
		VALUES (1, 'normal')
		ON CONFLICT (id) DO NOTHING;

		INSERT INTO public.roles (id, name)
		VALUES (2, 'manager')
		ON CONFLICT (id) DO NOTHING;

		INSERT INTO public.roles (id, name)
		VALUES (3, 'admin')
		ON CONFLICT (id) DO NOTHING;
	`)

	if err != nil {
		return err
	}
	return nil
}

func openDB(dataSourceName string) (*sql.DB, error) {
	db, err := sql.Open("postgres", dataSourceName)
	if err != nil {
		return nil, err
	}

	err = db.Ping()
	if err != nil {
		return nil, err
	}

	return db, nil
}

func connectToDB() *sql.DB {
	dpConfig := DataBaseConfig{Host: host, Port: port, User: user, Password: password, DBName: dbname, SSLMode: sslmode}

	dsn := dpConfig.String()

	for {
		connection, err := openDB(dsn)
		if err != nil {
			log.Println("Postgres not yet ready ...")
			counts++
		} else {
			log.Println("Connected to Postgres!")
			return connection
		}

		if counts > 10 {
			log.Println(err)
			return nil
		}

		log.Println("Backing off for two seconds....")
		time.Sleep(2 * time.Second)
		continue
	}
}
