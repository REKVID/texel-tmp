"""
Authentication Router
Handles user login, logout, and profile management
"""
from fastapi import APIRouter, HTTPException, Depends, Header
from typing import Optional
from datetime import datetime
from app.models import (
    LoginRequest,
    AuthTokenResponse,
    UserResponse,
    UserProfileResponse,
    UserFullProfile,
    DashboardData,
    UserProfileUpdate,
)
from app.services.telegram_auth import TelegramAuthService
from app.config import settings

router = APIRouter(prefix="/api/auth", tags=["auth"])


# ==================== Mock Database Functions ====================
# In a real application, these would interact with a database
MOCK_USERS = {}
MOCK_PROFILES = {}


def get_current_user(authorization: Optional[str] = Header(None)) -> int:
    """Extract and verify current user from JWT token"""
    if not authorization:
        raise HTTPException(status_code=401, detail="Not authenticated")

    try:
        scheme, token = authorization.split()
        if scheme.lower() != "bearer":
            raise HTTPException(status_code=401, detail="Invalid auth scheme")

        user_id = TelegramAuthService.verify_access_token(token)
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")

        return user_id
    except ValueError:
        raise HTTPException(status_code=401, detail="Invalid authorization header")


# ==================== Authentication Endpoints ====================

@router.post("/telegram-login", response_model=AuthTokenResponse)
async def telegram_login(request: LoginRequest):
    """
    Login with Telegram OAuth
    Verify Telegram data and create JWT token
    """
    telegram_data = request.telegram_data

    # Verify Telegram auth data signature
    if not TelegramAuthService.verify_telegram_auth_data(
        telegram_data, settings.TELEGRAM_BOT_TOKEN
    ):
        raise HTTPException(status_code=401, detail="Invalid Telegram authentication")

    # Verify auth date is not too old
    auth_date = int(telegram_data.get("auth_date", 0))
    if not TelegramAuthService.verify_auth_date(auth_date):
        raise HTTPException(status_code=401, detail="Authentication data expired")

    # Extract user data
    telegram_id = int(telegram_data.get("id"))
    first_name = telegram_data.get("first_name", "User")
    last_name = telegram_data.get("last_name")
    username = telegram_data.get("username")
    photo_url = telegram_data.get("photo_url")
    is_premium = telegram_data.get("is_premium", False)
    language_code = telegram_data.get("language_code", "en")

    # In real app, check if user exists in DB, if not create
    # For now using mock data
    mock_user_id = abs(hash(telegram_id)) % (10 ** 8)

    if mock_user_id not in MOCK_USERS:
        MOCK_USERS[mock_user_id] = {
            "id": mock_user_id,
            "telegram_id": telegram_id,
            "first_name": first_name,
            "last_name": last_name,
            "username": username,
            "avatar_url": photo_url,
            "is_premium": is_premium,
            "language_code": language_code,
            "is_active": True,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "last_login": datetime.utcnow(),
        }
        # Create default profile
        MOCK_PROFILES[mock_user_id] = {
            "id": mock_user_id,
            "user_id": mock_user_id,
            "bio": "",
            "skill_level": "beginner",
            "total_learning_hours": 0,
            "total_courses_completed": 0,
            "current_course_id": None,
            "current_course_progress": 0,
            "total_points": 0,
            "streak_days": 0,
            "preferred_language": "Python",
            "motivational_quote": None,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
        }
    else:
        # Update last login
        MOCK_USERS[mock_user_id]["last_login"] = datetime.utcnow()

    # Create JWT token
    access_token = TelegramAuthService.create_access_token(mock_user_id)

    user = UserResponse(**MOCK_USERS[mock_user_id])

    return AuthTokenResponse(
        access_token=access_token,
        token_type="bearer",
        expires_in=settings.JWT_EXPIRATION_HOURS * 3600,
        user=user,
    )


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(user_id: int = Depends(get_current_user)):
    """Get current user information"""
    if user_id not in MOCK_USERS:
        raise HTTPException(status_code=404, detail="User not found")

    user = UserResponse(**MOCK_USERS[user_id])
    return user


@router.post("/logout")
async def logout(user_id: int = Depends(get_current_user)):
    """Logout current user (client should discard token)"""
    return {"message": "Successfully logged out"}


# ==================== Profile Endpoints ====================

@router.get("/profile", response_model=UserFullProfile)
async def get_user_profile(user_id: int = Depends(get_current_user)):
    """Get full user profile with achievements and stats"""
    if user_id not in MOCK_USERS:
        raise HTTPException(status_code=404, detail="User not found")

    user = UserResponse(**MOCK_USERS[user_id])
    profile = UserProfileResponse(**MOCK_PROFILES[user_id])

    return UserFullProfile(
        user=user,
        profile=profile,
        recent_stats=[],
        achievements=[],
    )


@router.put("/profile", response_model=UserProfileResponse)
async def update_user_profile(
    update_data: UserProfileUpdate,
    user_id: int = Depends(get_current_user),
):
    """Update user profile"""
    if user_id not in MOCK_PROFILES:
        raise HTTPException(status_code=404, detail="Profile not found")

    profile = MOCK_PROFILES[user_id]

    # Update only provided fields
    if update_data.bio is not None:
        profile["bio"] = update_data.bio
    if update_data.skill_level is not None:
        profile["skill_level"] = update_data.skill_level
    if update_data.preferred_language is not None:
        profile["preferred_language"] = update_data.preferred_language
    if update_data.motivational_quote is not None:
        profile["motivational_quote"] = update_data.motivational_quote

    profile["updated_at"] = datetime.utcnow()

    return UserProfileResponse(**profile)


@router.get("/dashboard", response_model=DashboardData)
async def get_dashboard(user_id: int = Depends(get_current_user)):
    """Get dashboard data with stats and achievements"""
    if user_id not in MOCK_USERS:
        raise HTTPException(status_code=404, detail="User not found")

    user = UserResponse(**MOCK_USERS[user_id])
    profile = UserProfileResponse(**MOCK_PROFILES[user_id])

    # Calculate next milestone
    hours = profile.total_learning_hours
    next_milestone = None
    milestones = [10, 50, 100, 250, 500]
    for milestone in milestones:
        if hours < milestone:
            next_milestone = {
                "hours": milestone,
                "progress": (hours / milestone) * 100,
            }
            break

    return DashboardData(
        user=user,
        profile=profile,
        today_stats=None,
        week_stats=[],
        achievements_unlocked=[],
        next_milestone=next_milestone,
    )


@router.post("/verify-token")
async def verify_token(user_id: int = Depends(get_current_user)):
    """Verify that the token is still valid"""
    return {"valid": True, "user_id": user_id}
