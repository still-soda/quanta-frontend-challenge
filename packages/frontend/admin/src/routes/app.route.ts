const appRoutes = [
   {
      path: '/',
      name: 'Home',
      component: () => import('@/views/app/home/index.vue'),
   },
];

export default appRoutes;
