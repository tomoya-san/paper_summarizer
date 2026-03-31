from google import genai

from app.config import settings


class SummarizerService:
    SYSTEM_PROMPT = (
        "You are a research paper summarizer. Given a paper's PDF, "
        "provide a clear and concise summary that covers the key contributions, methodology, "
        "and findings. Write for a technical audience. Keep it to 3-5 paragraphs."
    )

    def __init__(self):
        self.client = genai.Client(api_key=settings.gemini_api_key)

    async def summarize(self, pdf_content: bytes) -> str:
        """Send the paper PDF to Gemini and return a summary."""
        response = await self.client.aio.models.generate_content(
            model="gemini-2.5-flash",
            contents=[
                genai.types.Part.from_bytes(data=pdf_content, mime_type="application/pdf"),
                "Please summarize this paper.",
            ],
            config=genai.types.GenerateContentConfig(
                system_instruction=self.SYSTEM_PROMPT,
            ),
        )

        return response.text
