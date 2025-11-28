#!/bin/bash

# ============================================================================
# BetterUs AI - Automated Secret Generation Script
# This script generates a new upload keystore and uploads secrets to GitHub
# ============================================================================

set -e

# Configuration
KEYSTORE_FILE="upload-keystore.jks"
KEY_ALIAS="betterus-alias"
KEYSTORE_PASSWORD=""
KEY_PASSWORD=""
VALIDITY_DAYS=10000
DNAME="CN=BetterUs AI, OU=Mobile, O=BetterUs, L=City, ST=State, C=US"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}============================================${NC}"
echo -e "${GREEN}   BetterUs AI Secret Generation Script${NC}"
echo -e "${GREEN}============================================${NC}"
echo ""

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
    echo -e "${RED}Error: GitHub CLI (gh) is not installed.${NC}"
    echo "Please install it from: https://cli.github.com/"
    exit 1
fi

# Check if gh is authenticated
if ! gh auth status &> /dev/null; then
    echo -e "${RED}Error: GitHub CLI is not authenticated.${NC}"
    echo "Please run: gh auth login"
    exit 1
fi

# Check if keytool is available
if ! command -v keytool &> /dev/null; then
    echo -e "${RED}Error: keytool is not installed.${NC}"
    echo "Please install Java JDK to get keytool."
    exit 1
fi

# Generate random passwords if not provided
generate_password() {
    openssl rand -hex 16
}

echo -e "${YELLOW}Generating secure passwords...${NC}"
KEYSTORE_PASSWORD=$(generate_password)
KEY_PASSWORD=$(generate_password)

# Remove existing keystore if it exists
if [ -f "$KEYSTORE_FILE" ]; then
    echo -e "${YELLOW}Removing existing keystore...${NC}"
    rm "$KEYSTORE_FILE"
fi

# Generate new keystore
echo -e "${YELLOW}Generating new upload keystore...${NC}"
keytool -genkey -v \
    -keystore "$KEYSTORE_FILE" \
    -alias "$KEY_ALIAS" \
    -keyalg RSA \
    -keysize 2048 \
    -validity "$VALIDITY_DAYS" \
    -storepass "$KEYSTORE_PASSWORD" \
    -keypass "$KEY_PASSWORD" \
    -dname "$DNAME"

echo -e "${GREEN}Keystore generated successfully!${NC}"

# Encode keystore to base64
echo -e "${YELLOW}Encoding keystore to base64...${NC}"
KEYSTORE_BASE64=$(base64 -w 0 "$KEYSTORE_FILE")

# Upload secrets to GitHub
echo -e "${YELLOW}Uploading secrets to GitHub repository...${NC}"

echo -e "  → Uploading ANDROID_KEYSTORE_BASE64..."
echo "$KEYSTORE_BASE64" | gh secret set ANDROID_KEYSTORE_BASE64

echo -e "  → Uploading KEYSTORE_PASSWORD..."
echo "$KEYSTORE_PASSWORD" | gh secret set KEYSTORE_PASSWORD

echo -e "  → Uploading KEY_ALIAS..."
echo "$KEY_ALIAS" | gh secret set KEY_ALIAS

echo -e "  → Uploading KEY_PASSWORD..."
echo "$KEY_PASSWORD" | gh secret set KEY_PASSWORD

echo -e "${GREEN}All secrets uploaded successfully!${NC}"

# Clean up
echo -e "${YELLOW}Cleaning up local keystore file...${NC}"
rm "$KEYSTORE_FILE"

echo ""
echo -e "${GREEN}============================================${NC}"
echo -e "${GREEN}   Setup Complete!${NC}"
echo -e "${GREEN}============================================${NC}"
echo ""
echo -e "The following secrets have been uploaded to your repository:"
echo -e "  • ANDROID_KEYSTORE_BASE64"
echo -e "  • KEYSTORE_PASSWORD"
echo -e "  • KEY_ALIAS"
echo -e "  • KEY_PASSWORD"
echo ""
echo -e "${YELLOW}Note: Keep these passwords secure. They are now stored in GitHub Secrets.${NC}"
echo ""
echo -e "To run this script:"
echo -e "  1. Make sure you are in the repository root directory"
echo -e "  2. Ensure GitHub CLI is installed and authenticated (gh auth login)"
echo -e "  3. Run: ${GREEN}chmod +x setup_secrets.sh && ./setup_secrets.sh${NC}"
echo ""
