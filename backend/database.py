import os
import json
from contextlib import contextmanager

import psycopg2
from dotenv import load_dotenv

load_dotenv()


def get_connection():
    return psycopg2.connect(
        host=os.getenv("DB_HOST", "localhost"),
        database=os.getenv("DB_NAME", "CollabHub"),
        user=os.getenv("DB_USER", "postgres"),
        password=os.getenv("DB_PASSWORD"),
        port=os.getenv("DB_PORT", "5432"),
    )


@contextmanager
def db_cursor():
    connection = get_connection()
    try:
        with connection:
            with connection.cursor() as cursor:
                yield cursor
    finally:
        connection.close()


def init_db():
    with db_cursor() as cursor:
        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(120) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password TEXT,
                password_hash TEXT NOT NULL,
                branch VARCHAR(120) NOT NULL,
                year INTEGER NOT NULL DEFAULT 1,
                entry_number VARCHAR(80) DEFAULT '',
                bio TEXT DEFAULT '',
                skills JSONB NOT NULL DEFAULT '[]',
                interests JSONB NOT NULL DEFAULT '[]',
                availability VARCHAR(30) NOT NULL DEFAULT 'available',
                cgpa NUMERIC(4, 2),
                contributions INTEGER NOT NULL DEFAULT 0,
                problems_solved INTEGER NOT NULL DEFAULT 0,
                collaborations INTEGER NOT NULL DEFAULT 0,
                tasks_completed INTEGER NOT NULL DEFAULT 0,
                created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
            );
            CREATE TABLE IF NOT EXISTS problems (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT NOT NULL,
                long_description TEXT DEFAULT '',
                branch VARCHAR(120) NOT NULL,
                problem_type VARCHAR(40) NOT NULL,
                difficulty VARCHAR(30) NOT NULL,
                deadline DATE NOT NULL,
                collaborators_needed INTEGER NOT NULL DEFAULT 1,
                status VARCHAR(30) NOT NULL DEFAULT 'open',
                skills JSONB NOT NULL DEFAULT '[]',
                tags JSONB NOT NULL DEFAULT '[]',
                posted_by INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                views INTEGER NOT NULL DEFAULT 0,
                requests INTEGER NOT NULL DEFAULT 0,
                created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
            );
            CREATE TABLE IF NOT EXISTS collaborations (
                id SERIAL PRIMARY KEY,
                problem_id INTEGER NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
                lead_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                status VARCHAR(30) NOT NULL DEFAULT 'active',
                progress INTEGER NOT NULL DEFAULT 0,
                created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                UNIQUE(problem_id, lead_id)
            );
            CREATE TABLE IF NOT EXISTS collaboration_members (
                collaboration_id INTEGER NOT NULL REFERENCES collaborations(id) ON DELETE CASCADE,
                user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                role VARCHAR(30) NOT NULL DEFAULT 'member',
                joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                PRIMARY KEY(collaboration_id, user_id)
            );
            CREATE TABLE IF NOT EXISTS tasks (
                id SERIAL PRIMARY KEY,
                collaboration_id INTEGER NOT NULL REFERENCES collaborations(id) ON DELETE CASCADE,
                title VARCHAR(255) NOT NULL,
                description TEXT DEFAULT '',
                assignee_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
                priority VARCHAR(30) NOT NULL DEFAULT 'medium',
                due_date DATE NOT NULL,
                status VARCHAR(30) NOT NULL DEFAULT 'todo',
                created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
            );
            CREATE TABLE IF NOT EXISTS notifications (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                type VARCHAR(30) NOT NULL,
                title VARCHAR(255) NOT NULL,
                description TEXT NOT NULL,
                read BOOLEAN NOT NULL DEFAULT FALSE,
                created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
            );
            """
        )
        cursor.execute(
            """SELECT column_name FROM information_schema.columns
            WHERE table_name='users'"""
        )
        user_columns = {row[0] for row in cursor.fetchall()}
        missing_columns = {
            "password": "TEXT",
            "password_hash": "TEXT",
            "year": "INTEGER NOT NULL DEFAULT 1",
            "entry_number": "VARCHAR(80) DEFAULT ''",
            "bio": "TEXT DEFAULT ''",
            "interests": "JSONB NOT NULL DEFAULT '[]'",
            "availability": "VARCHAR(30) NOT NULL DEFAULT 'available'",
            "cgpa": "NUMERIC(4, 2)",
            "contributions": "INTEGER NOT NULL DEFAULT 0",
            "problems_solved": "INTEGER NOT NULL DEFAULT 0",
            "collaborations": "INTEGER NOT NULL DEFAULT 0",
            "tasks_completed": "INTEGER NOT NULL DEFAULT 0",
        }
        for column, definition in missing_columns.items():
            if column not in user_columns:
                cursor.execute(f"ALTER TABLE users ADD COLUMN {column} {definition}")
        if "password" in user_columns and "password_hash" not in user_columns:
            from security import hash_password

            cursor.execute("SELECT id, password FROM users WHERE password_hash IS NULL")
            for user_id, password in cursor.fetchall():
                cursor.execute(
                    "UPDATE users SET password_hash=%s WHERE id=%s",
                    (hash_password(password or "change-me"), user_id),
                )
        cursor.execute("SELECT COUNT(*) FROM users")
        if cursor.fetchone()[0] == 0:
            from security import hash_password

            cursor.execute(
                """INSERT INTO users(name,email,password_hash,branch,year,entry_number,skills,interests)
                VALUES (%s,%s,%s,%s,%s,%s,%s,%s) RETURNING id""",
                ("Demo Student", "demo@smvdu.ac.in", hash_password("Demo@123"),
                 "Computer Science & Engineering", 3, "2022BCS001",
                 json.dumps(["Python", "React", "PostgreSQL"]), json.dumps(["AI", "Open Source"])),
            )
            user_id = cursor.fetchone()[0]
            cursor.execute(
                """INSERT INTO problems(title,description,branch,problem_type,difficulty,deadline,
                collaborators_needed,skills,tags,posted_by)
                VALUES (%s,%s,%s,%s,%s,CURRENT_DATE + INTERVAL '90 days',%s,%s,%s,%s)""",
                ("Campus Energy Monitoring Dashboard",
                 "Build a dashboard that helps SMVDU departments track energy use and identify waste.",
                 "Electronics / Computer Science", "project", "intermediate", 3,
                 json.dumps(["Python", "IoT", "React"]), json.dumps(["IoT", "Sustainability"]), user_id),
            )
        cursor.execute("SELECT COUNT(*) FROM problems")
        if cursor.fetchone()[0] == 0:
            cursor.execute("SELECT id FROM users ORDER BY id LIMIT 1")
            owner = cursor.fetchone()
            if owner:
                cursor.execute(
                    """INSERT INTO problems(title,description,branch,problem_type,difficulty,deadline,
                    collaborators_needed,skills,tags,posted_by)
                    VALUES (%s,%s,%s,%s,%s,CURRENT_DATE + INTERVAL '90 days',%s,%s,%s,%s)""",
                    ("Campus Energy Monitoring Dashboard",
                     "Build a dashboard that helps SMVDU departments track energy use and identify waste.",
                     "Electronics / Computer Science", "project", "intermediate", 3,
                     json.dumps(["Python", "IoT", "React"]), json.dumps(["IoT", "Sustainability"]), owner[0]),
                )
