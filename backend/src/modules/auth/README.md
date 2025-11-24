# 🔐 Module d'Authentification - SGHI

Module complet d'authentification et d'autorisation pour le système SGHI.

## 📋 Fonctionnalités

### Authentification
- ✅ **Inscription** - Création de nouveaux comptes utilisateurs
- ✅ **Connexion** - Authentification avec email/mot de passe
- ✅ **Déconnexion** - Invalidation des tokens
- ✅ **Refresh Token** - Renouvellement automatique des tokens d'accès
- ✅ **Vérification Email** - Confirmation de l'adresse email
- ✅ **Mot de passe oublié** - Réinitialisation par email
- ✅ **Changement de mot de passe** - Modification sécurisée

### Autorisation
- ✅ **JWT Guards** - Protection des routes avec JWT
- ✅ **Roles Guard** - Contrôle d'accès basé sur les rôles (RBAC)
- ✅ **Rate Limiting** - Protection contre les attaques par force brute
- ✅ **Public Decorator** - Routes publiques sans authentification

## 🏗️ Architecture

```
auth/
├── controllers/
│   └── auth.controller.ts      # Endpoints API
├── services/
│   └── auth.service.ts          # Logique métier
├── guards/
│   ├── jwt-auth.guard.ts        # Protection JWT
│   ├── jwt-refresh-auth.guard.ts # Protection refresh token
│   └── roles.guard.ts           # Contrôle des rôles
├── strategies/
│   ├── jwt.strategy.ts          # Stratégie JWT
│   └── jwt-refresh.strategy.ts  # Stratégie refresh
├── dto/
│   ├── register.dto.ts          # Validation inscription
│   ├── login.dto.ts             # Validation connexion
│   ├── refresh-token.dto.ts     # Validation refresh
│   ├── change-password.dto.ts   # Validation changement MDP
│   ├── forgot-password.dto.ts   # Validation oubli MDP
│   └── reset-password.dto.ts    # Validation reset MDP
├── entities/
│   └── user.entity.ts           # Entité User
└── auth.module.ts               # Module principal
```

## 🔑 Endpoints API

### Publics (sans authentification)

#### POST /api/auth/register
Inscription d'un nouvel utilisateur.

**Body:**
```json
{
  "nom": "Diop",
  "prenom": "Amadou",
  "email": "a.diop@sghi.com",
  "password": "Password@123",
  "telephone": "+221771234567",
  "role": "DOCTOR",
  "specialite": "Cardiologie",
  "numeroEmploye": "MED-2024-001",
  "service": "Cardiologie"
}
```

**Response:**
```json
{
  "message": "Inscription réussie. Veuillez vérifier votre email.",
  "data": {
    "id": "uuid",
    "email": "a.diop@sghi.com",
    "nom": "Diop",
    "prenom": "Amadou",
    "role": "DOCTOR"
  }
}
```

#### POST /api/auth/login
Connexion d'un utilisateur.

**Body:**
```json
{
  "email": "a.diop@sghi.com",
  "password": "Password@123"
}
```

**Response:**
```json
{
  "message": "Connexion réussie",
  "data": {
    "user": {
      "id": "uuid",
      "email": "a.diop@sghi.com",
      "nom": "Diop",
      "prenom": "Amadou",
      "role": "DOCTOR",
      "photo": null,
      "specialite": "Cardiologie",
      "service": "Cardiologie"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

#### POST /api/auth/refresh
Rafraîchir les tokens.

**Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response:**
```json
{
  "message": "Tokens rafraîchis avec succès",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

#### POST /api/auth/forgot-password
Demander une réinitialisation de mot de passe.

**Body:**
```json
{
  "email": "a.diop@sghi.com"
}
```

#### POST /api/auth/reset-password
Réinitialiser le mot de passe.

**Body:**
```json
{
  "token": "reset-token-uuid",
  "newPassword": "NewPassword@123"
}
```

#### GET /api/auth/verify-email/:token
Vérifier l'email avec le token.

### Protégés (authentification requise)

#### GET /api/auth/profile
Récupérer le profil de l'utilisateur connecté.

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

**Response:**
```json
{
  "message": "Profil récupéré avec succès",
  "data": {
    "id": "uuid",
    "email": "a.diop@sghi.com",
    "nom": "Diop",
    "prenom": "Amadou",
    "telephone": "+221771234567",
    "role": "DOCTOR",
    "photo": null,
    "specialite": "Cardiologie",
    "numeroEmploye": "MED-2024-001",
    "service": "Cardiologie",
    "isEmailVerified": true,
    "lastLoginAt": "2024-11-18T10:30:00Z",
    "createdAt": "2024-11-01T08:00:00Z"
  }
}
```

#### POST /api/auth/logout
Déconnexion de l'utilisateur.

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

#### POST /api/auth/change-password
Changer le mot de passe.

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

**Body:**
```json
{
  "oldPassword": "Password@123",
  "newPassword": "NewPassword@123"
}
```

## 🛡️ Sécurité

### Validation des mots de passe
Les mots de passe doivent respecter les critères suivants :
- Minimum 8 caractères
- Au moins une majuscule
- Au moins une minuscule
- Au moins un chiffre
- Au moins un caractère spécial (@$!%*?&)

### Hachage
- Algorithme : **bcrypt** avec salt de 10 rounds
- Hashage automatique avant insertion/mise à jour (via hooks TypeORM)

### Tokens JWT
- **Access Token** : Expire dans 15 minutes (configurable)
- **Refresh Token** : Expire dans 7 jours (configurable)
- Algorithme : **HS256**

### Rate Limiting
- 100 requêtes par minute par IP (configurable)
- Protection contre les attaques par force brute

## 👥 Rôles disponibles

```typescript
enum UserRole {
  // Administration
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',

  // Personnel médical
  DOCTOR = 'DOCTOR',
  SPECIALIST = 'SPECIALIST',
  SURGEON = 'SURGEON',
  NURSE = 'NURSE',
  NURSE_CHIEF = 'NURSE_CHIEF',
  ANESTHESIOLOGIST = 'ANESTHESIOLOGIST',

  // Personnel paramédical
  PHYSIOTHERAPIST = 'PHYSIOTHERAPIST',
  PHARMACIST = 'PHARMACIST',
  LAB_TECHNICIAN = 'LAB_TECHNICIAN',
  RADIOLOGY_TECHNICIAN = 'RADIOLOGY_TECHNICIAN',
  BIOLOGIST = 'BIOLOGIST',

  // Personnel administratif
  RECEPTIONIST = 'RECEPTIONIST',
  ACCOUNTANT = 'ACCOUNTANT',
  HR_MANAGER = 'HR_MANAGER',

  // Patients
  PATIENT = 'PATIENT',
}
```

## 🎯 Utilisation dans les contrôleurs

### Route publique
```typescript
import { Public } from '@common/decorators/public.decorator';

@Public()
@Get('public-route')
async publicRoute() {
  return { message: 'Accessible sans authentification' };
}
```

### Route protégée
```typescript
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Get('protected-route')
async protectedRoute() {
  return { message: 'Nécessite authentification' };
}
```

### Route avec contrôle de rôle
```typescript
import { Roles } from '@common/decorators/roles.decorator';
import { RolesGuard } from '@modules/auth/guards/roles.guard';
import { UserRole } from '@shared/constants/roles.constants';

@Roles(UserRole.DOCTOR, UserRole.NURSE)
@UseGuards(JwtAuthGuard, RolesGuard)
@Get('medical-route')
async medicalRoute() {
  return { message: 'Réservé aux médecins et infirmiers' };
}
```

### Récupérer l'utilisateur connecté
```typescript
import { CurrentUser } from '@common/decorators/current-user.decorator';

@Get('my-data')
async getMyData(@CurrentUser() user) {
  return { userId: user.id, email: user.email };
}

// Ou récupérer juste l'ID
@Get('my-data')
async getMyData(@CurrentUser('id') userId: string) {
  return { userId };
}
```

## 🧪 Tests

```bash
# Tests unitaires du module auth
npm run test -- auth

# Tests avec couverture
npm run test:cov -- auth
```

## 📊 Base de données

### Table: users

| Colonne | Type | Description |
|---------|------|-------------|
| id | UUID | Identifiant unique |
| nom | VARCHAR(100) | Nom de famille |
| prenom | VARCHAR(100) | Prénom |
| email | VARCHAR(255) | Email (unique) |
| telephone | VARCHAR(20) | Téléphone |
| password | VARCHAR(255) | Mot de passe hashé |
| role | ENUM | Rôle utilisateur |
| photo | VARCHAR(255) | URL photo de profil |
| specialite | VARCHAR(100) | Spécialité médicale |
| numeroEmploye | VARCHAR(50) | Numéro employé |
| service | VARCHAR(100) | Service d'affectation |
| isActive | BOOLEAN | Compte actif |
| isEmailVerified | BOOLEAN | Email vérifié |
| emailVerificationToken | VARCHAR(255) | Token vérification |
| emailVerifiedAt | TIMESTAMP | Date vérification |
| passwordResetToken | VARCHAR(255) | Token reset |
| passwordResetExpires | TIMESTAMP | Expiration token reset |
| refreshToken | VARCHAR(500) | Refresh token hashé |
| lastLoginAt | TIMESTAMP | Dernière connexion |
| lastLoginIp | VARCHAR(45) | IP dernière connexion |
| createdAt | TIMESTAMP | Date création |
| updatedAt | TIMESTAMP | Date modification |
| createdBy | UUID | Créé par |
| updatedBy | UUID | Modifié par |

### Index
- `IDX_USERS_EMAIL` sur `email`
- `IDX_USERS_ROLE` sur `role`
- `IDX_USERS_IS_ACTIVE` sur `isActive`

## 📝 Seeding

Des utilisateurs de test sont créés lors du seeding :

```bash
# Lancer le seeding
npm run seed:run
```

**Comptes créés :**
- **admin@sghi.com** (SUPER_ADMIN) - Password: `Admin@123`
- **a.diop@sghi.com** (DOCTOR) - Password: `Doctor@123`
- **f.fall@sghi.com** (SPECIALIST) - Password: `Doctor@123`
- **m.ndiaye@sghi.com** (NURSE_CHIEF) - Password: `Nurse@123`
- **a.sow@sghi.com** (NURSE) - Password: `Nurse@123`
- etc...

## 🔄 Workflow typique

1. **Inscription** → Compte créé, email de vérification envoyé
2. **Vérification email** → Compte activé
3. **Connexion** → Tokens JWT générés
4. **Utilisation** → Access token dans les headers
5. **Refresh** → Nouveau access token avant expiration
6. **Déconnexion** → Tokens invalidés

## 🚀 TODO / Améliorations futures

- [ ] Intégration service email (SendGrid/Nodemailer)
- [ ] Authentification à deux facteurs (2FA)
- [ ] OAuth2 (Google, Microsoft)
- [ ] Logs d'audit des connexions
- [ ] Détection connexions suspectes
- [ ] Politique de complexité des mots de passe configurable
- [ ] Historique des mots de passe
- [ ] Sessions actives (multi-devices)
- [ ] Révocation de tokens spécifiques

---

**Dernière mise à jour:** 18 Novembre 2024
