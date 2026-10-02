from fastapi import APIRouter
from database.connection import connection

router = APIRouter()


@router.post("/register")
def register_user(
    name: str,
    email: str,
    password: str,
    branch: str,
    skills: str
):
    cursor = connection.cursor()

    query = """
        INSERT INTO users (name, email, password, branch, skills)
        VALUES (%s, %s, %s, %s, %s)
        RETURNING id;
    """

    cursor.execute(query, (name, email, password, branch, skills))

    user_id = cursor.fetchone()[0]
    connection.commit()
    cursor.close()

    return {
        "message": "User registered successfully",
        "user_id": user_id
    }
    
@router.post("/login")
def login_user(
    email: str,
    password: str
):
    cursor = connection.cursor()

    query = """
        SELECT id, name, email, branch, skills
        FROM users
        WHERE email = %s AND password = %s;
    """

    cursor.execute(query, (email, password))
    user = cursor.fetchone()

    cursor.close()

    if not user:
        return {
            "message": "Invalid email or password"
        }

    return {
        "message": "Login successful",
        "user": {
            "id": user[0],
            "name": user[1],
            "email": user[2],
            "branch": user[3],
            "skills": user[4]
        }
    }