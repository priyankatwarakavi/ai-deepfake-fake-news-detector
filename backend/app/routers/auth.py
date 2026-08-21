from datetime import datetime, timedelta
import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr
from app.database import get_db
from app.auth import get_password_hash, verify_password, create_access_token

router = APIRouter(prefix="/auth", tags=["auth"])

class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class EmailVerification(BaseModel):
    email: EmailStr
    code: str

class ForgotPasswordReq(BaseModel):
    email: EmailStr

class ResetPasswordReq(BaseModel):
    token: str
    new_password: str

@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(user_in: UserRegister, db = Depends(get_db)):
    # Check if user already exists
    existing = db["users"].find_one({"email": user_in.email.lower()})
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email already exists"
        )
        
    # Check if this is the first user, make them Admin
    user_count = db["users"].count_documents()
    role = "admin" if user_count == 0 else "user"
    
    # Generate mock 6-digit verification code
    verification_code = "123456"  # Static for easy prototype verification
    
    new_user = {
        "_id": str(uuid.uuid4()),
        "name": user_in.name,
        "email": user_in.email.lower(),
        "password": get_password_hash(user_in.password),
        "role": role,
        "verified": False,
        "verificationCode": verification_code,
        "resetToken": None,
        "createdAt": datetime.utcnow()
    }
    
    db["users"].insert_one(new_user)
    
    return {
        "message": f"Registration successful! Please verify your email using the verification code: {verification_code}",
        "email": user_in.email.lower()
    }

@router.post("/login")
def login(credentials: UserLogin, db = Depends(get_db)):
    user = db["users"].find_one({"email": credentials.email.lower()})
    if not user or not verify_password(credentials.password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect email or password"
        )
        
    if not user.get("verified", False):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please verify your email address before logging in."
        )
        
    access_token = create_access_token(
        data={"sub": user["email"], "role": user["role"]}
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user["_id"],
            "name": user["name"],
            "email": user["email"],
            "role": user["role"]
        }
    }

@router.post("/verify-email")
def verify_email(data: EmailVerification, db = Depends(get_db)):
    user = db["users"].find_one({"email": data.email.lower()})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
        
    if user.get("verified", False):
        return {"message": "Email is already verified"}
        
    if user.get("verificationCode") != data.code:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid verification code"
        )
        
    db["users"].update_one(
        {"email": data.email.lower()},
        {"$set": {"verified": True, "verificationCode": None}}
    )
    
    return {"message": "Email verified successfully! You can now log in."}

@router.post("/forgot-password")
def forgot_password(data: ForgotPasswordReq, db = Depends(get_db)):
    user = db["users"].find_one({"email": data.email.lower()})
    if not user:
        # Avoid user enumeration attacks in production, but here we can return success
        return {"message": "If the email exists, a password reset token has been generated."}
        
    reset_token = "reset-" + str(uuid.uuid4())[:8]
    db["users"].update_one(
        {"email": data.email.lower()},
        {"$set": {"resetToken": reset_token}}
    )
    
    return {
        "message": f"Password reset link generated. Reset Token: {reset_token}",
        "resetToken": reset_token
    }

@router.post("/reset-password")
def reset_password(data: ResetPasswordReq, db = Depends(get_db)):
    user = db["users"].find_one({"resetToken": data.token})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset token"
        )
        
    db["users"].update_one(
        {"resetToken": data.token},
        {"$set": {"password": get_password_hash(data.new_password), "resetToken": None}}
    )
    
    return {"message": "Password has been successfully updated."}

@router.post("/logout")
def logout():
    return {"message": "Logged out successfully"}
