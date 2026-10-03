import json

from fastapi import APIRouter, HTTPException

from database import db_cursor
from models import problem_dict
from schemas import ProblemCreate

router = APIRouter(prefix="/problems", tags=["problems"])


def problem_query(extra=""):
    return f"""
    SELECT p.id,p.title,p.description,p.long_description,p.branch,p.problem_type,
      p.difficulty,p.deadline,p.collaborators_needed,
      (SELECT COUNT(*) FROM collaboration_members cm JOIN collaborations c ON c.id=cm.collaboration_id
       WHERE c.problem_id=p.id)::int AS collaborators_joined,
      p.status,p.skills,p.tags,p.views,p.requests,p.created_at,
      u.id,u.name,u.email,u.branch,u.year,u.entry_number,u.bio,u.skills,u.interests,
      u.availability,u.cgpa,u.contributions,u.problems_solved,u.collaborations,u.tasks_completed
    FROM problems p JOIN users u ON u.id=p.posted_by {extra}
    """


@router.get("")
def list_problems():
    with db_cursor() as cursor:
        cursor.execute(problem_query("ORDER BY p.created_at DESC"))
        return [problem_dict(row) for row in cursor.fetchall()]


@router.get("/{problem_id}")
def get_problem(problem_id: int):
    with db_cursor() as cursor:
        cursor.execute(problem_query("WHERE p.id=%s"), (problem_id,))
        row = cursor.fetchone()
    if not row:
        raise HTTPException(404, "Problem not found.")
    return problem_dict(row)


@router.post("")
def create_problem(payload: ProblemCreate, user_id: int):
    with db_cursor() as cursor:
        cursor.execute("SELECT 1 FROM users WHERE id=%s", (user_id,))
        if not cursor.fetchone():
            raise HTTPException(404, "User not found.")
        cursor.execute(
            """INSERT INTO problems
            (title,description,long_description,branch,problem_type,difficulty,deadline,
             collaborators_needed,skills,tags,posted_by)
            VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s) RETURNING id""",
            (payload.title, payload.description, payload.longDescription, payload.branch,
             payload.type, payload.difficulty, payload.deadline, payload.collaboratorsNeeded,
             json.dumps(payload.skills), json.dumps(payload.tags), user_id),
        )
        problem_id = cursor.fetchone()[0]
    return get_problem(problem_id)
