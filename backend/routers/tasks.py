from fastapi import APIRouter, HTTPException

from database import db_cursor
from schemas import TaskCreate, TaskUpdate

router = APIRouter(prefix="/tasks", tags=["tasks"])


@router.get("")
def list_tasks(user_id: int):
    with db_cursor() as cursor:
        cursor.execute(
            """SELECT t.id,t.title,t.description,t.priority,t.due_date,t.status,t.collaboration_id,
              u.id,u.name,u.email,u.branch,u.year,u.entry_number,u.bio,u.skills,u.interests,
              u.availability,u.cgpa,u.contributions,u.problems_solved,u.collaborations,u.tasks_completed
              FROM tasks t LEFT JOIN users u ON u.id=t.assignee_id
              WHERE t.assignee_id=%s OR EXISTS
              (SELECT 1 FROM collaboration_members cm WHERE cm.collaboration_id=t.collaboration_id AND cm.user_id=%s)
              ORDER BY t.due_date""",
            (user_id, user_id),
        )
        rows = cursor.fetchall()
    return [
        {"id": row[0], "title": row[1], "description": row[2], "priority": row[3],
         "dueDate": row[4].isoformat(), "status": row[5], "collaborationId": row[6],
         "assignee": {"id": row[7], "name": row[8], "email": row[9]} if row[7] else None}
        for row in rows
    ]


@router.post("")
def create_task(payload: TaskCreate, user_id: int):
    with db_cursor() as cursor:
        cursor.execute(
            """INSERT INTO tasks(collaboration_id,title,description,assignee_id,priority,due_date)
            VALUES (%s,%s,%s,%s,%s,%s) RETURNING id""",
            (payload.collaborationId, payload.title, payload.description, payload.assigneeId,
             payload.priority, payload.dueDate),
        )
        task_id = cursor.fetchone()[0]
        if payload.assigneeId:
            cursor.execute(
                """INSERT INTO notifications(user_id,type,title,description)
                VALUES (%s,'task','New task assigned','You have been assigned a new collaboration task.')""",
                (payload.assigneeId,),
            )
    return {"id": task_id, "message": "Task created."}


@router.patch("/{task_id}")
def update_task(task_id: int, payload: TaskUpdate):
    with db_cursor() as cursor:
        cursor.execute("UPDATE tasks SET status=%s WHERE id=%s RETURNING id", (payload.status, task_id))
        if not cursor.fetchone():
            raise HTTPException(404, "Task not found.")
    return {"message": "Task updated."}
