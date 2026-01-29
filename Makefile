.PHONY: dev up down test test-api build-api build-web migrate k8s-apply k8s-delete

# Development
dev:
	docker compose up -d db redis
	@echo "DB and Redis running. Start apps separately:"
	@echo "  cd apps/api && uvicorn app.main:app --reload"
	@echo "  cd apps/web && npm run dev"

up:
	docker compose up --build

down:
	docker compose down

# Testing
test: test-api

test-api:
	cd apps/api && python3 -m pytest tests/ -v

# Build
build-api:
	docker build -t niyyah-api ./apps/api

build-web:
	docker build -t niyyah-web ./apps/web

# Database
migrate:
	cd apps/api && alembic upgrade head

migration:
	cd apps/api && alembic revision --autogenerate -m "$(msg)"

# Kubernetes
k8s-apply:
	kubectl apply -f k8s/namespace.yaml
	kubectl apply -f k8s/postgres.yaml
	kubectl apply -f k8s/redis.yaml
	kubectl apply -f k8s/niyyah.yaml
	kubectl apply -f k8s/ingress.yaml

k8s-delete:
	kubectl delete namespace niyyah

k8s-migrate:
	kubectl apply -f k8s/migration-job.yaml
