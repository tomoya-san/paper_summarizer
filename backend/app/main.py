from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import papers

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://paper-summarizer-kpmciadgf-tomoya-sans-projects.vercel.app",
    ],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(papers.router)


@app.get("/")
async def root():
    return {"message": "Hello World"}
