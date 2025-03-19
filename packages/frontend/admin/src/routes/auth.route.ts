const authRoutes = [
   {
      path: '/login',
      component: () => import('@/views/auth/login/index.vue'),
   },
];
export default authRoutes;
