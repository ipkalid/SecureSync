package main

// import (
// 	"reporting-service/cmd/app"

// 	"log"
// )

// func main() {

// 	log.Println("Starting authentication service")
// 	app := app.NewApp()

// 	app.Start()
// }

// package main
import (
	"context"
	"encoding/json"
	"fmt"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func main() {
	// MONGO_INITDB_ROOT_USERNAME: root
	// MONGO_INITDB_ROOT_PASSWORD: example
	uri := "mongodb://root:example@localhost:27017"

	ctx := context.TODO()
	client, err := mongo.Connect(ctx, options.Client().ApplyURI(uri))
	if err != nil {
		panic(err)
	}
	err = client.Ping(ctx, nil)

	if err != nil {
		panic(err)
	}
	fmt.Println("hello world")
	databases, err := client.ListDatabaseNames(ctx, bson.M{})
	if err != nil {
		panic(err)
	}

	fmt.Println("Databases:")
	for _, database := range databases {
		fmt.Println(database)
	}
	coll := client.Database("test").Collection("users")

	cursor, err := coll.Find(ctx, bson.M{})
	if err != nil {
		panic(err)
	}

	var results []interface{}
	if err = cursor.All(context.TODO(), &results); err != nil {
		panic(err)
	}
	println(len(results))

	// Prints the results of the find operation as structs
	// for _, result := range results {
	// cursor.Decode(&result)
	output, err := json.MarshalIndent(results, "", "    ")
	if err != nil {
		panic(err)
	}
	fmt.Printf("%s\n", output)
	// }

}
