<template>
  <footer class="app-footer">
    <div class="footer-content">
      <div class="footer-left">
        <span class="copyright">
          © {{ currentYear }} SGHI - Système de Gestion Hospitalière Intégré
        </span>
        <span class="separator">|</span>
        <span class="version">Version {{ appVersion }}</span>
      </div>

      <div class="footer-center">
        <a href="#" @click.prevent="openLink('privacy')">Politique de confidentialité</a>
        <span class="separator">|</span>
        <a href="#" @click.prevent="openLink('terms')">Conditions d'utilisation</a>
        <span class="separator">|</span>
        <a href="#" @click.prevent="openLink('help')">Aide</a>
      </div>

      <div class="footer-right">
        <div class="connection-status" :class="connectionStatusClass">
          <i :class="connectionIcon"></i>
          <span>{{ connectionText }}</span>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useConnectionStore } from '@/stores/connection';

const connectionStore = useConnectionStore();

const currentYear = new Date().getFullYear();
const appVersion = '1.0.0';

const isOnline = computed(() => connectionStore.isOnline);
const isConnectedToServer = computed(() => connectionStore.isConnectedToServer);

const connectionStatusClass = computed(() => {
  if (!isOnline.value) return 'offline';
  if (!isConnectedToServer.value) return 'warning';
  return 'online';
});

const connectionIcon = computed(() => {
  if (!isOnline.value) return 'fas fa-wifi-slash';
  if (!isConnectedToServer.value) return 'fas fa-exclamation-triangle';
  return 'fas fa-check-circle';
});

const connectionText = computed(() => {
  if (!isOnline.value) return 'Hors ligne';
  if (!isConnectedToServer.value) return 'Connexion serveur perdue';
  return 'Connecté';
});

const openLink = (type: string) => {
  switch (type) {
    case 'privacy':
      // Open privacy policy
      break;
    case 'terms':
      // Open terms of service
      break;
    case 'help':
      // Open help documentation
      break;
  }
};
</script>

<style scoped lang="scss">
.app-footer {
  height: 48px;
  background: #fff;
  border-top: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  padding: 0 24px;
  font-size: 13px;
  color: #6b7280;
}

.footer-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.footer-left,
.footer-center,
.footer-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.separator {
  color: #d1d5db;
}

.version {
  font-weight: 500;
  color: #9ca3af;
}

.footer-center a {
  color: #6b7280;
  text-decoration: none;
  transition: color 0.2s;

  &:hover {
    color: #2563eb;
  }
}

.connection-status {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;

  &.online {
    color: #059669;
    background: #d1fae5;

    i {
      color: #10b981;
    }
  }

  &.warning {
    color: #d97706;
    background: #fef3c7;

    i {
      color: #f59e0b;
    }
  }

  &.offline {
    color: #dc2626;
    background: #fee2e2;

    i {
      color: #ef4444;
    }
  }

  i {
    font-size: 11px;
  }
}
</style>
