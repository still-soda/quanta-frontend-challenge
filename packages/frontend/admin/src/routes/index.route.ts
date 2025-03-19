import { createWebHistory } from 'vue-router';
import { createRouter } from 'vue-router';
import appRoutes from './app.route';
import authRoutes from './auth.route';

const router = createRouter({
   history: createWebHistory(),
   routes: [
      {
         path: '/',
         name: 'App',
         children: appRoutes,
         component: () => import('@/views/app/layout.vue'),
      },
      {
         path: '/auth/',
         name: 'Auth',
         redirect: '/auth/login',
         children: authRoutes,
      },
   ],
});

export default router;
