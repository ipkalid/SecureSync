package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/ipkalid/go-common/json_helpers"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var db *mongo.Database

func main() {
	// Construct MongoDB URI
	username := "root"
	password := "example"
	host := "mongodb.default.svc.cluster.local"
	port := "27017"
	database := "policiesconfig"

	mongoURI := fmt.Sprintf("mongodb://%s:%s@%s:%s/%s?authSource=admin", username, password, host, port, database)

	// MongoDB connection
	clientOptions := options.Client().ApplyURI(mongoURI).SetAuth(options.Credential{
		Username: username,
		Password: password,
	})
	client, err := mongo.NewClient(clientOptions)
	if err != nil {
		log.Fatalf("Error creating MongoDB client: %s", err)
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	err = client.Connect(ctx)
	if err != nil {
		log.Fatalf("Error connecting to MongoDB: %s", err)
	}
	log.Println("Successfully connected to MongoDB.")

	db = client.Database(database)

	// Setup HTTP router
	r := chi.NewRouter()
	r.Get("/appsPackages/{filter}", getApps)
	r.Get("/deviceSettingsOptions", deviceSettingsOptions)
	r.Get("/customConfigurations", fetchCustomConfigurations)
	r.Post("/saveCustomConfiguration", saveCustomConfiguration)

	externalPort := os.Getenv("EX_PORT")
	if externalPort == "" {
		externalPort = "80"
	}
	log.Printf("Server is running on http://localhost:%s\n", externalPort)

	err = http.ListenAndServe(":"+externalPort, r)
	if err != nil {
		log.Fatalf("Server failed to start: %s", err)
	}
}

func deviceSettingsOptions(w http.ResponseWriter, r *http.Request) {
	log.Println("Received request for device settings options")
	collection := db.Collection("deviceSettings")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var settings []bson.M
	cursor, err := collection.Find(ctx, bson.M{})
	if err != nil {
		log.Printf("Error fetching device settings: %s", err)
		http.Error(w, "Failed to fetch device settings", http.StatusInternalServerError)
		return
	}
	defer cursor.Close(ctx)

	if err = cursor.All(ctx, &settings); err != nil {
		log.Printf("Error decoding device settings: %s", err)
		http.Error(w, "Failed to decode device settings", http.StatusInternalServerError)
		return
	}

	payload := json_helpers.JsonResponse{
		Error:   false,
		Message: "success",
		Data:    settings,
	}
	json_helpers.WriteJSON(w, http.StatusOK, payload)
}

func getApps(w http.ResponseWriter, r *http.Request) {
	log.Println("Received request to get apps")
	filter := chi.URLParam(r, "filter")
	collection := db.Collection("appsPackages")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var apps []bson.M
	cursor, err := collection.Find(ctx, bson.M{"filter": filter})
	if err != nil {
		log.Printf("Error fetching apps: %s", err)
		http.Error(w, "Failed to fetch apps", http.StatusInternalServerError)
		return
	}
	defer cursor.Close(ctx)

	if err = cursor.All(ctx, &apps); err != nil {
		log.Printf("Error decoding apps: %s", err)
		http.Error(w, "Failed to decode apps", http.StatusInternalServerError)
		return
	}

	payload := json_helpers.JsonResponse{
		Error:   false,
		Message: "success",
		Data:    apps,
	}
	json_helpers.WriteJSON(w, http.StatusOK, payload)
}

func fetchCustomConfigurations(w http.ResponseWriter, r *http.Request) {
	log.Println("Received request for custom configurations")
	collection := db.Collection("customConfigurations")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	cursor, err := collection.Find(ctx, bson.M{})
	if err != nil {
		log.Printf("Error fetching custom configurations: %s", err)
		http.Error(w, "Failed to fetch documents", http.StatusInternalServerError)
		return
	}
	defer cursor.Close(ctx)

	var results []bson.M
	if err = cursor.All(ctx, &results); err != nil {
		log.Printf("Error decoding custom configurations: %s", err)
		http.Error(w, "Failed to decode documents", http.StatusInternalServerError)
		return
	}

	payload := json_helpers.JsonResponse{
		Error:   false,
		Message: "success",
		Data:    results,
	}
	json_helpers.WriteJSON(w, http.StatusOK, payload)
}

func saveCustomConfiguration(w http.ResponseWriter, r *http.Request) {
	log.Println("Received request to save custom configuration")
	var data map[string]interface{}

	err := json.NewDecoder(r.Body).Decode(&data)
	if err != nil {
		log.Printf("Error decoding request body: %s", err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	collection := db.Collection("customConfigurations")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	_, err = collection.InsertOne(ctx, data)
	if err != nil {
		log.Printf("Error inserting custom configuration: %s", err)
		http.Error(w, "Failed to create document", http.StatusInternalServerError)
		return
	}

	payload := json_helpers.JsonResponse{
		Error:   false,
		Message: "Document created successfully",
		Data:    nil,
	}
	json_helpers.WriteJSON(w, http.StatusCreated, payload)
}
