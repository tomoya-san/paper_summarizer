import os
import uuid
from datetime import datetime, timezone

import boto3

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(os.environ["PAPERS_TABLE_NAME"])


class PaperStore:
    def save(self, url: str, title: str, authors: list[str], summary: str) -> None:
        table.put_item(
            Item={
                "id": str(uuid.uuid4()),
                "url": url,
                "title": title,
                "authors": ", ".join(authors),
                "summary": summary,
                "created_at": datetime.now(timezone.utc).isoformat(),
            }
        )
