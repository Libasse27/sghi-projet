.PHONY: help install dev build clean docker-up docker-down docker-logs test lint format

help: ## Affiche l'aide
	@echo "Commandes disponibles:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

install: ## Installe toutes les dépendances
	@echo "📦 Installation des dépendances..."
	npm install
	npm run install --workspaces

dev-backend: ## Démarre le backend en mode développement
	@echo "🚀 Démarrage du backend..."
	npm run backend:dev

dev-desktop: ## Démarre l'application desktop en mode développement
	@echo "🖥️  Démarrage de l'application desktop..."
	npm run desktop:dev

dev-mobile: ## Démarre l'application mobile
	@echo "📱 Démarrage de l'application mobile..."
	npm run mobile:start

build: ## Build tous les projets
	@echo "🏗️  Build de tous les projets..."
	npm run build --workspaces

clean: ## Nettoie les node_modules et builds
	@echo "🧹 Nettoyage..."
	npm run clean

docker-up: ## Démarre tous les services Docker
	@echo "🐳 Démarrage des services Docker..."
	docker-compose up -d

docker-down: ## Arrête tous les services Docker
	@echo "🛑 Arrêt des services Docker..."
	docker-compose down

docker-logs: ## Affiche les logs Docker
	@echo "📋 Logs Docker..."
	docker-compose logs -f

docker-rebuild: ## Rebuild et redémarre les services Docker
	@echo "🔄 Rebuild des services Docker..."
	docker-compose down
	docker-compose build --no-cache
	docker-compose up -d

test: ## Lance tous les tests
	@echo "🧪 Lancement des tests..."
	npm run test --workspaces

test-backend: ## Lance les tests backend
	@echo "🧪 Tests backend..."
	cd backend && npm run test

test-e2e: ## Lance les tests E2E
	@echo "🧪 Tests E2E..."
	npm run test:e2e

lint: ## Vérifie le code avec ESLint
	@echo "🔍 Vérification du code..."
	npm run lint --workspaces

format: ## Formate le code avec Prettier
	@echo "✨ Formatage du code..."
	npm run format

migrate: ## Lance les migrations de base de données
	@echo "📊 Migration de la base de données..."
	cd backend && npm run migration:run

seed: ## Remplit la base avec des données de test
	@echo "🌱 Seeding de la base de données..."
	cd backend && npm run seed:run

reset-db: ## Reset la base de données
	@echo "⚠️  Reset de la base de données..."
	docker-compose down postgres mongodb
	docker volume rm sghi-project_postgres_data sghi-project_mongodb_data
	docker-compose up -d postgres mongodb
	sleep 5
	cd backend && npm run migration:run && npm run seed:run

logs-backend: ## Affiche les logs du backend
	docker-compose logs -f backend

logs-postgres: ## Affiche les logs PostgreSQL
	docker-compose logs -f postgres

logs-mongodb: ## Affiche les logs MongoDB
	docker-compose logs -f mongodb

logs-redis: ## Affiche les logs Redis
	docker-compose logs -f redis

ps: ## Affiche les services Docker en cours
	docker-compose ps

backup-db: ## Sauvegarde la base de données
	@echo "💾 Sauvegarde de la base de données..."
	docker exec sghi_postgres pg_dump -U sghi_user sghi_db > backup_$(shell date +%Y%m%d_%H%M%S).sql

restore-db: ## Restaure la base de données (usage: make restore-db FILE=backup.sql)
	@echo "📥 Restauration de la base de données..."
	docker exec -i sghi_postgres psql -U sghi_user sghi_db < $(FILE)
