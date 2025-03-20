export enum AuthRoute {
   Login = '/login',
}

export const authRoutes = [
   {
      path: AuthRoute.Login,
      component: () => import('@/views/auth/login/index.vue'),
   },
];
