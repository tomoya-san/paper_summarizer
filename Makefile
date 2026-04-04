ROOT_DIR := $(dir $(abspath $(lastword $(MAKEFILE_LIST))))

run-frontend:
	cd $(ROOT_DIR)/frontend && npm run dev

run-backend:
	cd $(ROOT_DIR)/backend && uv run uvicorn app.main:app --reload

run-db:
	cd $(ROOT_DIR) && docker compose up -d

stop-db:
	cd $(ROOT_DIR) && docker compose down

aws-login:
	aws sso login --profile PowerUserAccess-767397762455
