import json

from services.paper_service import PaperService


class PaperController:
    def __init__(self, paper_service: PaperService):
        self.paper_service = paper_service

    def list_papers(self, user_id: str) -> dict:
        papers = self.paper_service.get_all_papers(user_id)
        return self.__response(200, papers)

    def get_paper(self, user_id: str, created_at: str) -> dict:
        paper = self.paper_service.get_paper(user_id, created_at)
        if paper is None:
            return self.__response(404, {"error": "Paper not found"})
        return self.__response(200, paper)

    def mark_as_read(self, user_id: str, created_at: str) -> dict:
        paper = self.paper_service.mark_as_read(user_id, created_at)
        if paper is None:
            return self.__response(404, {"error": "Paper not found"})
        return self.__response(200, paper)

    def submit_papers(self, event: dict, user_id: str) -> dict:
        body = json.loads(event.get("body", "{}"))
        urls = body.get("urls", [])
        if not urls:
            return self.__response(400, {"error": "No URLs provided"})

        count = self.paper_service.submit_papers(urls, user_id)
        return self.__response(202, {"message": f"Queued {count} papers for summarization"})

    def __response(self, status_code: int, body) -> dict:
        return {
            "statusCode": status_code,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps(body),
        }
