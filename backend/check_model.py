import torch
import torch.nn as nn

print("=" * 60)
print(" ANALYZING YOUR MODEL")
print("=" * 60)

# Load the model checkpoint
model_path = "yoga_best.pth"
checkpoint = torch.load(model_path, map_location="cpu")

print("\n Model checkpoint keys:")
for key in checkpoint.keys():
    print(f"   - {key}")

# Check classifier layer
if 'classifier.weight' in checkpoint:
    num_classes = checkpoint['classifier.weight'].shape[0]
    print(f"\n Model was trained on {num_classes} classes")
    print(f"   Classifier weight shape: {checkpoint['classifier.weight'].shape}")

# Try to load labels.txt
print("\n Current labels.txt content:")
try:
    with open("labels.txt", "r") as f:
        labels = [line.strip() for line in f.readlines()]
        print(f"   {len(labels)} classes: {labels}")
        
        if len(labels) != num_classes:
            print(f"\n MISMATCH DETECTED!")
            print(f"   Model has {num_classes} classes")
            print(f"   labels.txt has {len(labels)} classes")
            print("\n This is causing incorrect pose detection!")
except FileNotFoundError:
    print("   labels.txt not found!")

print("=" * 60)

# Create correct labels based on model
print("\n Your model expects labels.txt to have these class names:")
print(f"   You need {num_classes} class names in order")
print("\n   For example, if your model was trained on:")
print("   class_0, class_1, class_2, ...")
print("\n   Create labels.txt with one class per line:")
for i in range(num_classes):
    print(f"   class_{i}")

print("\n To fix this, you need to:")
print("   1. Check your Colab training to see actual class names")
print("   2. Update labels.txt with those exact names in the same order")
print("=" * 60)