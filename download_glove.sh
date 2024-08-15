#!/bin/bash

# Check if Kaggle CLI is installed
if ! command -v kaggle &> /dev/null; then
    echo "Kaggle CLI is not installed. Please install it with 'pip install kaggle'."
    exit 1
fi

# Check if Kaggle API credentials are set up
if [ ! -f ~/.kaggle/kaggle.json ]; then
    echo "Kaggle API credentials not found. Please configure them by placing kaggle.json in ~/.kaggle/."
    exit 1
fi

# Ensure the src directory exists
mkdir -p src

echo "Downloading GloVe embeddings from Kaggle..."

# Download the GloVe 6B 300d file from Kaggle
kaggle datasets download -d thanakomsn/glove6b300dtxt -p src/

# Check if the download was successful
if [ -f "src/glove.6B.300d.txt" ]; then
    echo "GloVe embeddings downloaded successfully!"
else
    echo "Failed to download GloVe embeddings."
    exit 1
fi
