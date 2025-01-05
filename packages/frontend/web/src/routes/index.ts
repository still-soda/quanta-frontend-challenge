import { createRouter, createWebHistory } from 'vue-router';

import authRoute from './auth.route';
import appRoute from './app.route';

const routes = [authRoute, appRoute];

const router = createRouter({
   history: createWebHistory(),
   routes,
});

// 动态修改页面标题
router.beforeEach((to) => {
   if (to.meta.deynamiceTitle) {
      const title = `${to.meta.deynamiceTitle} - Quanta前端挑战`;
      document.title = title;
   } else {
      document.title = 'Quanta前端挑战';
   }
});

export default router;
