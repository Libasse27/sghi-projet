<template>
  <a-config-provider :locale="locale" :theme="themeConfig">
    <router-view />
  </a-config-provider>
</template>

<script setup>
import { computed } from 'vue';
import { useAppStore } from '@/store/app';
import frFR from 'ant-design-vue/es/locale/fr_FR';
import { theme } from 'ant-design-vue';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';

// Configuration dayjs en français
dayjs.locale('fr');

const appStore = useAppStore();

const locale = frFR;

const themeConfig = computed(() => ({
  token: {
    colorPrimary: '#2C7A7B',
    colorSuccess: '#48BB78',
    colorWarning: '#ED8936',
    colorError: '#F56565',
    colorInfo: '#4299E1',
    borderRadius: 6,
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  algorithm: appStore.isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
}));
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app {
  height: 100vh;
  overflow: hidden;
}
</style>
