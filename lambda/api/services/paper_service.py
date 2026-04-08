import json
import os

import boto3

from repositories.paper_repository import PaperRepository

sqs = boto3.client("sqs")
queue_url = os.environ["SQS_QUEUE_URL"]


class PaperService:
    def __init__(self, paper_repository: PaperRepository):
        self.paper_repository = paper_repository

    def get_all_papers(self, user_id: str) -> list[dict]:
        return self.paper_repository.find_all(user_id)

    def get_paper(self, user_id: str, created_at: str) -> dict | None:
        return self.paper_repository.find_by_key(user_id, created_at)

    def submit_papers(self, urls: list[str], user_id: str) -> int:
        for url in urls:
            sqs.send_message(
                QueueUrl=queue_url,
                MessageBody=json.dumps({"url": url, "user_id": user_id}),
            )
        return len(urls)
