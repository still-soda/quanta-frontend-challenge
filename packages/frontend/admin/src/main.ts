import { createApp } from 'vue';
import TDesign from 'tdesign-vue-next';
import 'tdesign-vue-next/es/style/index.css';
import './main.css';
import './styles/theme.css';

import App from './App.vue';
import router from './routes/index.route';
import { init, setBaseUrl } from '@challenge/api/utils';
import { createEventEmitter, INJECT_KEY } from '@challenge/utils';
import { createPinia } from 'pinia';

setBaseUrl(import.meta.env.VITE_APP_API_BASE_URL);

const app = createApp(App);

// 全局事件总线
const eventBus = createEventEmitter();
app.provide(INJECT_KEY, eventBus);

// 向请求中注入事件总线
init(eventBus);

const pinia = createPinia();

app.use(router).use(pinia).use(TDesign).mount('#app');
