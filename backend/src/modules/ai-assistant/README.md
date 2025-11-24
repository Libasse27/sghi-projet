# 🤖 AI Assistant Module

Module d'assistant IA pour le système SGHI, utilisant OpenAI pour fournir une assistance intelligente aux utilisateurs du système hospitalier.

## 📋 Vue d'ensemble

L'AI Assistant permet de :
- Répondre aux questions sur le système hospitalier
- Guider les utilisateurs dans l'utilisation des différents modules
- Fournir des informations sur les patients, consultations, etc.
- Assister dans les tâches administratives

## 🏗️ Architecture

```
ai-assistant/
├── controllers/
│   └── ai-assistant.controller.ts    # Endpoints REST API
├── services/
│   └── ai-assistant.service.ts       # Logique métier et intégration OpenAI
├── schemas/
│   └── conversation.schema.ts        # Schéma MongoDB pour les conversations
├── dto/
│   ├── chat-message.dto.ts          # DTOs pour les messages
│   └── conversation.dto.ts          # DTOs pour les conversations
├── interfaces/
│   └── ai-assistant.interface.ts    # Interfaces TypeScript
└── ai-assistant.module.ts           # Module NestJS
```

## 🚀 Configuration

### Variables d'environnement

Ajouter dans `.env` :

```env
# AI ASSISTANT
OPENAI_API_KEY=sk-your-openai-api-key
OPENAI_MODEL=gpt-4
OPENAI_MAX_TOKENS=2000
AI_ASSISTANT_ENABLED=true
```

### Installation des dépendances

Le module utilise `axios` pour les appels API OpenAI (déjà inclus dans les dépendances).

## 📡 API Endpoints

### 1. Envoyer un message

```http
POST /api/ai-assistant/chat
Content-Type: application/json
Authorization: Bearer <token>

{
  "message": "Comment puis-je prendre un rendez-vous?",
  "conversationId": "507f1f77bcf86cd799439011",  // optionnel
  "context": {                                     // optionnel
    "patientId": "123",
    "module": "appointments"
  }
}
```

**Réponse:**
```json
{
  "conversationId": "507f1f77bcf86cd799439011",
  "message": "Pour prendre un rendez-vous...",
  "timestamp": "2024-01-15T10:30:00Z",
  "metadata": {
    "model": "gpt-4",
    "tokensUsed": 150
  }
}
```

### 2. Lister les conversations

```http
GET /api/ai-assistant/conversations
Authorization: Bearer <token>
```

**Réponse:**
```json
[
  {
    "id": "507f1f77bcf86cd799439011",
    "title": "Questions sur les rendez-vous",
    "lastMessage": "Pour prendre un rendez-vous...",
    "lastActivityAt": "2024-01-15T10:30:00Z",
    "messageCount": 5,
    "status": "active"
  }
]
```

### 3. Récupérer une conversation

```http
GET /api/ai-assistant/conversations/:id
Authorization: Bearer <token>
```

### 4. Créer une conversation

```http
POST /api/ai-assistant/conversations
Content-Type: application/json
Authorization: Bearer <token>

{
  "title": "Nouvelle conversation",
  "initialMessage": "Bonjour, j'ai besoin d'aide"  // optionnel
}
```

### 5. Mettre à jour une conversation

```http
PATCH /api/ai-assistant/conversations/:id
Content-Type: application/json
Authorization: Bearer <token>

{
  "title": "Nouveau titre",
  "status": "archived"
}
```

### 6. Supprimer une conversation

```http
DELETE /api/ai-assistant/conversations/:id
Authorization: Bearer <token>
```

### 7. Archiver une conversation

```http
POST /api/ai-assistant/conversations/:id/archive
Authorization: Bearer <token>
```

## 💾 Base de données

### Schéma MongoDB - Conversation

```typescript
{
  _id: ObjectId,
  userId: ObjectId,
  title: string,
  messages: [
    {
      role: 'user' | 'assistant' | 'system',
      content: string,
      timestamp: Date
    }
  ],
  status: 'active' | 'archived' | 'deleted',
  metadata: object,
  lastActivityAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔧 Utilisation dans le code

### Injecter le service

```typescript
import { AiAssistantService } from '@/modules/ai-assistant/services/ai-assistant.service';

@Injectable()
export class MyService {
  constructor(private aiAssistantService: AiAssistantService) {}

  async askQuestion() {
    const response = await this.aiAssistantService.sendMessage(userId, {
      message: 'Comment créer un patient?',
      context: { module: 'patients' }
    });
    return response;
  }
}
```

## 🎯 Contexte système

L'assistant est configuré avec le contexte suivant :

- **Rôle**: Assistant pour SGHI (Système de Gestion Hospitalière Intégré)
- **Compétences**:
  - Information sur les patients et dossiers médicaux
  - Prise de rendez-vous et consultations
  - Gestion des urgences et triage
  - Services (laboratoire, imagerie, pharmacie)
  - Procédures administratives et facturation
- **Langue**: Français
- **Ton**: Professionnel, clair et concis

## 🔒 Sécurité

- **Authentification**: Utilise JWT (à décommenter le guard dans le controller)
- **Autorisation**: Vérifie que l'utilisateur accède uniquement à ses conversations
- **Rate limiting**: Protection contre les abus via ThrottlerGuard
- **Validation**: Validation des données avec class-validator

## 📊 Monitoring

Le service log :
- Erreurs d'appel à l'API OpenAI
- Nombre de tokens utilisés
- Conversations créées/modifiées

## 🧪 Tests

```bash
# Tests unitaires
npm run test

# Tests E2E
npm run test:e2e
```

## 🚀 Évolutions futures

- [ ] Support de plusieurs modèles IA (Claude, Gemini, etc.)
- [ ] Intégration avec les données patients (avec permissions)
- [ ] Suggestions proactives basées sur le contexte
- [ ] Support multilingue (wolof, arabe, anglais)
- [ ] Analyse de sentiment
- [ ] Export de conversations
- [ ] Statistiques d'utilisation
- [ ] Fine-tuning du modèle avec des données médicales

## 📝 Licence

MIT
