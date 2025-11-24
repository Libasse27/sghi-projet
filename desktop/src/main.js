import { createApp } from 'vue';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import Antd from 'ant-design-vue';
import App from './App.vue';
import router from './router';

// Styles
import 'ant-design-vue/dist/reset.css';
import './styles/main.scss';

// Créer l'application Vue
const app = createApp(App);

// Pinia store avec persistence
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

// Utiliser les plugins
app.use(pinia);
app.use(router);
app.use(Antd);

// Monter l'application
app.mount('#app');
