from datetime import datetime

from pydantic import BaseModel, model_validator


class PaperCreate(BaseModel):
    url: str


class PaperResponse(BaseModel):
    id: int
    url: str
    title: str
    authors: list[str]
    summary: str
    created_at: datetime

    @model_validator(mode="before")
    @classmethod
    def split_authors(cls, data):
        if hasattr(data, "authors") and isinstance(data.authors, str):
            data.authors = [a.strip() for a in data.authors.split(",")]
        return data
