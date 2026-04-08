import re

from controllers.paper_controller import PaperController


class Router:
    def __init__(self, paper_controller: PaperController):
        self.paper_controller = paper_controller

    def route(self, event: dict, user_id: str) -> dict:
        method = event["requestContext"]["http"]["method"]
        path = event["rawPath"]

        if method == "OPTIONS":
            return {
                "statusCode": 200,
                "headers": {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type, Authorization",
                },
                "body": "",
            }

        if method == "GET" and path == "/papers":
            return self.paper_controller.list_papers(user_id)

        if method == "GET" and re.match(r"^/papers/[^/]+$", path):
            created_at = path.split("/")[-1]
            return self.paper_controller.get_paper(user_id, created_at)

        if method == "POST" and path == "/papers/summarize":
            return self.paper_controller.submit_papers(event, user_id)

        return {
            "statusCode": 404,
            "headers": {"Content-Type": "application/json"},
            "body": '{"error": "Not found"}',
        }
