import json

from services.arxiv import ArxivService
from services.summarizer import SummarizerService
from services.paper_store import PaperStore

arxiv_service = ArxivService()
summarizer_service = SummarizerService()
paper_store = PaperStore()


def handler(event, context):
    for record in event["Records"]:
        body = json.loads(record["body"])
        url = body["url"]

        paper = arxiv_service.fetch_paper(url)
        summary = summarizer_service.summarize(paper.pdf_content)

        paper_store.save(
            url=url,
            title=paper.title,
            authors=paper.authors,
            summary=summary,
        )
