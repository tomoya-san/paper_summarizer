import os
from datetime import datetime, timezone

import boto3

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(os.environ["PAPERS_TABLE_NAME"])


class PaperStore:
    def save(self, user_id: str, url: str, title: str, authors: list[str], summary: str) -> None:
        table.put_item(
            Item={
                "user_id": user_id,
                "url": url,
                "title": title,
                "authors": ", ".join(authors),
                "summary": summary,
                "created_at": datetime.now(timezone.utc).isoformat(),
            }
        )
