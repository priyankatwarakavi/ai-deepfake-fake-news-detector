import os
import uuid
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import FileResponse
from app.database import get_db
from app.auth import get_current_user
from app.services.report_generator import generate_pdf_report

router = APIRouter(prefix="/reports", tags=["reports"])

REPORTS_DIR = r"C:\Users\PRIYANKA\.gemini\antigravity\scratch\ai-deepfake-fake-news-detector\backend\data\reports"

@router.post("/generate/{analysis_type}/{analysis_id}")
def generate_report(analysis_type: str, analysis_id: str, current_user = Depends(get_current_user), db = Depends(get_db)):
    if analysis_type not in ["news", "deepfake"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid analysis type. Must be 'news' or 'deepfake'."
        )
        
    collection_name = "fake_news_analysis" if analysis_type == "news" else "deepfake_analysis"
    record = db[collection_name].find_one({"_id": analysis_id})
    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Analysis record not found."
        )
        
    # Security check: users can only generate reports for their own scans (unless Admin)
    if record["userId"] != current_user["_id"] and current_user["role"] != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this analysis record."
        )
        
    # Path for PDF
    report_id = str(uuid.uuid4())
    pdf_filename = f"report-{report_id}.pdf"
    pdf_path = os.path.join(REPORTS_DIR, pdf_filename)
    
    # Generate PDF
    try:
        generate_pdf_report(
            analysis_type=analysis_type,
            data=record,
            user_name=current_user["name"],
            output_path=pdf_path
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate PDF: {e}"
        )
        
    # Save report metadata to DB
    new_report = {
        "_id": report_id,
        "userId": current_user["_id"],
        "userName": current_user["name"],
        "analysisId": analysis_id,
        "analysisType": analysis_type,
        "pdfPath": pdf_path,
        "pdfFilename": pdf_filename,
        "createdAt": datetime.utcnow()
    }
    
    db["reports"].insert_one(new_report)
    
    return {
        "reportId": report_id,
        "downloadUrl": f"/api/reports/download/{report_id}"
    }

@router.get("/")
def get_user_reports(current_user = Depends(get_current_user), db = Depends(get_db)):
    # Admins get all reports, users get only their own
    query = {} if current_user["role"] == "admin" else {"userId": current_user["_id"]}
    reports = db["reports"].find(query)
    
    result = []
    for r in reports:
        result.append({
            "id": r["_id"],
            "analysisId": r["analysisId"],
            "analysisType": r["analysisType"],
            "userName": r.get("userName", "User"),
            "pdfFilename": r["pdfFilename"],
            "createdAt": r["createdAt"].isoformat(),
            "downloadUrl": f"/api/reports/download/{r['_id']}"
        })
    return result

@router.get("/download/{report_id}")
def download_report(report_id: str, db = Depends(get_db)):
    report = db["reports"].find_one({"_id": report_id})
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found."
        )
        
    filepath = report["pdfPath"]
    if not os.path.exists(filepath):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Physical report file not found on disk."
        )
        
    return FileResponse(
        path=filepath,
        filename=report["pdfFilename"],
        media_type="application/pdf"
    )
