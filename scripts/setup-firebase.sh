#!/bin/bash
set -e

echo "🔥 Setting up Firebase for PrestaCerto..."

# Initialize gcloud if needed
if ! command -v gcloud &> /dev/null; then
    echo "Installing Google Cloud SDK..."
    curl https://sdk.cloud.google.com | bash
    exec -l $SHELL
fi

# Authenticate with Google
echo "🔐 Authenticating with Google..."
gcloud auth login --no-launch-browser

# Create Firebase project
PROJECT_ID="prestacerto-$(date +%s)"
REGION="southamerica-east1"

echo "📦 Creating Firebase project: $PROJECT_ID"
gcloud firebase projects create $PROJECT_ID --region=$REGION

# Get Firebase config
echo "🔑 Fetching Firebase config..."
FIREBASE_CONFIG=$(gcloud firebase projects describe $PROJECT_ID --format=json)

# Extract credentials (simplified — real implementation would be more complex)
API_KEY=$(echo $FIREBASE_CONFIG | grep -o '"apiKey":"[^"]*' | cut -d'"' -f4)
PROJECT_ID_ACTUAL=$(echo $FIREBASE_CONFIG | grep -o '"projectId":"[^"]*' | cut -d'"' -f4)

echo "✅ Firebase project created!"
echo ""
echo "Add these to .env.local:"
echo "NEXT_PUBLIC_FIREBASE_PROJECT_ID=$PROJECT_ID_ACTUAL"
echo ""
