#!/bin/bash

# Read .env.local file
if [ ! -f .env.local ]; then
    echo "Error: .env.local file not found"
    exit 1
fi

# Function to update a secret
update_secret() {
    local secret_name=$1
    local secret_value=$2
    
    echo "Updating secret: $secret_name"
    echo -n "$secret_value" | gcloud secrets versions add "$secret_name" --data-file=- 2>/dev/null || \
    (gcloud secrets create "$secret_name" --replication-policy="automatic" && \
     echo -n "$secret_value" | gcloud secrets versions add "$secret_name" --data-file=-)
}

# Read each line from .env.local and update secrets
while IFS='=' read -r key value; do
    # Skip empty lines and comments
    if [ -z "$key" ] || [[ $key == \#* ]]; then
        continue
    fi
    
    # Remove any quotes from the value
    value=$(echo "$value" | sed -e 's/^"//' -e 's/"$//' -e "s/^'//" -e "s/'$//")
    
    # Update the secret
    update_secret "$key" "$value"
done < .env.local

echo "All secrets have been updated!"