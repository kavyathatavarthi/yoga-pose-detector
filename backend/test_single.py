import base64
import requests
import json
from PIL import Image
import io
import os

print("=" * 60)
print("🧘 TESTING POSE DETECTION")
print("=" * 60)

# Try different image formats
image_paths = ["test_image.png", "tree.jpg", "warrior2.jpeg"]
test_image_path = None

for path in image_paths:
    if os.path.exists(path):
        test_image_path = path
        break

try:
    if test_image_path is None:
        raise FileNotFoundError("No test image found (test_image.png or test_image.jpg)")
    
    print(f"📸 Loading image: {test_image_path}")
    
    # Load image
    image = Image.open(test_image_path).convert('RGB')
    image = image.resize((640, 480))
    
    # Get file extension to determine format
    ext = os.path.splitext(test_image_path)[1].lower()
    format_type = "PNG" if ext == ".png" else "JPEG"
    mime_type = "image/png" if ext == ".png" else "image/jpeg"
    
    # Convert to base64
    buffered = io.BytesIO()
    image.save(buffered, format=format_type)
    img_base64 = base64.b64encode(buffered.getvalue()).decode('utf-8')
    
    # Send to API
    print("📡 Sending to backend...")
    response = requests.post(
        'http://localhost:5000/predict',
        json={'image': f'data:{mime_type};base64,{img_base64}'},
        timeout=10
    )
    
    if response.status_code == 200:
        result = response.json()
        print("\n✅ Results:")
        print(f"   Predicted Pose: {result['pose']}")
        print(f"   Confidence: {result['confidence']:.2%}")
        print(f"   Score: {result['score']}%")
        print(f"   Form Type: {result['form_type']}")
        print(f"\n💬 Feedback:")
        for msg in result['feedback'][:3]:
            print(f"   • {msg}")
    else:
        print(f"❌ Error: {response.status_code}")
        print(response.text)
        
except FileNotFoundError as e:
    print(f"❌ {e}")
    print("\n💡 To fix this:")
    print("   1. Take a photo of a yoga pose")
    print("   2. Save it as 'test_image.png' in the backend folder")
    print(f"   3. Location: {os.getcwd()}\\test_image.png")
except Exception as e:
    print(f"❌ Error: {e}")

print("=" * 60)