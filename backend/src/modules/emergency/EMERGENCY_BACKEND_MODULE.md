# ✅ Module Emergency (Backend) - Complété

Date: 2025-11-20

## 📋 Résumé

Le module backend de gestion des urgences pour SGHI a été créé avec succès. Il fournit une API REST complète pour gérer le triage des urgences, la file d'attente en temps réel et les statistiques.

## ✅ Structure du Module

```
backend/src/modules/emergency/
├── dto/
│   ├── create-emergency.dto.ts     # DTO pour créer un triage
│   ├── update-emergency.dto.ts     # DTO pour mettre à jour une urgence
│   ├── query-emergency.dto.ts      # DTO pour filtrer et paginer
│   └── index.ts                     # Exports centralisés
├── entities/
│   └── emergency.entity.ts          # Entité TypeORM Emergency
├── interfaces/                      # (optionnel pour interfaces futures)
├── emergency.controller.ts          # Contrôleur REST API
├── emergency.service.ts             # Service métier
├── emergency.module.ts              # Module NestJS
└── EMERGENCY_BACKEND_MODULE.md      # Cette documentation
```

## 🗄️ Entité Emergency

### Énumérations

```typescript
// 5 niveaux de priorité
enum EmergencyPriority {
  P1 = 'P1', // Urgence Absolue - Immédiat
  P2 = 'P2', // Urgence Relative - 20 min
  P3 = 'P3', // Urgence Non Vitale - 60 min
  P4 = 'P4', // Soins Rapides - 120 min
  P5 = 'P5', // Consultation - 240 min
}

// Statuts de l'urgence
enum EmergencyStatus {
  WAITING = 'waiting',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  TRANSFERRED = 'transferred',
}

// États de conscience
enum ConsciousnessState {
  ALERT = 'alert',
  CONFUSED = 'confused',
  DROWSY = 'drowsy',
  UNCONSCIOUS = 'unconscious',
}
```

### Champs de l'Entité

**Identifiants:**
- `id` (UUID) - Identifiant unique
- `priority` (EmergencyPriority) - Niveau de priorité
- `status` (EmergencyStatus) - Statut actuel

**Informations Patient:**
- `patientId` (string) - ID du patient
- `patientNom` (string) - Nom
- `patientPrenom` (string) - Prénom
- `patientAge` (number) - Âge
- `patientSexe` (string) - Sexe (M/F)

**Informations Triage:**
- `reason` (text) - Motif de consultation
- `observations` (text, nullable) - Observations supplémentaires

**Constantes Vitales:**
- `bloodPressure` (string) - Tension artérielle (format: "120/80")
- `heartRate` (number) - Fréquence cardiaque (bpm)
- `temperature` (decimal) - Température (°C)
- `respiratoryRate` (number, nullable) - Fréquence respiratoire (/min)
- `oxygenSaturation` (number, nullable) - Saturation O₂ (%)
- `bloodSugar` (decimal, nullable) - Glycémie (g/L)
- `painScale` (number) - Échelle de douleur (0-10)
- `consciousness` (ConsciousnessState) - État de conscience

**Gestion du Temps:**
- `arrivalTime` (timestamp) - Date/heure d'arrivée (auto)
- `takenCareAt` (timestamp, nullable) - Date/heure de prise en charge
- `completedAt` (timestamp, nullable) - Date/heure de fin
- `waitTime` (number) - Temps d'attente en minutes (calculé)
- `updatedAt` (timestamp) - Dernière modification (auto)

**Personnel:**
- `triagedBy` (User) - Infirmier(ère) de triage
- `triagedById` (string) - ID de l'infirmier(ère)
- `assignedTo` (User) - Médecin/Infirmier(ère) assigné(e)
- `assignedToId` (string) - ID du personnel assigné

**Transfert et Annulation:**
- `transferredTo` (string, nullable) - Service de destination
- `transferReason` (text, nullable) - Raison du transfert
- `cancellationReason` (text, nullable) - Raison de l'annulation

## 📝 DTOs (Data Transfer Objects)

### CreateEmergencyDto

Validation complète avec class-validator:

```typescript
{
  priority: EmergencyPriority;           // Obligatoire, enum
  patientId: string;                     // Obligatoire
  patientNom: string;                    // 2-100 caractères
  patientPrenom: string;                 // 2-100 caractères
  patientAge: number;                    // 0-150
  patientSexe: string;                   // M ou F
  reason: string;                        // 10-1000 caractères
  observations?: string;                 // Max 2000 caractères
  bloodPressure: string;                 // Format: \d{2,3}/\d{2,3}
  heartRate: number;                     // 20-250 bpm
  temperature: number;                   // 30-45 °C
  respiratoryRate?: number;              // 5-60 /min
  oxygenSaturation?: number;             // 50-100 %
  bloodSugar?: number;                   // 0.1-10 g/L
  painScale: number;                     // 0-10
  consciousness: ConsciousnessState;     // Enum
}
```

### UpdateEmergencyDto

Tous les champs optionnels (PartialType):
- Hérite de CreateEmergencyDto
- Ajoute: `status`, `assignedToId`, `transferredTo`, `transferReason`, `cancellationReason`

### QueryEmergencyDto

Filtres et pagination:
```typescript
{
  priority?: EmergencyPriority;
  status?: EmergencyStatus;
  patientId?: string;
  assignedToId?: string;
  startDate?: string;               // Format ISO
  endDate?: string;                 // Format ISO
  page?: number;                    // Défaut: 1
  limit?: number;                   // Défaut: 20
}
```

## 🔧 Service (EmergencyService)

### Méthodes Principales

#### create(createEmergencyDto, triagedById)
- Crée un nouveau triage
- Assigne automatiquement le statut `WAITING`
- Enregistre l'ID de l'infirmier(ère) de triage

#### findAll(query)
- Récupère toutes les urgences avec filtres
- Pagination (page, limit)
- Filtres: priorité, statut, patient, assigné, dates
- Tri: priorité ASC, arrivalTime ASC
- Calcule le temps d'attente pour les urgences en attente
- Relations: triagedBy, assignedTo

#### getQueue()
- Récupère uniquement les urgences en attente (`WAITING`)
- Tri par priorité puis par heure d'arrivée
- Calcule le temps d'attente pour chaque urgence

#### getStatistics()
- Total d'urgences
- Répartition par priorité (P1-P5)
- Répartition par statut
- Temps d'attente moyen pour les urgences en attente

#### findOne(id)
- Récupère une urgence par ID
- Inclut les relations (triagedBy, assignedTo)
- Calcule le temps d'attente si en attente
- Lance NotFoundException si non trouvée

#### update(id, updateEmergencyDto)
- Met à jour une urgence
- Validation automatique du DTO

#### takeCare(id, userId)
- Marque une urgence comme prise en charge
- Change le statut: `WAITING` → `IN_PROGRESS`
- Assigne le personnel (assignedToId)
- Enregistre l'heure de prise en charge (takenCareAt)
- Vérifie que l'urgence est bien en attente

#### reassignPriority(id, priority)
- Modifie la priorité d'une urgence
- Utile si réévaluation nécessaire

#### transfer(id, transferredTo, transferReason)
- Transfère une urgence vers un autre service
- Change le statut: → `TRANSFERRED`
- Enregistre le service de destination et la raison
- Enregistre l'heure de fin (completedAt)

#### cancel(id, cancellationReason)
- Annule une urgence
- Change le statut: → `CANCELLED`
- Enregistre la raison d'annulation
- Vérifie qu'elle n'est pas déjà complétée

#### complete(id)
- Marque une urgence comme terminée
- Change le statut: `IN_PROGRESS` → `COMPLETED`
- Enregistre l'heure de fin (completedAt)
- Vérifie qu'elle est bien en cours

#### remove(id)
- Supprime une urgence (soft delete possible avec extension)

## 🎯 Contrôleur (EmergencyController)

### Endpoints REST API

Tous les endpoints nécessitent authentification JWT (`@UseGuards(JwtAuthGuard, RolesGuard)`).

#### POST /api/emergency
- **Action**: Créer un nouveau triage
- **Body**: CreateEmergencyDto
- **Rôles**: SUPER_ADMIN, ADMIN, DOCTOR, NURSE, EMERGENCY_NURSE
- **Retour**: Emergency créée (201)

#### GET /api/emergency
- **Action**: Liste des urgences avec filtres
- **Query**: QueryEmergencyDto
- **Rôles**: SUPER_ADMIN, ADMIN, DOCTOR, NURSE, EMERGENCY_NURSE, RECEPTIONIST
- **Retour**: { data, total, page, limit }

#### GET /api/emergency/queue
- **Action**: File d'attente (urgences en attente uniquement)
- **Rôles**: SUPER_ADMIN, ADMIN, DOCTOR, NURSE, EMERGENCY_NURSE, RECEPTIONIST
- **Retour**: Emergency[] triées par priorité

#### GET /api/emergency/statistics
- **Action**: Statistiques du dashboard
- **Rôles**: SUPER_ADMIN, ADMIN, DOCTOR, NURSE, EMERGENCY_NURSE
- **Retour**: { total, byPriority, byStatus, averageWaitTime }

#### GET /api/emergency/:id
- **Action**: Détails d'une urgence
- **Rôles**: SUPER_ADMIN, ADMIN, DOCTOR, NURSE, EMERGENCY_NURSE
- **Retour**: Emergency avec relations

#### PATCH /api/emergency/:id
- **Action**: Modifier une urgence
- **Body**: UpdateEmergencyDto
- **Rôles**: SUPER_ADMIN, ADMIN, DOCTOR, NURSE, EMERGENCY_NURSE
- **Retour**: Emergency mise à jour

#### POST /api/emergency/:id/take-care
- **Action**: Prendre en charge une urgence
- **Rôles**: SUPER_ADMIN, ADMIN, DOCTOR, NURSE, EMERGENCY_NURSE
- **Retour**: Emergency avec statut IN_PROGRESS (200)

#### PATCH /api/emergency/:id/priority
- **Action**: Réassigner la priorité
- **Body**: { priority: string }
- **Rôles**: SUPER_ADMIN, ADMIN, DOCTOR, EMERGENCY_NURSE
- **Retour**: Emergency avec nouvelle priorité

#### POST /api/emergency/:id/transfer
- **Action**: Transférer vers un autre service
- **Body**: { transferredTo: string, transferReason: string }
- **Rôles**: SUPER_ADMIN, ADMIN, DOCTOR, NURSE, EMERGENCY_NURSE
- **Retour**: Emergency avec statut TRANSFERRED (200)

#### POST /api/emergency/:id/cancel
- **Action**: Annuler une urgence
- **Body**: { cancellationReason: string }
- **Rôles**: SUPER_ADMIN, ADMIN, DOCTOR, EMERGENCY_NURSE
- **Retour**: Emergency avec statut CANCELLED (200)

#### POST /api/emergency/:id/complete
- **Action**: Terminer une urgence
- **Rôles**: SUPER_ADMIN, ADMIN, DOCTOR, NURSE, EMERGENCY_NURSE
- **Retour**: Emergency avec statut COMPLETED (200)

#### DELETE /api/emergency/:id
- **Action**: Supprimer une urgence
- **Rôles**: SUPER_ADMIN, ADMIN uniquement
- **Retour**: 204 No Content

## 🔒 Sécurité et Permissions

### Authentification
- Tous les endpoints nécessitent un JWT valide
- Utilisation de `@UseGuards(JwtAuthGuard, RolesGuard)`

### Autorisations (RBAC)
- **Création de triage**: Médecins, Infirmiers, Urgentistes
- **Consultation**: + Réceptionnistes (lecture seule)
- **Actions (prendre en charge, transférer)**: Personnel médical uniquement
- **Modification de priorité**: Médecins et urgentistes uniquement
- **Suppression**: Administrateurs uniquement

### Validation
- Toutes les entrées sont validées avec class-validator
- DTOs avec règles strictes (min/max, regex, enum)
- Messages d'erreur en français

### Erreurs Gérées
- `NotFoundException`: Urgence non trouvée
- `BadRequestException`:
  - Urgence non en attente lors de prise en charge
  - Urgence non en cours lors de complétion
  - Urgence déjà complétée lors d'annulation

## 📊 Fonctionnalités Avancées

### Calcul Automatique du Temps d'Attente
```typescript
// Calculé à la volée pour les urgences en attente
const now = new Date();
const arrival = new Date(emergency.arrivalTime);
emergency.waitTime = Math.floor((now.getTime() - arrival.getTime()) / (1000 * 60));
```

### Tri Intelligent
- **Prioritaire**: P1 > P2 > P3 > P4 > P5
- **Secondaire**: Plus ancienne en premier (FIFO par priorité)

### Relations TypeORM
- `triagedBy`: Infirmier(ère) qui a effectué le triage
- `assignedTo`: Personnel assigné pour la prise en charge
- Chargement avec `relations: ['triagedBy', 'assignedTo']`

### Horodatage Automatique
- `arrivalTime`: @CreateDateColumn (auto)
- `updatedAt`: @UpdateDateColumn (auto)
- `takenCareAt`: Manuel lors de prise en charge
- `completedAt`: Manuel lors de complétion/transfert/annulation

## 🔗 Intégration

### AppModule
Le module Emergency est enregistré dans `app.module.ts`:
```typescript
import { EmergencyModule } from './modules/emergency/emergency.module';

@Module({
  imports: [
    // ...
    ...(process.env.DISABLE_DB !== 'true' ? [AuthModule, EmergencyModule] : []),
  ],
})
```

### Base de Données
Table PostgreSQL: `emergencies`
- TypeORM génère automatiquement les migrations
- Relations avec table `users` (auth module)

### Frontend
Compatible avec les vues desktop créées:
- EmergencyDashboard.vue → `/api/emergency/statistics` + `/api/emergency/queue`
- Triage.vue → `POST /api/emergency`
- EmergencyQueue.vue → `/api/emergency/queue`

## 📈 Statistiques du Module

- **Fichiers créés**: 7
- **Lignes de code**: ~800+
- **Endpoints API**: 12
- **Méthodes de service**: 11
- **Validations**: 20+ règles
- **Énumérations**: 3
- **Relations**: 2 (triagedBy, assignedTo)

## 🚀 Utilisation

### Créer un Triage
```bash
POST /api/emergency
Authorization: Bearer <JWT>

{
  "priority": "P2",
  "patientId": "patient-uuid",
  "patientNom": "Dupont",
  "patientPrenom": "Jean",
  "patientAge": 45,
  "patientSexe": "M",
  "reason": "Douleur thoracique aiguë depuis 2 heures",
  "bloodPressure": "150/95",
  "heartRate": 105,
  "temperature": 37.2,
  "oxygenSaturation": 96,
  "painScale": 8,
  "consciousness": "alert"
}
```

### Récupérer la File d'Attente
```bash
GET /api/emergency/queue
Authorization: Bearer <JWT>

# Retour:
[
  {
    "id": "uuid",
    "priority": "P1",
    "status": "waiting",
    "patient": { ... },
    "waitTime": 15,
    ...
  }
]
```

### Statistiques Dashboard
```bash
GET /api/emergency/statistics
Authorization: Bearer <JWT>

# Retour:
{
  "total": 25,
  "byPriority": {
    "P1": 2,
    "P2": 5,
    "P3": 10,
    "P4": 6,
    "P5": 2
  },
  "byStatus": {
    "waiting": 15,
    "in_progress": 8,
    "completed": 2
  },
  "averageWaitTime": 32
}
```

### Prendre en Charge
```bash
POST /api/emergency/:id/take-care
Authorization: Bearer <JWT>

# Le userId est extrait automatiquement du JWT
```

## 🎯 Prochaines Étapes

### Priorité 1: Tests
- [ ] Tests unitaires du service
- [ ] Tests d'intégration du contrôleur
- [ ] Tests E2E des endpoints

### Priorité 2: Fonctionnalités Avancées
- [ ] WebSocket pour mise à jour temps réel
- [ ] Notifications (nouveaux P1/P2)
- [ ] Historique des modifications
- [ ] Logs d'audit

### Priorité 3: Optimisations
- [ ] Cache Redis pour statistiques
- [ ] Index sur priority + status + arrivalTime
- [ ] Soft delete au lieu de hard delete
- [ ] Pagination cursor-based pour grandes listes

### Priorité 4: Intégration
- [ ] Module Patients (relations avec Patient entity)
- [ ] Module Notifications
- [ ] Module Reports/Analytics

## ✅ Status Final

**Module Emergency Backend**: ✅ **COMPLÉTÉ**

Le module est prêt pour:
- ✅ Connexion avec le frontend desktop
- ✅ Tests
- ✅ Déploiement en développement
- ✅ Extension avec fonctionnalités avancées

---

**Développé pour SGHI** - Système de Gestion Hospitalière Intégré
**Date**: 2025-11-20
**Module**: Emergency/Urgences (Backend)
