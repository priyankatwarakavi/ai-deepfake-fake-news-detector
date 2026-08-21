from fastapi import APIRouter, Depends, HTTPException
from app.database import get_db
from app.auth import get_current_user, RoleChecker
from datetime import datetime, timedelta

router = APIRouter(prefix="/analytics", tags=["analytics"])

@router.get("/dashboard")
def get_user_dashboard_analytics(current_user = Depends(get_current_user), db = Depends(get_db)):
    userId = current_user["_id"]
    
    # User-specific statistics
    news_scans = db["fake_news_analysis"].find({"userId": userId})
    deepfake_scans = db["deepfake_analysis"].find({"userId": userId})
    reports = db["reports"].find({"userId": userId})
    
    total_news = len(news_scans)
    total_df = len(deepfake_scans)
    total_scans = total_news + total_df
    total_reports = len(reports)
    
    fake_news_count = sum(1 for s in news_scans if s["result"] == "Fake")
    fake_df_count = sum(1 for s in deepfake_scans if s["result"] == "Fake")
    total_fake = fake_news_count + fake_df_count
    
    fake_ratio = round((total_fake / total_scans * 100), 1) if total_scans > 0 else 0.0
    
    # Recent activity log
    activity = []
    for s in news_scans:
        activity.append({
            "id": s["_id"],
            "type": "Fake News Scanner",
            "detail": f"Analyzed {s['inputType']}: {s['input'][:40]}...",
            "result": s["result"],
            "confidence": s["confidence"],
            "timestamp": s["timestamp"].isoformat()
        })
    for s in deepfake_scans:
        activity.append({
            "id": s["_id"],
            "type": "Deepfake Media Scanner",
            "detail": f"Analyzed {s['fileType'].split('/')[0]}: {s['fileName']}",
            "result": s["result"],
            "confidence": s["confidence"],
            "timestamp": s["timestamp"].isoformat()
        })
        
    activity.sort(key=lambda x: x["timestamp"], reverse=True)
    recent_activity = activity[:8]
    
    # Chart data (scans over last 7 days)
    days_data = []
    now = datetime.utcnow()
    for i in range(6, -1, -1):
        day = now - timedelta(days=i)
        day_str = day.strftime("%b %d")
        
        # Simple counts for this specific day
        day_news = sum(1 for s in news_scans if s["timestamp"].date() == day.date())
        day_df = sum(1 for s in deepfake_scans if s["timestamp"].date() == day.date())
        
        days_data.append({
            "day": day_str,
            "news": day_news,
            "deepfake": day_df
        })
        
    return {
        "stats": {
            "totalScans": total_scans,
            "newsScans": total_news,
            "deepfakeScans": total_df,
            "reportsGenerated": total_reports,
            "fakeContentDetected": total_fake,
            "fakeRatio": fake_ratio
        },
        "recentActivity": recent_activity,
        "chartData": days_data
    }

@router.get("/admin", dependencies=[Depends(RoleChecker(["admin"]))])
def get_global_admin_analytics(db = Depends(get_db)):
    users_count = db["users"].count_documents()
    news_scans = db["fake_news_analysis"].find()
    deepfake_scans = db["deepfake_analysis"].find()
    reports_count = db["reports"].count_documents()
    
    total_news = len(news_scans)
    total_df = len(deepfake_scans)
    total_scans = total_news + total_df
    
    fake_news_count = sum(1 for s in news_scans if s["result"] == "Fake")
    fake_df_count = sum(1 for s in deepfake_scans if s["result"] == "Fake")
    total_fake = fake_news_count + fake_df_count
    
    global_fake_ratio = round((total_fake / total_scans * 100), 1) if total_scans > 0 else 0.0
    
    # Media type distribution
    image_count = sum(1 for s in deepfake_scans if s["fileType"].startswith("image/"))
    video_count = sum(1 for s in deepfake_scans if s["fileType"].startswith("video/"))
    
    # Audit log (recent 15 activities globally)
    global_activity = []
    for s in news_scans:
        global_activity.append({
            "id": s["_id"],
            "user": s.get("userName", "Unknown User"),
            "action": "Fake News Verification",
            "target": s["input"][:45] + "...",
            "result": s["result"],
            "confidence": s["confidence"],
            "timestamp": s["timestamp"].isoformat()
        })
    for s in deepfake_scans:
        global_activity.append({
            "id": s["_id"],
            "user": s.get("userName", "Unknown User"),
            "action": "Deepfake Verification",
            "target": f"{s['fileName']} ({s['fileType']})",
            "result": s["result"],
            "confidence": s["confidence"],
            "timestamp": s["timestamp"].isoformat()
        })
        
    global_activity.sort(key=lambda x: x["timestamp"], reverse=True)
    recent_logs = global_activity[:15]
    
    return {
        "globalStats": {
            "totalUsers": users_count,
            "totalScans": total_scans,
            "totalNewsScans": total_news,
            "totalDeepfakeScans": total_df,
            "reportsCount": reports_count,
            "fakeRatio": global_fake_ratio
        },
        "mediaBreakdown": {
            "images": image_count,
            "videos": video_count
        },
        "systemLogs": recent_logs
    }
