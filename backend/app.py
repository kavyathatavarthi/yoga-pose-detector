# pylint: skip-file
# type: ignore

from flask import Flask, request, jsonify
from flask_cors import CORS
import base64
import cv2
import numpy as np
from PIL import Image
import io
import mediapipe as mp
import math
import torch
from collections import deque
import time
import os

from utils import load_labels, load_model, get_transform

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Load model
print("=" * 60)
print(" YOGA POSE DETECTOR - TREE POSE FIXED")
print("=" * 60)

# Load labels
labels_path = os.path.join(os.path.dirname(__file__), "labels.txt")
class_names = load_labels(labels_path)
print(f" Model classes ({len(class_names)} poses):")
for i, name in enumerate(class_names):
    print(f"   {i+1}. {name}")

# Load model
model_path = os.path.join(os.path.dirname(__file__), "yoga_best.pth")
model = load_model(model_path, class_names)
transform = get_transform()
print(" Model ready!")

# MediaPipe initialization
mp_pose = mp.solutions.pose
mp_draw = mp.solutions.drawing_utils
pose = mp_pose.Pose(
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5
)

# =========================
# STABILIZATION BUFFERS
# =========================
buffer = deque(maxlen=3)  # Reduced from 5 to 3 for faster response
score_buffer = deque(maxlen=5)  # Reduced from 8 to 5
prediction_history = deque(maxlen=5)  # Reduced from 10 to 5
locked_pose = None
lock_counter = 0
lock_threshold = 2          # Reduced from 3 to 2 for faster switching
stability_required = 0.6    # Increased from 0.5 for more stability

# =========================
# TREE POSE SPECIFIC DETECTION
# =========================

def is_tree_pose_detected(landmarks, frame_shape):
    """Direct detection of Tree Pose using leg position"""
    try:
        # Get key landmarks
        l_hip = landmarks[mp_pose.PoseLandmark.LEFT_HIP.value]
        r_hip = landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value]
        l_knee = landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value]
        r_knee = landmarks[mp_pose.PoseLandmark.RIGHT_KNEE.value]
        l_ankle = landmarks[mp_pose.PoseLandmark.LEFT_ANKLE.value]
        r_ankle = landmarks[mp_pose.PoseLandmark.RIGHT_ANKLE.value]
        
        # Calculate hip heights
        left_hip_y = l_hip.y
        right_hip_y = r_hip.y
        hip_diff = abs(left_hip_y - right_hip_y)
        
        # Calculate knee heights - one knee should be significantly higher (lifted leg)
        left_knee_y = l_knee.y
        right_knee_y = r_knee.y
        knee_diff = abs(left_knee_y - right_knee_y)
        
        # Calculate ankle heights - lifted foot should be higher
        left_ankle_y = l_ankle.y
        right_ankle_y = r_ankle.y
        ankle_diff = abs(left_ankle_y - right_ankle_y)
        
        # For Tree Pose: one leg is lifted, so one knee and ankle should be higher
        # The lifted leg's knee should be near hip level
        
        # Check if there's a significant height difference between legs
        # This indicates one leg is lifted
        if knee_diff > 0.08 or ankle_diff > 0.1:
            return True, min(0.9, 0.6 + knee_diff + ankle_diff)
        
        # Also check if one knee is above the other significantly
        # For lifted leg, knee should be above the other knee
        if left_knee_y < right_knee_y - 0.1 or right_knee_y < left_knee_y - 0.1:
            return True, 0.75
        
        return False, 0
        
    except Exception as e:
        print(f"Tree pose detection error: {e}")
        return False, 0

# =========================
# YOUR CORE FUNCTIONS
# =========================

POSE_FEEDBACK = {
    "downdog": {
        "ideal_angles": {
            "hip_angle": (110, 130),
            "arm_angle": (170, 180),
            "back_angle": (170, 190),
            "knee_angle": (160, 180)
        },
        "corrections": {
            "hips_too_low": ["Raise your hips higher", "Push hips up towards the ceiling", "Walk hands closer to feet"],
            "hips_too_high": ["Lower hips slightly", "Bend knees slightly if needed"],
            "back_rounded": ["Straighten your back", "Engage your core", "Lengthen through the spine"],
            "arms_bent": ["Straighten your arms", "Press through palms", "Rotate arms outward"],
            "heels_not_grounded": ["Press heels toward floor", "Bend knees slightly if needed"],
            "shoulders_tight": ["Relax shoulders away from ears", "Draw shoulders down back"],
            "perfect": ["Excellent Downward Dog!", "Great form! Keep breathing deeply", "Perfect alignment!"]
        }
    },
    "plank": {
        "ideal_angles": {
            "body_angle": (175, 185),
            "hip_shoulder_diff": (-0.03, 0.03),
            "shoulder_wrist_x": (-0.08, 0.08)
        },
        "corrections": {
            "hips_dropping": ["Engage your core", "Lift hips slightly", "Don't let hips sag"],
            "hips_too_high": ["Lower hips", "Keep body in straight line", "Don't pike the hips"],
            "back_arching": ["Tuck tailbone slightly", "Engage abdominal muscles", "Keep spine neutral"],
            "shoulders_over_wrists": ["Align shoulders over wrists", "Move forward slightly"],
            "neck_tension": ["Look slightly forward", "Relax neck", "Keep head in line with spine"],
            "elbows_locked": ["Micro-bend elbows", "Don't lock joints"],
            "perfect": ["Perfect Plank position!", "Strong core engagement!", "Excellent form!"]
        }
    },
    "warrior2": {
        "ideal_angles": {
            "front_knee": (85, 100),
            "back_leg": (170, 180),
            "arms_level": (-0.05, 0.05),
            "shoulder_height_diff": (-0.05, 0.05)
        },
        "corrections": {
            "front_knee_too_far": ["Bend front knee more", "Knee should be over ankle", "Lower hips"],
            "front_knee_not_bent": ["Bend front knee deeper", "Sink into the pose"],
            "back_leg_bent": ["Straighten back leg", "Press through back heel"],
            "arms_not_level": ["Raise arms to shoulder height", "Keep arms parallel to floor"],
            "leaning_forward": ["Keep torso upright", "Stack shoulders over hips"],
            "hips_not_open": ["Open hips to the side", "Square hips to the side"],
            "gaze_wrong": ["Look over front fingertips", "Keep neck relaxed"],
            "perfect": ["Beautiful Warrior II!", "Strong and stable position!", "Perfect alignment!"]
        }
    },
    "tree": {
        "ideal_angles": {
            "hip_height_diff": (0.05, 0.20),
            "shoulder_height_diff": (-0.08, 0.08),
            "standing_knee": (170, 185)
        },
        "corrections": {
            "foot_too_high": ["Place foot below knee", "Don't press into knee joint", "Find stable position"],
            "foot_too_low": ["Lift foot higher", "Press foot into thigh"],
            "hip_opened": ["Open hip to the side", "Keep hips square forward"],
            "leaning": ["Engage core", "Keep spine straight", "Find a focal point"],
            "shoulders_uneven": ["Level shoulders", "Relax shoulders down"],
            "standing_leg_bent": ["Straighten standing leg", "Engage thigh muscles"],
            "balance_issues": ["Find a drishti (focal point)", "Engage core for stability"],
            "perfect": ["Perfect Tree pose!", "Excellent balance!", "Beautiful alignment!"]
        }
    },
    "goddess": {
        "ideal_angles": {
            "knee_angle": (110, 130),
            "hip_height_diff": (-0.05, 0.05),
            "knee_height_diff": (-0.05, 0.05)
        },
        "corrections": {
            "knees_too_shallow": ["Bend knees deeper", "Sink lower into pose", "Open hips more"],
            "knees_too_deep": ["Don't over-bend knees", "Keep knees over ankles"],
            "knees_misaligned": ["Align knees with toes", "Open knees outward"],
            "back_arched": ["Keep spine straight", "Engage core", "Tuck tailbone slightly"],
            "shoulders_tight": ["Relax shoulders", "Draw shoulders down"],
            "feet_too_close": ["Widen stance", "Turn toes outward"],
            "perfect": ["Perfect Goddess pose!", "Strong and grounded!", "Beautiful opening!"]
        }
    }
}

def angle(a, b, c):
    a = [a.x, a.y]
    b = [b.x, b.y]
    c = [c.x, c.y]
    ang = math.degrees(
        math.atan2(c[1]-b[1], c[0]-b[0]) -
        math.atan2(a[1]-b[1], a[0]-b[0])
    )
    return abs(ang)

def avg_angle(a1, b1, c1, a2, b2, c2):
    return (angle(a1,b1,c1) + angle(a2,b2,c2)) / 2

def visibility_check(landmarks, threshold=0.5):
    visible = [lm.visibility for lm in landmarks]
    return sum(v > threshold for v in visible) / len(visible)

def calculate_pose_score(pose_name, joint_angles, metrics, confidence):
    if pose_name not in POSE_FEEDBACK:
        return int(confidence * 100), "detecting", ["Move into frame clearly"]
    
    ideal = POSE_FEEDBACK[pose_name]["ideal_angles"]
    score_components = []
    perfect_count = 0
    total_checks = 0
    
    for metric_name, ideal_range in ideal.items():
        total_checks += 1
        actual_value = joint_angles.get(metric_name) or metrics.get(metric_name)
        
        if actual_value is not None:
            min_ideal, max_ideal = ideal_range
            
            if min_ideal <= actual_value <= max_ideal:
                component_score = 100
                perfect_count += 1
                score_components.append(100)
            else:
                if actual_value < min_ideal:
                    deviation = (min_ideal - actual_value) / min_ideal
                else:
                    deviation = (actual_value - max_ideal) / max_ideal
                
                if deviation < 0.05:
                    component_score = 85
                elif deviation < 0.1:
                    component_score = 75
                elif deviation < 0.15:
                    component_score = 65
                else:
                    component_score = 50
                score_components.append(component_score)
    
    if score_components:
        pose_score = sum(score_components) / len(score_components)
    else:
        pose_score = confidence * 100
    
    final_score = int(0.7 * pose_score + 0.3 * confidence * 100)
    
    perfect_ratio = perfect_count / total_checks if total_checks > 0 else 0
    if perfect_ratio >= 0.8 and final_score < 85:
        final_score = min(95, final_score + 10)
    elif perfect_ratio >= 0.6 and final_score < 75:
        final_score = min(85, final_score + 5)
    
    final_score = max(0, min(100, final_score))
    
    if final_score >= 85:
        form_type = "perfect"
    elif final_score >= 70:
        form_type = "good"
    elif final_score >= 50:
        form_type = "needs_work"
    else:
        form_type = "poor"
    
    feedback_list = generate_feedback(pose_name, joint_angles, metrics, final_score, form_type)
    
    return final_score, form_type, feedback_list

def generate_feedback(pose_name, joint_angles, metrics, score, form_type):
    feedback = []
    pose_feedback = POSE_FEEDBACK.get(pose_name, {})
    corrections = pose_feedback.get("corrections", {})
    
    if form_type == "perfect":
        perfect_msgs = corrections.get("perfect", [f"Excellent {pose_name.capitalize()}!"])
        feedback.append(f" {perfect_msgs[0]}")
        if score >= 92:
            feedback.append(" Outstanding form! Keep it up!")
        return feedback[:3]
    
    if form_type == "good":
        feedback.append(" Good form! Minor improvements:")
    
    if form_type in ["needs_work", "poor"]:
        feedback.append(" Corrections needed:")
    
    issues_found = []
    
    if pose_name == "downdog":
        hip_angle = joint_angles.get("hip_angle", 0)
        arm_angle = joint_angles.get("arm_angle", 0)
        if hip_angle < 100:
            issues_found.append(("hips_too_low", hip_angle))
        elif hip_angle > 140:
            issues_found.append(("hips_too_high", hip_angle))
        if arm_angle < 170:
            issues_found.append(("arms_bent", arm_angle))
    
    elif pose_name == "plank":
        hip_shoulder = metrics.get("hip_shoulder_diff", 0)
        if hip_shoulder > 0.03:
            issues_found.append(("hips_dropping", hip_shoulder))
        elif hip_shoulder < -0.05:
            issues_found.append(("hips_too_high", hip_shoulder))
    
    elif pose_name == "warrior2":
        front_knee = joint_angles.get("front_knee", 0)
        if front_knee < 85:
            issues_found.append(("front_knee_not_bent", front_knee))
        elif front_knee > 100:
            issues_found.append(("front_knee_too_far", front_knee))
    
    elif pose_name == "tree":
        hip_diff = metrics.get("hip_height_diff", 0)
        if hip_diff < 0.04:
            issues_found.append(("foot_too_low", hip_diff))
        elif hip_diff > 0.22:
            issues_found.append(("foot_too_high", hip_diff))
        if score < 70:
            issues_found.append(("balance_issues", 0))
    
    elif pose_name == "goddess":
        knee_angle = joint_angles.get("knee_angle", 0)
        if knee_angle < 110:
            issues_found.append(("knees_too_deep", knee_angle))
        elif knee_angle > 130:
            issues_found.append(("knees_too_shallow", knee_angle))
    
    for issue_key, value in issues_found[:3]:
        if issue_key in corrections:
            correction_msgs = corrections[issue_key]
            if correction_msgs:
                feedback.append(f"  • {correction_msgs[0]}")
    
    return feedback[:4]

# =========================
# STABILIZATION FUNCTION
# =========================

def get_stable_pose(current_pose, confidence, tree_confidence=0):
    """Stabilization with improved Tree Pose handling"""
    global locked_pose, lock_counter

    # Special handling for Tree Pose - prioritize direct detection
    if tree_confidence > 0.5:  # Lower threshold for tree pose
        if locked_pose != "tree":
            locked_pose = "tree"
            lock_counter = 0
        return "tree", True

    # If currently locked on tree but tree confidence dropped, don't unlock immediately
    if locked_pose == "tree" and tree_confidence > 0.3:  # Keep locked if still somewhat confident
        return "tree", True

    # If no person detected or low confidence
    if current_pose in ["No Person", "Low Visibility", "Uncertain", "Detecting..."]:
        if locked_pose and locked_pose != "tree":  # Don't hold uncertain for tree pose
            return locked_pose, True
        return current_pose, False

    # Add to history
    prediction_history.append(current_pose)

    from collections import Counter
    counter = Counter(prediction_history)
    most_common_pose, count = counter.most_common(1)[0]
    consistency = count / len(prediction_history)

    if locked_pose:
        if current_pose == locked_pose:
            lock_counter = 0
            return locked_pose, True
        else:
            lock_counter += 1
            if lock_counter >= lock_threshold:
                if consistency >= stability_required:
                    locked_pose = most_common_pose
                    lock_counter = 0
                    return locked_pose, True
                else:
                    return locked_pose, True  # Stay locked if not consistent enough
            else:
                return locked_pose, True

    if consistency >= stability_required:
        locked_pose = most_common_pose
        lock_counter = 0
        return locked_pose, True

    # If not stable enough, return current pose but don't lock
    return current_pose, False

# =========================
# API ENDPOINTS
# =========================

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "model_loaded": True})

@app.route('/classes', methods=['GET'])
def get_classes():
    return jsonify({'classes': class_names})

@app.route('/predict', methods=['POST'])
def predict():
    try:
        global locked_pose, lock_counter
        
        data = request.json
        image_data = data['image'].split(',')[1]
        image_bytes = base64.b64decode(image_data)
        image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
        
        frame = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
        frame = cv2.resize(frame, (640, 480))
        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = pose.process(rgb)
        
        pose_name = "Detecting..."
        score = 0
        form_type = "detecting"
        feedback = ["Position yourself clearly in frame"]
        joint_angles = {}
        metrics = {}
        confidence = 0
        tree_confidence = 0
        
        if results.pose_landmarks:
            lm = results.pose_landmarks.landmark
            visibility = visibility_check(lm)
            
            # Check for Tree Pose directly
            is_tree, tree_confidence = is_tree_pose_detected(lm, frame.shape)
            
            if visibility < 0.6:
                pose_name = "Low Visibility"
                feedback = ["Ensure full body is visible", "Move to better lighting", "Stand 3-5 feet away"]
                score = 0
                form_type = "poor"
            else:
                h, w, _ = frame.shape
                xs = [lm.x for lm in lm]
                ys = [lm.y for lm in lm]
                
                x1, x2 = int(min(xs)*w), int(max(xs)*w)
                y1, y2 = int(min(ys)*h), int(max(ys)*h)
                
                pad = 30
                x1, y1 = max(0, x1-pad), max(0, y1-pad)
                x2, y2 = min(w, x2+pad), min(h, y2+pad)
                
                person_crop = rgb[y1:y2, x1:x2]
                
                if person_crop.size > 0:
                    img = Image.fromarray(person_crop)
                    img_t = transform(img).unsqueeze(0)
                    
                    with torch.no_grad():
                        out = model(pixel_values=img_t)
                        probs = torch.softmax(out.logits, dim=1)
                        pred = torch.argmax(probs).item()
                        confidence = probs[0][pred].item()
                    
                    if confidence < 0.5:
                        pose_name = "Uncertain"
                        feedback = ["Move closer", "Better lighting needed", "Clear pose required"]
                        score = 0
                        form_type = "poor"
                    else:
                        buffer.append(pred)
                        final_pred = max(set(buffer), key=buffer.count)
                        raw_pose = class_names[final_pred].upper()
                        
                        try:
                            l_sh = lm[mp_pose.PoseLandmark.LEFT_SHOULDER]
                            r_sh = lm[mp_pose.PoseLandmark.RIGHT_SHOULDER]
                            l_el = lm[mp_pose.PoseLandmark.LEFT_ELBOW]
                            r_el = lm[mp_pose.PoseLandmark.RIGHT_ELBOW]
                            l_wr = lm[mp_pose.PoseLandmark.LEFT_WRIST]
                            r_wr = lm[mp_pose.PoseLandmark.RIGHT_WRIST]
                            l_hp = lm[mp_pose.PoseLandmark.LEFT_HIP]
                            r_hp = lm[mp_pose.PoseLandmark.RIGHT_HIP]
                            l_kn = lm[mp_pose.PoseLandmark.LEFT_KNEE]
                            r_kn = lm[mp_pose.PoseLandmark.RIGHT_KNEE]
                            l_an = lm[mp_pose.PoseLandmark.LEFT_ANKLE]
                            r_an = lm[mp_pose.PoseLandmark.RIGHT_ANKLE]
                            
                            joint_angles = {
                                "hip_angle": avg_angle(l_sh, l_hp, l_an, r_sh, r_hp, r_an),
                                "arm_angle": avg_angle(l_sh, l_el, l_wr, r_sh, r_el, r_wr),
                                "body_angle": avg_angle(l_sh, l_hp, l_an, r_sh, r_hp, r_an),
                                "knee_angle": avg_angle(l_hp, l_kn, l_an, r_hp, r_kn, r_an),
                                "front_knee": angle(l_hp, l_kn, l_an),
                                "back_knee": angle(r_hp, r_kn, r_an),
                                "standing_knee": angle(l_hp, l_kn, l_an)
                            }
                            
                            metrics = {
                                "shoulder_height_diff": abs(l_sh.y - r_sh.y),
                                "hip_height_diff": abs(l_hp.y - r_hp.y),
                                "knee_height_diff": abs(l_kn.y - r_kn.y),
                                "hip_shoulder_diff": (l_hp.y + r_hp.y)/2 - (l_sh.y + r_sh.y)/2,
                                "shoulder_wrist_x": abs((l_sh.x + r_sh.x)/2 - (l_wr.x + r_wr.x)/2),
                                "hip_rotation": abs((l_hp.x + r_hp.x)/2 - (l_kn.x + r_kn.x)/2)
                            }
                            
                            # If direct detection says it's Tree, override the pose name
                            if tree_confidence > 0.5:  # Lower threshold for consistency
                                raw_pose = "TREE"
                            
                            score, form_type, feedback = calculate_pose_score(
                                raw_pose.lower(), joint_angles, metrics, confidence
                            )
                            
                            score_buffer.append(score)
                            score = int(sum(score_buffer) / len(score_buffer))
                            
                        except Exception as e:
                            print(f"Angle calculation error: {e}")
                            score = int(confidence * 100)
                            feedback = ["Adjust position for better detection"]
                            form_type = "needs_work"
                        
                        stabilized_pose, is_locked = get_stable_pose(raw_pose, confidence, tree_confidence)
                        pose_name = stabilized_pose
        
        else:
            if locked_pose:
                pose_name = locked_pose
            else:
                pose_name = "No Person"
            feedback = ["Stand in front of camera", "Ensure full body visible", "Good lighting helps"]
            score = 0
            form_type = "poor"
        
        print(f"\n{'='*45}")
        print(f" Pose: {pose_name}")
        print(f" Tree Confidence: {tree_confidence:.1%}")
        print(f" Score: {score}% | Form: {form_type.upper()}")
        print(f" {feedback[0] if feedback else 'No feedback'}")
        print(f"{'='*45}")
        
        return jsonify({
            'success': True,
            'pose': pose_name.lower() if pose_name not in ["Detecting...", "Low Visibility", "Uncertain", "No Person"] else pose_name,
            'confidence': confidence,
            'score': score,
            'form_type': form_type,
            'feedback': feedback,
            'joint_angles': joint_angles,
            'metrics': metrics,
            'visibility': visibility if 'visibility' in locals() else 0,
            'is_locked': locked_pose is not None,
            'tree_confidence': tree_confidence
        })
        
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500

if __name__ == '__main__':
    print("\n" + "=" * 60)
    print(" YOGA POSE DETECTOR - TREE POSE STABLE")
    print("=" * 60)
    print(" Direct Tree Pose detection using leg position")
    print(" Tree Pose overrides TNN when detected")
    print(" Fast 3-frame lock")
    print(" No more fluctuations between Uncertain and Tree")
    print("=" * 60)
    app.run(host='0.0.0.0', port=5000, debug=True)