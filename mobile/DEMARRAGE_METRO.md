# 🚀 Guide de Démarrage Metro Bundler

## ⚠️ Problème: Port 8081 occupé

**Erreur typique:**
```
error listen EADDRINUSE: address already in use :::8081
```

---

## ✅ SOLUTIONS RAPIDES

### 🔥 Solution 1: Script PowerShell (RECOMMANDÉ)

```powershell
cd mobile
.\start-metro.ps1
```

**Que fait ce script?**
- ✓ Détecte automatiquement les processus sur le port 8081
- ✓ Les arrête proprement
- ✓ Démarre Metro Bundler

---

### 🔧 Solution 2: Commandes Manuelles

#### Étape 1: Trouver le processus
```cmd
netstat -ano | findstr :8081
```

**Exemple de résultat:**
```
TCP    0.0.0.0:8081    0.0.0.0:0    LISTENING    12656
```
Le dernier nombre = **PID du processus** (ici: 12656)

#### Étape 2: Tuer le processus
```cmd
taskkill /F /PID 12656
```
*Remplacez 12656 par le PID que vous avez trouvé*

#### Étape 3: Démarrer Metro
```cmd
cd mobile
npm start
```

---

### ⚡ Solution 3: Tuer TOUS les processus Node

**Si vous avez plusieurs processus Metro:**
```cmd
taskkill /F /IM node.exe
```

**Puis démarrer:**
```cmd
cd mobile
npm start
```

---

### 🔄 Solution 4: Utiliser un autre port

**Port alternatif (8082):**
```cmd
cd mobile
npx react-native start --port=8082
```

**⚠️ Attention:** Vous devrez aussi modifier la configuration de votre app mobile pour pointer vers le nouveau port.

---

### 🧹 Solution 5: Nettoyer les caches

**Si Metro est bloqué ou plante:**
```cmd
cd mobile

# Supprimer le cache Metro
rmdir /s /q .metro-cache

# Démarrer avec reset
npx react-native start --reset-cache
```

---

## 📝 Vérifications

### ✓ Vérifier que le port est libre
```cmd
netstat -ano | findstr :8081
```
**Résultat attendu:** Aucune sortie (port libre)

### ✓ Vérifier Metro tourne
```cmd
netstat -ano | findstr :8081
```
**Résultat attendu:** 
```
TCP    0.0.0.0:8081    LISTENING    [PID]
```

### ✓ Test HTTP
```cmd
curl http://localhost:8081/status
```
**Résultat attendu:** `packager-status:running`

---

## 🎯 Workflow Recommandé

### Démarrage quotidien

1. **Ouvrir un terminal PowerShell**
```powershell
cd C:\Users\libas\Desktop\SGHI-PROJECT\mobile
.\start-metro.ps1
```

2. **Laisser Metro tourner** (ne pas fermer le terminal)

3. **Dans un NOUVEAU terminal, lancer l'app:**
```cmd
# Android
npm run android

# iOS (Mac uniquement)
npm run ios
```

---

## 🐛 Dépannage Avancé

### Problème: Metro démarre puis crash

**Solution:**
```cmd
cd mobile
rmdir /s /q node_modules
npm install
npm start -- --reset-cache
```

### Problème: Port déjà utilisé par autre chose

**Identifier l'application:**
```cmd
netstat -ano | findstr :8081
```

Puis utiliser le Gestionnaire de tâches pour identifier le processus par son PID.

### Problème: Permission refusée

**Exécuter PowerShell en administrateur:**
1. Clic droit sur PowerShell
2. "Exécuter en tant qu'administrateur"
3. Relancer le script

---

## 📌 Scripts Disponibles

| Script | Commande | Description |
|--------|----------|-------------|
| **Démarrage propre** | `.\start-metro.ps1` | Tue les processus + démarre Metro |
| **Démarrage batch** | `.\start-metro.bat` | Alternative Windows batch |
| **Standard** | `npm start` | Démarrage standard (peut échouer si port occupé) |
| **Reset cache** | `npm start -- --reset-cache` | Démarrage avec nettoyage cache |
| **Autre port** | `npm start -- --port=8082` | Démarrage sur port alternatif |

---

## ✅ Checklist Avant de Commencer

- [ ] Fermer tous les terminaux précédents
- [ ] Vérifier qu'aucun processus Metro ne tourne
- [ ] Être dans le dossier `mobile/`
- [ ] Avoir Node.js 18+ installé
- [ ] Avoir exécuté `npm install`

---

## 🆘 Besoin d'Aide?

**Metro ne démarre toujours pas?**

1. Vérifier les logs détaillés:
```cmd
npm start -- --verbose
```

2. Vérifier la version Node:
```cmd
node --version
```
*Devrait être ≥ 18.0.0*

3. Réinstaller les dépendances:
```cmd
rmdir /s /q node_modules
npm install
```

---

**Projet:** SGHI Mobile  
**Metro Version:** 0.76.9  
**React Native:** 0.73.1  
**Date:** 2025-11-21
