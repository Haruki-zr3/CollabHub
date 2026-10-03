from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import init_db
from routers import auth, collaborations, notifications, problems, tasks, users


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield


app = FastAPI(title="CollabHub API", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(auth.router, prefix="/api")
app.include_router(users.router, prefix="/api")
app.include_router(problems.router, prefix="/api")
app.include_router(collaborations.router, prefix="/api")
app.include_router(tasks.router, prefix="/api")
app.include_router(notifications.router, prefix="/api")


@app.get("/")
def home():
    return {"message": "CollabHub API is running"}
