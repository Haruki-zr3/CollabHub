from datetime import date
from typing import Any

from pydantic import BaseModel, Field


class RegisterRequest(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    email: str
    password: str = Field(min_length=6)
    branch: str
    year: int = Field(default=1, ge=1, le=8)
    entryNumber: str = ""


class LoginRequest(BaseModel):
    email: str
    password: str


class ProblemCreate(BaseModel):
    title: str
    description: str
    branch: str
    type: str = "project"
    difficulty: str = "intermediate"
    deadline: date
    collaboratorsNeeded: int = Field(default=1, ge=1, le=20)
    skills: list[str] = []
    tags: list[str] = []
    longDescription: str = ""


class CollaborationRequest(BaseModel):
    message: str = ""


class TaskCreate(BaseModel):
    collaborationId: int
    title: str
    description: str = ""
    assigneeId: int | None = None
    priority: str = "medium"
    dueDate: date


class TaskUpdate(BaseModel):
    status: str


class UserUpdate(BaseModel):
    bio: str | None = None
    skills: list[str] | None = None
    interests: list[str] | None = None
    availability: str | None = None
    cgpa: float | None = None


def json_value(value: Any):
    return value
