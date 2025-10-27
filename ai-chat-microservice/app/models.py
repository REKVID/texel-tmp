"""
Database models for Texel Learning Platform
"""
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


# ==================== User Models ====================
class UserBase(BaseModel):
    first_name: str
    last_name: Optional[str] = None
    telegram_id: int
    username: Optional[str] = None
    avatar_url: Optional[str] = None
    language_code: Optional[str] = "en"


class UserCreate(UserBase):
    pass


class UserResponse(UserBase):
    id: int
    is_active: bool
    is_premium: bool
    created_at: datetime
    updated_at: datetime
    last_login: Optional[datetime] = None

    class Config:
        from_attributes = True


# ==================== Profile Models ====================
class UserProfileBase(BaseModel):
    bio: Optional[str] = None
    skill_level: str = "beginner"
    preferred_language: str = "Python"
    motivational_quote: Optional[str] = None


class UserProfileUpdate(BaseModel):
    bio: Optional[str] = None
    skill_level: Optional[str] = None
    preferred_language: Optional[str] = None
    motivational_quote: Optional[str] = None


class UserProfileResponse(UserProfileBase):
    id: int
    user_id: int
    total_learning_hours: int
    total_courses_completed: int
    current_course_id: Optional[int] = None
    current_course_progress: int
    total_points: int
    streak_days: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# ==================== Learning Stats Models ====================
class LearningStatResponse(BaseModel):
    id: int
    user_id: int
    date: str
    hours_learned: float
    lessons_completed: int
    exercises_solved: int
    points_earned: int
    created_at: datetime

    class Config:
        from_attributes = True


class LearningStatCreate(BaseModel):
    date: str
    hours_learned: float = 0
    lessons_completed: int = 0
    exercises_solved: int = 0
    points_earned: int = 0


# ==================== Achievement Models ====================
class AchievementResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    icon_url: str

    class Config:
        from_attributes = True


class UserAchievementResponse(BaseModel):
    achievement: AchievementResponse
    unlocked_at: datetime

    class Config:
        from_attributes = True


# ==================== Authentication Models ====================
class TelegramUserData(BaseModel):
    id: int
    first_name: str
    last_name: Optional[str] = None
    username: Optional[str] = None
    photo_url: Optional[str] = None
    auth_date: int
    hash: str
    is_premium: bool = False
    language_code: Optional[str] = None


class AuthTokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int
    user: UserResponse


class LoginRequest(BaseModel):
    telegram_data: dict = Field(..., description="Telegram user data from widget")


# ==================== Combined Models ====================
class UserFullProfile(BaseModel):
    user: UserResponse
    profile: UserProfileResponse
    recent_stats: list[LearningStatResponse] = []
    achievements: list[UserAchievementResponse] = []

    class Config:
        from_attributes = True


class DashboardData(BaseModel):
    user: UserResponse
    profile: UserProfileResponse
    today_stats: Optional[LearningStatResponse] = None
    week_stats: list[LearningStatResponse] = []
    achievements_unlocked: list[UserAchievementResponse] = []
    next_milestone: Optional[dict] = None

    class Config:
        from_attributes = True


# ==================== Chat Models (Legacy) ====================
class ChatMessage(BaseModel):
    message: str = Field(..., min_length=1, max_length=4000)
    conversation_id: str = Field(..., min_length=1)
    model: Optional[str] = Field(default="meta-llama/llama-3.3-70b-instruct:free")
    temperature: Optional[float] = Field(default=0.7, ge=0.0, le=2.0)
    max_tokens: Optional[int] = Field(default=1500, ge=1, le=4000)


class ChatResponse(BaseModel):
    model_config = {"protected_namespaces": ()}  # fix для model_ конфликтов
    response: str
    model_used: str
    tokens_used: int
    conversation_id: str
    timestamp: str
    response_time_ms: int


class ConversationHistory(BaseModel):
    conversation_id: str
    messages: list[dict[str, str]]
    messages_count: int
    created_at: str
    updated_at: Optional[str] = None


class ServiceStats(BaseModel):
    total_conversations: int
    total_messages: int
    active_conversations: int
    openrouter_configured: bool
    timestamp: str = datetime.utcnow().isoformat()
