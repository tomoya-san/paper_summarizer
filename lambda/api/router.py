import re

from controllers.paper_controller import PaperController


class Router:
    def __init__(self, paper_controller: PaperController):
        self.paper_controller = paper_controller

    def route(self, event: dict) -> dict:
        method = event["httpMethod"]
        path = event["path"]

        if method == "GET" and path == "/papers":
            return self.paper_controller.list_papers(event)

        if method == "GET" and re.match(r"^/papers/[^/]+$", path):
            paper_id = path.split("/")[-1]
            return self.paper_controller.get_paper(event, paper_id)

        if method == "POST" and path == "/papers/summarize":
            return self.paper_controller.submit_papers(event)

        return {
            "statusCode": 404,
            "headers": {"Content-Type": "application/json"},
            "body": '{"error": "Not found"}',
        }