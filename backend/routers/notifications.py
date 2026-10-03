from fastapi import APIRouter

from database import db_cursor

router = APIRouter(prefix="/notifications", tags=["notifications"])


@router.get("")
def list_notifications(user_id: int):
    with db_cursor() as cursor:
        cursor.execute(
            """SELECT id,type,title,description,read,created_at FROM notifications
            WHERE user_id=%s ORDER BY created_at DESC""",
            (user_id,),
        )
        rows = cursor.fetchall()
    return [
        {"id": row[0], "type": row[1], "title": row[2], "description": row[3],
         "read": row[4], "timestamp": row[5].isoformat()}
        for row in rows
    ]


@router.patch("/{notification_id}/read")
def mark_read(notification_id: int):
    with db_cursor() as cursor:
        cursor.execute("UPDATE notifications SET read=TRUE WHERE id=%s", (notification_id,))
    return {"message": "Notification marked as read."}
