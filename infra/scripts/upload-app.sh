#!/usr/bin/env bash
set -euo pipefail

# Inputs
ARTIFACT_URL="${ARTIFACT_URL}"
STORAGE_ACCOUNT_NAME="${STORAGE_ACCOUNT_NAME}"
STORAGE_ACCOUNT_CONTAINER="${STORAGE_ACCOUNT_CONTAINER}"

echo "============================================================"
echo "Artifact URL              : $ARTIFACT_URL"
echo "Storage Account Name      : $STORAGE_ACCOUNT_NAME"
echo "Storage Account Container : $STORAGE_ACCOUNT_CONTAINER"
echo "============================================================"

# Download artifact
echo "==> Downloading artifact..."
wget "$ARTIFACT_URL" -O app.zip

echo "==> Artifact contents: "
unzip -l app.zip

# Clean up container contents
echo "==> Cleaning up container contents..."
az storage blob delete-batch \
  --account-name "$STORAGE_ACCOUNT_NAME" \
  --container-name "$STORAGE_ACCOUNT_CONTAINER" \
  --prefix "" \
  --auth-mode login

# Upload artifact to blob storage
echo "==> Uploading to blob..."
az storage blob upload \
  --account-name "$STORAGE_ACCOUNT_NAME" \
  --container-name "$STORAGE_ACCOUNT_CONTAINER" \
  --name app.zip \
  --file app.zip \
  --auth-mode login \
  --overwrite true

echo "==> Successfully uploaded artifact to Azure Functions package"
