#!/bin/bash
# Set the pipefail option.
set -o pipefail

# Get the Vercel API endpoints.
GET_DEPLOYMENTS_ENDPOINT="https://api.vercel.com/v6/deployments"
DELETE_DEPLOYMENTS_ENDPOINT="https://api.vercel.com/v13/deployments"

# Create a list of deployments.
deployments=$(curl -s -X GET "$GET_DEPLOYMENTS_ENDPOINT/?projectId=$VERCEL_PROJECT_ID&teamId=$VERCEL_ORG_ID" -H "Authorization: Bearer $VERCEL_TOKEN ")
#deployments=$(curl -s -X GET "$GET_DEPLOYMENTS_ENDPOINT/?projectId=$VERCEL_PROJECT_ID" -H "Authorization: Bearer $VERCEL_TOKEN ")

# Filter the deployments list by meta.base_hash === meta tag.
filtered_deployments=$(echo -E $deployments | jq --arg META_TAG "$META_TAG" '[.deployments[] | select(.meta.base_hash | type == "string" and contains($META_TAG)) | .uid] | join(",")')
filtered_deployments="${filtered_deployments//\"/}" # Remove double quotes

# Clears the values from filtered_deployments
IFS=',' read -ra values <<<"$filtered_deployments"

echo "META_TAG ${META_TAG}"
echo "Filtered deployments ${filtered_deployments}"

# Iterate over the filtered deployments list.
for uid in "${values[@]}"; do
    echo "Deleting ${uid}"

    delete_url="${DELETE_DEPLOYMENTS_ENDPOINT}/${uid}?teamId=${VERCEL_ORG_ID}"
    echo $delete_url

    # Make DELETE a request to the /v13/deployments/{id} endpoint.
    curl -X DELETE $delete_url -H "Authorization: Bearer $VERCEL_TOKEN"

    echo "Deleted!"
done
