#!/bin/bash



# Directory containing all service directories
BASE_DIR="/Users/mansovic./Downloads/SecureSync"

# List of services
services=("device-service" "enrollment-service" "mail-service" "policy-service")

# Loop through each service and build/push the Docker image
for service in "${services[@]}"; do
    echo "Processing $service..."
    cd "$BASE_DIR/$service"

    # Build the Docker image
    docker build -t gcr.io/$(gcloud config get-value project)/$service:latest .

    # Push the Docker image
    docker push gcr.io/$(gcloud config get-value project)/$service:latest

    # List images in GCR
    gcloud container images list

    # Return to the base directory (optional depending on your directory structure)
    cd $BASE_DIR
done

echo "All services processed successfully."

