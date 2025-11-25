# 🔧 Solution Complète: Port 8081 Occupé

## 📋 Résumé

Quand Metro Bundler demande:
```
? Use port 8082 instead?
```

Vous avez **2 options** selon votre situation.

---

## ✅ Option 1: Utiliser le Port 8082 (RAPIDE)

**Quand l'utiliser:** Vous voulez juste lancer l'app rapidement sans vous soucier du port.

**Action:**
- Appuyez sur `Y` (Yes) dans le terminal
- Metro démarre sur le port 8082
- L'app fonctionne normalement

**Avantages:**
- ✓ Solution immédiate (0 seconde)
- ✓ Aucune commande supplémentaire
- ✓ Pas de risque d'arrêter d'autres processus

**Inconvénient:**
- Port non standard (8082 au lieu de 8081)

---

## ✅ Option 2: Libérer le Port 8081 (PROPRE)

**Quand l'utiliser:** Vous voulez toujours utiliser le port standard 8081.

### Méthode A: Commande Rapide (Recommandée)

**1 seule commande pour tout nettoyer:**
```powershell
taskkill /F /IM node.exe && timeout /t 2 && npm start
```

**Que fait cette commande?**
1. Tue tous les processus Node.js
2. Attend 2 secondes
3. Démarre Metro sur le port 8081

---

### Méthode B: Étape par Étape

#### Étape 1: Trouver le processus
```powershell
netstat -ano | findstr :8081
```

**Résultat attendu:**
```
TCP    0.0.0.0:8081    LISTENING    12345
```
→ Le dernier nombre (12345) = PID du processus

#### Étape 2: Tuer le processus
```powershell
taskkill /F /PID 12345
```
*Remplacez 12345 par le PID trouvé*

#### Étape 3: Démarrer Metro
```powershell
npm start
```

---

### Méthode C: Script Automatique (MEILLEUR)

**Utilisez le script PowerShell fourni:**

```powershell
cd C:\Users\libas\Desktop\SGHI-PROJECT\mobile
.\start-metro.ps1
```

**Ce script fait automatiquement:**
1. ✓ Détecte les processus sur le port 8081
2. ✓ Les tue proprement
3. ✓ Attend que le port soit libre
4. ✓ Démarre Metro

---

## 🔄 Reset Complet de Metro

**Si Metro continue à avoir des problèmes:**

```bash
# Option 1: Reset cache seulement
npm start -- --reset-cache

# Option 2: Nettoyage complet
rm -rf node_modules
rm -rf .metro-cache
npm install
npm start
```

---

## 📝 Scripts NPM Personnalisés

**Ajoutez dans `package.json`:**

```json
{
  "scripts": {
    "start": "react-native start",
    "start:clean": "react-native start --reset-cache",
    "kill:metro": "taskkill /F /IM node.exe",
    "dev": "npm run kill:metro && timeout /t 2 && npm start"
  }
}
```

**Utilisation:**
```bash
npm run dev     # Tue Metro + démarre proprement
npm run start:clean  # Démarre avec cache nettoyé
```

---

## 🎯 Quelle Méthode Choisir?

| Situation | Méthode Recommandée | Temps |
|-----------|-------------------|-------|
| **Développement rapide** | Option 1 (Port 8082) | 0s |
| **Usage quotidien** | Script PowerShell | 5s |
| **Port 8081 requis** | Méthode B (Manuel) | 10s |
| **Problèmes persistants** | Reset complet | 2min |

---

## 🚨 Cas Particuliers

### Metro ne démarre toujours pas
```bash
# Vérifier tous les ports occupés
netstat -ano | findstr LISTENING

# Tuer TOUS les Node
taskkill /F /IM node.exe

# Redémarrer le PC (dernière option)
```

### L'app ne se connecte pas à Metro
1. Vérifier que Metro tourne
2. Vérifier le port dans l'app:
   - Android: Secouer → Dev Settings → Debug server host
   - Mettre: `localhost:8081` (ou 8082 si utilisé)

### Autre application utilise le port 8081
```powershell
# Trouver quelle application
netstat -ano | findstr :8081

# Puis identifier le PID dans le Gestionnaire de tâches
```

---

## ✅ Solution Permanente

**Pour éviter ce problème à chaque fois:**

### 1. Toujours fermer Metro proprement
- Utilisez `Ctrl+C` dans le terminal
- Ne fermez pas brutalement le terminal

### 2. Utilisez le script start-metro.ps1
- S'occupe automatiquement du nettoyage
- Garantit le démarrage sur 8081

### 3. Ajoutez un alias PowerShell
```powershell
# Dans votre profil PowerShell
function Start-Metro {
    cd C:\Users\libas\Desktop\SGHI-PROJECT\mobile
    .\start-metro.ps1
}

# Utilisation: juste taper
Start-Metro
```

---

## 📚 Fichiers Créés

| Fichier | Description |
|---------|-------------|
| `start-metro.ps1` | Script auto-nettoyage |
| `start-metro.bat` | Alternative Windows Batch |
| `DEMARRAGE_METRO.md` | Guide complet |
| `README_QUICK_START.md` | Démarrage 30s |
| `PORT_8081_SOLUTION.md` | Ce fichier |

---

## 🎓 Comprendre le Problème

### Pourquoi le port 8081?
- Port par défaut de Metro Bundler
- Utilisé pour le Hot Reload
- Communication app ↔ serveur de développement

### Causes fréquentes
1. ✓ Metro précédent pas fermé
2. ✓ Plusieurs projets React Native ouverts
3. ✓ Crash de Metro (processus zombie)
4. ✓ Autre serveur Node sur ce port

### Comment l'éviter?
- Toujours fermer Metro avec `Ctrl+C`
- Un seul projet React Native à la fois
- Utiliser les scripts automatiques

---

## 🆘 Besoin d'Aide?

**Metro ne démarre toujours pas?**

1. **Vérifier Node.js:**
   ```bash
   node --version  # Doit être ≥ 18
   ```

2. **Réinstaller les dépendances:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Vérifier les permissions:**
   - Exécuter PowerShell en Admin si nécessaire

4. **Logs détaillés:**
   ```bash
   npm start -- --verbose
   ```

---

**Projet:** SGHI Mobile  
**Metro:** v0.76.9  
**React Native:** 0.73.1  
**Date:** 2025-11-21  
**Status:** ✅ Solutions testées et fonctionnelles
