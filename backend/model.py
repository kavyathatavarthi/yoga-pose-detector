import torch
import torch.nn.functional as F
from transformers import ViTForImageClassification

class YogaPoseModel:
    """Wrapper class for Yoga Pose Detection TNN Model"""
    
    def __init__(self, model_path, labels_path):
        self.class_names = self._load_labels(labels_path)
        self.model = self._load_model(model_path)
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.model.to(self.device)
        
    def _load_labels(self, path):
        with open(path, 'r') as f:
            return [line.strip() for line in f.readlines()]
    
    def _load_model(self, path):
        model = ViTForImageClassification.from_pretrained(
            "google/vit-base-patch16-224",
            num_labels=len(self.class_names),
            ignore_mismatched_sizes=True
        )
        model.load_state_dict(torch.load(path, map_location=self.device))
        model.eval()
        return model
    
    def predict(self, image_tensor):
        """Predict pose from image tensor"""
        with torch.no_grad():
            image_tensor = image_tensor.to(self.device)
            outputs = self.model(pixel_values=image_tensor)
            probs = torch.softmax(outputs.logits, dim=1)
            pred = torch.argmax(probs, dim=1).item()
            confidence = probs[0][pred].item()
            
        return {
            'pose': self.class_names[pred],
            'confidence': confidence,
            'probabilities': {self.class_names[i]: float(probs[0][i]) 
                            for i in range(len(self.class_names))}
        }