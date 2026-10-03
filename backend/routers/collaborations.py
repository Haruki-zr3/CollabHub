from fastapi import APIRouter, HTTPException

from database import db_cursor
from schemas import CollaborationRequest

router = APIRouter(prefix="/collaborations", tags=["collaborations"])


@router.get("")
def list_collaborations(user_id: int):
    with db_cursor() as cursor:
        cursor.execute(
            """SELECT c.id,c.status,c.progress,p.id,p.title,p.description,p.deadline,
              u.id,u.name,u.email,u.branch,u.year,u.entry_number,u.bio,u.skills,u.interests,
              u.availability,u.cgpa,u.contributions,u.problems_solved,u.collaborations,u.tasks_completed
              FROM collaborations c JOIN problems p ON p.id=c.problem_id JOIN users u ON u.id=c.lead_id
              WHERE EXISTS (SELECT 1 FROM collaboration_members cm WHERE cm.collaboration_id=c.id AND cm.user_id=%s)
              ORDER BY c.created_at DESC""",
            (user_id,),
        )
        rows = cursor.fetchall()
    return [
        {"id": row[0], "status": row[1], "progress": row[2],
         "problem": {"id": row[3], "title": row[4], "description": row[5], "deadline": row[6].isoformat()},
         "lead": {"id": row[7], "name": row[8], "email": row[9], "branch": row[10], "year": row[11]},
         "members": []}
        for row in rows
    ]


@router.post("/problems/{problem_id}/join")
def join_collaboration(problem_id: int, user_id: int, payload: CollaborationRequest | None = None):
    with db_cursor() as cursor:
        cursor.execute("SELECT posted_by FROM problems WHERE id=%s", (problem_id,))
        problem = cursor.fetchone()
        if not problem:
            raise HTTPException(404, "Problem not found.")
        owner_id = problem[0]
        cursor.execute(
            """INSERT INTO collaborations(problem_id,lead_id) VALUES (%s,%s)
            ON CONFLICT(problem_id,lead_id) DO UPDATE SET status='active'
            RETURNING id""",
            (problem_id, owner_id),
        )
        collaboration_id = cursor.fetchone()[0]
        cursor.execute(
            "INSERT INTO collaboration_members(collaboration_id,user_id) VALUES (%s,%s) ON CONFLICT DO NOTHING",
            (collaboration_id, user_id),
        )
        cursor.execute("UPDATE problems SET requests=requests+1 WHERE id=%s", (problem_id,))
        cursor.execute(
            """INSERT INTO notifications(user_id,type,title,description)
            VALUES (%s,'collaboration','New collaboration request','A student offered to help with your problem.')""",
            (owner_id,),
        )
    return {"id": collaboration_id, "message": "Collaboration request sent."}
