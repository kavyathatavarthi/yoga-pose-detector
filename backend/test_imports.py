import sys
print(f"Python version: {sys.version}")

try:
    import flask
    print(f"✅ Flask: {flask.__version__}")
except: print("❌ Flask missing")

try:
    import torch
    print(f"✅ PyTorch: {torch.__version__}")
except: print("❌ PyTorch missing")

try:
    import transformers
    print(f"✅ Transformers: {transformers.__version__}")
except: print("❌ Transformers missing")

try:
    import cv2
    print(f"✅ OpenCV: {cv2.__version__}")
except: print("❌ OpenCV missing")

try:
    import mediapipe as mp
    print(f"✅ MediaPipe: {mp.__version__}")
except: print("❌ MediaPipe missing")