#!/bin/bash

# Script tự động tải models cho face-api.js

MODEL_DIR="client/public/models"
echo "Creating models directory: $MODEL_DIR"
mkdir -p $MODEL_DIR

echo ""
echo "=========================================="
echo "Downloading Face-API.js Models"
echo "=========================================="
echo ""

# Tiny Face Detector Model
echo "1. Downloading Tiny Face Detector Model..."
echo "  - tiny_face_detector_model-weights_manifest.json"
curl -L -o "$MODEL_DIR/tiny_face_detector_model-weights_manifest.json" \
  https://raw.githubusercontent.com/justadudewhohacks/face-api.js-models/master/weights/tiny_face_detector_model-weights_manifest.json

echo "  - tiny_face_detector_model-shard1"
curl -L -o "$MODEL_DIR/tiny_face_detector_model-shard1" \
  https://raw.githubusercontent.com/justadudewhohacks/face-api.js-models/master/weights/tiny_face_detector_model-shard1

echo "  ✓ Tiny Face Detector Model downloaded"
echo ""

# Face Landmark 68 Model
echo "2. Downloading Face Landmark 68 Model..."
echo "  - face_landmark_68_model-weights_manifest.json"
curl -L -o "$MODEL_DIR/face_landmark_68_model-weights_manifest.json" \
  https://raw.githubusercontent.com/justadudewhohacks/face-api.js-models/master/weights/face_landmark_68_model-weights_manifest.json

echo "  - face_landmark_68_model-shard1"
curl -L -o "$MODEL_DIR/face_landmark_68_model-shard1" \
  https://raw.githubusercontent.com/justadudewhohacks/face-api.js-models/master/weights/face_landmark_68_model-shard1

echo "  ✓ Face Landmark 68 Model downloaded"
echo ""

echo "=========================================="
echo "✓ All models downloaded successfully!"
echo "Location: $MODEL_DIR"
echo "=========================================="

