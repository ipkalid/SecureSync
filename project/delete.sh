#!/bin/bash

# List all container images and their tags
IMAGES=$(gcloud container images list --format='value(name)')

# Loop through each image and delete all tags
for IMAGE in $IMAGES; do
    REPO=$(echo $IMAGE | cut -d'/' -f2-)
    gcloud container images delete $IMAGE --force-delete-tags --quiet
done
	
