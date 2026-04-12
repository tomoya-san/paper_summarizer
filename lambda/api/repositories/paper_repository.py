import os

import boto3
from boto3.dynamodb.conditions import Key

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(os.environ["PAPERS_TABLE_NAME"])


class PaperRepository:
    def find_all(self, user_id: str) -> list[dict]:
        result = table.query(
            KeyConditionExpression=Key("user_id").eq(user_id),
            ScanIndexForward=False,
        )
        return result["Items"]

    def find_by_key(self, user_id: str, created_at: str) -> dict | None:
        result = table.get_item(Key={"user_id": user_id, "created_at": created_at})
        return result.get("Item")

    def mark_as_read(self, user_id: str, created_at: str) -> dict | None:
        result = table.update_item(
            Key={"user_id": user_id, "created_at": created_at},
            UpdateExpression="SET is_read = :val",
            ConditionExpression="attribute_exists(user_id)",
            ExpressionAttributeValues={":val": True},
            ReturnValues="ALL_NEW",
        )
        return result.get("Attributes")
