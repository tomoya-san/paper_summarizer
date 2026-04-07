import json
import os

import boto3

from repositories.paper_repository import PaperRepository

sqs = boto3.client("sqs")
queue_url = os.environ["SQS_QUEUE_URL"]


class PaperService:
    def __init__(self, paper_repository: PaperRepository):
        self.paper_repository = paper_repository

    def get_all_papers(self) -> list[dict]:
        return self.paper_repository.find_all()

    def get_paper(self, paper_id: str) -> dict | None:
        return self.paper_repository.find_by_id(paper_id)

    def submit_papers(self, urls: list[str]) -> int:
        for url in urls:
            sqs.send_message(
                QueueUrl=queue_url,
                MessageBody=json.dumps({"url": url}),
            )
        return len(urls)
