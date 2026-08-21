import os
import uuid
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from pydantic import BaseModel, HttpUrl
from typing import Optional
from app.database import get_db
from app.auth import get_current_user
from app.services.news_detector import analyze_news_content
from app.services.deepfake_detector import analyze_media

router = APIRouter(prefix="/detect", tags=["detection"])

class NewsAnalysisRequest(BaseModel):
    text: Optional[str] = None
    url: Optional[str] = None

@router.post("/news")
def detect_fake_news(data: NewsAnalysisRequest, current_user = Depends(get_current_user), db = Depends(get_db)):
    if not data.text and not data.url:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Either text or url must be provided for news analysis."
        )
        
    analysis_result = analyze_news_content(text=data.text, url=data.url)
    
    # Save to database
    record_id = str(uuid.uuid4())
    record = {
        "_id": record_id,
        "userId": current_user["_id"],
        "userName": current_user["name"],
        "input": data.text or data.url,
        "inputType": "url" if data.url and not data.text else "text",
        "result": analysis_result["result"],
        "confidence": analysis_result["confidence"],
        "sentiment": analysis_result["sentiment"],
        "sentimentScore": analysis_result["sentimentScore"],
        "sourceCredibility": analysis_result["sourceCredibility"],
        "explanation": analysis_result["explanation"],
        "timestamp": datetime.utcnow()
    }
    
    db["fake_news_analysis"].insert_one(record)
    
    return {
        "id": record_id,
        **analysis_result
    }

@router.post("/deepfake")
async def detect_deepfake(
    file: UploadFile = File(...),
    current_user = Depends(get_current_user),
    db = Depends(get_db)
):
    # Validate file type
    content_type = file.content_type
    if not content_type.startswith(("image/", "video/")):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file format. Please upload an image or video."
        )
        
    # Write file locally
    upload_dir = r"C:\Users\PRIYANKA\.gemini\antigravity\scratch\ai-deepfake-fake-news-detector\backend\data\uploads"
    os.makedirs(upload_dir, exist_ok=True)
    
    file_id = str(uuid.uuid4())
    ext = os.path.splitext(file.filename)[1]
    safe_filename = f"{file_id}{ext}"
    dest_path = os.path.join(upload_dir, safe_filename)
    
    try:
        with open(dest_path, "wb") as buffer:
            shutil_copy = True
            # Read and write chunks
            while content := await file.read(1024 * 1024):
                buffer.write(content)
    except Exception as e:
         raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Could not save file: {e}"
        )
        
    # Relative media URL (served locally or mock)
    media_url = f"/static/uploads/{safe_filename}"
    
    # Run analysis
    analysis_result = analyze_media(filename=file.filename, file_type=content_type)
    
    # Save to database
    record_id = str(uuid.uuid4())
    record = {
        "_id": record_id,
        "userId": current_user["_id"],
        "userName": current_user["name"],
        "mediaUrl": media_url,
        "fileName": file.filename,
        "fileType": content_type,
        "result": analysis_result["result"],
        "confidence": analysis_result["confidence"],
        "facesDetected": analysis_result["facesDetected"],
        "manipulationScore": analysis_result["manipulationScore"],
        "anomalies": analysis_result["anomalies"],
        "frames": analysis_result["frames"],
        "metadata": analysis_result["metadata"],
        "timestamp": datetime.utcnow()
    }
    
    db["deepfake_analysis"].insert_one(record)
    
    return {
        "id": record_id,
        **analysis_result,
        "mediaUrl": media_url
    }
