# 🔧 Guide de dépannage - SGHI Backend

## Problème actuel : Erreur `Native is not a constructor`

### Cause
L'erreur provient du module `pg-native` qui est une dépendance native de PostgreSQL. Webpack essaie de bundler ce module natif, ce qui cause des problèmes.

### Solutions appliquées

1. ✅ Ajout de `pg-native` aux externals de Webpack
2. ✅ Ajout de `nativeDriver: false` dans la configuration TypeORM
3. ✅ Option pour désactiver les bases de données temporairement

### Solution temporaire : Démarrer sans bases de données

Dans `backend/.env`, les bases de données sont désactivées :
```env
DISABLE_DB=true
DISABLE_MONGO=true
```

Pour démarrer le backend :
```powershell
cd backend
Remove-Item -Recurse -Force dist
npm run dev
```

## Installation des bases de données

### Option 1 : Docker (RECOMMANDÉ)

```powershell
# PostgreSQL
docker run --name sghi_postgres `
  -e POSTGRES_USER=sghi_user `
  -e POSTGRES_PASSWORD=sghi_password `
  -e POSTGRES_DB=sghi_db `
  -p 5432:5432 `
  -d postgres:15-alpine

# MongoDB
docker run --name sghi_mongodb `
  -e MONGO_INITDB_ROOT_USERNAME=sghi_mongo_user `
  -e MONGO_INITDB_ROOT_PASSWORD=sghi_mongo_password `
  -p 27017:27017 `
  -d mongo:6

# Redis
docker run --name sghi_redis `
  -p 6379:6379 `
  -d redis:7-alpine `
  redis-server --requirepass sghi_redis_password

# Vérifier que tout fonctionne
docker ps
```

Puis dans `backend/.env` :
```env
DISABLE_DB=false
DISABLE_MONGO=false
```

### Option 2 : Installation locale

#### PostgreSQL
1. Télécharger : https://www.postgresql.org/download/windows/
2. Installer et créer la base :
```sql
CREATE USER sghi_user WITH PASSWORD 'sghi_password';
CREATE DATABASE sghi_db OWNER sghi_user;
GRANT ALL PRIVILEGES ON DATABASE sghi_db TO sghi_user;
```

#### MongoDB
1. Télécharger : https://www.mongodb.com/try/download/community
2. Installer et créer l'utilisateur :
```javascript
use admin
db.createUser({
  user: "sghi_mongo_user",
  pwd: "sghi_mongo_password",
  roles: [{role: "root", db: "admin"}]
})
```

#### Redis
1. Installer Memurai (Redis pour Windows) : https://www.memurai.com/
2. Ou utiliser WSL2 + Redis

## Commandes utiles

```powershell
# Nettoyer le cache et dist
cd backend
Remove-Item -Recurse -Force dist, node_modules/.cache
npm run dev

# Vérifier les ports
netstat -ano | findstr :3000  # Backend API
netstat -ano | findstr :5432  # PostgreSQL
netstat -ano | findstr :27017 # MongoDB
netstat -ano | findstr :6379  # Redis

# Arrêter un processus sur un port
# Trouver le PID
netstat -ano | findstr :3000
# Tuer le processus (remplacer PID)
taskkill /PID <PID> /F

# Docker : Arrêter et supprimer les conteneurs
docker stop sghi_postgres sghi_mongodb sghi_redis
docker rm sghi_postgres sghi_mongodb sghi_redis

# Docker : Voir les logs
docker logs sghi_postgres
docker logs sghi_mongodb
docker logs sghi_redis
```

## Vérification de l'installation

### Tester PostgreSQL
```powershell
docker exec -it sghi_postgres psql -U sghi_user -d sghi_db -c "SELECT version();"
```

### Tester MongoDB
```powershell
docker exec -it sghi_mongodb mongosh --username sghi_mongo_user --password sghi_mongo_password --authenticationDatabase admin
```

### Tester Redis
```powershell
docker exec -it sghi_redis redis-cli -a sghi_redis_password ping
```

## Prochaines étapes

Une fois les bases de données fonctionnelles :

1. Activer les connexions dans `backend/.env` :
   ```env
   DISABLE_DB=false
   DISABLE_MONGO=false
   ```

2. Redémarrer le backend :
   ```powershell
   cd backend
   Remove-Item -Recurse -Force dist
   npm run dev
   ```

3. Le serveur devrait démarrer sur `http://localhost:3000`

4. Accéder à la documentation Swagger : `http://localhost:3000/api/docs`

## Erreurs courantes

### Erreur : `EADDRINUSE` (Port déjà utilisé)
```powershell
# Trouver et tuer le processus sur le port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Erreur : `ECONNREFUSED` (Connexion refusée)
- Vérifier que PostgreSQL/MongoDB/Redis sont démarrés
- Vérifier les ports dans `.env`
- Vérifier les credentials

### Erreur Webpack : modules natifs
- Vérifier que `webpack.config.js` existe et contient les externals
- Supprimer `dist` et `node_modules/.cache`
- Relancer la compilation

## Support

Si les problèmes persistent :
1. Vérifier les logs : `docker logs <container_name>`
2. Vérifier les variables d'environnement
3. Réinstaller les dépendances : `rm -rf node_modules && npm install`

---

*Dernière mise à jour : 19 novembre 2025*
