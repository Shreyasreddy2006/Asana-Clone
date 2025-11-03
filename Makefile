.PHONY: help build up down restart logs clean rebuild test

help:
	@echo "Asana Clone Docker Commands"
	@echo "=============================="
	@echo "make build      - Build all Docker images"
	@echo "make up         - Start all services"
	@echo "make down       - Stop all services"
	@echo "make restart    - Restart all services"
	@echo "make logs       - View logs from all services"
	@echo "make logs-f     - Follow logs from all services"
	@echo "make clean      - Remove containers, volumes, and images"
	@echo "make rebuild    - Clean rebuild of all services"
	@echo "make test       - Run tests"
	@echo "make ps         - Show running containers"
	@echo "make shell-client  - Access client container shell"
	@echo "make shell-server  - Access server container shell"
	@echo "make shell-db      - Access MongoDB shell"

build:
	docker-compose build

up:
	docker-compose up -d

down:
	docker-compose down

restart:
	docker-compose restart

logs:
	docker-compose logs

logs-f:
	docker-compose logs -f

clean:
	docker-compose down -v --rmi all

rebuild: clean build up

test:
	docker-compose up -d
	@echo "Waiting for services to start..."
	@sleep 10
	@echo "Testing client..."
	@curl -f http://localhost || echo "Client test failed"
	@echo "Testing server..."
	@curl -f http://localhost:5000/health || echo "Server test failed"
	@docker-compose down

ps:
	docker-compose ps

shell-client:
	docker-compose exec client sh

shell-server:
	docker-compose exec server sh

shell-db:
	docker-compose exec mongodb mongosh --username admin --password password123 --authenticationDatabase admin
