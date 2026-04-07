import os

import boto3
from google import genai

SYSTEM_PROMPT = (
    "You are a research paper summarizer. Given a paper's PDF, "
    "provide a clear and concise summary that covers the key contributions, methodology, "
    "and findings. Write for a technical audience. Keep it to 3-5 paragraphs."
)

ssm = boto3.client("ssm")
response = ssm.get_parameter(
    Name=os.environ["GEMINI_API_KEY_SSM_NAME"],
    WithDecryption=True,
)
client = genai.Client(api_key=response["Parameter"]["Value"])


class SummarizerService:
    def summarize(self, pdf_content: bytes) -> str:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=[
                genai.types.Part.from_bytes(data=pdf_content, mime_type="application/pdf"),
                "Please summarize this paper.",
            ],
            config=genai.types.GenerateContentConfig(
                system_instruction=SYSTEM_PROMPT,
            ),
        )
        return response.text
