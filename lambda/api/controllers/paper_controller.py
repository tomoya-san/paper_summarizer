import json

from services.paper_service import PaperService


class PaperController:
    def __init__(self, paper_service: PaperService):
        self.paper_service = paper_service

    def list_papers(self, event: dict) -> dict:
        papers = self.paper_service.get_all_papers()
        return self._response(200, papers)

    def get_paper(self, event: dict, paper_id: str) -> dict:
        paper = self.paper_service.get_paper(paper_id)
        if paper is None:
            return self._response(404, {"error": "Paper not found"})
        return self._response(200, paper)

    def submit_papers(self, event: dict) -> dict:
        body = json.loads(event.get("body", "{}"))
        urls = body.get("urls", [])
        if not urls:
            return self._response(400, {"error": "No URLs provided"})

        count = self.paper_service.submit_papers(urls)
        return self._response(202, {"message": f"Queued {count} papers for summarization"})

    def _response(self, status_code: int, body) -> dict:
        return {
            "statusCode": status_code,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps(body),
        }
