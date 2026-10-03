import json

from fastapi import APIRouter, HTTPException

from database import db_cursor
from models import user_dict
from schemas import LoginRequest, RegisterRequest
from security import hash_password, verify_password

router = APIRouter(prefix="/auth", tags=["auth"])
USER_COLUMNS = "id, name, email, branch, year, entry_number, bio, skills, interests, availability, cgpa, contributions, problems_solved, collaborations, tasks_completed"


@router.post("/register")
def register(payload: RegisterRequest):
    if not payload.email.lower().endswith("@smvdu.ac.in"):
        raise HTTPException(400, "Use an official @smvdu.ac.in email address.")
    with db_cursor() as cursor:
        try:
            cursor.execute(
                f"""INSERT INTO users
                (name,email,password,password_hash,branch,year,entry_number)
                VALUES (%s,%s,%s,%s,%s,%s,%s) RETURNING {USER_COLUMNS}""",
                (payload.name.strip(), payload.email.lower(), hash_password(payload.password),
                 hash_password(payload.password),
                 payload.branch, payload.year, payload.entryNumber.strip()),
            )
            return {"user": user_dict(cursor.fetchone())}
        except Exception as exc:
            if "duplicate key" in str(exc).lower():
                raise HTTPException(409, "An account with this email already exists.") from exc
            raise


@router.post("/login")
def login(payload: LoginRequest):
    with db_cursor() as cursor:
        cursor.execute(
            f"SELECT {USER_COLUMNS}, password_hash FROM users WHERE email=%s",
            (payload.email.lower(),),
        )
        row = cursor.fetchone()
    if not row or not verify_password(payload.password, row[-1]):
        raise HTTPException(401, "Invalid email or password.")
    return {"user": user_dict(row[:-1])}
