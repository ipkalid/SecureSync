package app

import (
	"context"
	"fmt"
	"log"
	"os"
	"time"

	_ "github.com/lib/pq"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// const (
// 	host     = "localhost"
// 	port     = "5432"
// 	user     = "postgres"
// 	password = "1234"
// 	dbname   = "users"
// 	sslmode  = "disable"
// )

type DataBaseConfig struct {
	Host     string
	Port     string
	User     string
	Password string
	DBName   string
}

var counts int64

func (dbc DataBaseConfig) String() string {

	return fmt.Sprintf("mongodb://%s:%s@%s:%s/%s",
		dbc.User, dbc.Password,
		dbc.Host, dbc.Port, dbc.DBName)

}

func openDB(dataSourceName string) (*mongo.Client, error) {

	ctx := context.TODO()
	client, err := mongo.Connect(ctx, options.Client().ApplyURI(dataSourceName))
	if err != nil {
		panic(err)
	}
	err = client.Ping(ctx, nil)

	return client, nil
}

func connectToDB() *mongo.Client {
	host := os.Getenv("DB_HOST")
	port := os.Getenv("DB_PORT")
	user := os.Getenv("DB_USERNAME")
	password := os.Getenv("DB_PASSWORD")
	dbname := os.Getenv("DB_NAME")

	dpConfig := DataBaseConfig{Host: host, Port: port, User: user, Password: password, DBName: dbname}

	dsn := dpConfig.String()

	for {
		connection, err := openDB(dsn)
		if err != nil {
			log.Println("MongoDb not yet ready ...")
			counts++
		} else {
			log.Println("Connected to MongoDb!")
			fmt.Println(dsn)
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

// // MONGO_INITDB_ROOT_USERNAME: root
// 	// MONGO_INITDB_ROOT_PASSWORD: example
// 	uri := "mongodb://root:example@localhost:27017"

// 	ctx := context.TODO()
// 	client, err := mongo.Connect(ctx, options.Client().ApplyURI(uri))
// 	if err != nil {
// 		panic(err)
// 	}
// 	err = client.Ping(ctx, nil)

// 	if err != nil {
// 		panic(err)
// 	}
// 	fmt.Println("hello world")
// 	databases, err := client.ListDatabaseNames(ctx, bson.M{})
// 	if err != nil {
// 		panic(err)
// 	}

// 	fmt.Println("Databases:")
// 	for _, database := range databases {
// 		fmt.Println(database)
// 	}
// 	coll := client.Database("test").Collection("users")

// 	cursor, err := coll.Find(ctx, bson.M{})
// 	if err != nil {
// 		panic(err)
// 	}

// 	var results []interface{}
// 	if err = cursor.All(context.TODO(), &results); err != nil {
// 		panic(err)
// 	}
// 	println(len(results))

// 	// Prints the results of the find operation as structs
// 	// for _, result := range results {
// 	// cursor.Decode(&result)
// 	output, err := json.MarshalIndent(results, "", "    ")
// 	if err != nil {
// 		panic(err)
// 	}
// 	fmt.Printf("%s\n", output)
// 	// }
