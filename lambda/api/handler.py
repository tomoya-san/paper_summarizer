from controllers.paper_controller import PaperController
from repositories.paper_repository import PaperRepository
from router import Router
from services.paper_service import PaperService

paper_repository = PaperRepository()
paper_service = PaperService(paper_repository)
paper_controller = PaperController(paper_service)
router = Router(paper_controller)


def handler(event, context):
    return router.route(event)