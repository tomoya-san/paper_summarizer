import re
from dataclasses import dataclass

import arxiv
import httpx


@dataclass
class ArxivPaper:
    title: str
    authors: list[str]
    abstract: str
    pdf_content: bytes


class ArxivService:
    def __init__(self):
        self.client = arxiv.Client(delay_seconds=3.0, num_retries=5)

    def fetch_paper(self, url: str) -> ArxivPaper:
        arxiv_id = self.__extract_id(url)
        search = arxiv.Search(id_list=[arxiv_id])
        result = next(self.client.results(search), None)

        if result is None:
            raise ValueError(f"Paper not found for arxiv ID: {arxiv_id}")

        return ArxivPaper(
            title=result.title,
            authors=[author.name for author in result.authors],
            abstract=result.summary,
            pdf_content=self.__download_pdf(result.pdf_url),
        )

    def __extract_id(self, url: str) -> str:
        match = re.search(r"(\d{4}\.\d{4,5})(v\d+)?", url)
        if not match:
            raise ValueError(f"Could not extract arxiv ID from: {url}")
        return match.group(0)

    def __download_pdf(self, pdf_url: str) -> bytes:
        response = httpx.get(pdf_url, follow_redirects=True, timeout=60)
        response.raise_for_status()
        return response.content
