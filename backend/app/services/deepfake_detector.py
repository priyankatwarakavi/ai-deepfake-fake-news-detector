import random
import os

def analyze_media(filename: str, file_type: str) -> dict:
    """
    Mock Computer Vision and deep learning classifier for deepfake detection.
    Analyzes metadata, file structure, and simulates frame-by-frame facial manipulation analysis.
    """
    name_lower = filename.lower()
    
    # Heuristics: if name contains 'fake', 'manipulated', or 'deepfake', make it fake
    is_fake_hint = "fake" in name_lower or "manipulated" in name_lower or "deep" in name_lower or "synth" in name_lower
    
    # Seed based on filename to ensure reproducibility for the same file
    random.seed(sum(ord(c) for c in filename))
    
    # Simulating facial detection
    num_faces = random.choice([1, 2]) if "crowd" not in name_lower else random.randint(3, 6)
    
    # Manipulation score
    if is_fake_hint:
        manipulation_score = random.uniform(0.72, 0.98)
    else:
        manipulation_score = random.uniform(0.02, 0.28)
        
    is_manipulated = manipulation_score > 0.5
    result = "Fake" if is_manipulated else "Real"
    confidence = manipulation_score if is_manipulated else (1.0 - manipulation_score)
    confidence_percentage = round(confidence * 100, 1)
    
    # Generate frame-by-frame analysis report for video
    frames_report = []
    if file_type.startswith("video") or name_lower.endswith((".mp4", ".avi", ".mov", ".mkv")):
        num_frames = 10  # Sample 10 keyframes for report
        for i in range(num_frames):
            frame_num = i * 24  # Assuming 24fps
            frame_score = manipulation_score + random.uniform(-0.08, 0.08)
            frame_score = max(0.01, min(0.99, frame_score))
            
            # Simulated bounding box for face in frame [ymin, xmin, ymax, xmax]
            bbox = [
                round(0.2 + random.uniform(-0.02, 0.02), 3),
                round(0.3 + random.uniform(-0.02, 0.02), 3),
                round(0.6 + random.uniform(-0.02, 0.02), 3),
                round(0.7 + random.uniform(-0.02, 0.02), 3)
            ]
            
            frames_report.append({
                "frame": frame_num,
                "score": round(frame_score * 100, 1),
                "facesDetected": 1,
                "boundingBox": bbox,
                "anomalyDetected": frame_score > 0.5
            })
            
    # Manipulation techniques detected
    anomalies = []
    if is_manipulated:
        anomalies.append("Asymmetry in iris light reflections detected on primary face.")
        anomalies.append("Boundary blending inconsistencies around mouth and jawline (SSIM threshold breach).")
        anomalies.append("Double compression quantization noise anomalies detected in chrominance channels.")
    else:
        anomalies.append("Natural temporal consistency across facial landmarker movements.")
        anomalies.append("Coherent high-frequency textures match background noise distribution.")
        
    return {
        "result": result,
        "confidence": confidence_percentage,
        "facesDetected": num_faces,
        "manipulationScore": round(manipulation_score * 100, 1),
        "anomalies": anomalies,
        "frames": frames_report,
        "metadata": {
            "fileName": filename,
            "fileType": file_type,
            "dimensions": "1080x1080" if "img" in name_lower else "1920x1080",
            "codec": "JPEG" if file_type.startswith("image") else "H.264 / AVC"
        }
    }
