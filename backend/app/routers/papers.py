import asyncio

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import Paper
from app.schemas import PaperCreate, PaperResponse
from app.services.arxiv import ArxivService
from app.services.summarizer import SummarizerService

router = APIRouter(prefix="/papers", tags=["papers"])
arxiv_service = ArxivService()
summarizer_service = SummarizerService()


@router.post("/fetch")
def fetch_paper(body: PaperCreate):
    paper = arxiv_service.fetch_paper(body.url)
    return {
        "title": paper.title,
        "authors": paper.authors,
        "abstract": paper.abstract,
    }


@router.post("/summarize", response_model=PaperResponse)
async def summarize_paper(body: PaperCreate, db: AsyncSession = Depends(get_db)):
    paper = await asyncio.to_thread(arxiv_service.fetch_paper, body.url)
    summary = await summarizer_service.summarize(paper.pdf_content)

    db_paper = Paper(
        url=body.url,
        title=paper.title,
        authors=", ".join(paper.authors),
        summary=summary,
    )
    db.add(db_paper)
    await db.commit()
    await db.refresh(db_paper)

    return db_paper


@router.get("/", response_model=list[PaperResponse])
async def list_papers(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Paper).order_by(Paper.created_at.desc()))
    return result.scalars().all()


@router.get("/{paper_id}", response_model=PaperResponse)
async def get_paper(paper_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Paper).where(Paper.id == paper_id))
    paper = result.scalar_one_or_none()
    if paper is None:
        raise HTTPException(status_code=404, detail="Paper not found")
    return paper
