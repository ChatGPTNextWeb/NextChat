# Configuration
SERVER_USER="YOUR_USERNAME"  # Replace with your server's username
SERVER_IP="YOUR_SERVER_IP"  # Replace with your server's IP address
IMAGE_NAME="nextchat"
TAG="latest"
TAR_FILE="nextchat-image.tar"

echo "Building NextChat Docker image locally..."

# Build the Docker image locally for AMD64 platform, change as needed
docker build --platform linux/amd64 -t ${IMAGE_NAME}:${TAG} .

if [ $? -ne 0 ]; then
    echo "Docker build failed!"
    exit 1
fi

echo "Saving Docker image to tar file..."
# Save the image to a tar file
docker save -o ${TAR_FILE} ${IMAGE_NAME}:${TAG}

echo "Transferring image to server..."
# Transfer the tar file to server
scp ${TAR_FILE} ${SERVER_USER}@${SERVER_IP}:/tmp/

echo "Loading image on server and running container..."
# SSH to server and load the image, then run it, change the environment variables as needed
ssh ${SERVER_USER}@${SERVER_IP} << EOF
# Load the Docker image
docker load -i /tmp/${TAR_FILE}

# Stop existing container if running
docker stop nextchat 2>/dev/null || true
docker rm nextchat 2>/dev/null || true

# Run the new container
docker run -d -p 3000:3000 \\
  --name nextchat \\
  -e OPENAI_API_KEY=sk-xxxx \\
  -e CODE=your-password \\
  ${IMAGE_NAME}:${TAG}

# Clean up the tar file
rm -f /tmp/${TAR_FILE}

echo "NextChat is now running on port 3000!"
echo "You can access it at: http://${SERVER_IP}:3000"
EOF

# Clean up local tar file
rm -f ${TAR_FILE}

echo "Deployment complete!"
