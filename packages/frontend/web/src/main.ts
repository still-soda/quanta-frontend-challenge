import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './routes';
import loadingDirective from './components/Loading/index.directive';

import './style.css';
import { createEventEmitter, INJECT_KEY } from '@challenge/utils';
import { setBaseUrl, init } from '@challenge/api/utils';

// 设置请求基础路径
setBaseUrl(import.meta.env.VITE_APP_API_BASE_URL);

const pinia = createPinia();

const app = createApp(App);

// 全局事件总线
const eventBus = createEventEmitter();
app.provide(INJECT_KEY, eventBus);

// 向请求中注入事件总线
init(eventBus);

// 全局加载指令
app.directive('suspense', loadingDirective);

app.use(router).use(pinia).mount('#app');
