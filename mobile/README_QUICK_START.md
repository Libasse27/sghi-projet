# 🚀 SGHI Mobile - Démarrage Rapide

## ⚡ Commande Rapide

**Ouvrir PowerShell dans le dossier `mobile/` et exécuter:**

```powershell
.\start-metro.ps1
```

C'est tout! Le script va:
1. ✓ Tuer automatiquement les anciens processus Metro
2. ✓ Libérer le port 8081
3. ✓ Démarrer Metro Bundler

---

## 📱 Lancer l'Application

**Dans un NOUVEAU terminal** (laisser Metro tourner):

### Android
```cmd
cd mobile
npm run android
```

### iOS (Mac uniquement)
```cmd
cd mobile
npm run ios
```

---

## ❌ Si vous voyez l'erreur "EADDRINUSE: port 8081"

**Solution en 2 commandes:**

```cmd
taskkill /F /IM node.exe
npm start
```

---

## 📚 Documentation Complète

Voir [DEMARRAGE_METRO.md](./DEMARRAGE_METRO.md) pour:
- Toutes les solutions détaillées
- Dépannage avancé
- Vérifications système

---

## ✅ Prérequis

- ✓ Node.js 18+
- ✓ npm ou yarn
- ✓ React Native CLI
- ✓ Android Studio (pour Android)
- ✓ Xcode (pour iOS, Mac uniquement)

---

**Bon développement! 🎉**
