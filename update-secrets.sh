#!/bin/bash

# Service account email
SERVICE_ACCOUNT="576937573011-compute@developer.gserviceaccount.com"

# Function to update secret permissions
update_secret_permissions() {
    local secret_name=$1
    echo "Updating permissions for secret: $secret_name"
    
    # Add secretmanager.secretAccessor role to the service account
    gcloud secrets add-iam-policy-binding $secret_name \
        --member="serviceAccount:$SERVICE_ACCOUNT" \
        --role="roles/secretmanager.secretAccessor"
}

# Get all secrets and update their permissions
secrets=$(gcloud secrets list --format="value(name)")
for secret in $secrets; do
    update_secret_permissions $secret
done

echo "All secret permissions have been updated!"