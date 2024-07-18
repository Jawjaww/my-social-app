#!/bin/bash

# Create google-services.json file from the secret
echo "$GOOGLE_SERVICES_JSON" > google-services.json

# Verify that the file is created
if [ -f "google-services.json" ]; then
  echo "google-services.json file created successfully."
else
  echo "Failed to create google-services.json file."
  exit 1
fi
