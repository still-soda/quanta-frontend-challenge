import { createApp } from 'vue';
import TDesign from 'tdesign-vue-next';
import 'tdesign-vue-next/es/style/index.css';
import './main.css';
import './styles/theme.css';

import App from './App.vue';
import router from './routes/index.route';

createApp(App).use(router).use(TDesign).mount('#app');
