import json

from fastapi import APIRouter, HTTPException

from database import db_cursor
from models import student_from_row, user_dict
from schemas import UserUpdate

router = APIRouter(prefix="/users", tags=["users"])
USER_COLUMNS = "id, name, email, branch, year, entry_number, bio, skills, interests, availability, cgpa, contributions, problems_solved, collaborations, tasks_completed"


@router.get("")
def list_users():
    with db_cursor() as cursor:
        cursor.execute(f"SELECT {USER_COLUMNS} FROM users ORDER BY name")
        return [student_from_row(row) for row in cursor.fetchall()]


@router.get("/{user_id}")
def get_user(user_id: int):
    with db_cursor() as cursor:
        cursor.execute(f"SELECT {USER_COLUMNS} FROM users WHERE id=%s", (user_id,))
        row = cursor.fetchone()
    if not row:
        raise HTTPException(404, "User not found.")
    return student_from_row(row)


@router.patch("/{user_id}")
def update_user(user_id: int, payload: UserUpdate):
    values = payload.model_dump(exclude_none=True)
    if not values:
        return get_user(user_id)
    mapping = {"bio": "bio", "skills": "skills", "interests": "interests", "availability": "availability", "cgpa": "cgpa"}
    assignments = []
    params = []
    for key, value in values.items():
        assignments.append(f"{mapping[key]}=%s")
        params.append(json.dumps(value) if key in {"skills", "interests"} else value)
    params.append(user_id)
    with db_cursor() as cursor:
        cursor.execute(f"UPDATE users SET {', '.join(assignments)} WHERE id=%s", params)
    return get_user(user_id)
