from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import List, Optional
from app.database import get_db
from app.auth import get_current_user, RoleChecker

router = APIRouter(prefix="/users", tags=["users"])

class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    role: str
    verified: bool
    createdAt: str

class RoleUpdate(BaseModel):
    role: str

@router.get("/me")
def get_me(current_user = Depends(get_current_user)):
    return {
        "id": current_user["_id"],
        "name": current_user["name"],
        "email": current_user["email"],
        "role": current_user["role"],
        "verified": current_user.get("verified", False),
        "createdAt": current_user["createdAt"].isoformat()
    }

@router.get("/", dependencies=[Depends(RoleChecker(["admin"]))])
def get_all_users(db = Depends(get_db)):
    users = db["users"].find()
    result = []
    for u in users:
        result.append({
            "id": u["_id"],
            "name": u["name"],
            "email": u["email"],
            "role": u["role"],
            "verified": u.get("verified", False),
            "createdAt": u["createdAt"].isoformat()
        })
    return result

@router.put("/{user_id}/role", dependencies=[Depends(RoleChecker(["admin"]))])
def update_user_role(user_id: str, data: RoleUpdate, db = Depends(get_db)):
    if data.role not in ["user", "admin"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid role"
        )
        
    user = db["users"].find_one({"_id": user_id})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
        
    db["users"].update_one(
        {"_id": user_id},
        {"$set": {"role": data.role}}
    )
    return {"message": "User role updated successfully"}

@router.delete("/{user_id}", dependencies=[Depends(RoleChecker(["admin"]))])
def delete_user(user_id: str, db = Depends(get_db)):
    user = db["users"].find_one({"_id": user_id})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
        
    # Prevent deleting oneself
    db["users"].delete_one({"_id": user_id})
    return {"message": "User deleted successfully"}
