ROOT_DIR := $(dir $(abspath $(lastword $(MAKEFILE_LIST))))
export AWS_PROFILE := admin

run-frontend:
	cd $(ROOT_DIR)/frontend && npm run dev

run-backend:
	cd $(ROOT_DIR)/backend && uv run uvicorn app.main:app --reload

run-db:
	cd $(ROOT_DIR) && docker compose up -d

stop-db:
	cd $(ROOT_DIR) && docker compose down

aws-whoami:
	aws sts get-caller-identity

AWS_ACCOUNT_ID := $(shell AWS_PROFILE=admin aws sts get-caller-identity --query Account --output text)
AWS_REGION := ap-northeast-1
ECR_URL := $(AWS_ACCOUNT_ID).dkr.ecr.$(AWS_REGION).amazonaws.com

ecr-login:
	aws ecr get-login-password --region $(AWS_REGION) | docker login --username AWS --password-stdin $(ECR_URL)

build-api:
	docker build --provenance=false --platform linux/amd64 -t $(ECR_URL)/paper-summarizer-api:latest $(ROOT_DIR)/lambda/api

build-worker:
	docker build --provenance=false --platform linux/amd64 -t $(ECR_URL)/paper-summarizer-worker:latest $(ROOT_DIR)/lambda/worker

push-api: build-api
	docker push $(ECR_URL)/paper-summarizer-api:latest

push-worker: build-worker
	docker push $(ECR_URL)/paper-summarizer-worker:latest

update-api:
	aws lambda update-function-code \
		--function-name paper-summarizer-api \
		--image-uri $(ECR_URL)/paper-summarizer-api:latest \
		--region $(AWS_REGION)

update-worker:
	aws lambda update-function-code \
		--function-name paper-summarizer-worker \
		--image-uri $(ECR_URL)/paper-summarizer-worker:latest \
		--region $(AWS_REGION)

deploy-lambdas: ecr-login push-api push-worker update-api update-worker

.PHONY: sync-env
sync-env:
	@grep NEXT_PUBLIC_COGNITO_USER_POOL_ID frontend/.env.local | cut -d= -f2 | vercel env add NEXT_PUBLIC_COGNITO_USER_POOL_ID production
	@grep NEXT_PUBLIC_COGNITO_CLIENT_ID frontend/.env.local | cut -d= -f2 | vercel env add NEXT_PUBLIC_COGNITO_CLIENT_ID production