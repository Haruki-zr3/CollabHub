from fastapi import FastAPI
from database.connection import connection
from routes.users import router as users_router

app = FastAPI()

app.include_router(users_router, prefix="/users")


@app.get("/")
def home():
    return {"message": "CollabHub API is running"}


@app.get("/db-test")
def database_test():
    cursor = connection.cursor()
    cursor.execute("SELECT 1")
    result = cursor.fetchone()
    cursor.close()

    return {
        "message": "Database connection successful",
        "result": result[0]
    }
