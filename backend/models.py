"""Database record helpers shared by the API routers."""

from datetime import date, datetime
import json


def _json_list(value):
    if isinstance(value, str):
        try:
            return json.loads(value)
        except json.JSONDecodeError:
            return [item.strip() for item in value.split(",") if item.strip()]
    return value or []


def user_dict(row):
    return {
        "id": row[0], "name": row[1], "email": row[2], "branch": row[3],
        "year": row[4], "entryNumber": row[5], "bio": row[6],
        "skills": _json_list(row[7]), "interests": _json_list(row[8]),
        "availability": row[9], "cgpa": float(row[10]) if row[10] is not None else None,
        "contributions": row[11], "problemsSolved": row[12],
        "collaborations": row[13], "tasksCompleted": row[14],
    }


def student_from_row(row):
    user = user_dict(row)
    initials = "".join(part[0] for part in user["name"].split() if part)[:2].upper()
    return {
        **user,
        "initials": initials,
        "avatarColor": "#4F46E5",
        "department": "SMVDU",
        "location": "SMVDU",
        "github": "",
        "linkedin": "",
    }


def problem_dict(row):
    posted_at = row[15]
    if isinstance(posted_at, datetime):
        posted_at = posted_at.date()
    if isinstance(posted_at, date):
        posted_at = posted_at.isoformat()
    return {
        "id": str(row[0]), "title": row[1], "description": row[2],
        "longDescription": row[3] or row[2], "branch": row[4],
        "type": row[5], "difficulty": row[6], "deadline": row[7].isoformat(),
        "collaboratorsNeeded": row[8], "collaboratorsJoined": row[9],
        "status": row[10], "skills": row[11] or [], "tags": row[12] or [],
        "views": row[13], "requests": row[14], "postedAt": posted_at,
        "postedBy": student_from_row(row[16:31]),
    }
