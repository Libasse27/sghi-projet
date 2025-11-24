# 🧪 Guide de Test - Module d'Authentification

Ce guide vous permet de tester rapidement le module d'authentification avec Docker.

## 🚀 Démarrage rapide

### 1. Démarrer les services Docker

```bash
# Depuis la racine du projet
cd SGHI-PROJECT
docker-compose up -d
```

Attendez environ 30 secondes que tous les services démarrent.

### 2. Vérifier que les services sont actifs

```bash
docker-compose ps
```

Vous devriez voir :
- ✓ sghi_postgres (port 5432)
- ✓ sghi_mongodb (port 27017)
- ✓ sghi_redis (port 6379)
- ✓ sghi_backend (port 3000)

### 3. Vérifier l'API

```bash
curl http://localhost:3000
```

Vous devriez recevoir une réponse JSON avec les informations de l'API.

### 4. Accéder à la documentation Swagger

Ouvrez votre navigateur : [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

## 📝 Tests avec cURL

### 1. Inscription d'un nouvel utilisateur

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "Test",
    "prenom": "Utilisateur",
    "email": "test@sghi.com",
    "password": "Test@123456",
    "telephone": "+221771234599",
    "role": "DOCTOR",
    "specialite": "Cardiologie",
    "numeroEmploye": "MED-2024-999"
  }'
```

**Réponse attendue:**
```json
{
  "statusCode": 201,
  "message": "Inscription réussie. Veuillez vérifier votre email.",
  "data": {
    "id": "uuid-generated",
    "email": "test@sghi.com",
    "nom": "Test",
    "prenom": "Utilisateur",
    "role": "DOCTOR"
  },
  "timestamp": "2024-11-18T..."
}
```

### 2. Connexion avec un compte seedé

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@sghi.com",
    "password": "Admin@123"
  }'
```

**Réponse attendue:**
```json
{
  "statusCode": 200,
  "message": "Connexion réussie",
  "data": {
    "user": {
      "id": "uuid",
      "email": "admin@sghi.com",
      "nom": "Admin",
      "prenom": "Super",
      "role": "SUPER_ADMIN",
      ...
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "timestamp": "2024-11-18T..."
}
```

**💡 Sauvegardez le accessToken pour les requêtes suivantes!**

### 3. Récupérer le profil (route protégée)

```bash
# Remplacez YOUR_ACCESS_TOKEN par le token reçu lors de la connexion
curl -X GET http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Réponse attendue:**
```json
{
  "statusCode": 200,
  "message": "Profil récupéré avec succès",
  "data": {
    "id": "uuid",
    "email": "admin@sghi.com",
    "nom": "Admin",
    "prenom": "Super",
    "role": "SUPER_ADMIN",
    "isEmailVerified": true,
    "lastLoginAt": "2024-11-18T...",
    ...
  },
  "timestamp": "2024-11-18T..."
}
```

### 4. Changer le mot de passe

```bash
curl -X POST http://localhost:3000/api/auth/change-password \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "oldPassword": "Admin@123",
    "newPassword": "NewAdmin@123"
  }'
```

### 5. Rafraîchir le token

```bash
curl -X POST http://localhost:3000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "YOUR_REFRESH_TOKEN"
  }'
```

### 6. Déconnexion

```bash
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 7. Mot de passe oublié

```bash
curl -X POST http://localhost:3000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@sghi.com"
  }'
```

## 🔐 Comptes de test disponibles

Après avoir lancé le seeding, vous pouvez vous connecter avec :

| Email | Mot de passe | Rôle | Spécialité |
|-------|--------------|------|------------|
| admin@sghi.com | Admin@123 | SUPER_ADMIN | - |
| a.diop@sghi.com | Doctor@123 | DOCTOR | Cardiologie |
| f.fall@sghi.com | Doctor@123 | SPECIALIST | Gastro-entérologie |
| m.ndiaye@sghi.com | Nurse@123 | NURSE_CHIEF | Urgences |
| a.sow@sghi.com | Nurse@123 | NURSE | Médecine Générale |
| i.sarr@sghi.com | Lab@123 | BIOLOGIST | Laboratoire |
| o.gueye@sghi.com | Lab@123 | LAB_TECHNICIAN | Laboratoire |
| a.ba@sghi.com | Pharma@123 | PHARMACIST | Pharmacie |
| m.cisse@sghi.com | Physio@123 | PHYSIOTHERAPIST | Kinésithérapie |
| k.toure@sghi.com | Reception@123 | RECEPTIONIST | Accueil |
| a.faye@sghi.com | Account@123 | ACCOUNTANT | Comptabilité |
| s.diouf@sghi.com | HR@123 | HR_MANAGER | RH |

## 📊 Tests avec Postman

### Import de collection

1. Ouvrez Postman
2. Import → Lien : [http://localhost:3000/api-docs-json](http://localhost:3000/api-docs-json)
3. Postman convertira automatiquement le Swagger en collection

### Variables d'environnement Postman

Créez ces variables :
- `base_url` = `http://localhost:3000`
- `access_token` = (sera rempli automatiquement après login)
- `refresh_token` = (sera rempli automatiquement après login)

### Script post-login (Tests tab)

```javascript
// Sauvegarder les tokens après connexion
if (pm.response.code === 200) {
    const jsonData = pm.response.json();
    pm.environment.set("access_token", jsonData.data.accessToken);
    pm.environment.set("refresh_token", jsonData.data.refreshToken);
}
```

## 🗄️ Accès aux bases de données

### PostgreSQL via Adminer

URL: [http://localhost:8080](http://localhost:8080)

- **Système**: PostgreSQL
- **Serveur**: postgres
- **Utilisateur**: sghi_user
- **Mot de passe**: sghi_password
- **Base**: sghi_db

### MongoDB via Mongo Express

URL: [http://localhost:8081](http://localhost:8081)

- **Username**: admin
- **Password**: admin123

### Redis via Redis Commander

URL: [http://localhost:8082](http://localhost:8082)

## 🧪 Tests unitaires

```bash
# Tests du module auth
cd backend
npm run test -- auth

# Tests avec couverture
npm run test:cov -- auth

# Tests en mode watch
npm run test:watch -- auth
```

## ❌ Tests d'erreurs

### 1. Email déjà utilisé (409)

```bash
# S'inscrire deux fois avec le même email
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "Test",
    "prenom": "User",
    "email": "admin@sghi.com",
    "password": "Test@123456",
    "role": "DOCTOR"
  }'
```

### 2. Mot de passe invalide (401)

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@sghi.com",
    "password": "WrongPassword"
  }'
```

### 3. Token expiré (401)

```bash
# Attendre 15 minutes après connexion, puis :
curl -X GET http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer EXPIRED_TOKEN"
```

### 4. Validation des données (400)

```bash
# Mot de passe trop court
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "Test",
    "prenom": "User",
    "email": "test@sghi.com",
    "password": "123",
    "role": "DOCTOR"
  }'
```

## 🔍 Vérifications manuelles

### 1. Vérifier que le mot de passe est hashé

```sql
-- Dans Adminer (http://localhost:8080)
SELECT email, password FROM users LIMIT 1;
-- Le password doit commencer par $2b$ (bcrypt)
```

### 2. Vérifier les index

```sql
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'users';
```

### 3. Vérifier le refresh token

```sql
SELECT email,
       CASE WHEN "refreshToken" IS NOT NULL THEN 'OUI' ELSE 'NON' END as has_refresh_token,
       "lastLoginAt"
FROM users
WHERE email = 'admin@sghi.com';
```

## 📝 Logs

### Voir les logs du backend

```bash
# Logs en temps réel
docker-compose logs -f backend

# Dernières 100 lignes
docker-compose logs --tail=100 backend
```

## 🐛 Dépannage

### Le backend ne démarre pas

```bash
# Vérifier les logs
docker-compose logs backend

# Redémarrer le service
docker-compose restart backend
```

### Erreur de connexion à la base de données

```bash
# Vérifier que PostgreSQL est prêt
docker-compose ps postgres

# Réinitialiser les données
docker-compose down -v
docker-compose up -d
```

### Reset complet

```bash
# Arrêter tous les services
docker-compose down -v

# Supprimer les volumes
docker volume prune

# Redémarrer
docker-compose up -d

# Attendre 30s, puis lancer les migrations et seeds
```

## ✅ Checklist de validation

- [ ] L'API répond sur http://localhost:3000
- [ ] Swagger accessible sur http://localhost:3000/api-docs
- [ ] Inscription fonctionne (POST /api/auth/register)
- [ ] Connexion fonctionne (POST /api/auth/login)
- [ ] Token JWT est retourné
- [ ] Route protégée accessible avec token (GET /api/auth/profile)
- [ ] Route protégée refuse l'accès sans token (401)
- [ ] Refresh token fonctionne
- [ ] Déconnexion fonctionne
- [ ] Changement de mot de passe fonctionne
- [ ] Validation des données (mauvais format → 400)
- [ ] Email en double refusé (409)
- [ ] Mauvais mot de passe refusé (401)

## 📖 Ressources

- [Documentation Swagger](http://localhost:3000/api-docs)
- [Code source module Auth](./src/modules/auth/)
- [README module Auth](./src/modules/auth/README.md)
- [Tests unitaires](./src/modules/auth/**/*.spec.ts)

---

**Bon testing! 🚀**
