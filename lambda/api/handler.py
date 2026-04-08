from controllers.paper_controller import PaperController
from repositories.paper_repository import PaperRepository
from router import Router
from services.paper_service import PaperService

paper_repository = PaperRepository()
paper_service = PaperService(paper_repository)
paper_controller = PaperController(paper_service)
router = Router(paper_controller)


def handler(event, context):
    method = event["requestContext"]["http"]["method"]
    if method == "OPTIONS":
        return router.route(event, None)
    user_id = event["requestContext"]["authorizer"]["jwt"]["claims"]["sub"]
    return router.route(event, user_id)
