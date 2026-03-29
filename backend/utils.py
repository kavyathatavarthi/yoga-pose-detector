import torch
from torchvision import transforms
from PIL import Image
import os

def load_labels(labels_path='labels.txt'):
    """Load class names from labels file"""
    with open(labels_path, 'r') as f:
        return [line.strip() for line in f.readlines()]

def get_transform():
    """Get image transformation pipeline"""
    return transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])

def load_model(model_path, class_names):
    """Load the Vision Transformer model"""
    from transformers import ViTForImageClassification
    model = ViTForImageClassification.from_pretrained(
        'google/vit-base-patch16-224',
        num_labels=len(class_names),
        ignore_mismatched_sizes=True
    )
    if os.path.exists(model_path):
        model.load_state_dict(torch.load(model_path, map_location='cpu'))
        print(f"✅ Model loaded from {model_path}")
    else:
        print(f"⚠️ Model file not found: {model_path}")
    model.eval()
    return model