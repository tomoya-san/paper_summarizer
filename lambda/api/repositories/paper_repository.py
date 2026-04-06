import os

import boto3

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(os.environ["PAPERS_TABLE_NAME"])


class PaperRepository:
    def find_all(self) -> list[dict]:
        result = table.scan()
        return sorted(result["Items"], key=lambda x: x.get("created_at", ""), reverse=True)

    def find_by_id(self, paper_id: str) -> dict | None:
        result = table.get_item(Key={"id": paper_id})
        return result.get("Item")
