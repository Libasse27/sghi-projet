-- Script d'initialisation PostgreSQL pour SGHI
-- Crée les extensions nécessaires

-- Extension pour UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Extension pour chiffrement
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Extension pour recherche full-text
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Extension pour géolocalisation (optionnel - pour localiser hôpitaux)
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Création de la base de données si elle n'existe pas
-- (déjà créée par POSTGRES_DB dans docker-compose)

-- Définir le timezone
SET timezone = 'Africa/Dakar';

-- Message de confirmation
SELECT 'PostgreSQL initialisé avec succès pour SGHI!' AS status;
